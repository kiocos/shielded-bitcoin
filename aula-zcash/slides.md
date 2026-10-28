---
theme: default
title: From Zcash to Shielded Bitcoin
info: An interactive course to understand and explain the protocol
author: Study material
colorSchema: dark
lang: en
aspectRatio: 16/9
canvasWidth: 1200
fonts:
  sans: Inter
  mono: monospace
  provider: none
drawings:
  enabled: false
transition: fade-out
mdc: true
layout: none
---

<StudyPage :index="0" />

<!--
How to study · From Zcash to Shielded Bitcoin

You already know that a transaction must be valid. Now we will separate the information needed to verify that validity from the information that must be public.

We will follow the same sequence throughout: first the problem, then the mechanism that solves it, then the technical rule. Whenever a formula appears, we will identify who knows each input and who checks the result.

This course is for reading and experimenting. You do not need presenter mode. The numerical examples and labs are teaching models; they do not move funds.

Key point: Goal: explain a complete transfer, including what the paper leaves unresolved.

Mastering Zcash: Chapters 3–4 as a starting point
https://maxdesalle.com/mastering-zcash/

Shielded Bitcoin · 24 Sep 2026: §§1–2: scope and relationship to Zcash
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=3
-->

---
layout: none
title: "Three sessions, one transfer"
---

<StudyPage :index="1" />

<!--
How to study · Three sessions, one transfer

Read the explanation on the right and examine the diagram on the left. On lab screens, change an input and predict the result before clicking.

Answer each question before revealing the solution. The answer explains the rule and the reason. Visiting a screen does not count as mastering its content.

The Reading button brings all explanations together on a searchable, printable page. The index lets you return to any concept. Your last study location is saved in this browser without recording an assessment.

Key point: Check your understanding: can you explain what would break if we removed each part?


-->

---
layout: none
title: "How to use the article"
---

<StudyPage :index="2" />

<!--
How to study · How to use the article

The article is a long introduction that combines technical explanations with an argument for privacy. Chapters 3 and 4 are the useful core for approaching the paper.

We will use Orchard as a concrete Zcash reference. Zcash is not one frozen construction: Sprout, Sapling and Orchard differ in their circuits, keys and proofs.

This course is not a translation of the article. Formulas and capabilities are checked against primary sources. At the end, we revisit simplifications that need care.

Key point: Always ask: is this an intuition, an Orchard rule or a Shielded Bitcoin rule?

Mastering Zcash: Article structure
https://maxdesalle.com/mastering-zcash/

ZIP 224 · Orchard: Motivation; Specification
https://zips.z.cash/zip-0224
-->

---
layout: none
title: "Start with a payment you know"
---

<StudyPage :index="3" />

<!--
Money as data · Start with a payment you know

A UTXO is an unspent transaction output. A wallet calculates its balance by adding the outputs it can spend; Bitcoin does not maintain a wallet balance field.

In this example, 60,000 sats go to Bob, 39,000 return as change and 1,000 pay the fee. Inputs explicitly reference previous outputs by transaction ID and output index.

This makes it possible to verify existence, authorization, absence of a previous spend and conservation of value. It also makes the link between the old output and the new payment public. That is the link we want to remove.

Key point: The challenge is to verify the rules without publishing the path of the money, rather than hiding the entire transaction.

Bitcoin Developer Guide · transactions: Inputs, outputs, UTXOs and change
https://developer.bitcoin.org/devguide/transactions.html
-->

---
layout: none
title: "A note is a unit of value"
---

<StudyPage :index="4" />

<!--
Money as data · A note is a unit of value

Think of a note as a private record of value that can be consumed once. It provides a useful connection to a UTXO, but spending will not directly reference the note’s public identifier.

A payment consumes whole notes and creates new ones. If you hold a note worth 100,000 and pay 60,000, you create one note for Bob and another for change. You do not edit the original note’s value.

The note is the logical object. Plaintext is its representation before encryption. Ciphertext is the encrypted data. The tree leaf is another object again. We will not use these terms interchangeably.

Key point: Notes, ciphertexts and leaves are related, but serve different purposes.

Zcash Protocol · 21 Oct 2026: §3.2: shielded pools and notes
https://zips.z.cash/protocol/protocol.pdf#page=15

Shielded Bitcoin · 24 Sep 2026: §5: note model
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=9
-->

---
layout: none
title: "Hiding, committing and proving are different tasks"
---

<StudyPage :index="5" />

<!--
Money as data · Hiding, committing and proving are different tasks

A ciphertext lets someone with the appropriate key recover its contents. A commitment lets someone check an opening: the data and randomness that produced it.

A commitment must hide its contents and prevent conflicting openings. A sealed envelope is an analogy: you fix something now and can open it later. The analogy stops where mathematical properties under explicit assumptions begin.

Neither mechanism alone demonstrates that a sum is correct or that you control a note. A ZK proof connects these facts without revealing the secrets.

Key point: Encryption enables reading. A commitment fixes data. A proof connects data to rules.

Orchard Book · commitments: Two types of commitment in Orchard
https://zcash.github.io/orchard/design/commitments.html

Shielded Bitcoin · 24 Sep 2026: §§9, 12 and 14: ciphertexts and the proved relation
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=15
-->

---
layout: none
title: "Try it: why is randomness necessary?"
---

<StudyPage :index="6" />

<!--
Money as data · Try it: why is randomness necessary?

If you publish only H(value), someone can test all plausible values and compare the hashes. A hash being hard to invert does not prevent guessing inputs from a small set.

The lab uses SHA-256 over a list containing a domain, value and randomness. Changing any field changes the output. Real randomness needs sufficient entropy and must remain private until an opening.

This is a teaching model of a commitment, not the Orchard algorithm. Orchard uses a commitment construction with Sinsemilla. What you are observing is the need to hide a predictable value.

Key point: A hash is not automatically private. The input space and randomness matter.

Orchard Book · commitments: Commit / ShortCommit and Sinsemilla
https://zcash.github.io/orchard/design/commitments.html
-->

---
layout: none
title: "The tree answers: was this note created?"
---

<StudyPage :index="7" />

<!--
Money as data · The tree answers: was this note created?

Hash pairs of leaves, then pairs of the results, until you obtain a root. Changing a leaf changes the hashes along the path to the root.

To prove that a leaf belongs to the tree, supply the sibling at each level and the left/right position. The path length is proportional to the logarithm of the number of leaves.

Leaves for accepted notes are appended in order. A spent note remains in the tree. The tree records creation; the nullifier set records consumption. Confusing these two states makes the entire model seem more complicated than it is.

Key point: Tree membership proves existence. We still need to check that the note has not been spent.

Orchard Book · commitment tree: Structure, ordering and anchors
https://zcash.github.io/orchard/design/commitment-tree.html

Shielded Bitcoin · 24 Sep 2026: §8: replayed state
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=13
-->

---
layout: none
title: "Build a Merkle path"
---

<StudyPage :index="8" />

<!--
Money as data · Build a Merkle path

Choose a leaf. At the first level, combine it with its sibling in the correct order. At the second, combine the result with the other pair’s hash. The result should be the public root.

The lab uses SHA-256 with separate domains for leaves and nodes. Displayed values are abbreviated; calculations use full hashes. This is neither Orchard’s tree hash nor an implementation of the paper.

An ordinary Merkle proof exposes which leaf and path you used. In a shielded transaction, this check takes place inside the ZK circuit, with the leaf, position and path kept private. Only the root needs to be public.

Key point: Merkle makes membership compact. ZK lets it be checked without revealing the path.

Orchard Book · commitment tree: Commitment tree
https://zcash.github.io/orchard/design/commitment-tree.html

Shielded Bitcoin · 24 Sep 2026: Appendix B, block 2: Merkle membership
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=46
-->

---
layout: none
title: "Spend without pointing to the leaf"
---

<StudyPage :index="9" />

<!--
Spend without pointing · Spend without pointing to the leaf

Publishing “I spent leaf 42” would restore the public link you wanted to hide. A nullifier is a different representation of that note’s spending identity.

It must be deterministic: spending the same note again produces the same marker. It must also be hard to link the marker to the leaf without the appropriate secret capability.

This creates two checks: the proof shows that the nullifier was derived correctly; the public state checks whether it has already appeared. A fresh random nullifier for each spend would allow double spending.

Key point: The proof fixes which nullifier can be produced. The public set prevents its reuse.

Orchard Book · nullifiers: Balance and spend unlinkability
https://zcash.github.io/orchard/design/nullifiers.html

Shielded Bitcoin · 24 Sep 2026: §9: nullifiers
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=15
-->

---
layout: none
title: "Experiment with spending identity"
---

<StudyPage :index="10" />

<!--
Spend without pointing · Experiment with spending identity

Here we use SHA-256 to visualize the dependence between fields. In the paper, the relation is nf = H_nf(sk_nf, ρ, pos), with functions and encodings fixed by the implementation profile.

Changing the position changes the spending identity. But the wallet cannot choose a convenient position: the circuit checks it against the tree path. Nor can it invent a different sk_nf: that key is derived from sk_spend inside the circuit.

The sender knows the plaintext of the note they created. That is not enough to identify its future nullifier: they lack the recipient’s derivation key. The lab illustrates the dependency; it does not prove cryptographic security.

Key point: Each formula input must be bound to the same note by a circuit constraint.

Shielded Bitcoin · 24 Sep 2026: §9 and appendix B, blocks 2–4
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=15
-->

---
layout: none
title: "The statement is the question. The witness is the evidence."
---

<StudyPage :index="11" />

<!--
Spend without pointing · The statement is the question. The witness is the evidence.

The statement is the public claim to verify, parameterized by x. The witness is the data that demonstrates it: the note, secret, Merkle path and other values.

The relation R describes the conditions connecting x and w. Under the system’s assumptions, a proof of knowledge says the prover knows suitable evidence. Zero knowledge says the proof reveals no additional information about that witness beyond the statement.

A ZK proof is not an encrypted note. The recipient does not decrypt the proof to receive a payment. They decrypt the note ciphertext, a separate transaction field.

Key point: Public: what is being claimed. Private: the data that makes the claim true.

Shielded Bitcoin · 24 Sep 2026: §14: public statement and private witness
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=22

Zcash Protocol · 21 Oct 2026: §4.18: circuit statements
https://zips.z.cash/protocol/protocol.pdf#page=63
-->

---
layout: none
title: "Where does “NP” come in?"
---

<StudyPage :index="12" />

<!--
Spend without pointing · Where does “NP” come in?

NP does not mean “non-polynomial.” It means that yes-instances have polynomial-size evidence whose validity can be checked in polynomial time.

Every problem in P is also in NP. We do not know whether P = NP. We do not need to resolve that question to understand a shielded transfer.

The wallet already has the notes and secrets. It is not searching for a solution to an NP-hard puzzle. It transforms a witness it holds into a verifiable proof without exposing that witness. The term “NP statement” appears again in PIPEs for the same reason.

Key point: The difficulty of discovering secrets and the cost of checking evidence are different questions.

Stephen Cook · P versus NP: §1: definitions of P, NP and checking relation
https://www.claymath.org/wp-content/uploads/2022/06/pvsnp.pdf

Bitcoin PIPEs v2: NP statement in the witness encryption construction
https://eprint.iacr.org/2026/186
-->

---
layout: none
title: "What does a zk-SNARK add?"
---

<StudyPage :index="13" />

<!--
Spend without pointing · What does a zk-SNARK add?

ZK is the property of not revealing the witness. Succinct means that the proof and its verification are compact relative to the computation being proved, with costs depending on the system and public inputs.

Non-interactive means that, with the necessary parameters, the prover supplies a proof without a round of questions from the verifier. Argument of knowledge includes a computational knowledge guarantee under cryptographic assumptions.

Groth16 and Halo 2 are different systems for producing and verifying proofs. Choosing one does not define what the proof guarantees: that comes from the relation the circuit actually enforces.

Key point: A proof can verify a circuit perfectly even when that circuit omitted an essential rule.

Justin Thaler · Proofs, Arguments, and Zero-Knowledge: §§3.1–3.2, 7.4 and 11.1
https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.pdf

Shielded Bitcoin · 24 Sep 2026: §17, A3 and appendix A.1
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=26

ZIP 224 · Orchard: Proving system
https://zips.z.cash/zip-0224
-->

---
layout: none
title: "A circuit is a set of constraints"
---

<StudyPage :index="14" />

<!--
Spend without pointing · A circuit is a set of constraints

In a circuit, “I ran an if statement in JavaScript” is not enough. Validity depends on mathematical constraints checked by the proof system. Every necessary property must appear in those constraints.

Circuit arithmetic usually takes place in a finite field. If the modulus were 17, 8 and 25 would be equal in that field. That does not authorize creating 17 units of money.

The lab separates modular equality from integer equality and checks value ranges. It does not generate a SNARK or hide the numbers. It is a constraint inspector for understanding why range checks and overflow prevention are part of conservation.

Key point: Σ inputs = Σ outputs must hold for integer amounts, not just modulo p.

Shielded Bitcoin · 24 Sep 2026: Appendix B, blocks 6–7
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=46
-->

---
layout: none
title: "Pause here: what prevents double spending?"
---

<StudyPage :index="15" />

<!--
Spend without pointing · Pause here: what prevents double spending?

The proof can show that a note exists under a root and that the spender is authorized. Those facts can remain true after the first spend.

That is why cryptographic proof verification and checking the current state complement each other. “Proof valid” is not a complete acceptance decision.

In Shielded Bitcoin, this separation is visible in the replay sequence. In Zcash, these checks are part of the chain’s validity rules.

Key point: If you can explain both checks, you already understand the central structure.

Shielded Bitcoin · 24 Sep 2026: §14.2: uniqueness outside the circuit; §15
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=22

Zcash Protocol · 21 Oct 2026: §3.9: nullifier sets
https://zips.z.cash/protocol/protocol.pdf#page=23
-->

---
layout: none
title: "Zcash has protocol generations"
---

<StudyPage :index="16" />

<!--
Zcash: Orchard · Zcash has protocol generations

Pools are separate domains of notes and state. A Sapling note does not become an Orchard leaf through a name change; moving value between pools involves rules and public values at the boundary.

The general pattern of commitments, nullifiers and proofs survives across generations. Note formulas, keys and authorization change.

Orchard uses Halo 2 with PLONKish arithmetization. This removes the trusted setup ceremony for that proof system, but does not remove cryptographic assumptions or the risk of circuit and implementation bugs.

Key point: The Shielded Bitcoin profile uses Groth16; it does not inherit Orchard’s lack of trusted setup.

ZIP 224 · Orchard: Motivation; Proving system; Security considerations
https://zips.z.cash/zip-0224

Shielded Bitcoin · 24 Sep 2026: Appendix A.1: Groth16
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=42
-->

---
layout: none
title: "What enters and leaves a pool is public"
---

<StudyPage :index="17" />

<!--
Zcash: Orchard · What enters and leaves a pool is public

A shielded pool is a domain of notes and rules within Zcash. Moving from one pool to another does not automatically merge their candidate sets. The net value crossing the boundary is public.

The turnstile is public accounting of inflows and outflows. The rule that a pool balance cannot become negative limits how much can leave. On its own, it does not show that every private note inside was created correctly.

A fully Orchard payment must also account for the fee in the transaction balance. We cannot import that mechanism into Shielded Bitcoin: the link between notes and BTC UTXOs requires a separate peg, outside the paper’s scope.

Key point: Hiding internal flows and controlling the monetary boundary are related but distinct problems.

ZIP 224 · Orchard: Security and Privacy Considerations: turnstile
https://zips.z.cash/zip-0224

Zcash Protocol · 21 Oct 2026: §4.17: chain value pool balances
https://zips.z.cash/protocol/protocol.pdf#page=61

Shielded Bitcoin · 24 Sep 2026: §1.2: peg outside scope
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=4
-->

---
layout: none
title: "The actual Orchard note"
---

<StudyPage :index="18" />

<!--
Zcash: Orchard · The actual Orchard note

addr contains diversified receiving material. v is the value. ρ connects the note’s creation to the Action that produces it. ψ and rcm are derived from a random seed, also using ρ.

The logical representation is not the plaintext serialization. The plaintext carries rseed, and the wallet derives the other values. The required ρ is already available in the Action.

The note commitment cm fixes the note. The tree receives cmx, the coordinate extracted from that commitment. Calling all of this “a hash of the note” helps on a first reading, but hides the actual construction.

Key point: The logical object, transmitted plaintext and public commitment are three distinct representations.

Orchard Book · nullifiers: Note structure and derivation of ψ
https://zcash.github.io/orchard/design/nullifiers.html

Zcash Protocol · 21 Oct 2026: §3.2 and §3.2.1
https://zips.z.cash/protocol/protocol.pdf#page=15
-->

---
layout: none
title: "The actual Orchard nullifier formula"
---

<StudyPage :index="19" />

<!--
Zcash: Orchard · The actual Orchard nullifier formula

The secret nk prevents someone who knows the note but lacks the nullifier capability from detecting its spend. ψ provides randomness; cm binds the construction to the note commitment.

The displayed expression omits only the detailed notation for reductions and field representations. It shows the relevant operations in the Orchard construction. Use the specification and test vectors for implementation.

Compare this with Shielded Bitcoin: it uses H_nf(sk_nf, ρ, pos), explicitly including the leaf position. Do not carry the formula from one system into the other. The conceptual purpose is the same; the definition differs.

Key point: Understand the properties before memorizing the formula, but do not confuse a simplification with the algorithm.

Orchard Book · nullifiers: Formula and rationale
https://zcash.github.io/orchard/design/nullifiers.html

Shielded Bitcoin · 24 Sep 2026: §9: nullifier with position
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=15
-->

---
layout: none
title: "Orchard organizes transactions into Actions"
---

<StudyPage :index="20" />

<!--
Zcash: Orchard · Orchard organizes transactions into Actions

An Action contains one input and one output, which may be zero-value dummies according to the rules. A bundle groups Actions, and a Halo 2 proof covers the bundle.

If the real payment uses one note and creates two, the construction can fill the remaining spending side with a dummy. An observer sees two Actions; that count alone does not directly reveal that there was exactly one real input.

This reduces arity leakage, but the Action count and transaction size remain public. In the Shielded Bitcoin profile, N and M are explicit, and the paper does not fix a standardized arity that hides all such patterns.

Key point: Two Actions do not necessarily mean two real inputs and two real recipients.

Orchard Book · actions: Action rationale
https://zcash.github.io/orchard/design/actions.html

Shielded Bitcoin · 24 Sep 2026: §20.3: observable surface and arity
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=34
-->

---
layout: none
title: "Note commitment ≠ value commitment"
---

<StudyPage :index="21" />

<!--
Zcash: Orchard · Note commitment ≠ value commitment

This is the conceptual form of a Pedersen commitment. Adding commitments also adds their values and blinding factors. This makes it possible to construct a balance check without publishing each amount.

In Orchard, an Action uses a commitment to the net value between its input and output. The circuit binds that commitment to the private amounts. The binding signature completes the bundle balance check against valueBalanceOrchard.

You cannot simply add points and expect zero: the blinding factors are present too. This construction does not replace range checks. Shielded Bitcoin directly enforces integer equality of the sums in the transfer relation.

Key point: Do not confuse proving a note’s existence with proving conservation of value.

Orchard Book · commitments: HomomorphicCommit
https://zcash.github.io/orchard/design/commitments.html

Zcash Protocol · 21 Oct 2026: §4.14: balance and binding signature
https://zips.z.cash/protocol/protocol.pdf#page=57

Shielded Bitcoin · 24 Sep 2026: Appendix B, block 7
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=47
-->

---
layout: none
title: "Seeing spends is not authorizing spends"
---

<StudyPage :index="22" />

<!--
Zcash: Orchard · Seeing spends is not authorizing spends

The full viewing key can detect when received notes have been spent because it includes nk. It still lacks the authorization secret ask. Authorization uses spend signatures checked by the protocol rules.

That is why “viewing keys cannot spend because they lack nk” does not correctly describe Orchard. A capability can identify a spend without having the authority to authorize the transaction.

Outgoing recovery covers outputs constructed for the corresponding outgoing viewing key. Holding a FVK does not force a sender to publish a recoverable record of every possible activity.

Key point: Read capabilities and spending authority must be analyzed separately.

Zcash Protocol · 21 Oct 2026: §3.1; §4.2.3; §4.15
https://zips.z.cash/protocol/protocol.pdf#page=14
-->

---
layout: none
title: "How does Bob find a note?"
---

<StudyPage :index="23" />

<!--
Zcash: Orchard · How does Bob find a note?

The wallet scans outputs and attempts recovery with its viewing capability. When it finds a candidate, it reconstructs the note values and checks the public commitment. Decryption and candidate validation are separate steps.

The Orchard proof does not enforce the complete ciphertext encryption relation that Shielded Bitcoin proposes to enforce. A transaction can satisfy consensus rules while carrying incorrect recovery data.

This does not make someone else’s note spendable by the wrong recipient. It means valid publication and recoverable delivery are different properties. The Shielded Bitcoin paper chooses to bring ciphertext consistency into the circuit.

Key point: A note must be valid, and its data must reach the recipient in recoverable form.

Zcash Protocol · 21 Oct 2026: §4.20.2: decryption; §4.18.4: Action statement
https://zips.z.cash/protocol/protocol.pdf#page=71

Shielded Bitcoin · 24 Sep 2026: §14.1, condition 5
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=22
-->

---
layout: none
title: "A Zcash transaction, end to end"
---

<StudyPage :index="24" />

<!--
Zcash: Orchard · A Zcash transaction, end to end

Start with Alice’s notes: select notes and paths, choose an anchor, and construct outputs and ciphertexts. Then construct the proof and the required authorization and balance signatures.

Nodes check structure, proofs, signatures, anchors, nullifiers and other consensus rules. Mining and inclusion apply to transactions that satisfy the chain’s rules.

Bob detects and validates his note. The wallet’s confirmation policy addresses reorganization risk. None of these steps turns data privacy into an absence of metadata: size, timing and public structure remain observable.

Key point: In Zcash, accepting a shielded transaction is part of correctly accepting the chain itself.

Zcash Protocol · 21 Oct 2026: §4.7.3, §4.20.2 and §7.4
https://zips.z.cash/protocol/protocol.pdf#page=48
-->

---
layout: none
title: "What does a viewing key disclose?"
---

<StudyPage :index="25" />

<!--
Zcash: Orchard · What does a viewing key disclose?

Name a secret by the capability it grants. “Only I have the private key” does not explain a system with spending keys, viewing keys and ephemeral keys.

When comparing with Shielded Bitcoin, do not assume the Orchard FVK is equivalent to vk_in or vk_out. In the paper, those disclosure capabilities exclude sk_nf and do not provide a general mechanism for linking nullifiers.

Key point: The same word “viewing” can describe different scopes in different protocols.

Zcash Protocol · 21 Oct 2026: §3.1: composition of the Orchard FVK
https://zips.z.cash/protocol/protocol.pdf#page=14

Shielded Bitcoin · 24 Sep 2026: §7: disclosure
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=11
-->

---
layout: none
title: "Now remove the separate chain"
---

<StudyPage :index="26" />

<!--
The bridge to Bitcoin · Now remove the separate chain

The wallet produces an envelope containing nullifiers, ciphertexts and a proof. That envelope goes into an ordinary Bitcoin transaction called a carrier.

Bitcoin checks the Bitcoin transaction rules. Indexers extract envelopes, run replay and verify shielded validity. An invalid envelope can remain published on the chain without changing shielded state.

This is the central architectural change from Zcash. The paper specifies internal transfers; moving value into and out of ordinary BTC requires separate components. Publication on L1 does not mean validation by L1 consensus.

Key point: Bitcoin orders the bytes. Replay gives the bytes meaning.

Shielded Bitcoin · 24 Sep 2026: §§1.2, 4 and 15
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=4
-->

---
layout: none
title: "Three conceptual structures hold the state"
---

<StudyPage :index="27" />

<!--
The bridge to Bitcoin · Three conceptual structures hold the state

You can think of event sourcing: read an ordered log and apply a deterministic transition function. The qualification is that not every published record is accepted. Rules filter envelopes before changing the state.

The tree is global to the protocol, not one tree per indexer or user. Each implementation stores a copy or an equivalent representation.

Equal results require the same completed profile, declared initial state and inventory, and active chain prefix. This is not a promise of agreement between implementations using different rules.

Key point: Same data + same rules + same initial state → same reconstructed state.

Shielded Bitcoin · 24 Sep 2026: §8; §17, A8; §18, G1
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=13
-->

---
layout: none
title: "The paper’s plaintext is small"
---

<StudyPage :index="28" />

<!--
The bridge to Bitcoin · The paper’s plaintext is small

v is the note’s value. d selects a diversified receiving base. rseed reconstructs the derived values needed to use the note.

The payment address provides the pair (d, pk_d). The note does not carry a spending key, and the sender does not need Bob’s spending key to create an output for him.

ρ and sk_eph are derived values, not extra independent plaintext fields. sk_eph also appears inside the encrypted sender recovery batch. So do not say it is never transmitted.

Key point: The note carries enough to reconstruct its relations without publishing its secrets.

Shielded Bitcoin · 24 Sep 2026: §§5–6 and appendix A.3
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=9
-->

---
layout: none
title: "Both sides reach the same secret"
---

<StudyPage :index="29" />

<!--
The bridge to Bitcoin · Both sides reach the same secret

This is a Diffie–Hellman relation. Alice uses her ephemeral secret and Bob’s diversified public key. Bob uses his viewing secret and the ephemeral key Alice publishes.

The shared secret feeds key derivation and authenticated note encryption. Bob recovers d and rseed and checks the necessary relations. The profile must define encodings, KDFs and the encryption construction.

Knowing sk_view allows reading, not the spend proof required by the circuit. Spending requires knowledge of sk_spend, and the input relation derives the key lineage inside the circuit.

Key point: The equality explains recovery. Spending authority comes from a different relation.

Shielded Bitcoin · 24 Sep 2026: §12: output encryption
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=18
-->

---
layout: none
title: "Encryption must also bind the note"
---

<StudyPage :index="30" />

<!--
The bridge to Bitcoin · Encryption must also bind the note

The circuit connects the private note to the public ciphertext. For that connection to provide a secure identity, the ciphertext must not have conflicting openings that satisfy different relations.

The paper requires a committing AEAD for the recipient channel, with key commitment and opening robustness as well as key privacy. An ordinary AEAD does not automatically guarantee all of these properties.

ct_out has its own requirements for confidentiality, integrity and sender key privacy. Binding its bytes to h_body prevents later tampering; it does not turn arbitrary sender-chosen contents into a complete, truthful report. The profile still needs to fix the concrete constructions.

Key point: “It is encrypted” is not enough to support the security argument.

Shielded Bitcoin · 24 Sep 2026: §17, A6; appendix A.1: encryption requirements
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=26
-->

---
layout: none
title: "The leaf derives from public ciphertext"
---

<StudyPage :index="31" />

<!--
The bridge to Bitcoin · The leaf derives from public ciphertext

The indexer does not need the plaintext to compute the leaf. It has the public envelope body and computes the leaf after the transfer is accepted.

The proof verifies that the published ciphertexts are consistent with the notes used in the balance. When spending later, the circuit reconstructs the creation leaf and its relation to the private note.

j and pos are not interchangeable. A transfer can create output j = 0 at global position 420 and output j = 1 at position 421. The nullifier uses pos; leaf reconstruction uses j.

Key point: Consistent encryption → public fields → leaf → private path to the root.

Shielded Bitcoin · 24 Sep 2026: §9 and appendix B, blocks 1 and 5
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=15
-->

---
layout: none
title: "Why include pos in the nullifier?"
---

<StudyPage :index="32" />

<!--
The bridge to Bitcoin · Why include pos in the nullifier?

Depending only on sender-chosen material can allow intentional spending-identity collisions between distinct notes. The paper includes the replay-assigned position to distinguish occurrences and address the serial-number reuse flaw discussed in this line of work.

Alice cannot change pos without breaking tree membership. Nor can she change sk_nf independently of sk_spend. These constraints prevent manufacturing a new marker for the same spend.

The old leaf remains. Accepting a spend inserts the nullifier into the set and appends the new outputs to the tree.

Key point: The marker is stable for that note at that position, under that authority.

Shielded Bitcoin · 24 Sep 2026: §9; §19.2; appendix B, block 4
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=15
-->

---
layout: none
title: "The contract between proof and replay"
---

<StudyPage :index="33" />

<!--
The bridge to Bitcoin · The contract between proof and replay

The root comes from R[h_anchor]. Counts N and M are part of the logical statement. The header, h_anchor and ct_out are bound through the body hash, without individual slots in that tuple.

The circuit checks existence, authorization, correct nullifiers, ciphertext consistency, ranges and integer equality of the sums. Each output is bound to the chosen recipient; their key is not derived from the sender’s key.

The circuit does not do everything. Canonical parsing, the anchor window and uniqueness against current state belong to replay. Scanning and note selection belong to the wallet.

Key point: Read Appendix B asking: which attack does each constraint block prevent?

Shielded Bitcoin · 24 Sep 2026: §14 and appendix B
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=22
-->

---
layout: none
title: "The proof must apply to these bytes"
---

<StudyPage :index="34" />

<!--
The bridge to Bitcoin · The proof must apply to these bytes

The wallet first finishes the recipient ciphertexts and the ct_out batch. Only then does it serialize the body canonically and compute h_body. The proof is generated afterward and appended.

If someone changes ct_out after proof generation, the recomputed hash changes. Verification with the new statement fails. ct_out is a useful example because it has no separate public slot in the circuit tuple.

Proof π is excluded from the hash to avoid circularity. This allows re-randomizing a Groth16 proof without changing the body, but does not allow another spend: the nullifiers remain the same.

Key point: The proof attests to a relation about a specific envelope, not a reusable generic authorization.

Shielded Bitcoin · 24 Sep 2026: §13.3; §19.5
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=21
-->

---
layout: none
title: "Separate Shielded Bitcoin’s capabilities"
---

<StudyPage :index="35" />

<!--
The bridge to Bitcoin · Separate Shielded Bitcoin’s capabilities

sk_spend is the secret whose possession authorizes spending in the circuit. sk_nf and the incoming viewing lineage derive from it. vk_out comes from the master branch and recovers outgoing records.

sk_nf is sensitive because it links known notes to nullifiers, but it cannot authorize a spend by itself. vk_in and vk_out are reading capabilities and do not include sk_nf.

d diversifies receiving; it does not create another independent spending authority. Do not attribute an unlinkability guarantee for diversified addresses to the paper when it does not state one.

Key point: Do not copy Orchard’s key diagram to explain this paper’s capabilities.

Shielded Bitcoin · 24 Sep 2026: §6 and §9: derivation and ownership
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=10
-->

---
layout: none
title: "Disclosure is reading with a scope"
---

<StudyPage :index="36" />

<!--
The bridge to Bitcoin · Disclosure is reading with a scope

If you provide a raw key and say “use it only for October,” the time restriction is a policy. The holder can apply it to all accessible compatible history.

A selective opening may be more appropriate for showing a single object. A balance or completeness report needs sufficient evidence; a wallet export does not become a proof just because it contains numbers.

None of the paper’s disclosure modes grants spending authority or a general nullifier-derivation capability. This also limits what an auditor can conclude about notes already consumed.

Key point: A reading capability is not, by itself, proof of balance, ownership or completeness.

Shielded Bitcoin · 24 Sep 2026: §7: disclosure and audit model
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=11
-->

---
layout: none
title: "What exactly goes onto Bitcoin?"
---

<StudyPage :index="37" />

<!--
Replay and wallets · What exactly goes onto Bitcoin?

In the two-input, two-output example, the envelope is 610 bytes. Counts determine the nullifier and output vectors. ct_out is a batch of sender recovery data.

The Appendix A profile places the entire envelope in one OP_RETURN output. That output occupies 625 non-witness bytes, contributing 625 vB to the carrier. This is not the size of the entire transaction.

The paper also calculates 438 vB for a witness commit/reveal pair. This is an alternative publication template, not a carrier automatically accepted by the described OP_RETURN profile.

Key point: 610 protocol bytes ≠ 610 vB for a complete Bitcoin transaction.

Shielded Bitcoin · 24 Sep 2026: Appendices A.3–A.5: sizes and carrier
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=43

Bitcoin Core 30 · relay policy: datacarriersize changes are policy
https://bitcoincore.org/en/releases/30.0/#policy
-->

---
layout: none
title: "The shielded payment balances without an internal fee"
---

<StudyPage :index="38" />

<!--
Replay and wallets · The shielded payment balances without an internal fee

Alice consumes a 100,000 sat note and creates 60,000 for Bob and 40,000 as change. The paper’s relation requires exact equality between shielded inputs and outputs.

The miner receives the fee from a conceptually separate Bitcoin transaction: the carrier publishing the envelope. In this example, a 12,000 sat UTXO creates 11,000 in change and pays a 1,000 sat fee. These numbers are illustrative.

Do not subtract that 1,000 from the shielded note without a protocol rule authorizing it. The fee wallet is also a source of public correlation. Private fees are future work.

Key point: Hiding the envelope’s contents does not hide how its publication is funded.

Shielded Bitcoin · 24 Sep 2026: §14.1; §20.5; appendix B, block 7
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=22
-->

---
layout: none
title: "Replay has an acceptance order"
---

<StudyPage :index="39" />

<!--
Replay and wallets · Replay has an acceptance order

The parser rejects ambiguous bytes, invalid lengths and invalid encodings. Replay derives the body hash and corresponding statement. It checks the window and retrieves the anchor root.

Next it checks for duplicate nullifiers within the envelope and nullifiers already present in the state. It verifies the proof under the profile parameters and only then applies the change.

Applying means inserting every nullifier and appending every leaf. If any check fails, there is no “half of the outputs accepted.” The envelope remains visible on Bitcoin, but shielded state remains unchanged.

Key point: Confirmed on Bitcoin and accepted by Shielded Bitcoin are different decisions.

Shielded Bitcoin · 24 Sep 2026: §15 and appendix A.7
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=23
-->

---
layout: none
title: "An anchor is a root from an allowed past"
---

<StudyPage :index="40" />

<!--
Replay and wallets · An anchor is a root from an allowed past

If only the tip root were valid, new outputs could invalidate the wallet’s reference while it prepared a proof. A window of earlier roots allows construction against a recent snapshot.

The profile uses W = 100 and K_min = 1. A note created in H cannot be spent in H because it does not exist under any permitted earlier root.

An expired anchor does not destroy the note. The wallet must update its path, anchor, body and proof. Choosing a deeper anchor and waiting for confirmations are wallet risk decisions beyond replay’s minimum.

Key point: Existence under an earlier root and permission to use that root are separate checks.

Shielded Bitcoin · 24 Sep 2026: §8 and appendix A.6
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=13
-->

---
layout: none
title: "Act as the indexer"
---

<StudyPage :index="41" />

<!--
Replay and wallets · Act as the indexer

Process a valid case, then repeat its nullifier. Next test a modified body, an invalid proof and anchors at the window boundaries.

This lab is a teaching state machine: it simulates parsing, binding and proof verification outcomes. It does not contain Groth16. Ordering, uniqueness and mutation only after acceptance are executed in the browser.

Two candidates spending the same note can each be individually well formed. Bitcoin order determines which reaches the state first. The second attempt fails. A reorganization requires rolling back the suffix and replaying the new order.

Key point: Look at the state before and after, not just the Bitcoin transaction status.

Shielded Bitcoin · 24 Sep 2026: §15; appendix A.7
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=23
-->

---
layout: none
title: "Alice pays Bob: walk through every step"
---

<StudyPage :index="42" />

<!--
Replay and wallets · Alice pays Bob: walk through every step

Alice already holds an accepted note; this example does not demonstrate BTC entering the system. She obtains its position and path, chooses an anchor and constructs Bob’s note and her change.

She then computes the nullifier, ciphertexts, ct_out and h_body, and generates the proof. She publishes the envelope in a carrier with a Bitcoin fee. Indexers replay it and apply the change if everything passes.

Bob scans accepted outputs, decrypts a candidate and checks the note relations. He stores the creation data and replay-assigned position. The confirmation policy still determines when the wallet treats the receipt as sufficiently stable.

Key point: Every field Bob saves now will help reconstruct the witness for a future spend.

Shielded Bitcoin · 24 Sep 2026: Appendix C: Alice-to-Bob walkthrough
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=48
-->

---
layout: none
title: "How does the wallet recover?"
---

<StudyPage :index="43" />

<!--
Replay and wallets · How does the wallet recover?

The seed alone does not contain all future payments. It derives the keys needed to recognize and decrypt published records. The wallet must scan history and associate the results with replayed state.

For initial deployment notes, the paper requires deployment-defined bootstrap recovery data. “Seed + history” does not remove that initial condition.

Obtaining positions from an indexer can be convenient, but trusting them without replay or verification changes the trust model. Losing local history is also different from losing the seed.

Key point: Recovery depends on both possession of the secret and the availability and interpretation of data.

Shielded Bitcoin · 24 Sep 2026: §16; §1.1: bootstrap
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=23
-->

---
layout: none
title: "What can a malicious indexer do?"
---

<StudyPage :index="44" />

<!--
Replay and wallets · What can a malicious indexer do?

An indexer receives no authority to spend notes. That is a custody property. Availability and response integrity are different properties.

A wallet that neither replays nor verifies responses trusts its indexer for the state it sees. The paper acknowledges this assumption in A11; efficient light-client verification is future work.

If two indexers disagree, check the active prefix, initial state, profile and implementation. Counting votes among APIs does not replace checking the rules.

Key point: “I can verify” and “my wallet actually verifies” are different claims.

Shielded Bitcoin · 24 Sep 2026: §17, A11; §22: light clients
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=27
-->

---
layout: none
title: "A reorg also changes shielded state"
---

<StudyPage :index="45" />

<!--
Replay and wallets · A reorg also changes shielded state

A transfer can disappear from the active chain or reappear in a different order. Replay follows the active Bitcoin chain, not the first sequence an indexer saw.

A note’s global position can change after a reorganization. Because pos enters the nullifier and Merkle path, the wallet must update affected witnesses and transfers. Do not treat a constructed spend’s hash as permanent across every possible chain.

Waiting for confirmations reduces reorganization risk without giving an absolute guarantee. K_min = 1 only specifies which anchors the protocol accepts.

Key point: There is no second finality mechanism independent of Bitcoin. State derives from the active chain.

Shielded Bitcoin · 24 Sep 2026: §8 and §19.1: replay and reorganizations
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=14
-->

---
layout: none
title: "The proof hides the witness, not the world"
---

<StudyPage :index="46" />

<!--
Limits and assumptions · The proof hides the witness, not the world

The privacy model conditions its guarantee on public information it does not try to hide. Compared histories must have the same relevant leakage pattern.

Two recipients in the same envelope can compare h_body and recognize that their outputs came from the same transfer. That alone does not reveal the sender’s real-world identity.

Network and mempool analysis are outside the paper’s model. Absence of a direct cryptographic link also does not mean inference is impossible using timing, boundary amounts or outside knowledge.

Key point: The useful question is “what does this adversary know?”, rather than “is it private, yes or no?”.

Shielded Bitcoin · 24 Sep 2026: §20: privacy model and residual leakage
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=31
-->

---
layout: none
title: "A possible set is not guaranteed privacy"
---

<StudyPage :index="47" />

<!--
Limits and assumptions · A possible set is not guaranteed privacy

The anchor root limits which leaves could have been spent: later leaves cannot be inputs to that statement. This is a structural bound, not a uniform probability distribution.

The lab reveals hypothetical outside facts: a voluntary opening or private knowledge that certain notes remain unspent. These exclusions belong to the scenario; they are not facts anyone can infer from a ciphertext.

Being a note’s sender is not enough to compute the recipient’s nullifier. Counting leaves does not count people, either. Even several remaining candidates may have very unequal probabilities.

Key point: A candidate set bounds possibilities; effective privacy depends on available information.

Shielded Bitcoin · 24 Sep 2026: §20.6: privacy set
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=36
-->

---
layout: none
title: "Trusted setup: what is being trusted?"
---

<StudyPage :index="48" />

<!--
Limits and assumptions · Trusted setup: what is being trusted?

Setup generates parameters for a specific circuit. In an appropriate multiparty ceremony, one honest, uncompromised contribution that is correctly discarded is enough to prevent reconstruction of the trapdoor.

The main risk here is soundness: accepting false statements, such as transfers that create value. Do not automatically conclude that a trapdoor also decrypts every note; those are different properties.

The paper assumes a secure setup. It also leaves concrete circuit, encoding, hash and encryption choices to a completed implementation specification. Groth16 does not fill those gaps by itself.

Key point: The 192-byte proof size comes with a concrete set of assumptions and choices.

Shielded Bitcoin · 24 Sep 2026: §17, A3; §22.1; appendix A.1
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=26
-->

---
layout: none
title: "How do BTC enter and leave?"
---

<StudyPage :index="49" />

<!--
Limits and assumptions · How do BTC enter and leave?

A note denominated in satoshis does not by itself show that it can be redeemed for a Bitcoin UTXO. That link requires an entry and exit mechanism with its own rules.

The paper excludes peg-in and peg-out from its scope and its non-custodial transfer claim. It points to PIPEs v2 as a direction, but that is not a complete peg specification.

The introduction and abstract use broad language about PIPEs. For the operational division, read §1.2, §2, §15 and A.1: replay verifies the transfer; PIPEs appears at the boundary with ordinary BTC.

Key point: Never turn “non-custodial internal transfers” into “an already specified trustless peg.”

Shielded Bitcoin · 24 Sep 2026: §1.2; §2; §22.3
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=4
-->

---
layout: none
title: "PIPEs: a proof can unlock a signature"
---

<StudyPage :index="50" />

<!--
Limits and assumptions · PIPEs: a proof can unlock a signature

Witness encryption encrypts under a statement, and decryption uses a witness satisfying that statement. In the PIPEs framing, it allows the use of signing material to depend on a relation outside Bitcoin.

A SNARK proof can serve as the witness for another relation whose predicate verifies that proof. This is a different layer from the transfer’s original private witness.

Bitcoin still checks an ordinary signature. To obtain covenant-like output restrictions, the construction must bind authorization to the permitted message or transaction; releasing a reusable key without that binding is insufficient. The concrete WE construction is presented as a research direction.

Key point: A small proof does not imply a small WE ciphertext or a production-ready bridge.

Bitcoin PIPEs v2: Abstract and Witness Signature construction
https://eprint.iacr.org/2026/186

Shielded Bitcoin · 24 Sep 2026: §22.3: future peg
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=39
-->

---
layout: none
title: "What the paper resolves and what remains open"
---

<StudyPage :index="51" />

<!--
Limits and assumptions · What the paper resolves and what remains open

Appendix A describes a profile and defaults, but A.1 lists concrete choices still required. Two implementers cannot choose different hashes, curves or encodings and expect agreement.

OP_RETURN carriage depends on relay and mining policy, not a consensus promise. The increase in datacarriersize in Core 30 helps this carrier, but operators can adopt other policies.

The paper also sketches atomic swaps through h_aux and optional KYC lineage. These are extensions, not prerequisites for understanding the basic transfer. Learn the validity relation and system boundaries first.

Key point: When explaining maturity, distinguish proposal, profile, implementation, deployment and measurement.

Shielded Bitcoin · 24 Sep 2026: §22; appendices A.1 and D
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=38

Bitcoin Core 30 · relay policy: Configurable OP_RETURN policy
https://bitcoincore.org/en/releases/30.0/#policy
-->

---
layout: none
title: "The complete comparison, side by side"
---

<StudyPage :index="52" />

<!--
Explain the paper · The complete comparison, side by side

What you carry from Zcash into the paper is a set of questions: how to represent value, prove existence, mark spends, authorize, conserve and recover data.

The answers are not interchangeable. The paper uses ciphertext-derived leaves, checks ciphertext consistency inside the circuit, includes position in the nullifier and separates the carrier fee.

This comparison is with Orchard, not every protocol that has existed under the Zcash name. For another generation, rebuild the table using its specification.

Key point: Learning Zcash provides the vocabulary. Understanding the differences lets you explain the paper.

ZIP 224 · Orchard: Orchard specification
https://zips.z.cash/zip-0224

Shielded Bitcoin · 24 Sep 2026: §§2, 9, 14 and A.1
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=5
-->

---
layout: none
title: "Revisit the article with these adjustments"
---

<StudyPage :index="53" />

<!--
Explain the paper · Revisit the article with these adjustments

Use these differences to guide rereading without discarding the article’s teaching sequence. Its payment cycle remains useful for organizing the investigation.

Identify the public data, the secret and the exact check instead of repeating a broad privacy claim. If a statement depends on a generation, pool or capability, name it.

The article also makes political claims and comparisons between projects. Those do not replace an adversary model or specification. You do not need to adopt those positions to explain Shielded Bitcoin.

Key point: A clear explanation can remain simple while stating exactly where a simplification ends.

Mastering Zcash: §§3.5–3.6, 4 and 8.2
https://maxdesalle.com/mastering-zcash/

Orchard Book · nullifiers: Actual formula
https://zcash.github.io/orchard/design/nullifiers.html

Zcash Protocol · 21 Oct 2026: §3.1 and §4.18.4
https://zips.z.cash/protocol/protocol.pdf#page=14
-->

---
layout: none
title: "Read the paper in this order"
---

<StudyPage :index="54" />

<!--
Explain the paper · Read the paper in this order

On the first pass, mark the nouns: note, leaf, nullifier, anchor, witness, envelope. On the second, mark the verbs: derive, verify, reject, append, recover.

For each check, ask who performs it, what data they know and when state can change. This avoids assigning an indexer rule to Bitcoin or a viewing capability to a spending key.

In the analysis, separate assumptions from conclusions. G1 does not mean “all indexers always agree”: it has conditions on profile, initial state and chain. Privacy also has an explicit leakage model.

Key point: You understand the paper when you can reconstruct its relations, not merely recognize its acronyms.

Shielded Bitcoin · 24 Sep 2026: Reading map by section
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=2
-->

---
layout: none
title: "Explain: a miner included an invalid envelope"
---

<StudyPage :index="55" />

<!--
Explain the paper · Explain: a miner included an invalid envelope

Include both validity domains in your answer, identifying which state changes and which does not.

Then compare with Zcash: there, violating shielded consensus rules violates the transaction’s validity on that chain. This distinction is the main answer to “why does this not require a soft fork?”

Key point: No consensus change means Bitcoin has not started checking a new shielded rule.

Shielded Bitcoin · 24 Sep 2026: §4; §15; appendix A.1
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=8
-->

---
layout: none
title: "Explain: why is this sum wrong?"
---

<StudyPage :index="56" />

<!--
Explain the paper · Explain: why is this sum wrong?

Conservation means more than “do not create money.” It means following the exact rule implemented by the circuit. Here, silently subtracting a fee violates the relation.

This question is useful because people often carry the equation for UTXOs or Zcash transactions into Shielded Bitcoin without noticing the separation between the two layers.

Key point: The word “fee” appears in different systems at different places in their balance equations.

Shielded Bitcoin · 24 Sep 2026: Appendix B, block 7; §20.5
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=47
-->

---
layout: none
title: "Now explain without reading the answer"
---

<StudyPage :index="57" />

<!--
Explain the paper · Now explain without reading the answer

A good answer identifies the problem, mechanism and limit. For example: “The nullifier rejects repeated spending without publishing which leaf was spent. The circuit constrains its derivation and replay checks uniqueness. Metadata can still support inferences.”

If you get stuck, return to that concept through the index. You do not need to repeat the entire course. Answering a counterexample is a better test than reciting a formula.

Then explain it in two minutes: note representation, transfer construction, publication, replay, recovery and the peg boundary.

Key point: Next, explain it to someone else and notice which relations you still need to look up.

Shielded Bitcoin · 24 Sep 2026: §21: summary; §§17–20: guarantees and assumptions
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=38
-->

---
layout: none
title: "A two-minute explanation"
---

<StudyPage :index="58" />

<!--
Explain the paper · A two-minute explanation

Shielded Bitcoin proposes private transfers between notes denominated in satoshis. The wallet demonstrates control of existing notes, derives their nullifiers and creates outputs whose total value exactly matches the inputs, without revealing amounts or recipients.

The envelope containing ciphertexts, nullifiers and a proof is published in a Bitcoin transaction. Indexers replay envelopes in order and update the tree and nullifier set only after every check passes. Bitcoin does not check shielded validity.

Wallets recover notes using their keys and history. Publication metadata remains visible. The profile uses Groth16 with trusted setup and still needs concrete choices. Peg-in, peg-out, private fees and light clients are not resolved by the transfer protocol.

Key point: Guarantees come from combining cryptography, state, data availability and deployment rules.

Shielded Bitcoin · 24 Sep 2026: §§1.2, 14–16, 20 and 22
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=4
-->
