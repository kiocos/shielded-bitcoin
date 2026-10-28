# Shielded Bitcoin — presenter script

25 minutes plus questions · 26 main slides · 8 optional Q&A slides.

The talk follows one payment from Alice to Bob. Each mechanism answers a practical question about that payment. There are no equations, worked calculations or cryptographic derivations to present, including in the appendix. The two labs ask the audience to predict what happens.

This file is the source for Slidev’s presenter notes. Run `npm run bitdevs:sync` after editing it. Each `[Click n]` advances a visual reveal. Pause long enough for people to see what changed before explaining the next step.

Use the protocol’s terminology and define each term where it first appears. A note contains private spendable value. A leaf commits to its public output data. A nullifier identifies a spend without identifying that leaf. The witness supplies private circuit inputs; the envelope carries public transfer data. Field names on slides match the paper. Amounts are example data, not arithmetic exercises.

Labels such as “Alice’s note” show what the wallet knows. An outside observer does not see those ownership labels. The proof explanation names the inputs, parameters, encoding and verifier operations; it does not derive the pairing equation. Timing targets include pauses and the labs and should be checked in rehearsal.

## 01 · Shielded Bitcoin {#cover}

Tonight we’re going to follow one payment. Alice has funds. She wants to pay Bob without publishing the payment details for everyone to inspect.

What has to be public? What can stay private? And who checks that she isn’t cheating?

We’ll use those questions to understand Shielded Bitcoin, then compare its choices with other privacy approaches. This is a proposal walkthrough, not a demonstration of a working production wallet.

## 02 · Alice spends an output to pay Bob {#public}

With an ordinary Bitcoin transaction, Alice spends an input, creates an output for Bob, and usually creates change for herself. That structure is public.

[Click 1] So are the amounts. The blockchain doesn’t put Alice’s and Bob’s names on the transaction, but exchanges, payment records and other observations can connect parts of the graph to people.

[Click 2] We want to hide the payment details while keeping the important checks. Alice must own what she spends. She must not spend it twice. And she must not create money just by writing a larger amount.

Keep those three attempts to cheat in mind. The next few mechanisms exist to stop them.

## 03 · Bitcoin consensus and shielded replay {#roles}

Start with the jobs. Alice’s wallet prepares the payment: encrypted notes, nullifiers and a proof.

[Click 1] It puts that envelope inside an ordinary Bitcoin transaction. The paper calls the outer transaction the carrier. Bitcoin validates the carrier and records its bytes in order. It does not check whether the shielded payment is valid.

[Click 2] Software called an indexer reads those bytes and applies the shielded rules. Processing that history is called replay. It verifies proofs and keeps track of which notes have been created and which nullifiers have been used.

[Click 3] Anyone can run replay. These indexers aren’t voting on validity. Given the same complete rules, starting state and Bitcoin history, correct implementations must reach the same result.

So there are two distinct jobs: Bitcoin records the envelope; replay decides what it does to the shielded state.

## 04 · Note plaintext and published ciphertext {#note}

Alice already owns an accepted note. Its plaintext has three fields: v is the value in satoshis; d is the diversifier used in the receiving address; rseed is fresh randomness from which note-specific cryptographic values are derived.

[Click 1] To spend that note, Alice needs sk_spend. The circuit derives the corresponding receiving-key material and checks that it authorizes this input. Knowing the note’s plaintext is not sufficient to spend it.

[Click 2] The original output published pk_eph, an ephemeral public key, and ct_note, the encrypted plaintext. pk_eph is not the recipient’s address key. These fields let the recipient discover and decrypt the output without publishing the recipient’s private key.

[Click 3] Replay hashes the output data and its creation context into a Merkle leaf. That context includes the creation envelope’s body digest and the output’s index within it. The resulting leaf commits to a specific published output. It is not simply a commitment to an amount and a random number.

## 05 · Merkle membership without revealing the leaf {#tree}

The note tree is append-only. Its leaves are derived from accepted output records; parent hashes commit to their contents and positions. Replay records a root for each block.

Alice’s wallet knows which leaf belongs to her. That highlight is wallet knowledge, not an ownership label available to an observer.

[Click 1] Her witness includes the leaf’s global position and Merkle authentication path: the sibling hashes needed to reconstruct the root. Both the selected position and path remain private in this spend.

[Click 2] Inside the circuit, Alice’s input data must reconstruct the leaf, and the path must reach r_anchor. Replay obtains that public root from the accepted state at h_anchor. Alice cannot validate an invented input by choosing an arbitrary root.

[Click 3] The leaf stays after spending. Membership proves that the note existed in this state. Spent status is tracked separately through nullifiers.

## 06 · Nullifiers prevent double spending {#nullifier}

A nullifier is a public identifier derived for a note’s spend. It lets replay detect repeated spends without identifying the input leaf.

The derivation uses sk_nf, rho and pos. sk_nf comes from the spending key. Rho comes from the note’s rseed. Pos is the leaf’s global position in the tree. It distinguishes the note’s occurrence in the history.

[Click 1] The circuit enforces those derivations and checks that the result is the published nullifier. Alice cannot supply an arbitrary replacement nullifier for the same input.

[Click 2] On acceptance, replay inserts the nullifier into its public spent set.

[Click 3] A second spend of the same note produces the same nullifier. Replay rejects it even if Alice creates different proof bytes.

Alice knows the contents of an output she creates for Bob, but she does not know Bob’s sk_nf. That plaintext alone does not let her compute his nullifier and recognize his later spend.

## 07 · What goes into the transfer envelope? {#publication}

There are three different interfaces here.

The witness contains sk_spend, the selected input’s opening, its position and authentication path, plus output values, destinations and randomness. Those private inputs go to the prover.

[Click 1] The serialized envelope contains the header, anchor height, input/output counts, nullifiers, output ephemeral keys and ciphertexts, ct_out for outgoing recovery, and the Groth16 proof. It is these bytes that are published on Bitcoin.

[Click 2] Replay derives the proof’s public inputs. It resolves h_anchor to the accepted root r_anchor and computes h_body from the canonical envelope body. Counts, nullifiers and output fields also enter the public statement. The envelope is therefore not just passed blindly to the verifier as an opaque blob.

[Click 3] Proof verification uses those public inputs and the circuit’s verifying key, without receiving the witness. Bob separately decrypts his output to learn its amount.

The SNARK witness is not the witness area of a Bitcoin transaction. Publishing proof bytes in a Bitcoin witness carrier would not publish the SNARK’s private inputs.

## 08 · Groth16 proof generation {#proof-making}

Groth16 has a prover and a verifier with different inputs. The prover needs the private witness and the public statement we just identified.

[Click 1] It also needs a proving key prepared for the compiled circuit. That circuit encodes membership, input authorization, nullifier derivation, output encryption, amount ranges, conservation of value and envelope binding. The proving key is public cryptographic material, not a wallet spending key.

[Click 2] The prover combines the witness assignment with those parameters to construct three elliptic-curve points. Those serialized points are the proof. They encode relationships determined by the circuit; they are not a signature by an indexer or an encrypted copy of the witness.

[Click 3] Groth16 randomizes proof generation as part of providing zero knowledge. Under the proof system and setup assumptions, the verifier can establish knowledge of a satisfying witness without learning its private values. This guarantee applies to the implemented constraints. Missing constraints remain a circuit bug.

## 09 · What the Groth16 verifier actually checks {#proof-checking}

An observer first derives the public inputs from the envelope and accepted history. They also receive the serialized proof.

[Click 1] The verifier uses the verifying key selected by the agreed profile for this circuit and supported arity—the input and output counts. Alice does not get to substitute a key for a different, weaker circuit.

[Click 2] The implementation decodes the proof’s curve points and validates their encodings and group membership as required by the profile. It combines the public-input values with the corresponding elements of the verifying key. Then it runs Groth16’s pairing check on the proof points, that public-input contribution and the remaining key elements.

A pairing is a cryptographic operation on curve-group elements. We are naming the operation the verifier executes, not calculating it during the talk.

[Click 3] If verification passes, the proof supports these public inputs under this circuit and its assumptions. The verifier has not decrypted the input note, recovered the Merkle path or rerun the constraints on Alice’s private witness. Replay must still enforce anchor eligibility and nullifier uniqueness.

## 10 · What binds the amount to the original note? {#binding-note}

Here is a concrete forgery attempt. Alice’s note contains 100,000 sats, but she supplies one million as its value in the witness. Where does that fail?

[Click 1] The circuit checks that the input plaintext and derived encryption material form a valid opening of the original ct_note. The paper assumes committing encryption, which rules out conflicting valid openings. Ordinary encryption confidentiality alone would not give this binding guarantee.

[Click 2] The circuit reconstructs the Merkle leaf from the ciphertext and public creation fields. Those include pk_eph, the creation body digest and output index. Alice cannot bypass this step by supplying an arbitrary leaf hash.

[Click 3] That reconstructed leaf, its position and Merkle path must lead to r_anchor, the root replay derived for the selected anchor block.

[Click 4] Changing v makes the ciphertext-opening check fail. Encrypting a new note with the larger value produces a different output record and leaf. Alice would then need membership for that different leaf under the accepted root.

These checks bind the private amount to an actual published note. The authorization constraints also bind its receiving key to sk_spend.

## 11 · Each attack needs an explicit constraint {#constraints}

A valid proof establishes that the implemented constraints were satisfied. Reviewing whether those constraints express the full protocol is a separate task.

[Click 1] Invented input: the circuit reconstructs the leaf and verifies its Merkle path against r_anchor.

[Click 2] Unauthorized spend: it derives the input’s diversified receiving-key material from sk_spend and d, and checks consistency with the selected note.

[Click 3] Arbitrary nullifier: it derives sk_nf and rho, then constrains the nullifier using the note’s position. Replay, outside the circuit, checks that this correctly derived nullifier has not appeared before.

[Click 4] Extra value: output ciphertexts must match the newly created notes, individual amounts must lie in range, and integer balance must hold without overflow. A computation performed only by witness-generation code does not enforce a circuit constraint.

Reviewers should alter each component independently and check that invalid witnesses fail. They must also trace the reviewed circuit through compilation and setup to the actual verifying key used by replay. Appendix A.1 still leaves concrete implementation choices open.

## 12 · Alice creates outputs; Bob decrypts his note {#transfer}

Now follow the actual transfer. Alice’s input note is already in the tree.

[Click 1] She creates Bob’s output and her change output, preserving the input value. For each output she uses the recipient address and fresh rseed to produce pk_eph and ct_note.

[Click 2] Her wallet assembles the envelope, computes its public inputs and generates the proof. It publishes the envelope in a Bitcoin carrier transaction. That transaction pays Bitcoin fees separately; there is no fee deducted inside the shielded balance relation.

[Click 3] After every replay check passes, the two output leaves are appended and Alice’s input nullifier enters the spent set. The original leaf is never removed.

[Click 4] Bob scans outputs using sk_view. His key and pk_eph derive the same Diffie–Hellman shared secret that Alice derived using her ephemeral secret and Bob’s receiving public key. A key-derivation function produces the AEAD key, and decryption recovers v, d and rseed. Bob checks consistency, the assigned position and spent status. He does not need to be online when Alice publishes.

## 13 · h_body binds the proof to the envelope {#binding-body}

The transfer proof must be bound to the serialized envelope, including fields that do not have individual slots in the public statement.

[Click 1] Replay hashes the canonical body with the protocol’s domain separation to obtain h_body. The proof bytes are excluded to avoid a circular dependency.

[Click 2] h_body is a public input to Groth16. The circuit’s envelope-binding requirement and verification against this input prevent moving the original proof onto a different body.

[Click 3] Change ct_out, the encrypted outgoing-recovery data. Replay now computes a different h_body. The original proof fails verification against that new public statement, even though ct_out has no individual public-input slot.

Binding ct_out’s bytes is not the same as certifying every derived recovery report. Also, Groth16 proof re-randomization does not bypass the nullifier set: the input nullifiers remain unchanged.

## 14 · Replay’s acceptance pipeline {#replay}

Replay processes candidate envelopes in Bitcoin order. It starts by parsing canonical bytes, selecting the supported format, and binding the public inputs to the envelope body.

[Click 1] It checks h_anchor against the allowed anchor window and obtains the corresponding accepted root. This profile permits roots from the previous 100 blocks, excluding the current block. It also rejects nullifiers repeated within the envelope or already present in the spent set.

[Click 2] It verifies the Groth16 proof using the public inputs it derived and the verifying key required by the profile and arity.

[Click 3] Only then does it append output leaves, assign their global positions and insert input nullifiers. Any failure leaves both the tree and spent set unchanged.

Two implementations agree only when they use the same complete profile, initial state and chain prefix. An expired anchor requires a new proof against an eligible root; it does not destroy the input notes. The wallet’s Bitcoin confirmation policy is separate from this minimum acceptance window.

## 15 · Lab: which envelopes change the state? {#replay-lab}

[Allow 90 seconds. Ask for accept or reject before each reveal. Proof verification is simulated; the audience does not calculate balances or block windows.]

The existing note history is on the right. The spent-nullifier set is empty. Each row is an envelope processed after the preceding row.

[Click 1] A passes. Replay appends Bob’s note and Alice’s change, and inserts nf_A. The original leaf remains.

[Click 2] B carries a valid proof but repeats nf_A. Replay rejects it at the nullifier check. No additional leaves or nullifiers are applied.

[Click 3] C uses a different nullifier, but its proof is invalid. Reject it at proof verification. The accepted state stays unchanged.

[Click 4] D refers to an expired anchor. Reject it before proof verification. The wallet would have to rebuild against an eligible root.

Circuit validity and state-dependent acceptance are different checks. A new proof does not make an already-spent note spendable again.

## 16 · Confirmed carrier, invalid shielded proof {#confirmed}

[Give the audience five seconds to choose.]

The carrier transaction is confirmed, but the shielded proof is invalid. What gets rejected: the Bitcoin block, the envelope, or just Bob’s output?

[Click 1] The envelope. Its bytes remain on Bitcoin, but replay applies none of it. Bitcoin itself has no shielded-proof validation rule to run here.

## 17 · Spending keys, viewing keys and recovery {#recovery}

The wallet derives separate capabilities from its seed. sk_spend authorizes spends and derives sk_nf, the nullifier secret. sk_nf alone cannot authorize a spend.

[Click 1] vk_in supplies incoming viewing capability, including sk_view for note discovery and decryption. vk_out recovers outgoing records. Neither grants spending authority, and there is no global viewing key for everyone’s wallet.

[Click 2] Recovery uses the seed and published transfer history, together with replayed leaf positions. Initial notes may also require deployment-defined bootstrap data. Recovering from a seed still requires synchronization with the relevant history and profile.

[Click 3] An indexer can serve stale data, omit results or claim an incorrect root. Those results will not match correct independent replay of the same chain prefix. A wallet that does not verify locally is trusting its selected indexer. Light-client verification remains future work in the paper.

## 18 · The envelope still exposes metadata {#leakage}

The model protects note amounts, the link between an input leaf and its nullifier, and the association between an output and its recipient.

[Click 1] The envelope still exposes timing, byte size, arity and anchor age. The carrier transaction and its fee funding are public. Entry and exit may expose amounts and timing at the peg boundary.

[Click 2] Co-recipients receive notes with the same creation h_body and can recognize that their outputs belonged to one transfer. Network and mempool observation are outside this privacy model.

These are separate leakage channels. Zero knowledge for the proof does not erase public transaction structure or information the observer already has.

## 19 · Lab: narrow the possible input leaves {#privacy-lab}

[Allow 60 seconds. The exclusions are assumptions of this example. Ask people to predict whether each clue helps identify the spent note.]

An observer sees a nullifier. Which earlier note could it belong to? Start with the records on screen.

[Click 1] Some were created after the root used by this payment. Those cannot be its inputs. Remove them.

[Click 2] Suppose the observer controls several of the remaining notes and knows they did not authorize this spend. Those can be ruled out too. Merely having sent a note to someone would not be enough.

[Click 3] Additional outside information narrows it to one possibility. The observer did not decrypt the proof or break its cryptography. The surrounding facts did the work.

This is a candidate set, not a count of people or a measured privacy score. Candidates also need not be equally likely.

## 20 · Peg-in and peg-out are outside this paper {#peg}

We began with Alice already holding a note. Now we can see the missing boundary: getting BTC into the system, and getting them back out.

[Click 1] That is the peg. This paper specifies internal transfers. Describing those transfers as non-custodial does not establish a non-custodial peg. The entry and exit rules need their own construction.

[Click 2] PIPEs v2 is a research direction involving witness encryption: a condition controls release of a Bitcoin signing key. That alone does not finish a peg. Once someone has the key, they can sign ordinary messages. Restrictions on future use need more machinery.

The distinction matters when evaluating the proposal. A private transfer protocol can be well specified while the complete system remains unfinished.

## 21 · Data availability, fees and setup assumptions {#cost}

The design puts encrypted note data in Bitcoin’s public history.

[Click 1] That enables independent replay and recovery. Bob does not need every previous sender to retain and resend private coin data to reconstruct this published history.

[Click 2] But publication consumes block space and costs Bitcoin fees. Relay and mining policy affect how these envelopes can be carried. The paper’s OP_RETURN profile relies on the relaxed policy introduced in Bitcoin Core 30; configurable policy is not a universal relay guarantee.

The proof system also needs a secure circuit-specific setup. A complete implementation must fix the remaining profile choices, and the peg still needs its own solution. Public data availability is useful, but it does not remove those dependencies.

## 22 · On Bitcoin: what are we trying to hide? {#native}

Now compare the problem each mechanism tackles.

[Click 1] CoinJoin introduces ambiguity among participants. Payjoin has the recipient contribute inputs, weakening common ownership assumptions. They work differently, but neither encrypts the on-chain amounts or transaction graph.

[Click 2] Silent Payments lets a reusable destination produce unique outputs that an observer cannot simply associate with the static address. The receiver scans for payments. Amounts and the graph still remain public.

These are useful privacy properties. They are different from hiding the contents and spending links of shielded notes.

## 23 · Beyond ordinary on-chain payments {#layers}

[Click 1] Lightning keeps individual payments out of the global on-chain log. Onion routing limits each hop’s view, while liquidity, channel state and observable boundaries still matter. Whether the wallet is custodial is a separate question.

[Click 2] Liquid hides amounts and asset types, while leaving an observable transaction graph. It is a sidechain with L-BTC and a federated peg.

[Click 3] Cashu and Fedimint use blind-signature eCash. The mint or federation holds the backing. Holding a token does not give its owner unilateral control over the backing BTC.

For each system, ask what an observer sees, who controls the funds, and what data the user must keep.

## 24 · The closest relatives {#cousins}

[Click 1] Zcash Orchard is the closest familiar note-based comparison. Its own consensus validates shielded transfers. It uses ZEC and a different proof system, Halo 2, without Groth16’s circuit-specific trusted setup. We are comparing the architecture, not borrowing its exact note formulas.

[Click 2] Shielded CSV moves validation and coin data to the client. Recipients must retain the data they receive. That reduces global publication but changes the recovery requirement. Using it with BTC still requires resolving the peg.

[Click 3] Shielded Bitcoin publishes the encrypted history on Bitcoin and validates it through replay outside Bitcoin consensus. That helps recovery, at a publication cost. The peg remains outside this paper.

A comparison of mechanisms is not a claim that these systems have the same maturity. Some are deployed systems; others are research proposals.

## 25 · One transfer, three validation boundaries {#recap}

Follow the verification boundaries when explaining the protocol.

[Click 1] The circuit constrains membership, spend authority, nullifier derivation, ciphertext consistency, ranges, value conservation and envelope binding. The witness stays private.

[Click 2] Replay checks canonical encoding, the anchor window, nullifier uniqueness and the proof, then atomically updates the note tree and spent set.

[Click 3] Bitcoin validates the carrier and orders its bytes. It does not validate the shielded proof or establish redemption rights over the backing BTC. Those depend on the separate peg.

Bob discovers his output by scanning and decrypting it. An outside observer verifies the transfer without receiving Bob’s amount or the private input path.

## 26 · Questions {#questions}

Where would you try to cheat: invent a note, use someone else’s key, spend twice, change the amount, or edit the envelope?

[End the main talk here. The appendix has plain-language answers and reference detail. No equations are needed for any of it.]

## A1 · What is serialized in a Groth16 proof? {#proof-details}

The Groth16 proof contains three serialized elliptic-curve points, conventionally named A, B and C. The profile estimates about 192 bytes. It does not serialize private wire values, note plaintexts or Merkle paths.

[Click 1] Verification begins with decoding and the curve/subgroup checks required by the selected profile. The verifier computes a public-input contribution using the verifying key’s input-coefficient elements, then performs the Groth16 pairing check. All of these inputs are public. The witness is never an argument to this algorithm.

The circuit’s constraints enter through the proving and verifying parameters. Groth16 converts those constraints into an algebraic relation; its proof points encode the prover’s satisfying assignment under that relation. The pairing check verifies the encoded relation. We do not need to work through the equation to identify which implementation components and inputs are responsible.

[Click 2] The proof is randomized to provide zero knowledge. Knowledge soundness establishes knowledge of a satisfying witness under the construction’s assumptions. Zero knowledge separately limits what the proof reveals beyond its public statement.

The setup, circuit and verifier all matter. A retained setup trapdoor can compromise soundness; an unconstrained circuit input can allow an invalid transfer even when the proof system works correctly. Appendix A.1 leaves concrete curves, encodings and gadgets to the implementation specification.

## A2 · How do we review the circuit? {#circuit-audit}

A passing proof tells us that the encoded constraints were satisfied. To know whether those constraints are the right ones, we need a different review process.

[Click 1] Start with the specification and list the attacks. Could someone invent a note, use the wrong key, change an amount, fake encryption, or disconnect the proof from its envelope?

[Click 2] Find the exact constraints that stop each attack. Check all helper values, ranges, indices, encodings and curve points. A value computed by the witness-generation program is not automatically constrained inside the proof circuit. Adversarial tests should alter parts independently and exercise boundaries and overflow. Valid examples alone do not catch every missing rule.

[Click 3] Follow the artifacts from reviewed source through compilation, setup and the actual verifying key used by replay. Independent review, reproducible builds and test vectors help establish that the deployed checks are the ones reviewed. Formal verification can strengthen particular parts without certifying the entire software stack.

Appendix B specifies eight constraint blocks, including envelope binding. Appendix A.1 leaves concrete implementation choices open. Parsing, eligible roots, duplicate nullifiers and atomic state updates are also required, but live in replay outside the circuit.

## A3 · The public statement and private witness {#statement}

Appendix B’s public statement contains r_anchor; the counts N and M; input nullifiers; output pk_eph and ct_note fields; and h_body. Replay derives r_anchor from the serialized h_anchor and accepted history.

The header, h_anchor and ct_out do not have separate statement slots. The body digest binds their bytes. The serialized envelope also carries the proof, which is excluded from the body hash.

[Click 1] The witness contains sk_spend and each selected input’s plaintext, creation h_body, creation output index, pk_eph, ct_note, global position and Merkle path. Each output supplies its value, d, destination pk_d and rseed. The recipient’s private key is not needed to create that output.

The input ciphertext and creation context were public when the note was created. What remains private in this spend includes which historical output Alice selected and its opening and authority.

[Click 2] The circuit derives sk_nf from sk_spend, and rho and sk_eph from rseed. It reconstructs leaves and nullifiers rather than accepting arbitrary private results. The input leaf covers the domain-separated salt, creation h_body, local output index, pk_eph, ct_note and the auxiliary field reserved by the base profile.

The local output index and global tree position serve different purposes. The nullifier uses the global position assigned by replay. Every implementation must agree on these encodings and derivations.

## A4 · What each wallet key authorizes {#keys}

The seed derives a master key and separate branches for spending authority and outgoing recovery. No global disclosure key exists.

[Click 1] The incoming-viewing path derives vk_in and sk_view for scanning and decryption. During a spend, the circuit derives the input’s diversified receiving key from sk_spend and d to check authorization.

[Click 2] vk_out decrypts the outgoing-recovery channel ct_out. The recovered batch includes material needed to reopen sent outputs, including sk_eph. That ephemeral secret is not published in plaintext, but it is included in the encrypted recovery channel.

[Click 3] sk_spend supplies spending authority and derives sk_nf inside the circuit. Knowing sk_nf can support nullifier derivation with the other note data, but cannot authorize a spend on its own. Viewing keys also cannot authorize spends.

The paper distinguishes IncomingView, OutgoingView, NoteOpening and DerivedReport. Raw viewing keys grant broad access; a request to audit only one month does not cryptographically restrict that key. Derived reports are assertions unless backed by openings or other evidence.

## A5 · What does publication cost? {#bytes}

These are reference figures, not a calculation for the audience. The paper’s example with two inputs and two outputs has a 610-byte envelope, including the proof and encrypted data. Our Alice-to-Bob walkthrough used one input.

[Click 1] Publishing that example in OP_RETURN contributes 625 virtual bytes for the output alone. The complete carrier transaction has additional overhead. This is a size figure, not a fixed fee in sats.

[Click 2] Relay and mining policy affect publication. The profile uses the relaxed datacarrier policy introduced in Bitcoin Core 30. Policy can be configured and is different from consensus.

The paper also compares a witness-carried alternative using a commit and reveal across two transactions. Using that carrier requires an agreed alternative profile. An individual indexer cannot silently accept it as a local preference and still expect replay agreement.

“Bitcoin witness data” is the transaction area carrying those bytes. It is not the SNARK’s private witness. Publishing a proof there would not mean publishing Alice’s private inputs.

## A6 · Why doesn’t PIPEs finish the peg? {#pipes}

Witness encryption aims to encrypt a message under a condition such that possession of a valid witness enables decryption. The message here can be a Bitcoin signing key. Its witness-encryption relation is a different concept from the transfer SNARK’s private witness.

[Click 1] Satisfying the condition releases that key. The condition can involve proof verification, but the full mechanism and its assumptions still need to be specified.

[Click 2] The key can then produce an ordinary Bitcoin signature. Bitcoin continues checking signatures; it has not gained a general shielded-proof verification rule.

[Click 3] Once someone has the key, they can sign arbitrary messages. A one-time release does not enforce continuing restrictions on future signatures. PIPEs v2 explicitly discusses this limit. A peg that needs persistent restrictions requires an additional construction.

The concrete witness-encryption approach is presented as research. A small transfer proof does not establish that witness encryption is small, practical or ready for production.

## A7 · Questions worth being ready for {#faq}

[Click 1] Does Bob need to be online? Not for the basic transfer. The published output data lets him scan later. His wallet still needs history, the agreed profile, correct state and its confirmation policy.

[Click 2] Can Alice tell when he spends? Not from the plaintext she created alone. She lacks his nullifier secret. Disclosure or outside information can change what she knows, so this is not a promise of absolute anonymity.

[Click 3] Can an indexer invent a balance? It can lie to a wallet that trusts it. Its result will not match correct independent replay of the same history and profile. It can also censor responses or serve stale information.

Other short answers:

- Does a valid proof guarantee Alice paid the right person? It binds the output to the chosen recipient material. It cannot know whether Alice selected the human or address she intended.
- Can a remote service make the proof? Giving it the witness exposes private payment data and spending authority. Outsourcing does not automatically preserve privacy.
- Can Alice make two different proofs for the same spend? Different proof bytes do not change the required nullifier. Replay still rejects a second use.
- What happens in a reorg? Replay rolls back the removed history and processes the active chain. Wallets need a confirmation policy and suitable anchors.
- What if the anchor expires? Rebuild the proof against an eligible root. The old note is not lost simply because that root aged out.
- Are shielded fees hidden? There is no internal shielded fee in this transfer design. The carrier pays Bitcoin fees, which can link activity to its funding wallet.
- Does Bitcoin guarantee redemption? It checks the carrier. Redemption depends on the separate peg.
- What if the trusted setup is compromised? A retained trapdoor can compromise proof soundness, potentially allowing false statements to verify. That is why setup is part of the trust analysis.

## A8 · Further reading {#sources}

The source map is in SOURCES.md. Each slide also links its references in the footer and notes.

For the protocol, start with the transfer statement and constraints, then read the worked transfer and replay rules. Read the privacy analysis, assumptions and out-of-scope sections before judging the whole design.

The labs are visual teaching models. They do not generate Groth16 proofs, implement a wallet or test the protocol’s cryptographic security.
