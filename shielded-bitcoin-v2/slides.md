---
theme: default
title: Shielded Bitcoin — from notes to a payment
info: A separate protocol presentation guided by the teaching sequence of Mastering Zcash
class: text-left
colorSchema: dark
lang: en
aspectRatio: 16/9
canvasWidth: 980
drawings:
  persist: false
transition: fade
mdc: true
fonts:
  sans: Inter
  mono: JetBrains Mono
layout: cover
clicks: 0
---

<CipherRain />
<div class="relative flex flex-col items-center text-center">
  <ShieldMark :size="140" />
  <h1>Shielded Bitcoin</h1>
  <div class="v2-cover-sub">From notes to a private payment</div>
  <div class="v2-cover-credit">Shikhelman · Komarov · Moskvin — [alloc] init</div>
  <div class="v2-cover-edition">A protocol walkthrough · version 2</div>
</div>

<!--
*Let the cover animation finish*

Shielded Bitcoin is a proposal for private transfers of bitcoin-denominated value, with the transfer data published on Bitcoin.

We will start with an ordinary payment, work out what has to change to make its details private, and then follow one payment from Alice’s wallet to Bob’s wallet.

The paper specifies transfers between notes already inside the system. Getting ordinary BTC into it and back out is a separate problem. Keep that boundary in mind throughout the talk.

Source: Shielded Bitcoin — §§1–4
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "A public payment"
clicks: 3
---

# A public payment

<div class="v2-canvas">
<PaymentFlow :clicks="$clicks" mode="public" />
</div>

<!--
Alice has a Bitcoin output worth one hundred thousand satoshis. She wants to send sixty thousand to Bob.

**[click]** Her transaction spends that earlier output and creates a new output for Bob. The reference to the old output is public.

**[click]** It also creates change for Alice. In this example, five hundred satoshis go to the miner as the transaction fee. The input, outputs and amounts are all visible.

**[click]** The chain does not label these outputs “Alice” and “Bob”. But an observer can follow the references and combine them with information from elsewhere. Privacy requires hiding more than people’s names.

Source: Shielded Bitcoin — §1; ordinary Bitcoin UTXO model
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Keep the checks. Hide the details."
clicks: 4
---

# Keep the checks. Hide the details.

<div class="v2-canvas">
<div class="v2-four">
  <div v-click="1" class="v2-check pane-violet"><div class="i-ph-tree-structure-duotone text-violet" /><span>Exists</span><small>a real input</small></div>
  <div v-click="2" class="v2-check pane-amber"><div class="i-ph-key-duotone text-amber" /><span>Authorized</span><small>the right spending key</small></div>
  <div v-click="3" class="v2-check pane-red"><div class="i-ph-fingerprint-duotone text-red" /><span>Not spent twice</span><small>one accepted spend</small></div>
  <div v-click="4" class="v2-check pane-green"><div class="i-ph-scales-duotone text-green" /><span>Conserves value</span><small>inputs = outputs</small></div>
</div>
</div>

<!--
Suppose we hide which earlier output Alice spends, who receives the new value, and the amounts. We still need to reject invalid payments.

**[click]** The input must exist. Alice cannot invent a record of money.

**[click]** She must be authorized to spend it. Knowing that a record exists is not enough.

**[click]** She must not spend it twice.

**[click]** And the transfer must conserve value.

Encryption hides data, but encryption alone does not establish any of these conditions. We need public evidence that the hidden data satisfies the rules. The next few mechanisms provide that evidence, each solving a different part of the problem.

Source: Shielded Bitcoin — §14.1; App. B
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Who checks a shielded payment?"
clicks: 3
---

# Who checks a shielded payment?

<div class="v2-canvas">
<ProtocolFlow variant="roles" :clicks="$clicks" />
</div>

<!--
Before looking inside a payment, separate the three jobs.

**[click]** The wallet holds keys, prepares the transfer and produces a proof.

**[click]** A normal Bitcoin transaction carries the transfer data. Bitcoin checks its own transaction rules and orders the bytes in blocks. It does not verify the shielded proof.

**[click]** An indexer reads those blocks and checks the shielded rules. Processing that history is called replay. Replay builds the note tree, the spent-nullifier set and the history of roots.

Anyone can run this software, including a wallet operator. Indexers do not vote on which transfer is valid, and the indexing role grants no spending authority. We will return to what happens if a wallet relies on somebody else’s replay.

Source: Shielded Bitcoin — §4; §15; A.1
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Value is held in notes"
clicks: 3
---

# Value is held in notes

<div class="v2-canvas">
<PaymentFlow :clicks="$clicks" mode="notes" />
</div>

<!--
Inside Shielded Bitcoin, the wallet controls notes: individual records of value. A displayed balance is calculated from the notes it can spend.

**[click]** For our example, Alice already owns an accepted note worth one hundred thousand satoshis.

**[click]** Paying Bob uses that note in full and creates a new note worth sixty thousand for him.

**[click]** Another new note returns forty thousand to Alice. The original note is not edited to contain a smaller balance.

These note amounts add up exactly. Unlike the ordinary Bitcoin transaction on the earlier slide, there is no fee deducted inside this shielded transfer. Publishing it requires a separate Bitcoin carrier transaction, which pays a Bitcoin fee.

Source: Shielded Bitcoin — §5; §14.1; App. B, block 7
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "What is inside a note?"
clicks: 4
---

# What is inside a note?

<div class="v2-canvas">
<NoteAnatomy :clicks="$clicks" />
</div>

<!--
**[click]** A note’s plaintext has three fields: v, its amount in satoshis; d, the receive-path diversifier; and rseed, fresh randomness for this note.

**[click]** The wallet derives two values from rseed. Rho will help identify a repeated spend. The ephemeral secret key is used in encryption. They are derived values, not additional plaintext fields.

**[click]** The sender encrypts the plaintext to the recipient’s address. The published output contains an ephemeral public key, pk_eph, and the ciphertext, ct_note. That public key is not the recipient’s address key.

**[click]** Replay can build a tree entry from the published output data without decrypting it. That entry is called a leaf. Let’s look at exactly what it identifies.

Source: Shielded Bitcoin — §5; §12
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "A leaf identifies a published output"
clicks: 3
---

# A leaf identifies a published output

<div class="v2-canvas">
<LeafBuild :clicks="$clicks" />
</div>

<!--
**[click]** Start with the output’s ephemeral public key and ciphertext. These bytes are public, even though the note plaintext is hidden.

**[click]** Include the creation transfer’s body hash and this output’s index within that transfer. The hash distinguishes the transfer; the index distinguishes its outputs. The leaf also includes a protocol salt and the reserved auxiliary value.

**[click]** Hash those fields together to obtain the leaf. Replay can repeat this calculation independently.

This is specific to Shielded Bitcoin: the leaf is derived from the published ciphertext and its context. It is not simply a hash of the hidden amount. Later, the transfer circuit must connect the hidden note to this public record, so the spender cannot substitute different contents.

Source: Shielded Bitcoin — §9; §12.1; App. B, blocks 1 and 5
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Record every accepted output"
clicks: 3
---

# Record every accepted output

<div class="v2-canvas">
<NoteTree pane="roots" :leaves="$clicks >= 2 ? 6 : $clicks >= 1 ? 4 : 2" :roots="[{ label: 'H − 2', seed: 'root-2' }, ...($clicks >= 1 ? [{ label: 'H − 1', seed: 'root-4' }] : []), ...($clicks >= 2 ? [{ label: 'H', seed: 'root-6' }] : [])]" />
<div v-click="3" class="v2-under text-cyan">Each block has a root · spent leaves stay in the tree</div>
</div>

<!--
Leaves are appended to one global Merkle tree. Each parent is computed from its children, until one root represents the tree state.

**[click]** Accepted outputs add leaves in replay order. Each gets a global position.

**[click]** New leaves change the root. Replay stores the root after every Bitcoin block. A block with no accepted outputs carries the previous root forward.

**[click]** The history contains earlier roots as well as the current one. A wallet can refer to a recent earlier state when preparing a proof.

The tree records accepted creation history. Spending does not delete a leaf. If we removed spent leaves, the public deletion would identify the input we wanted to hide.

Source: Shielded Bitcoin — §8; §15
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Prove membership without naming the leaf"
clicks: 4
---

# Prove membership without naming the leaf

<div class="v2-canvas">
<MerkleWitness :clicks="$clicks" />
</div>

<!--
Alice knows her note and its position. She needs evidence that its leaf belongs under an accepted root.

**[click]** Start with the selected leaf and its sibling hash. Hash them in their correct left-to-right order.

**[click]** Combine that result with the sibling at the next level. Continue until reaching the root. The sibling hashes and position form the Merkle authentication path.

**[click]** Check that the result equals the public anchor root. This proves membership in that state, assuming the hash construction is secure.

**[click]** In the shielded transfer, this computation happens inside the proof circuit. The selected leaf, position and path remain private witness data. Publishing an ordinary Merkle path would identify the leaf; the zero-knowledge proof is what hides which path was used.

Source: Shielded Bitcoin — §8; §14; App. B, block 2
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Prevent spending the same note twice"
clicks: 4
---

# Prevent spending the same note twice

<div class="v2-canvas">
<NoteTree pane="nullifiers" :leaves="8" :highlight="2" :unknown="$clicks >= 4" :existing="['earlier-nf-1']" :nfAt="$clicks >= 2 ? 'set' : $clicks >= 1 ? 'leaf' : null" :dupAt="$clicks === 3 ? 'set' : null" />
<div class="v2-under"><span class="chip-violet">nf = H_nf(sk_nf, ρ, pos)</span><span v-click="4" class="chip-green ml-4">the leaf-to-nullifier link is private</span></div>
</div>

<!--
Membership tells us that the note exists. Its leaf remains in the tree after spending, so membership cannot tell us whether it is still spendable.

**[click]** Derive a public spend marker, the nullifier, from the wallet’s nullifier secret, the note’s rho, and its global tree position.

**[click]** When replay accepts the transfer, it inserts that nullifier into a public set.

**[click]** Spending the same note again produces the same marker. Replay rejects the duplicate. The proof enforces the derivation, so Alice cannot choose a fresh marker for the same input.

**[click]** From outside the wallet, the connection to the highlighted leaf disappears. The observer sees the marker, but the marker does not disclose which leaf it belongs to. Other information can still narrow the possibilities.

Source: Shielded Bitcoin — §9; §14.2; §19.2; App. B, block 4
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Reading and spending are separate capabilities"
clicks: 6
---

# Reading and spending are separate capabilities

<div class="v2-canvas">
<KeyTree :clicks="$clicks" />
</div>

<!--
The protocol derives several capabilities from one wallet seed. Their names matter less than what each one permits.

**[click]** The seed produces the master secret.

**[click]** The spending branch produces sk_spend. Knowing this secret is required to authorize a spend.

**[click]** From it comes sk_nf, the nullifier secret. The circuit enforces this derivation. sk_nf alone does not authorize spending.

**[click]** The incoming viewing branch supplies the material for detecting and decrypting received notes. The receive address contains a diversifier and a public transmission key.

**[click]** A separate outgoing viewing key recovers the sender’s records.

**[click]** Only sk_spend carries spending authority. Sharing a viewing capability reveals information without granting that authority. There is no global key that lets an indexer read everybody’s notes.

Source: Shielded Bitcoin — §6; §7; §9
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: section
title: "Follow one payment"
clicks: 0
---

<div class="eyebrow mb-4 !text-violet">from wallet to wallet</div>
<h1>Follow one payment</h1>
<div class="mt-5 text-xl text-muted">Select → construct → publish → accept → receive</div>

<!--
We have the objects. Now let’s follow what the wallet actually does with them, from choosing an input to Bob recognizing the result.

Source: Shielded Bitcoin — §10; App. C
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Alice chooses the input and destinations"
clicks: 3
---

# Alice chooses the input and destinations

<div class="v2-canvas">
<PaymentFlow mode="select" :clicks="$clicks" />
</div>

<!--
*The amounts are our wallet view, not an observer’s view*

**[click]** Alice selects her accepted, unspent note worth one hundred thousand satoshis. Her wallet has its plaintext and creation record, not just a number on a balance screen.

**[click]** Bob gives her his payment address: d and pk_d. This supplies the public material for encrypting a new note to him. He does not give Alice a spending or viewing secret.

**[click]** Alice plans sixty thousand to Bob and forty thousand to her own change address. Each output will use fresh note randomness.

Our payment has one input and two outputs. That shape is public. The association between an input and an earlier leaf, and between outputs and recipients, is what the protocol aims to hide.

Source: Shielded Bitcoin — §10; §13.1; C.2–C.5
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Choose a recent accepted root"
clicks: 4
---

# Choose a recent accepted root

<div class="v2-canvas">
<AnchorWindow :clicks="$clicks" />
<div class="v2-under mt-5"><span class="chip-cyan">H − 100 ≤ h_anchor ≤ H − 1</span><span class="chip-muted ml-4">profile defaults · window drawing compressed</span></div>
</div>

<!--
Alice cannot prove against an arbitrary root. She needs a root reconstructed from accepted history.

**[click]** The suggested profile allows anchors from the previous one hundred Bitcoin blocks, excluding the block currently being processed. This drawing compresses the window into ten blocks.

**[click]** The wallet chooses an anchor height and gets the corresponding root and authentication path. The envelope carries the height; replay derives the root from its own history.

**[click]** If publication is delayed until the anchor expires, replay rejects that envelope even if its proof was correct for the old root.

**[click]** The wallet rebuilds against a newer eligible root. Expiration does not destroy the note.

Wallets should choose deeper anchors according to their reorganization policy. The minimum accepted anchor depth is not a promise of finality. A note also cannot be spent in the same block that created it.

Source: Shielded Bitcoin — §8; A.6; C.3
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Reconstruct the input inside the circuit"
clicks: 3
---

# Reconstruct the input inside the circuit

<div class="v2-canvas">
<ProtocolFlow variant="input" :clicks="$clicks" />
</div>

<!--
Now connect Alice’s wallet data to the public state.

**[click]** The circuit uses the note opening and its creation record to reconstruct the same ciphertext-derived leaf. It checks the relationship to the receiving key derived from Alice’s spending key. Merely knowing the note plaintext would not authorize this spend.

**[click]** The position and authentication path must take that leaf to the chosen root. The creation output index and the global tree position are different values, used for different jobs.

**[click]** From the same spending authority, note randomness and position, the circuit derives the nullifier that Alice will publish.

These are connected constraints. Alice cannot prove membership for one note, use another note’s amount, and attach an unrelated nullifier.

Source: Shielded Bitcoin — §9; §14.3; App. B, blocks 1–4
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Encrypt Bob’s new note"
clicks: 4
---

# Encrypt Bob’s new note

<div class="v2-canvas">
<RecipientChannel :clicks="$clicks" />
</div>

<!--
The output note contains the amount, Bob’s diversifier and fresh rseed.

**[click]** From rseed, Alice derives a one-time secret and its corresponding ephemeral public key.

**[click]** Her one-time secret and Bob’s public transmission key produce a shared secret. A key schedule uses it and the ephemeral public key to derive the encryption material.

**[click]** Encrypt the note. The published output contains pk_eph and ct_note. The change output is constructed the same way, using Alice’s receiving address and separate randomness.

**[click]** Bob can derive the same shared secret using his viewing secret and the published ephemeral key. He can therefore decrypt without receiving Alice’s one-time secret through a separate channel.

The circuit must check that each ciphertext encrypts the same output note whose value it counts. Encryption and conservation cannot describe different outputs.

Source: Shielded Bitcoin — §6; §12.1; App. B, block 5
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Keep an encrypted outgoing record"
clicks: 3
---

# Keep an encrypted outgoing record

<div class="v2-canvas">
<ProtocolFlow variant="outgoing" :clicks="$clicks" />
</div>

<!--
Bob can recover his incoming note. Alice also needs to reconstruct what she sent if she restores her wallet.

**[click]** For every output, collect its recipient transmission key and ephemeral secret. Keep these records in output order.

**[click]** Encrypt the whole batch using material derived from Alice’s outgoing viewing key. This produces ct_out, with one authentication tag for the batch. It is bound to the already fixed public output data.

**[click]** On recovery, Alice can decrypt the batch and reconstruct the note-encryption channels. That lets her recover sent-payment details.

This does not reveal Bob’s nullifier secret or let Alice authorize his later spend. Even though she created his note and knows its contents, that knowledge alone does not identify its future nullifier.

Source: Shielded Bitcoin — §12.2; §16.2; C.8
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Package the public data"
clicks: 6
transition: none
---

# Package the public data

<div class="v2-canvas">
<EnvelopeBar :step="$clicks" />
<div class="v2-under mt-6"><span class="chip-violet">Size example: 2 inputs → 2 outputs</span><span class="chip-muted ml-4">Alice’s payment: 1 → 2</span></div>
</div>

<!--
*This size illustration switches to the paper’s two-input/two-output example; it is not the size of Alice’s one-input payment*

An envelope is the serialized transfer record that will be published on Bitcoin.

**[click]** Its leading fields identify the format, anchor height and input/output counts.

**[click]** Then come the nullifiers, one for each input.

**[click]** Each output contributes an ephemeral public key and an encrypted note.

**[click]** ct_out carries the outgoing recovery batch. At this point the entire body can be finalized.

**[click]** The proof has a separate slot after the body. It will be generated only after binding that body, which is our next step.

**[click]** In the paper’s two-input/two-output size example, the complete envelope is six hundred and ten bytes. The header group is widened here so its label is readable. This is an envelope size, not the size of a full Bitcoin transaction.

Source: Shielded Bitcoin — §11; §13; A.3–A.5
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Bind the proof to this exact body"
clicks: 3
---

# Bind the proof to this exact body

<div class="v2-canvas">
<EnvelopeBar full :bind="$clicks" />
<div class="v2-under mt-6"><span class="chip-violet">Same 2-input → 2-output illustration</span><span v-click="3" class="chip-red ml-4">edited ct_out → different h_body</span></div>
</div>

<!--
The proof must establish a valid transfer and identify which published transfer it establishes.

**[click]** Hash the canonical body: all the envelope fields except the proof. The result is h_body. The proof is excluded to avoid making its input depend on its own bytes.

**[click]** h_body becomes part of the public statement for proof verification. Replay computes it independently from the published body.

**[click]** Suppose somebody changes ct_out after Alice creates the proof. The body hash changes, and the old proof no longer verifies for that statement.

This matters even for fields without separate public-input slots. The header, anchor height and outgoing recovery ciphertext are body-bound. The input and output counts also belong to the logical public statement; they are not omitted from it.

Source: Shielded Bitcoin — §13.3; §14.2; App. B, block 8
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Generate the proof"
clicks: 6
---

# Generate the proof

<div class="v2-canvas">
<ProofStatement :clicks="$clicks" />
</div>

<!--
Now Alice has the private inputs and the finalized public statement.

**[click]** Her private witness contains the selected note opening, its creation data, position and path, her spending key, and the planned output data.

**[click]** Public inputs include the anchor root, counts, nullifiers, output keys and ciphertexts, and h_body. The verifier receives these values, not the witness.

**[click]** The prover uses the circuit’s proving key to produce a Groth16 proof. Verification uses the corresponding verifying key. Zero knowledge hides the witness; it does not encrypt the public inputs.

**[click]** The constraints establish membership and spending authority.

**[click]** They enforce the nullifier derivation and output ciphertext consistency.

**[click]** They enforce valid amount ranges, exact input/output equality, and binding to the envelope. Range and overflow constraints prevent arithmetic tricks from manufacturing value.

The proof establishes these relationships. Checking whether a nullifier has already been accepted remains a replay operation against the current state.

Source: Shielded Bitcoin — §14; A.1; App. B
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Publish in a Bitcoin transaction"
clicks: 3
---

# Publish in a Bitcoin transaction

<div class="v2-canvas">
<ProtocolFlow variant="publish" :clicks="$clicks" />
</div>

<!--
**[click]** Alice attaches the proof to the body and puts the envelope in a Bitcoin carrier transaction. The carrier’s fee is paid with ordinary Bitcoin inputs.

**[click]** When the carrier confirms, its bytes have a position in Bitcoin history. Bitcoin consensus has checked the carrier, not the shielded transfer.

**[click]** Replay reads the envelope at that position and applies the shielded checks. This is where acceptance is decided.

The paper’s suggested carrier uses OP_RETURN. It also considers a witness carrier with a commit and reveal transaction. Neither way of publishing bytes adds a shielded-proof verification rule to Bitcoin consensus. Publication policy and shielded validity are separate questions.

Source: Shielded Bitcoin — §11; §15; A.4
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Replay checks before changing state"
clicks: 4
---

# Replay checks before changing state

<div class="v2-canvas">
<ReplayPipeline :clicks="$clicks" />
<div v-click="4" class="v2-under text-cyan">Every check must pass before any state change</div>
</div>

<!--
Read these stages from left to right: parse, body binding, anchor, nullifiers, proof, then apply.

**[click]** A valid envelope passes all checks. Only then does replay append its output leaves and insert its nullifiers. Our one-input payment adds two leaves and one nullifier.

**[click]** A second envelope repeats the input’s nullifier. It fails at that check, even if it contains a fresh-looking proof. None of its outputs is applied.

**[click]** At the end of the block, replay stores the resulting root for that height.

**[click]** Acceptance is all-or-nothing. A bad proof, expired anchor or malformed envelope has no partial effect on the note tree or nullifier set. Its published bytes still remain in the Bitcoin transaction.

Source: Shielded Bitcoin — §15; A.7
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "The accepted state records both events"
clicks: 3
---

# The accepted state records both events

<div class="v2-canvas">
<PaymentFlow mode="state" :clicks="$clicks" />
</div>

<!--
**[click]** Alice’s old leaf remains in creation history. Her nullifier is now in the spent set, which prevents another accepted spend of that note.

**[click]** Replay appends the leaves for Bob’s output and Alice’s change, assigning each a position. The public tree does not label them with recipient names or amounts.

**[click]** The new root commits to that updated history. Other payments can later prove membership under an eligible root containing those outputs.

An accepted payment therefore records two different events: old value was spent, and new notes were created. The nullifiers and leaves represent those events without directly publishing the link between an input leaf and its spend marker.

Source: Shielded Bitcoin — §8; §15; C.11
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Bob finds his output"
clicks: 3
---

# Bob finds his output

<div class="v2-canvas">
<ScanNotes :clicks="$clicks" />
</div>

<!--
Bob does not look for his name or a publicly listed destination address. His wallet scans output records.

**[click]** Using the incoming viewing capability, it tries the shared-secret derivation and authenticated decryption for candidate outputs.

**[click]** A successful decryption returns the amount, diversifier and note randomness. Bob re-derives the ephemeral public key and checks it against the published one.

**[click]** He reconstructs the leaf and checks its accepted replay position. The wallet stores the note opening, creation data and position for a future spend.

Decrypting a ciphertext by itself does not establish acceptance. Bob must also know that replay accepted its envelope. His wallet then applies its Bitcoin confirmation policy before treating the payment as sufficiently settled.

Source: Shielded Bitcoin — §16.1; C.12
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Confirmed does not mean accepted"
clicks: 1
---

# Confirmed does not mean accepted

<div class="v2-canvas">
<div class="v2-verdicts">
  <div class="pane-orange v2-verdict"><div class="i-ph-currency-btc-fill text-orange" /><span>Carrier confirmed</span><small>bytes are in a Bitcoin block</small></div>
  <div v-click="1" class="pane-red v2-verdict"><div class="i-ph-x-circle-fill text-red" /><span>Envelope rejected</span><small>no shielded state change</small></div>
</div>
</div>

<!--
Suppose the Bitcoin carrier confirms, but its shielded proof is invalid.

**[click]** The carrier remains confirmed. Replay rejects the envelope and leaves shielded state unchanged. Bob has no accepted note from that envelope.

These are two distinct conditions a wallet must track. Bitcoin confirmation establishes publication in the active chain; replay acceptance establishes the shielded state transition. Neither removes reorganization risk. If the active Bitcoin chain changes, replay must rebuild the affected state from that chain.

Source: Shielded Bitcoin — §15; §16.3; §19.1
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Independent replay gives the same result"
clicks: 4
---

# Independent replay gives the same result

<div class="v2-canvas">
<IndexerAgreement :clicks="$clicks" />
</div>

<!--
**[click]** Two correct indexers replay the same Bitcoin blocks and derive the same root.

**[click]** A third service reports a different root. That claim alone does not change the protocol state. We do not settle the discrepancy by counting indexers.

**[click]** The wallet independently replays the history. Its result matches the correct indexers and exposes the inconsistent response. The same rules determine the tree, nullifier set and root history.

**[click]** That agreement requires the same completed deployment profile, starting state and declared note inventory, and the same active-chain prefix. Implementations cannot independently choose acceptance rules and still expect to agree.

An indexer can omit results, serve stale data or claim a wrong root. It cannot make those results match correct independent replay. A wallet that accepts an indexer’s answer without verifying it is trusting that service. The paper leaves light-client verification for future work.

Source: Shielded Bitcoin — §1.1; §17 A8/A11; §18 G1; §19.1
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Recover from keys and published history"
clicks: 3
---

# Recover from keys and published history

<div class="v2-canvas">
<ProtocolFlow variant="recover" :clicks="$clicks" />
</div>

<!--
**[click]** Restore the seed to derive the wallet’s spending and viewing capabilities.

**[click]** Replay and scan the published transfer history. Incoming decryption recovers received notes; outgoing recovery reconstructs sent records.

**[click]** Replayed positions and the nullifier set let the wallet establish which recovered notes remain unspent and prepare their paths.

The seed alone is not an instantly restored balance. Recovery still needs the relevant history, protocol profile and replayed state. Initial notes may additionally depend on bootstrap recovery data supplied by the deployment.

Viewing keys can be shared for disclosure, but raw keys can reveal broad histories. A report is a claim unless supported by appropriate evidence; sharing a viewing key does not itself prove a complete balance.

Source: Shielded Bitcoin — §1.1; §7; §16; §19.4
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "What stays private? What stays public?"
clicks: 3
---

# What stays private? What stays public?

<div class="v2-canvas">
<div class="v2-privacy-grid">
  <div v-click="1" class="pane-green v2-privacy-card"><div class="i-ph-eye-slash-duotone text-green" /><div class="eyebrow !text-green">protected by the model</div><div>note amounts</div><div>output → recipient</div><div>input leaf → nullifier</div></div>
  <div v-click="2" class="pane-red v2-privacy-card"><div class="i-ph-eye-duotone text-red" /><div class="eyebrow !text-red">still observable</div><div>timing · size · shape</div><div>anchor age</div><div>carrier · fee funding · peg</div></div>
</div>
<div v-click="3" class="v2-under mt-5 text-muted">Co-recipients can recognize their shared creation h_body</div>
</div>

<!--
**[click]** For an honestly generated accepted transfer, the model protects the note amounts, recipient associations and the direct link from a nullifier to its input leaf.

**[click]** Timing, envelope size, input/output counts and anchor age remain public. So do the carrier transaction and its fee funding. Entry and exit can expose amounts and timing at the peg boundary.

**[click]** Recipients of outputs from the same transfer can recognize the shared creation body hash. Their outputs are grouped even though outsiders cannot simply read their amounts.

The proof hides its witness. It does not erase public metadata or facts an observer knows independently. Network and mempool observation sit outside this paper’s privacy model.

Source: Shielded Bitcoin — §20
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Which earlier note could it be?"
clicks: 3
---

# Which earlier note could it be?

<div class="v2-canvas">
<NoteTree :leaves="8" rootLabel="current root" unknown :struck="$clicks >= 3 ? [0,1,3,4,5,6,7] : $clicks >= 2 ? [0,1,5,6,7] : $clicks >= 1 ? [6,7] : []" :candidates="$clicks >= 3 ? [2] : $clicks >= 2 ? [2,3,4] : $clicks >= 1 ? [0,1,2,3,4,5] : []" />
<div class="v2-privacy-legend">
  <div v-click="1" class="chip-muted">after the anchor</div>
  <div v-click="2" class="chip-muted">excluded by known ownership</div>
  <div v-click="3" class="chip-red">one candidate remains</div>
  <small>hypothetical exclusions · not a measured privacy score</small>
</div>
</div>

<!--
An observer sees a nullifier and considers possible input leaves.

**[click]** A note created after the anchor root cannot be this input. The selected root limits the candidate history.

**[click]** Other knowledge can rule out candidates. For example, the observer may control some notes and know they did not authorize this spend. Merely having sent a note to somebody would not provide that knowledge.

**[click]** Enough outside information can leave just one plausible input. The illustration assumes those exclusions; it does not measure the privacy of a real payment.

The number of leaves is an upper bound on possibilities, not a guarantee of equally likely senders. A large tree does not automatically give every transfer a large effective privacy set.

Source: Shielded Bitcoin — §20.3; §20.6
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Publication has a cost"
clicks: 3
---

# Publication has a cost

<div class="v2-canvas">
<div class="v2-costs">
  <div v-click="1" class="pane-violet v2-cost"><div class="eyebrow !text-violet">2 inputs → 2 outputs</div><div class="v2-number">610 <small>B</small></div><div>protocol envelope</div></div>
  <div v-click="2" class="pane-orange v2-cost"><div class="eyebrow !text-orange">OP_RETURN</div><div class="v2-number">625 <small>vB</small></div><div>one output only</div></div>
  <div v-click="3" class="pane-cyan v2-cost"><div class="eyebrow !text-cyan">witness alternative</div><div class="v2-number">438 <small>vB</small></div><div>commit + reveal transactions</div></div>
</div>
<div v-click="3" class="v2-under mt-6 text-muted">Paper’s size assumptions · different scopes, not a fee quote</div>
</div>

<!--
**[click]** Return to the separate two-input/two-output example: six hundred and ten envelope bytes under the paper’s size assumptions.

**[click]** One OP_RETURN output carrying them is six hundred and twenty-five virtual bytes. That figure excludes the other parts of the Bitcoin transaction. The paper relies on the Bitcoin Core v30 relay-policy change for this carrier; it is not a consensus change.

**[click]** Its witness-carrier example totals four hundred and thirty-eight virtual bytes across a commit and a reveal transaction, under the stated transaction assumptions. Choosing another carrier requires a deployment to specify it consistently.

Those are publication estimates, not a wallet benchmark or a universal fee quote. The Bitcoin fee also creates a linkage surface through the wallet or service funding the carrier.

Source: Shielded Bitcoin — §11; A.4
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "What still needs to be specified?"
clicks: 4
---

# What still needs to be specified?

<div class="v2-canvas">
<div class="v2-open-grid">
  <div v-click="1" class="pane-red v2-open"><span class="i-ph-arrows-left-right-duotone text-red" /><div><strong>Peg-in / peg-out</strong><small>separate boundary protocol</small></div></div>
  <div v-click="2" class="pane-amber v2-open"><span class="i-ph-key-duotone text-amber" /><div><strong>Trusted setup</strong><small>Groth16 · circuit-specific keys</small></div></div>
  <div v-click="3" class="pane-violet v2-open"><span class="i-ph-code-duotone text-violet" /><div><strong>Completed profile</strong><small>encoding · encryption · circuit · arities</small></div></div>
  <div v-click="4" class="pane-cyan v2-open"><span class="i-ph-magnifying-glass-duotone text-cyan" /><div><strong>Private fees / light clients</strong><small>future work in the paper</small></div></div>
</div>
</div>

<!--
**[click]** Peg-in and peg-out are outside the transfer specification. The paper points to PIPEs v2 as a direction, but this transfer walkthrough does not establish a complete trustless deposit and withdrawal system.

**[click]** Groth16 requires circuit-specific setup and published proving and verifying keys. A retained setup trapdoor could undermine soundness and allow false proofs. This proposal does not inherit Orchard’s absence of a trusted setup.

**[click]** Deployments must complete concrete choices: supported input/output shapes, encodings, hashes, encryption construction, circuit gadgets and verifier parameters. The encryption requirements include recipient privacy and resistance to ambiguous openings; choosing any ordinary encryption library is not sufficient.

**[click]** Private fee funding and light-client verification remain future work. These limits matter when assessing an implementation, even though we can already explain the proposed transfer rules precisely.

Source: Shielded Bitcoin — §1.2; §17; §22; A.1
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "One payment, end to end"
clicks: 4
---

# One payment, end to end

<div class="v2-canvas">
<ProtocolFlow variant="recap" :clicks="$clicks" />
</div>

<!--
*Pause briefly on each stage; this is the same payment, not a second example*

**[click]** Alice selects an accepted note, a recent root and its path, then derives the input nullifier.

**[click]** She creates and encrypts Bob’s note and her change, prepares outgoing recovery, binds the body and generates the proof.

**[click]** A Bitcoin carrier publishes the envelope. Replay validates it and updates the note tree and nullifier set only on acceptance.

**[click]** Bob scans, decrypts and checks the accepted output. He now has the data needed to spend his note later, under his own spending authority.

Source: Shielded Bitcoin — §10; App. C
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: default
title: "Three things to remember"
clicks: 3
---

# Three things to remember

<div class="v2-canvas">
<div class="v2-takeaways">
  <div v-click="1"><span class="text-violet">01</span><div>Notes, creation history, spend markers</div></div>
  <div v-click="2"><span class="text-violet">02</span><div>One proof connects the private and public data</div></div>
  <div v-click="3"><span class="text-violet">03</span><div>Bitcoin publishes · replay accepts</div></div>
</div>
</div>

<!--
**[click]** Notes represent value. The tree records their creation; nullifiers prevent repeated spending without directly identifying the input leaves.

**[click]** The proof connects private notes and authority to public ciphertexts, spend markers and an exact envelope. Encryption alone would not establish validity.

**[click]** Bitcoin supplies publication and ordering. Replay establishes shielded acceptance. The proposal’s transfer guarantees and assumptions must be assessed separately from the unfinished entry and exit mechanisms.

That is the transfer protocol we have followed from Alice to Bob.

Source: Shielded Bitcoin — §§8–16; §21; §1.2
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
-->

---
layout: center
title: "Questions"
clicks: 0
---

<div class="v2-end">
  <div><h1>Questions</h1><div class="mt-5 text-lg text-muted">Shielded Bitcoin · from notes to a payment</div><div class="v2-end-links"><a href="https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf" target="_blank" rel="noopener">Shielded Bitcoin paper ↗</a><a href="https://maxdesalle.com/mastering-zcash/" target="_blank" rel="noopener">Teaching reference: Mastering Zcash ↗</a></div></div>
  <div class="v2-qr"><img src="/paper-qr.svg" alt="QR code linking to the Shielded Bitcoin paper" /><span>read the paper</span></div>
</div>

<!--
The QR code links to the Shielded Bitcoin paper. Appendix C walks through a transfer, and Appendix B lists the constraints behind the proof.

The Mastering Zcash article helped organize the explanation from basic objects to a payment lifecycle. For the mechanics of Shielded Bitcoin, use the paper and the source map accompanying this presentation.

Source: Shielded Bitcoin — App. B; App. C; Mastering Zcash §§3.3–3.6 and §4 (teaching structure only)
https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf

Teaching sequence only:
https://maxdesalle.com/mastering-zcash/
-->
