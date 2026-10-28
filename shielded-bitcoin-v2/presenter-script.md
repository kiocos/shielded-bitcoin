# Shielded Bitcoin — from notes to a payment

This is a separate presentation. The original deck and the other versions are preserved.

**Audience:** technical, with no assumed background in shielded notes or zero-knowledge proofs. **Language:** English, matching the original talk. **Scope:** the September 24, 2026 proposal, including its stated assumptions and incomplete deployment choices.

Read the paragraphs aloud. Italic text gives stage directions. **[click]** advances one reveal. The same text is synchronized into Slidev’s presenter notes. Slide numbers follow the deck. The timing estimate and commands are in the README; rehearse before treating the estimate as a schedule.

The explanation follows a concrete dependency: public payments → private value records → existence → double spending → authority → one complete payment. Mastering Zcash §§3.3–3.6 and §4 inform that teaching sequence. All Shielded Bitcoin mechanics come from its paper, particularly §§5–16 and Appendices A–C. The examples and narration here are original, rather than a translation of the article. See SOURCES.md for the claim map and the differences that must survive the adaptation.

The worked payment uses one accepted 100,000-satoshi note to create 60,000 for Bob and 40,000 in change. Those amounts are teaching values, visible to us because we are following the wallets. The 610-byte envelope is a separate **two-input/two-output** example from the paper. Diagrams are illustrations, not cryptographic implementations.

---

## Slide 1 · Shielded Bitcoin {#cover}

*Let the cover animation finish*

Shielded Bitcoin is a proposal for private transfers of bitcoin-denominated value, with the transfer data published on Bitcoin.

We will start with an ordinary payment, work out what has to change to make its details private, and then follow one payment from Alice’s wallet to Bob’s wallet.

The paper specifies transfers between notes already inside the system. Getting ordinary BTC into it and back out is a separate problem. Keep that boundary in mind throughout the talk.

## Slide 2 · A public payment {#public-payment}

Alice has a Bitcoin output worth one hundred thousand satoshis. She wants to send sixty thousand to Bob.

**[click]** Her transaction spends that earlier output and creates a new output for Bob. The reference to the old output is public.

**[click]** It also creates change for Alice. In this example, five hundred satoshis go to the miner as the transaction fee. The input, outputs and amounts are all visible.

**[click]** The chain does not label these outputs “Alice” and “Bob”. But an observer can follow the references and combine them with information from elsewhere. Privacy requires hiding more than people’s names.

## Slide 3 · Keep the checks. Hide the details. {#checks}

Suppose we hide which earlier output Alice spends, who receives the new value, and the amounts. We still need to reject invalid payments.

**[click]** The input must exist. Alice cannot invent a record of money.

**[click]** She must be authorized to spend it. Knowing that a record exists is not enough.

**[click]** She must not spend it twice.

**[click]** And the transfer must conserve value.

Encryption hides data, but encryption alone does not establish any of these conditions. We need public evidence that the hidden data satisfies the rules. The next few mechanisms provide that evidence, each solving a different part of the problem.

## Slide 4 · Who checks a shielded payment? {#roles}

Before looking inside a payment, separate the three jobs.

**[click]** The wallet holds keys, prepares the transfer and produces a proof.

**[click]** A normal Bitcoin transaction carries the transfer data. Bitcoin checks its own transaction rules and orders the bytes in blocks. It does not verify the shielded proof.

**[click]** An indexer reads those blocks and checks the shielded rules. Processing that history is called replay. Replay builds the note tree, the spent-nullifier set and the history of roots.

Anyone can run this software, including a wallet operator. Indexers do not vote on which transfer is valid, and the indexing role grants no spending authority. We will return to what happens if a wallet relies on somebody else’s replay.

## Slide 5 · Value is held in notes {#notes}

Inside Shielded Bitcoin, the wallet controls notes: individual records of value. A displayed balance is calculated from the notes it can spend.

**[click]** For our example, Alice already owns an accepted note worth one hundred thousand satoshis.

**[click]** Paying Bob uses that note in full and creates a new note worth sixty thousand for him.

**[click]** Another new note returns forty thousand to Alice. The original note is not edited to contain a smaller balance.

These note amounts add up exactly. Unlike the ordinary Bitcoin transaction on the earlier slide, there is no fee deducted inside this shielded transfer. Publishing it requires a separate Bitcoin carrier transaction, which pays a Bitcoin fee.

## Slide 6 · What is inside a note? {#note-fields}

**[click]** A note’s plaintext has three fields: v, its amount in satoshis; d, the receive-path diversifier; and rseed, fresh randomness for this note.

**[click]** The wallet derives two values from rseed. Rho will help identify a repeated spend. The ephemeral secret key is used in encryption. They are derived values, not additional plaintext fields.

**[click]** The sender encrypts the plaintext to the recipient’s address. The published output contains an ephemeral public key, pk_eph, and the ciphertext, ct_note. That public key is not the recipient’s address key.

**[click]** Replay can build a tree entry from the published output data without decrypting it. That entry is called a leaf. Let’s look at exactly what it identifies.

## Slide 7 · A leaf identifies a published output {#leaf}

**[click]** Start with the output’s ephemeral public key and ciphertext. These bytes are public, even though the note plaintext is hidden.

**[click]** Include the creation transfer’s body hash and this output’s index within that transfer. The hash distinguishes the transfer; the index distinguishes its outputs. The leaf also includes a protocol salt and the reserved auxiliary value.

**[click]** Hash those fields together to obtain the leaf. Replay can repeat this calculation independently.

This is specific to Shielded Bitcoin: the leaf is derived from the published ciphertext and its context. It is not simply a hash of the hidden amount. Later, the transfer circuit must connect the hidden note to this public record, so the spender cannot substitute different contents.

## Slide 8 · Record every accepted output {#tree}

Leaves are appended to one global Merkle tree. Each parent is computed from its children, until one root represents the tree state.

**[click]** Accepted outputs add leaves in replay order. Each gets a global position.

**[click]** New leaves change the root. Replay stores the root after every Bitcoin block. A block with no accepted outputs carries the previous root forward.

**[click]** The history contains earlier roots as well as the current one. A wallet can refer to a recent earlier state when preparing a proof.

The tree records accepted creation history. Spending does not delete a leaf. If we removed spent leaves, the public deletion would identify the input we wanted to hide.

## Slide 9 · Prove membership without naming the leaf {#path}

Alice knows her note and its position. She needs evidence that its leaf belongs under an accepted root.

**[click]** Start with the selected leaf and its sibling hash. Hash them in their correct left-to-right order.

**[click]** Combine that result with the sibling at the next level. Continue until reaching the root. The sibling hashes and position form the Merkle authentication path.

**[click]** Check that the result equals the public anchor root. This proves membership in that state, assuming the hash construction is secure.

**[click]** In the shielded transfer, this computation happens inside the proof circuit. The selected leaf, position and path remain private witness data. Publishing an ordinary Merkle path would identify the leaf; the zero-knowledge proof is what hides which path was used.

## Slide 10 · Prevent spending the same note twice {#nullifier}

Membership tells us that the note exists. Its leaf remains in the tree after spending, so membership cannot tell us whether it is still spendable.

**[click]** Derive a public spend marker, the nullifier, from the wallet’s nullifier secret, the note’s rho, and its global tree position.

**[click]** When replay accepts the transfer, it inserts that nullifier into a public set.

**[click]** Spending the same note again produces the same marker. Replay rejects the duplicate. The proof enforces the derivation, so Alice cannot choose a fresh marker for the same input.

**[click]** From outside the wallet, the connection to the highlighted leaf disappears. The observer sees the marker, but the marker does not disclose which leaf it belongs to. Other information can still narrow the possibilities.

## Slide 11 · Reading and spending are separate capabilities {#keys}

The protocol derives several capabilities from one wallet seed. Their names matter less than what each one permits.

**[click]** The seed produces the master secret.

**[click]** The spending branch produces sk_spend. Knowing this secret is required to authorize a spend.

**[click]** From it comes sk_nf, the nullifier secret. The circuit enforces this derivation. sk_nf alone does not authorize spending.

**[click]** The incoming viewing branch supplies the material for detecting and decrypting received notes. The receive address contains a diversifier and a public transmission key.

**[click]** A separate outgoing viewing key recovers the sender’s records.

**[click]** Only sk_spend carries spending authority. Sharing a viewing capability reveals information without granting that authority. There is no global key that lets an indexer read everybody’s notes.

## Slide 12 · Follow one payment {#payment-divider}

We have the objects. Now let’s follow what the wallet actually does with them, from choosing an input to Bob recognizing the result.

## Slide 13 · Alice chooses the input and destinations {#select}

*The amounts are our wallet view, not an observer’s view*

**[click]** Alice selects her accepted, unspent note worth one hundred thousand satoshis. Her wallet has its plaintext and creation record, not just a number on a balance screen.

**[click]** Bob gives her his payment address: d and pk_d. This supplies the public material for encrypting a new note to him. He does not give Alice a spending or viewing secret.

**[click]** Alice plans sixty thousand to Bob and forty thousand to her own change address. Each output will use fresh note randomness.

Our payment has one input and two outputs. That shape is public. The association between an input and an earlier leaf, and between outputs and recipients, is what the protocol aims to hide.

## Slide 14 · Choose a recent accepted root {#anchor}

Alice cannot prove against an arbitrary root. She needs a root reconstructed from accepted history.

**[click]** The suggested profile allows anchors from the previous one hundred Bitcoin blocks, excluding the block currently being processed. This drawing compresses the window into ten blocks.

**[click]** The wallet chooses an anchor height and gets the corresponding root and authentication path. The envelope carries the height; replay derives the root from its own history.

**[click]** If publication is delayed until the anchor expires, replay rejects that envelope even if its proof was correct for the old root.

**[click]** The wallet rebuilds against a newer eligible root. Expiration does not destroy the note.

Wallets should choose deeper anchors according to their reorganization policy. The minimum accepted anchor depth is not a promise of finality. A note also cannot be spent in the same block that created it.

## Slide 15 · Reconstruct the input inside the circuit {#input}

Now connect Alice’s wallet data to the public state.

**[click]** The circuit uses the note opening and its creation record to reconstruct the same ciphertext-derived leaf. It checks the relationship to the receiving key derived from Alice’s spending key. Merely knowing the note plaintext would not authorize this spend.

**[click]** The position and authentication path must take that leaf to the chosen root. The creation output index and the global tree position are different values, used for different jobs.

**[click]** From the same spending authority, note randomness and position, the circuit derives the nullifier that Alice will publish.

These are connected constraints. Alice cannot prove membership for one note, use another note’s amount, and attach an unrelated nullifier.

## Slide 16 · Encrypt Bob’s new note {#encrypt}

The output note contains the amount, Bob’s diversifier and fresh rseed.

**[click]** From rseed, Alice derives a one-time secret and its corresponding ephemeral public key.

**[click]** Her one-time secret and Bob’s public transmission key produce a shared secret. A key schedule uses it and the ephemeral public key to derive the encryption material.

**[click]** Encrypt the note. The published output contains pk_eph and ct_note. The change output is constructed the same way, using Alice’s receiving address and separate randomness.

**[click]** Bob can derive the same shared secret using his viewing secret and the published ephemeral key. He can therefore decrypt without receiving Alice’s one-time secret through a separate channel.

The circuit must check that each ciphertext encrypts the same output note whose value it counts. Encryption and conservation cannot describe different outputs.

## Slide 17 · Keep an encrypted outgoing record {#outgoing}

Bob can recover his incoming note. Alice also needs to reconstruct what she sent if she restores her wallet.

**[click]** For every output, collect its recipient transmission key and ephemeral secret. Keep these records in output order.

**[click]** Encrypt the whole batch using material derived from Alice’s outgoing viewing key. This produces ct_out, with one authentication tag for the batch. It is bound to the already fixed public output data.

**[click]** On recovery, Alice can decrypt the batch and reconstruct the note-encryption channels. That lets her recover sent-payment details.

This does not reveal Bob’s nullifier secret or let Alice authorize his later spend. Even though she created his note and knows its contents, that knowledge alone does not identify its future nullifier.

## Slide 18 · Package the public data {#envelope}

*This size illustration switches to the paper’s two-input/two-output example; it is not the size of Alice’s one-input payment*

An envelope is the serialized transfer record that will be published on Bitcoin.

**[click]** Its leading fields identify the format, anchor height and input/output counts.

**[click]** Then come the nullifiers, one for each input.

**[click]** Each output contributes an ephemeral public key and an encrypted note.

**[click]** ct_out carries the outgoing recovery batch. At this point the entire body can be finalized.

**[click]** The proof has a separate slot after the body. It will be generated only after binding that body, which is our next step.

**[click]** In the paper’s two-input/two-output size example, the complete envelope is six hundred and ten bytes. The header group is widened here so its label is readable. This is an envelope size, not the size of a full Bitcoin transaction.

## Slide 19 · Bind the proof to this exact body {#binding}

The proof must establish a valid transfer and identify which published transfer it establishes.

**[click]** Hash the canonical body: all the envelope fields except the proof. The result is h_body. The proof is excluded to avoid making its input depend on its own bytes.

**[click]** h_body becomes part of the public statement for proof verification. Replay computes it independently from the published body.

**[click]** Suppose somebody changes ct_out after Alice creates the proof. The body hash changes, and the old proof no longer verifies for that statement.

This matters even for fields without separate public-input slots. The header, anchor height and outgoing recovery ciphertext are body-bound. The input and output counts also belong to the logical public statement; they are not omitted from it.

## Slide 20 · Generate the proof {#proof}

Now Alice has the private inputs and the finalized public statement.

**[click]** Her private witness contains the selected note opening, its creation data, position and path, her spending key, and the planned output data.

**[click]** Public inputs include the anchor root, counts, nullifiers, output keys and ciphertexts, and h_body. The verifier receives these values, not the witness.

**[click]** The prover uses the circuit’s proving key to produce a Groth16 proof. Verification uses the corresponding verifying key. Zero knowledge hides the witness; it does not encrypt the public inputs.

**[click]** The constraints establish membership and spending authority.

**[click]** They enforce the nullifier derivation and output ciphertext consistency.

**[click]** They enforce valid amount ranges, exact input/output equality, and binding to the envelope. Range and overflow constraints prevent arithmetic tricks from manufacturing value.

The proof establishes these relationships. Checking whether a nullifier has already been accepted remains a replay operation against the current state.

## Slide 21 · Publish in a Bitcoin transaction {#publish}

**[click]** Alice attaches the proof to the body and puts the envelope in a Bitcoin carrier transaction. The carrier’s fee is paid with ordinary Bitcoin inputs.

**[click]** When the carrier confirms, its bytes have a position in Bitcoin history. Bitcoin consensus has checked the carrier, not the shielded transfer.

**[click]** Replay reads the envelope at that position and applies the shielded checks. This is where acceptance is decided.

The paper’s suggested carrier uses OP_RETURN. It also considers a witness carrier with a commit and reveal transaction. Neither way of publishing bytes adds a shielded-proof verification rule to Bitcoin consensus. Publication policy and shielded validity are separate questions.

## Slide 22 · Replay checks before changing state {#replay}

Read these stages from left to right: parse, body binding, anchor, nullifiers, proof, then apply.

**[click]** A valid envelope passes all checks. Only then does replay append its output leaves and insert its nullifiers. Our one-input payment adds two leaves and one nullifier.

**[click]** A second envelope repeats the input’s nullifier. It fails at that check, even if it contains a fresh-looking proof. None of its outputs is applied.

**[click]** At the end of the block, replay stores the resulting root for that height.

**[click]** Acceptance is all-or-nothing. A bad proof, expired anchor or malformed envelope has no partial effect on the note tree or nullifier set. Its published bytes still remain in the Bitcoin transaction.

## Slide 23 · The accepted state records both events {#accepted}

**[click]** Alice’s old leaf remains in creation history. Her nullifier is now in the spent set, which prevents another accepted spend of that note.

**[click]** Replay appends the leaves for Bob’s output and Alice’s change, assigning each a position. The public tree does not label them with recipient names or amounts.

**[click]** The new root commits to that updated history. Other payments can later prove membership under an eligible root containing those outputs.

An accepted payment therefore records two different events: old value was spent, and new notes were created. The nullifiers and leaves represent those events without directly publishing the link between an input leaf and its spend marker.

## Slide 24 · Bob finds his output {#scan}

Bob does not look for his name or a publicly listed destination address. His wallet scans output records.

**[click]** Using the incoming viewing capability, it tries the shared-secret derivation and authenticated decryption for candidate outputs.

**[click]** A successful decryption returns the amount, diversifier and note randomness. Bob re-derives the ephemeral public key and checks it against the published one.

**[click]** He reconstructs the leaf and checks its accepted replay position. The wallet stores the note opening, creation data and position for a future spend.

Decrypting a ciphertext by itself does not establish acceptance. Bob must also know that replay accepted its envelope. His wallet then applies its Bitcoin confirmation policy before treating the payment as sufficiently settled.

## Slide 25 · Confirmed does not mean accepted {#confirmation}

Suppose the Bitcoin carrier confirms, but its shielded proof is invalid.

**[click]** The carrier remains confirmed. Replay rejects the envelope and leaves shielded state unchanged. Bob has no accepted note from that envelope.

These are two distinct conditions a wallet must track. Bitcoin confirmation establishes publication in the active chain; replay acceptance establishes the shielded state transition. Neither removes reorganization risk. If the active Bitcoin chain changes, replay must rebuild the affected state from that chain.

## Slide 26 · Independent replay gives the same result {#agreement}

**[click]** Two correct indexers replay the same Bitcoin blocks and derive the same root.

**[click]** A third service reports a different root. That claim alone does not change the protocol state. We do not settle the discrepancy by counting indexers.

**[click]** The wallet independently replays the history. Its result matches the correct indexers and exposes the inconsistent response. The same rules determine the tree, nullifier set and root history.

**[click]** That agreement requires the same completed deployment profile, starting state and declared note inventory, and the same active-chain prefix. Implementations cannot independently choose acceptance rules and still expect to agree.

An indexer can omit results, serve stale data or claim a wrong root. It cannot make those results match correct independent replay. A wallet that accepts an indexer’s answer without verifying it is trusting that service. The paper leaves light-client verification for future work.

## Slide 27 · Recover from keys and published history {#recover}

**[click]** Restore the seed to derive the wallet’s spending and viewing capabilities.

**[click]** Replay and scan the published transfer history. Incoming decryption recovers received notes; outgoing recovery reconstructs sent records.

**[click]** Replayed positions and the nullifier set let the wallet establish which recovered notes remain unspent and prepare their paths.

The seed alone is not an instantly restored balance. Recovery still needs the relevant history, protocol profile and replayed state. Initial notes may additionally depend on bootstrap recovery data supplied by the deployment.

Viewing keys can be shared for disclosure, but raw keys can reveal broad histories. A report is a claim unless supported by appropriate evidence; sharing a viewing key does not itself prove a complete balance.

## Slide 28 · What stays private? What stays public? {#privacy}

**[click]** For an honestly generated accepted transfer, the model protects the note amounts, recipient associations and the direct link from a nullifier to its input leaf.

**[click]** Timing, envelope size, input/output counts and anchor age remain public. So do the carrier transaction and its fee funding. Entry and exit can expose amounts and timing at the peg boundary.

**[click]** Recipients of outputs from the same transfer can recognize the shared creation body hash. Their outputs are grouped even though outsiders cannot simply read their amounts.

The proof hides its witness. It does not erase public metadata or facts an observer knows independently. Network and mempool observation sit outside this paper’s privacy model.

## Slide 29 · Which earlier note could it be? {#privacy-set}

An observer sees a nullifier and considers possible input leaves.

**[click]** A note created after the anchor root cannot be this input. The selected root limits the candidate history.

**[click]** Other knowledge can rule out candidates. For example, the observer may control some notes and know they did not authorize this spend. Merely having sent a note to somebody would not provide that knowledge.

**[click]** Enough outside information can leave just one plausible input. The illustration assumes those exclusions; it does not measure the privacy of a real payment.

The number of leaves is an upper bound on possibilities, not a guarantee of equally likely senders. A large tree does not automatically give every transfer a large effective privacy set.

## Slide 30 · Publication has a cost {#cost}

**[click]** Return to the separate two-input/two-output example: six hundred and ten envelope bytes under the paper’s size assumptions.

**[click]** One OP_RETURN output carrying them is six hundred and twenty-five virtual bytes. That figure excludes the other parts of the Bitcoin transaction. The paper relies on the Bitcoin Core v30 relay-policy change for this carrier; it is not a consensus change.

**[click]** Its witness-carrier example totals four hundred and thirty-eight virtual bytes across a commit and a reveal transaction, under the stated transaction assumptions. Choosing another carrier requires a deployment to specify it consistently.

Those are publication estimates, not a wallet benchmark or a universal fee quote. The Bitcoin fee also creates a linkage surface through the wallet or service funding the carrier.

## Slide 31 · What still needs to be specified? {#scope}

**[click]** Peg-in and peg-out are outside the transfer specification. The paper points to PIPEs v2 as a direction, but this transfer walkthrough does not establish a complete trustless deposit and withdrawal system.

**[click]** Groth16 requires circuit-specific setup and published proving and verifying keys. A retained setup trapdoor could undermine soundness and allow false proofs. This proposal does not inherit Orchard’s absence of a trusted setup.

**[click]** Deployments must complete concrete choices: supported input/output shapes, encodings, hashes, encryption construction, circuit gadgets and verifier parameters. The encryption requirements include recipient privacy and resistance to ambiguous openings; choosing any ordinary encryption library is not sufficient.

**[click]** Private fee funding and light-client verification remain future work. These limits matter when assessing an implementation, even though we can already explain the proposed transfer rules precisely.

## Slide 32 · One payment, end to end {#recap}

*Pause briefly on each stage; this is the same payment, not a second example*

**[click]** Alice selects an accepted note, a recent root and its path, then derives the input nullifier.

**[click]** She creates and encrypts Bob’s note and her change, prepares outgoing recovery, binds the body and generates the proof.

**[click]** A Bitcoin carrier publishes the envelope. Replay validates it and updates the note tree and nullifier set only on acceptance.

**[click]** Bob scans, decrypts and checks the accepted output. He now has the data needed to spend his note later, under his own spending authority.

## Slide 33 · Three things to remember {#takeaway}

**[click]** Notes represent value. The tree records their creation; nullifiers prevent repeated spending without directly identifying the input leaves.

**[click]** The proof connects private notes and authority to public ciphertexts, spend markers and an exact envelope. Encryption alone would not establish validity.

**[click]** Bitcoin supplies publication and ordering. Replay establishes shielded acceptance. The proposal’s transfer guarantees and assumptions must be assessed separately from the unfinished entry and exit mechanisms.

That is the transfer protocol we have followed from Alice to Bob.

## Slide 34 · Questions {#questions}

The QR code links to the Shielded Bitcoin paper. Appendix C walks through a transfer, and Appendix B lists the constraints behind the proof.

The Mastering Zcash article helped organize the explanation from basic objects to a payment lifecycle. For the mechanics of Shielded Bitcoin, use the paper and the source map accompanying this presentation.
