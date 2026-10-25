# Shielded Bitcoin — Speaker Script

**Runtime:** about 28–30 minutes as written, plus questions. The timing guide assumes roughly
155 spoken words per minute and short pauses for the click animations. Rehearse once; a slower
140-word pace takes about 32 minutes. The cut plan gives a version of about 23–24 minutes.
**Audience:** technical, without assuming knowledge of zero-knowledge proofs, Merkle trees or
shielded-note protocols.
**Scope:** the September 24, 2026 paper and its implementation profile. This is an explanation of
the proposal, not a claim that its open deployment questions have been solved.

The slides are the visual companion. Read the blockquotes; italic directions are for the presenter.
**[click]** means advance one build step. Timings are cumulative, rounded to five seconds. Divider
slides are brief transitions. Press `p` in Slidev for presenter mode: the spoken text and stage
directions are also in the deck's notes.

The note tree returns across slides 8, 9 and 27. The envelope stays in place across slides 11–12,
and Alice's transfer stays in place across slides 22–23. Let the diagrams develop as you explain.

**Colour code:** orange = Bitcoin; violet = notes, ciphertexts and proofs; cyan = replay/indexers
and read-only viewing keys; green = accepted or hidden from outside observers; red = rejected or
visible to observers; amber = Alice and private spending/nullifier material; pink = Bob. Amber
on a nullifier key means keep it private, not that it can spend by itself.

**Vocabulary:** a *note* is a private value record; a *ciphertext* is encrypted data; a *leaf* is
one entry in the note tree; a *root* commits to the tree's contents; a *Merkle path* proves a leaf
belongs under that root. A *nullifier* is a public spend marker. An *envelope* is the published
transfer data; its *carrier* is the Bitcoin transaction that contains it. *Replay* checks envelopes
in Bitcoin order. An *anchor* selects a recent replayed root. *Arity* means input/output counts.
Say “h body”, “rho” and “outgoing recovery copy” aloud; there is no need to read every symbol.

The sources and section map at the end are for preparation, not spoken citations. The reported
cost estimate is explicitly attributed when used.

---

## 0:00 — Slide 1 · Shielded Bitcoin

*Let the title animation settle. Introduce this as a proposal, not a product demonstration.*

> Tonight's subject is Shielded Bitcoin. It is a protocol proposal, published in September 2026
> by Clara Shikhelman, Mikhail Komarov and Aleksei Moskvin at [alloc] init.
>
> The goal is private transfers of bitcoin-denominated value, published on Bitcoin itself,
> without changing Bitcoin's consensus rules and without a new blockchain.
>
> I will explain how it works, what it hides, what it does not hide, and which parts are still
> open. The transfer model comes from the paper. I will distinguish its guarantees from its
> assumptions and from the parts it leaves for future work.

---

## 0:35 — Slide 2 · Bitcoin's ledger is public

> Start with the problem. Circles are addresses, boxes are transactions. This graph is public.
>
> **[click]** The amounts are public too: every output, and the earlier output each input
> spends.
>
> **[click]** Analysts use that structure to infer ownership. Inputs spent together often belong
> to one person. A change output often returns to that person. These are heuristics, not proof.
> Here they suggest that three addresses belong to one wallet.
>
> **[click]** An exchange withdrawal can connect one address to a known customer. That gives an
> observer a starting point for attributing other payments in the cluster. A mistaken heuristic
> can also give a mistaken attribution.
>
> Addresses are pseudonymous. Their transaction history is public.

---

## 1:20 — Slide 3 · What exists today

*[CUT] In a short version, reveal all four panes and give one sentence on each.*

> What do we already have?
>
> **[click]** On Bitcoin itself: CoinJoin, PayJoin, Silent Payments. CoinJoin and PayJoin make
> the usual graph heuristics less reliable. Silent Payments avoid address reuse. All three are
> useful. None of them hides amounts, and the structure of the transactions stays public.
>
> **[click]** Separate chains. Shielded Zcash transfers and Monero aim to hide sender, recipient
> and amount. But they are different networks with different assets. To use them, you leave
> Bitcoin.
>
> **[click]** New opcodes. Proposals such as OP_CAT and OP_CSFS would allow more expressive
> constructions on Bitcoin. Those constructions depend on a soft fork.
>
> **[click]** Shielded Bitcoin tries to sit in the gap: the privacy model Zcash uses, with all
> the data published on Bitcoin, and no change to Bitcoin.

---

## 2:10 — Slide 4 · Encrypted notes, published on Bitcoin

> Here is the whole idea in a few sentences.
>
> Value is held as encrypted records called notes. Spending a note publishes a marker called a
> nullifier. A zero-knowledge proof shows that the spend is valid. All of it is published on
> Bitcoin.
>
> Bitcoin does not check any of it. Software that anyone can run reads the data in Bitcoin's
> order and checks it. With the same protocol parameters, starting state and Bitcoin history,
> every correct copy gets the same result.
>
> The rest of the talk takes those sentences apart, one piece at a time.

---

## 2:45 — Slide 5 · The model

> First, who does what.

---

## 2:50 — Slide 6 · Three roles

*Start with Bitcoin at the bottom. Let each moving token arrive before the next click.*

> There are three roles. Start at the bottom.
>
> **[click]** Bitcoin. It stores bytes and puts them in order. That is all it does here. A miner
> who includes a Shielded Bitcoin transfer does not check whether the transfer is valid.
> Bitcoin's rules only care that the Bitcoin transaction carrying it is valid.
>
> **[click]** Indexers. An indexer is software that reads every Bitcoin block, in order, finds
> the Shielded Bitcoin data, checks each transfer, and keeps the resulting state. The paper
> calls this process replay. Anyone can run one. The indexer role needs no user spending keys
> and gives no authority to spend notes.
>
> **[click]** Wallets. A wallet holds the user's keys. It builds transfers, produces the proof,
> and scans for notes that belong to it.
>
> Now the flow.
>
> **[click]** A wallet publishes a transfer to Bitcoin. The paper calls the published data an
> envelope.
>
> **[click]** Indexers read it from the chain, in block order, and replay it.
>
> **[click]** And wallets get the state back from indexers: the note tree, its roots, and the
> Merkle paths they need to build their next transfer.
>
> The line to remember: Bitcoin provides publication and ordering. Validity is checked above it.

---

## 4:10 — Slide 7 · A note

> The basic object is a note: a record of value that can be created once and spent once.
>
> **[click]** Its plaintext is three fields. An amount, in satoshis. A diversifier, d, which
> says which of the recipient's addresses it was sent to. And rseed, fresh randomness for this
> note.
>
> **[click]** Two more values are derived from rseed, so they are not extra fields in the note
> plaintext. Rho goes into the nullifier, which we will get to. sk_eph is a one-time secret used
> to encrypt this note.
>
> **[click]** The plaintext never goes on chain. The sender encrypts it to the recipient's
> address. What Bitcoin carries is a one-time public key, pk_eph, and the ciphertext, ct_note.
> Anyone can read those bytes. The recipient can decrypt the note. The sender can also recover
> it. An outside observer without the relevant secrets cannot.
>
> **[click]** One more detail that matters later. Each note gets a leaf in a global tree, and
> that leaf is computed from these public bytes. So every indexer can compute it without knowing
> anything about what is inside the note.

---

## 5:20 — Slide 8 · The note tree

*Point to the root when defining it. Leaves stay in place throughout.*

> That is the note tree. Its root is a hash that commits to all its leaves. A Merkle path lets a
> wallet prove that one leaf is included under that root. The tree only grows.
>
> **[click]** Every accepted transfer appends one leaf per new note. Each leaf gets a position,
> in order. Leaves are never removed and never changed.
>
> **[click]** A new transfer is accepted: two new notes, so two new leaves, at positions three
> and four. The root changes.
>
> On the right is the root history. After an indexer finishes replaying a block, it stores the
> root of the tree for that block height.
>
> **[click]** If a block has no Shielded Bitcoin transfers, the root simply carries over. So
> every block height has a root. That matters when we get to anchors.

---

## 6:15 — Slide 9 · Spending publishes a nullifier

*Pause at the rejected second spend. The leaf remains in the tree.*

> How do you spend a note without saying which one?
>
> Here is the same tree. In our view — which nobody else has — the note at position two is
> Alice's.
>
> **[click]** To spend it, her wallet computes its nullifier. The nullifier is a hash of three
> things: her nullifier key, the note's rho, and the note's position in the tree. It requires
> the recipient's nullifier secret. Knowing the note plaintext, as its sender does, is not
> enough.
>
> **[click]** The transfer publishes the nullifier. When it is accepted, the nullifier goes into
> the nullifier set: the list of every spend ever accepted.
>
> Note what did not happen. The leaf is still in the tree. It is not removed and not marked.
> Spending is recorded only in the nullifier set.
>
> **[click]** Now suppose Alice tries to spend the same note a second time. Same key, same rho,
> same position — so the same nullifier. It is already in the set, so the transfer is rejected.
> That is the whole double-spend rule: one note has exactly one nullifier, and a nullifier is
> accepted only once.
>
> **[click]** And this is what everyone else sees. A nullifier, and a tree of leaves. The
> published nullifier does not identify its leaf. Metadata may still help an observer narrow the
> candidates; we will return to that.

---

## 7:40 — Slide 10 · The proof

*[CUT] Keep the six clicks, but shorten the explanation to membership, authority, correct outputs and exact balance.*

> So an indexer sees a nullifier it cannot link to a note. How does it know the spend is valid?
> That is the job of the zero-knowledge proof.
>
> **[click]** On the left is what the wallet knows and never publishes: the notes being spent,
> their positions and Merkle paths, the spend key, and the new notes with their recipients.
>
> **[click]** On the right is the public statement — the values the proof is checked against.
> The anchor root, the nullifiers, the new notes' public keys and ciphertexts, and h_body, a
> hash of the whole envelope. We will see h_body in a moment.
>
> **[click]** The proof connects the two. It shows that the private values on the left satisfy
> the rules with respect to the public values on the right. Under the proof system's
> assumptions, the proof reveals no additional private witness data.
>
> So what does it establish?
>
> **[click]** The notes being spent exist in the tree. And the sender holds the key that can
> spend them.
>
> **[click]** Each nullifier is the correct one for one of those notes. And each recipient
> ciphertext encrypts the note used in the balance calculation. A wallet still checks decryption
> and consistency before it recognises an output as its own.
>
> **[click]** Every amount is in range, and inputs equal outputs exactly, so no value is
> created. And the proof is bound to this exact envelope.
>
> Every indexer verifies every proof, which is why the paper wants proofs that are small and
> cheap to check. The profile in the paper uses Groth16, with proofs of about 192 bytes. We will
> come back to what that choice costs.

---

## 9:30 — Slide 11 · The transfer envelope

*[CUT] For the shorter talk, reveal the bar quickly: nullifiers, encrypted outputs, recovery data, proof. Do not read byte counts.*

> This is the envelope: everything one transfer puts on Bitcoin. The bar shows the relative
> field sizes for a transfer with two inputs and two outputs; the header is widened so its label
> fits.
>
> **[click]** A small header: the protocol version, the anchor height, and how many inputs and
> outputs there are.
>
> **[click]** The nullifiers, one per input.
>
> **[click]** For each output, its one-time public key and its ciphertext.
>
> **[click]** ct_out. This is an encrypted copy, for the sender, of what they need to recover
> their own outgoing payments later. It is encrypted under the sender's outgoing viewing key.
>
> **[click]** And the proof.
>
> **[click]** In total, 610 bytes. In the paper's profile it is carried in a single OP_RETURN
> output.
>
> That last part depends on relay policy, not on consensus. Bitcoin Core 30 raised the default
> OP_RETURN limit far enough for this, but node operators can set it back, so how well these
> transactions relay depends on what people run. The paper compares a lighter witness carrier
> using two transactions. That comparison is outside the specified OP_RETURN profile; indexers
> using this profile ignore witness bytes.

---

## 10:40 — Slide 12 · Bound to the body

*[CUT] Optional slide in the short version. The changed field is ct_out. Advance from slide 11 without resetting the canvas.*

> Same envelope. There is a problem to solve here.
>
> The proof takes some fields directly as public inputs: the nullifiers, the output keys, the
> ciphertexts. Others it does not see individually: the header, the anchor height, and the
> recovery copy, ct_out. Without something extra, those could be changed after the proof was
> made, and the proof would still verify.
>
> **[click]** So the wallet hashes every byte of the envelope except the proof. That hash is
> h_body.
>
> **[click]** And h_body is a public input of the proof. The proof is valid only for that exact
> value.
>
> **[click]** Now change one byte of ct_out. The body changes, so h_body changes, so the proof
> is checked against a statement it was not made for. It does not verify, and the whole envelope
> is rejected.
>
> The new leaves are also computed from h_body, so they are tied to this exact envelope as well.

---

## 11:40 — Slide 13 · Replay

> Now what indexers actually do.

---

## 11:45 — Slide 14 · Every indexer runs the same checks

*Let the valid envelope finish before showing the rejected one.*

> For every candidate envelope, in Bitcoin order, an indexer runs five checks, always in the
> same order. Parse it. Recompute h_body. Check that the anchor is in the allowed window. Check
> that its nullifiers are distinct and none is already spent. Verify the proof.
>
> **[click]** A valid envelope passes all five, and only then does the state change: the new
> leaves are appended and the nullifiers are added.
>
> **[click]** Here is one that reuses a nullifier. It passes the first three checks and fails
> the fourth. It is rejected, and the state is exactly as it was before. There are no partial
> updates.
>
> **[click]** When the indexer finishes a block, it stores the root of the tree for that height.
>
> **[click]** The order and the rules are part of the protocol. If two indexers accepted
> slightly different things, they would end up with different states from the same chain. The
> paper is explicit that there is no implementation-defined acceptance rule.

---

## 12:50 — Slide 15 · Same blocks, same state

> That is the property everything else rests on.
>
> **[click]** Two correct indexers using the same completed profile, starting state and blocks
> compute the same state and root. They do not talk to each other, and there is no extra
> consensus protocol. Bitcoin's order is the only coordination.
>
> **[click]** What can a dishonest indexer do? It can leave envelopes out. It can serve old
> data. It can report a root that is simply wrong.
>
> **[click]** What it cannot do is make that wrong root match an independent replay of the same
> blocks. A wallet that replays for itself, or checks the indexer's answer against Bitcoin data,
> sees the mismatch.
>
> **[click]** The flip side: a wallet that does neither is trusting its indexer. The paper says
> so directly. A full replay is expensive, and a cheap way for a light wallet to verify the
> state is listed as future work.

---

## 13:50 — Slide 16 · Confirmed is not the same as accepted

*Pause after the final sentence. Replay acceptance and confirmation depth are separate requirements.*

> A consequence that is easy to miss.
>
> A Bitcoin full node checks Bitcoin transaction validity. Those checks do not validate the
> shielded transfer carried inside the transaction.
>
> Bitcoin will confirm the carrier transaction as long as it is a valid Bitcoin transaction. The
> envelope inside can still be rejected by replay — a bad proof, a reused nullifier, an expired
> anchor. Rejected envelopes stay in Bitcoin's history. They simply have no effect on the
> shielded state.
>
> A wallet needs replay acceptance as well as its chosen Bitcoin confirmation depth before
> treating a payment as final.

---

## 14:30 — Slide 17 · The anchor

*The drawing compresses a 100-block window into ten boxes. It is schematic, not a scale drawing.*

> One field in the header needs its own slide: the anchor.
>
> Each block has a stored root. H is the block being replayed right now.
>
> **[click]** A transfer must prove its notes are in one recent root. The allowed heights form a
> window: from H minus W up to H minus one. In the paper's profile W is 100 blocks, about
> sixteen hours. The drawing shows ten.
>
> It cannot use H itself, because the root for H only exists once H has been fully replayed.
> That also means a note cannot be spent in the same block it was created in.
>
> **[click]** Alice's wallet picks one height in the window — that is h_anchor — and builds its
> proof against that block's root. The envelope carries only the height, four bytes. Indexers
> look up the root themselves.
>
> Why is an older root acceptable? Because the tree only grows. If a note is in an older root,
> it is still in the tree. Whether it has been spent since is decided by the current nullifier
> set, not by the root.
>
> **[click]** Now suppose the envelope is not mined quickly — fees spiked, or the wallet was
> offline. Blocks pass, and the anchor falls out of the window. The envelope is now invalid.
>
> **[click]** Expiry does not destroy the notes. This rejected envelope did not spend them. The
> wallet picks a newer anchor, fetches new Merkle paths, and builds a fresh proof.

---

## 16:05 — Slide 18 · Keys

> Now the wallet side.

---

## 16:10 — Slide 19 · One seed, separate capabilities

*[CUT] Short version: one seed, spending authority, two read-only viewing keys. Reveal all six steps.*

> All keys come from one seed, through one-way derivations.
>
> **[click]** The seed gives a master secret.
>
> **[click]** From it, the spend key. This is the only key that can authorize spending a note.
>
> **[click]** From the spend key, the nullifier key. It is derived from the spend key on
> purpose, and the proof checks that derivation, so one spend authority always produces one
> nullifier per note. If it were an independent secret, a note could be spent twice under two
> different nullifiers.
>
> **[click]** Also from the spend key, the incoming viewing key. It can find and decrypt notes
> sent to you, but it cannot spend them. Your addresses come from it: a diversifier, d, and a
> public key, pk_d. One wallet can make many addresses from the same viewing key.
>
> **[click]** From the master secret, separately, the outgoing viewing key. It decrypts the
> ct_out copies, so it can recover what you sent.
>
> **[click]** The spend key authorises spending. The nullifier key can identify spends but
> cannot authorise them alone. Keep both private. The two viewing keys are read-only.

---

## 17:20 — Slide 20 · Disclosure is read-only

*[CUT] Optional in the short version. Keep the distinction between seeing a payment and proving a balance.*

> Which makes selective disclosure possible — to an auditor, an accountant, a counterparty.
>
> **[click]** Share the incoming viewing key, and someone can find and decrypt matching received
> outputs in accepted history.
>
> **[click]** Share the outgoing viewing key, and they can see what you sent. Neither key shows
> which of your notes were spent in a given transfer.
>
> **[click]** Or open one specific note, and let them check it against the chain.
>
> **[click]** Or give a report — a balance at some height, totals over a period — with evidence
> for the checks they need to make. Openings can substantiate particular entries; they do not by
> themselves prove that nothing was omitted, or establish a spendable balance.
>
> **[click]** None of these can spend. There is no global disclosure key, and no backdoor.
>
> One limit: a viewing key, once shared, works on the whole history. Limiting an audit to one
> month is a policy, not a cryptographic limit. For a narrow audit, disclose notes or a report,
> not the key.

---

## 18:30 — Slide 21 · One transfer

> Let us put it all together with one transfer. Alice pays Bob.

---

## 18:35 — Slide 22 · Alice pays Bob (building)

*Amounts in the diagram are BTC-denominated examples; notes store integer satoshis. Wait for moving tokens to arrive.*

> Alice on the left, Bob on the right, indexers at the top, Bitcoin at the bottom. Alice already
> has two notes. How value enters the system is a separate question, still outside this paper.
>
> **[click]** Bob gives Alice an address. That is the only thing that has to pass between them.
>
> **[click]** Alice's wallet picks the 0.30 note, and gets from an indexer what it needs to
> prove that note is in the tree: a recent root, and the Merkle path to her leaf.
>
> **[click]** It creates two new notes: 0.20 for Bob, and 0.10 back to herself as change. 0.30
> in, 0.30 out, exactly. There is no fee inside a shielded transfer. The Bitcoin fee is paid by
> the Bitcoin transaction that carries the envelope.
>
> **[click]** It encrypts both notes, computes the nullifier of the note it is spending, adds
> her recovery copy, hashes the body, and produces the proof.
>
> **[click]** It publishes the envelope in a Bitcoin transaction, and a miner includes it in a
> block.
>
> At this point Alice's wallet treats the 0.30 note as locked, not spent. It is spent when
> replay accepts the envelope.

---

## 19:50 — Slide 23 · Alice pays Bob (settling)

*Keep the same canvas. This example is one input and two outputs, unlike the size example on slide 11.*

> Same picture. The envelope is in a block.
>
> **[click]** Indexers replay the block. The envelope passes all five checks. Two leaves are
> appended, one nullifier is added, and the root changes.
>
> **[click]** Bob's wallet tries his incoming viewing key on each new output. One decrypts. His
> wallet checks it against the public data — the ephemeral key and the leaf have to match — and
> records its position. A later transfer can spend it using an allowed anchor. It cannot be
> spent in the block that created it, and Bob's wallet also applies its confirmation policy.
>
> **[click]** Alice's 0.30 note is now spent, because its nullifier is in the set. Her 0.10
> change arrives the same way Bob's note did.
>
> An outside observer sees a Bitcoin transaction carrying an envelope: one nullifier and two
> encrypted outputs. The shielded amounts and participants are not directly revealed. The
> carrier transaction and its fee funding are public.

---

## 20:50 — Slide 24 · Recovery from seed and history

*The recovery claim concerns the transfer history. Do not extend it to an unspecified peg or bootstrap process.*

> For notes created by accepted transfers, the recovery data is published on Bitcoin.
>
> **[click]** So with only the seed and the chain, a wallet can rebuild itself: every note
> received, everything sent, the tree positions, which notes are spent, and the balance. Cached
> plaintexts are an optimisation, not something you have to back up.
>
> **[click]** That is a real difference from client-side validation designs such as Shielded
> CSV, where the owner has to keep the data needed to spend, and losing it cannot be fixed from
> the chain.
>
> **[click]** The condition: recovery needs the replayed positions, so the wallet either replays
> the chain itself, or trusts an indexer. This covers published transfer history; the paper
> separately mentions deployment-defined recovery data for any initial notes.

---

## 21:40 — Slide 25 · Privacy

> Now the privacy boundary: what an observer learns.

---

## 21:45 — Slide 26 · What an observer sees

> **[click]** The shielded data does not directly reveal to an outside observer: the amounts.
> The sender. The recipient. Which earlier note was spent. And which inputs became which
> outputs.
>
> **[click]** Visible: that a transfer happened, and when. How many inputs and outputs it has —
> a one-to-two transfer and a two-to-one transfer look different. The anchor height, so how old
> the root was, and the envelope size. The Bitcoin transaction that carries it, including the
> inputs that funded its fee and any ownership inferences an observer can make from them. And
> anything at the boundary: amounts and timing when value enters or leaves the system.
>
> **[click]** So the protocol hides the contents of a transfer. It does not hide that a transfer
> took place. Its privacy claim concerns the transfer contents, subject to the metadata that
> remains visible.
>
> And this is about outside observers. Bob knows what Alice sent him. Alice knows what she sent.

---

## 22:45 — Slide 27 · The privacy set

*Crosses show candidates excluded by an informed observer. They are not public spent flags on tree leaves.*

> How much privacy is that in practice?
>
> When Alice spends a note, the candidates for "which note was it" are the leaves under the
> anchor root. Here, eight.
>
> **[click]** But an observer often knows more. For example, it can exclude notes it owns and
> knows it has not spent. Knowledge of payments it made or received can narrow the possibilities
> too. Sending a note does not reveal its nullifier.
>
> **[click]** Timing and amounts at the boundary rule out more. A distinctive entry amount
> followed by a matching exit soon afterwards may narrow the candidates. These are inferences
> from extra information, not links exposed by a nullifier.
>
> **[click]** What is left is the real privacy set. It can be much smaller than the tree. It can
> be one.
>
> The paper says this plainly: the size of the tree is only an upper bound. Real privacy depends
> on how many people use the system, and how they use it.

---

## 23:50 — Slide 28 · Metadata that can still link you

> Four specific leaks, all named in the paper.
>
> **[click]** Fees. The Bitcoin transaction that carries the envelope has to pay a fee, from
> some Bitcoin wallet. If you always pay from the same wallet, your transfers can be linked at
> the Bitcoin layer, even though their contents are hidden.
>
> **[click]** Shape. Input and output counts are public. A single standard shape, such as two-in
> two-out, would remove that signal, at the cost of padding. The paper leaves the choice open.
>
> **[click]** Anchor age. If most wallets anchor a few blocks deep and yours repeatedly chooses
> a root near the old end of the allowed window, that stands out.
>
> **[click]** Shared h_body. All the outputs of one transfer are tied to the same h_body. Two
> people paid in the same transfer can compare notes and learn they had the same sender. Wallets
> should send unrelated payments in separate transfers.
>
> Network-level observation — who broadcast a transaction first — is outside the paper's model
> as well.

---

## 24:55 — Slide 29 · Open questions

> Finally, what the paper does not do.

---

## 25:00 — Slide 30 · Outside this paper

*Keep the peg and setup limitations even when cutting for time. The fee multiple is an attributed estimate, not a benchmark.*

> **[click]** Getting bitcoin in and out. This is the big one. The paper specifies transfers
> between notes. It does not specify how real BTC becomes a note, or how a note becomes BTC
> again. Those are peg-in and peg-out, and they are left to a separate paper. The paper's non-
> custodial claim covers transfers only — not entry and exit.
>
> **[click]** Paying fees privately. The direction they describe is a fee vault, built with the
> same mechanism as the peg. It is not specified yet.
>
> **[click]** Light clients. A short proof that a root is the correct replay would let small
> wallets check the state cheaply. That is open.
>
> **[click]** Trusted setup. Groth16 needs a setup ceremony for each circuit, which means one
> for each supported transfer shape. The security claims assume nobody kept the ceremony's
> trapdoor. Anyone who had it could make false proofs verify.
>
> **[click]** Cost. 610 bytes for a two-in two-out envelope. In the September 26 CoinDesk
> report, Komarov estimated a transfer at roughly 700 virtual bytes, against 100 to 200 for an
> ordinary payment — about four times the fee at the same fee rate.
>
> This talk describes the September specification. The September 26 report said there was no
> announced launch date.

---

## 26:20 — Slide 31 · PIPEs, briefly

*[CUT] Optional in the short version. Do not describe practical witness encryption as settled.*

> Since peg-in and peg-out are the obvious question: the paper says they are expected to use
> Bitcoin PIPEs v2, also from [alloc] init. Here is the idea.
>
> **[click]** Take an ordinary Bitcoin private key that controls some coins.
>
> **[click]** Encrypt that key with witness encryption, under a statement — for example, "there
> is a valid proof that this withdrawal is authorised by the shielded state".
>
> **[click]** Anyone who has a valid proof for that statement can decrypt the key. That
> restriction depends on the witness-encryption security assumptions.
>
> **[click]** With the key, they produce a normal Schnorr signature. To Bitcoin, it is an
> ordinary spend.
>
> The PIPEs v2 paper presents its concrete witness-encryption construction as a research
> direction. It does not establish a ready-to-deploy peg for this transfer protocol.

---

## 27:10 — Slide 32 · Extensions sketched in the paper

*[CUT] Optional in the short version. These are sketches of extensions, not core transfer features.*

> Two extensions the paper sketches. Neither is part of the core specification.
>
> **[click]** Atomic swaps. Each note leaf has a reserved slot, h_aux, for binding extra data to
> the note when it is created. It is unused in this version. The motivating use is to commit a
> hash-lock there, so that one preimage unlocks both a shielded note and an ordinary Bitcoin
> HTLC. A liquidity provider could then swap between shielded and transparent bitcoin.
>
> **[click]** Opt-in compliance evidence. An institution could ask for proof that a note
> descends from approved deposits, and passed only through certified addresses — without seeing
> the path itself. It is optional: notes without it are still valid, and on chain the two cannot
> be told apart.

---

## 28:00 — Slide 33 · What to take away

> Three things to take with you.
>
> **[click]** One. Bitcoin only publishes and orders. The rules are enforced by replay, above
> it, and every correct replay reaches the same state. Agreement assumes the same protocol
> parameters and starting state.
>
> **[click]** Two. Notes, nullifiers and proofs hide the contents of a transfer: the amounts,
> the sender, the recipient, and which note was spent. They do not hide that a transfer
> happened, its shape, or its fees.
>
> **[click]** Three. The transfer layer is specified. Getting real bitcoin in and out is not —
> and that is the part that will decide how much trust the whole system really needs.

---

## 28:45 — Slide 34 · Thank you!

*Leave the QR code on screen during questions.*

> The QR code opens the Shielded Bitcoin paper. The sources also include PIPEs v2 for the
> proposed boundary mechanism. The fee estimate came from Komarov's comments reported by
> CoinDesk.
>
> Happy to take questions.

---

## CUT PLAN

Aim for about 23–24 minutes. Keep the caveats on replay, metadata, setup and the peg. Do not speed
through the whole script to compensate for a late start.

| Change | How to present it | Approximate saving |
|---|---|---:|
| Slide 3 | One sentence per category; reveal all four panes. | 25 s |
| Slide 10 | Keep all clicks; state what is proved without reading the public/private input lists. | 30 s |
| Slides 11–12 | Name the envelope parts and say the proof binds its body. Skip slide 12. | 1 min 20 s |
| Slides 19–20 | Briefly show spending versus viewing keys; skip the disclosure catalogue on slide 20. | 1 min 15 s |
| Slide 31 | Say PIPEs is the proposed direction and witness encryption remains research. Skip the mechanism. | 45 s |
| Slide 32 | Skip both extension sketches. | 45 s |

Use slide navigation to jump over optional slides; do not delete them or renumber this script.
When skipping slide 20, say: “Viewing keys let a wallet disclose history without granting spending
rights. They are broad read capabilities, so individual note openings are better for narrow audits.”
When skipping slide 31, say: “The proposed peg direction is PIPEs v2, which depends on witness
encryption. This paper does not specify that peg, and the concrete construction remains research.”

## Q&A PREP

These answers are preparation, outside the runtime above. They describe the cited specification.
Where a deployment decision is missing, say so.

### Figures to have ready

| Item | Figure and scope | Source |
|---|---|---|
| Two-input, two-output envelope | **610 bytes** including its proof; not a whole Bitcoin transaction | Paper App. A.4, pp. 43–44 |
| Complete OP_RETURN output for that envelope | **625 non-witness bytes / 2,500 WU / 625 vB contribution**; transaction inputs, change and overhead are additional | Paper App. A.4 |
| Illustrative witness carrier | Commit **154 vB**, reveal **284 vB**, total **438 vB** across two transactions, under the stated P2TR template; outside the OP_RETURN replay profile | Paper App. A.4, Table 4 |
| Groth16 proof | About **192 bytes** for the selected profile | Paper §22, App. A |
| Alternative proof sizes cited | Polymath about **176 bytes**; Pari about **160 bytes**; not the chosen profile | Paper §22 |
| Anchor window | **H − 100 ≤ h_anchor ≤ H − 1**; W = 100, K_min = 1 | Paper §8, App. A.6 |
| Nominal duration of 100 blocks | About **16 h 40 min** at the ten-minute target; the paper rounds to about 16 hours. Actual block intervals vary. | Arithmetic from App. A.6 |
| Wallet seed; diversifier | **32 bytes**; **11 bytes** | Paper App. A |
| Core v30 OP_RETURN policy | Default `datacarriersize`: **83 → 100,000 bytes**, configurable by node operators; not a consensus rule | Paper App. A.4; [Core 30 release notes](https://bitcoincore.org/en/releases/30.0/#policy) |
| Reported whole-transfer estimate | Komarov: about **700 vB**, versus **100–200 vB** for an ordinary payment; reported as roughly **4× fees** at the same fee rate. Treat as an estimate, not a measured universal ratio. | [CoinDesk, September 26, 2026](https://www.coindesk.com/tech/2026/09/26/bitcoin-could-soon-get-zcash-style-shielded-privacy-without-changing-its-rules) |

The 610-byte example breaks down as follows. Do not use this number for Alice's one-input,
two-output walkthrough, or confuse it with a total carrier transaction size.

| Field | Bytes |
|---|---:|
| Header | 6 |
| Anchor height | 4 |
| Input/output counts | 2 |
| Two nullifiers | 64 |
| Two ephemeral public keys | 64 |
| Two note ciphertexts, 67 each | 134 |
| Outgoing recovery batch: two 64-byte entries + one 16-byte authentication tag | 144 |
| Proof | 192 |
| **Total** | **610** |

*Source: [paper Appendix A.4, pp. 43–44](https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf#page=43).
The bar on slide 11 represents their relative sizes, with the header widened for legibility.*

### Is it non-custodial? Are these actual BTC?

The transfer-layer claim is non-custodial: wallets retain spending authority, and indexers and
viewing keys do not receive it. Notes represent bitcoin-denominated value. This paper does not
specify the complete mechanism that locks Bitcoin for entry or releases it on exit. It therefore
does not establish the trust model of an end-to-end BTC peg. Do not infer backing or redemption
guarantees from private transfer validity. *Paper §1.2, §17, §22.*

### How do the first notes exist?

Replay agreement assumes a common starting state and protocol parameters. The introduction
mentions a deployment-supplied initial inventory and recovery data for initial notes. Internal
transfers conserve value; they do not define how BTC deposits create that inventory. The peg and
bootstrap details are not supplied by the internal transfer walkthrough. *Paper §1.1–1.2.*

### Who runs indexers? What if they disagree?

An indexer is software that anyone can run; this is not an elected committee. Correct implementations
using the same completed profile, starting state and active Bitcoin prefix must agree. If they
disagree, check those inputs and their implementations. Comparing two services is not a proof that
either is right: independent replay establishes the canonical result. The paper does not specify an
indexer business model. A wallet accepting unverified answers assumes its chosen indexer is truthful.
*Paper §4, §17 A8–A11, §18 G1.*

### Does Bitcoin enforce the proof? Can an invalid transfer confirm?

Bitcoin validates the carrier as a Bitcoin transaction. The shielded proof is checked by replay.
An invalid envelope can therefore appear in a confirmed block. It remains published but creates no
notes and spends no notes in canonical shielded state. Replay applies a transfer only after all checks
pass. Confirmation depth is still a separate wallet policy. *Paper §15, §17, App. A.7.*

### Can Alice tell when Bob spends what she sent?

Not from the nullifier alone. Alice knows the note plaintext and its randomness, but the nullifier
also requires Bob's `sk_nf`. Bob's viewing keys do not supply that secret either. Metadata or other
information may still reveal activity; this is not a claim that Alice can never infer it. *Paper §6,
§9, §20.*

### Why put the tree position in the nullifier?

The nullifier is `H_nf(sk_nf, ρ, pos)`. Position makes different note leaves distinct inputs even if
someone reuses note randomness. The paper identifies the old Zerocash serial-number-reuse issue
as motivation. Reusing randomness is still contrary to honest wallet behaviour; position does not
make such reuse good practice. *Paper §9; §19, Lemma 1.*

### Does the nullifier key spend? Can a viewing key prove my balance?

The spending key authorises a spend; `sk_nf` alone does not. It gives nullifier derivation and can
therefore expose spend linkage when combined with note data and positions. Viewing keys are
read-only and exclude `sk_nf`. Incoming receipts and outgoing recovery records do not by themselves
identify which notes were consumed. A list of opened notes proves those entries, not automatically
completeness or a spendable balance. Ask what an auditor can actually recompute from the disclosed
material. *Paper §6–7, §16.*

### What if the trusted setup was compromised?

The guarantees assume an honestly generated setup with no usable trapdoor retained by an adversary.
If that assumption fails, proof soundness can fail: a false statement, such as an unbalanced
transfer, could verify. An indexer faithfully running the verifier would not fix this. The paper
calls for setup per circuit/arity; it does not document a completed deployment ceremony here.
*Paper §17 A3, §22.*

### What happens in a Bitcoin reorg? Is one confirmation enough?

Replay follows the active chain. A reorg can change note positions, nullifiers and roots from the
replaced height onwards. A wallet rescans and, where needed, rebuilds its proof against the new
history. `K_min = 1` is the minimum valid anchor depth, not a finality guarantee. The paper recommends
a deeper wallet anchor policy and a separately chosen confirmation depth. It does not give one
confirmation count that is safe for every use case. *Paper §15, §17 A9, App. A.6.*

### What if my anchor expires? Can I spend a note twice against old roots?

An expired anchor makes that envelope invalid; it does not destroy the underlying notes. If those
notes remain unspent, fetch current paths and rebuild. An old root proves membership only: replay
also checks the current nullifier set, so an already spent note cannot be spent again through an
older root. Duplicate nullifiers inside one envelope are rejected too. *Paper §8–9, §15, App. A.6–A.7.*

### What about Groth16 proof re-randomisation?

A different proof can verify for the same statement. Its body, `h_body` and nullifiers stay the same.
Once one version is accepted, another version repeats those nullifiers and is rejected. If a copy
arrives first, it can be the version accepted; the transfer effects are the same. The paper discusses
carrier transaction-ID effects at the publication layer. It is not a way to change recipients,
create value or obtain a second accepted spend. *Paper §19, “Proof re-randomization”.*

### How is this different from Zcash or Shielded CSV?

The note/nullifier/proof structure comes from shielded-note systems such as Zcash. Here Bitcoin
supplies publication and ordering, while shielded validity is outside Bitcoin consensus; there is
no dedicated shielded chain enforcing it. The comparison with Shielded CSV concerns recovery data:
client-side validation requires owners to retain data that the chain cannot replace. This proposal
publishes transfer recovery data on Bitcoin. Keep the claim scoped to transfer history, with the
stated replay and initial-state assumptions. *Paper §2, §16.*

### Why OP_RETURN? What if relay policy tightens?

The specified profile extracts a complete envelope from one OP_RETURN output. Relay and mining
policy determine how easily it can be published; no consensus rule guarantees that a miner will
include it. A stricter policy can impair publication. The paper's witness-carrier comparison is not
a fallback recognised by this profile: changing carriers requires an agreed deployment profile and
matching indexers. *Paper §11, App. A.4; [Core 30 release notes](https://bitcoincore.org/en/releases/30.0/#policy).*

### How do BTC get in or out? Is PIPEs ready?

The paper points to PIPEs v2 as a direction for the boundary mechanisms, but does not specify the
peg. At a high level, witness encryption makes access to signing material conditional on a valid
witness for a statement. Bitcoin then sees an ordinary Schnorr signature. The PIPEs paper describes
its concrete construction as a research direction; that does not establish a practical, integrated
Shielded Bitcoin peg. *Paper §22; [PIPEs v2 abstract](https://eprint.iacr.org/2026/186).*

### Where is the fee deducted? Does a relayer solve linkage?

Inside the transfer, input value equals output value exactly. A carrier transaction pays a separate
Bitcoin fee. Its funding inputs, change and reuse can link activity. The paper names a PIPE-based
fee vault as future work; it does not specify a complete private-fee or relayer design. Do not promise
that simply adding a relayer removes that leakage. *Paper §14, §20, §22.*

### How big is the privacy set? Can the sender remove every note they created?

All leaves under the chosen root are only an upper bound. An observer's own notes, disclosures,
entry/exit amounts, timing and other knowledge can reduce candidates, possibly to one. Knowing a
note's plaintext as its sender does not automatically reveal its nullifier; do not indiscriminately
exclude every note an observer ever sent. The crosses on slide 27 illustrate exclusions justified
by additional knowledge, not a public list of spent leaves. *Paper §9, §20.*

### Does h_body identify the sender to everyone?

No. It groups the outputs of an envelope and binds the proof to that body. Co-recipients can compare
the shared transfer identifier with their payment knowledge and learn that they were paid in the
same transfer. This is why the paper recommends separating unrelated payments. It does not make a
sender's name a public envelope field. *Paper §13, §20.*

## Sources

1. **[Shielded Bitcoin: Private Transfers on the Bitcoin L1](https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf)**,
   Clara Shikhelman, Mikhail Komarov and Aleksei Moskvin, [alloc] init, September 24, 2026. Primary
   source for the transfer protocol. Section references above refer to the 56-page paper supplied
   in the project handoff. A completed deployment profile and starting state are assumptions,
   not details established by the diagrams.
2. **[Bitcoin PIPEs v2](https://eprint.iacr.org/2026/186)**, Michel Abdalla et al., IACR ePrint 2026/186.
   Source for the witness-encryption mechanism and its research status; not a completed peg specification.
3. **[Bitcoin Core 30.0 release notes](https://bitcoincore.org/en/releases/30.0/#policy)**.
   Primary confirmation of the OP_RETURN relay-policy default and operator configurability.
4. **[CoinDesk report, September 26, 2026](https://www.coindesk.com/tech/2026/09/26/bitcoin-could-soon-get-zcash-style-shielded-privacy-without-changing-its-rules)**.
   Used only for Komarov's attributed size/fee estimate and the launch-status statement as of that report.
5. **[Bitcoin Magazine announcement](https://bitcoinmagazine.com/technical/alloc-init-releases-shielded-bitcoin-proposal-for-private-bitcoin-transactions)**.
   Further reading from the handoff; not used to establish transfer security guarantees.

### Claim map for rehearsal and fact-checking

| Slides | Primary passages |
|---|---|
| 1–4: motivation and scope | Paper §1–2, pp. 3–5 |
| 5–6: Bitcoin, replay and wallets | Paper §3–4, pp. 6–8 |
| 7–9: notes, leaves and nullifiers | Paper §5, §8–9, pp. 9, 13–16 |
| 10: proof obligations | Paper §14, pp. 22–23; App. B, pp. 46–47 |
| 11–12: envelope and binding | Paper §11–13, pp. 17–21; App. A.3–A.5, pp. 43–44; Core 30 policy notes |
| 13–17: replay, agreement, finality and anchors | Paper §8, §15, §17–19; App. A.6–A.7 |
| 18–20: keys and disclosure | Paper §6–7, pp. 10–12 |
| 21–24: walkthrough and recovery | Paper §10, §16, App. C; §1.1 for initial-note recovery qualification |
| 25–28: privacy and metadata | Paper §20, pp. 31–37 |
| 29–30: unfinished work and cost | Paper §1.2, §17 A3, §22, App. A.4; CoinDesk only for reported estimates/status |
| 31: PIPEs | Paper §22; PIPEs v2 abstract and construction |
| 32: extensions | Paper §22; App. D, pp. 53–54 |
| 33–34: recap | Paper §1.2, §18, §20–22 |
