---
theme: default
title: Shielded Bitcoin
info: Private transfers on the Bitcoin L1 — how the [alloc] init proposal works, what it hides, and what is still open.
class: text-left
colorSchema: dark
drawings:
  persist: false
transition: fade
mdc: true
fonts:
  sans: Inter
  mono: JetBrains Mono
layout: cover
---

<CipherRain />

<div class="relative flex flex-col items-center text-center">

<ShieldMark :size="150" />

# Shielded Bitcoin

<div class="cover-sub mt-2 text-xl text-body/80">Private transfers on the Bitcoin L1</div>

<div class="cover-by mt-12 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-muted">
  <div class="i-ph-file-text-duotone text-base text-violet" />
  Shikhelman · Komarov · Moskvin — [alloc] init — 2026
</div>

</div>

<style>
.cover-sub { opacity: 0; animation: cover-in .7s ease 1.3s forwards; }
.cover-by { opacity: 0; animation: cover-in .7s ease 1.7s forwards; }
@keyframes cover-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
</style>

<!--
*Let the title animation settle. Introduce this as a proposal, not a product demonstration.*

Tonight's subject is Shielded Bitcoin. It is a protocol proposal, published in September 2026
by Clara Shikhelman, Mikhail Komarov and Aleksei Moskvin at [alloc] init.

The goal is private transfers of bitcoin-denominated value, published on Bitcoin itself,
without changing Bitcoin's consensus rules and without a new blockchain.

I will explain how it works, what it hides, what it does not hide, and which parts are still
open. The transfer model comes from the paper. I will distinguish its guarantees from its
assumptions and from the parts it leaves for future work.
-->

---
clicks: 3
---

# Bitcoin's ledger is public

<PublicGraph class="mt-4" :clicks="$clicks" />

<div v-click="3" class="mt-3 text-center text-lg text-white">
  One identified address can expose a wider payment history.
</div>

<!--
Start with the problem. Circles are addresses, boxes are transactions. This graph is public.

**[click]** The amounts are public too: every output, and the earlier output each input
spends.

**[click]** Analysts use that structure to infer ownership. Inputs spent together often belong
to one person. A change output often returns to that person. These are heuristics, not proof.
Here they suggest that three addresses belong to one wallet.

**[click]** An exchange withdrawal can connect one address to a known customer. That gives an
observer a starting point for attributing other payments in the cluster. A mistaken heuristic
can also give a mistaken attribution.

Addresses are pseudonymous. Their transaction history is public.
-->

---
clicks: 4
---

# What exists today

<div class="mt-7 grid grid-cols-3 gap-5">
<div v-click="1" class="pane flex flex-col px-5 py-4">
  <div class="eyebrow">on Bitcoin</div>
  <div class="mt-1.5 text-lg text-white font-semibold">CoinJoin · PayJoin · Silent Payments</div>
  <div class="mt-auto space-y-1.5 pt-4 text-sm">
    <div class="flex items-start gap-2"><div class="i-ph-check-circle-fill mt-0.5 shrink-0 text-green" /><span class="text-body">the graph is harder to follow</span></div>
    <div class="flex items-start gap-2"><div class="i-ph-x-circle-fill mt-0.5 shrink-0 text-red" /><span class="text-body">amounts and structure stay public</span></div>
  </div>
</div>
<div v-click="2" class="pane flex flex-col px-5 py-4">
  <div class="eyebrow">separate chains</div>
  <div class="mt-1.5 text-lg text-white font-semibold">Zcash · Monero</div>
  <div class="mt-auto space-y-1.5 pt-4 text-sm">
    <div class="flex items-start gap-2"><div class="i-ph-check-circle-fill mt-0.5 shrink-0 text-green" /><span class="text-body">sender, recipient, amount hidden</span></div>
    <div class="flex items-start gap-2"><div class="i-ph-x-circle-fill mt-0.5 shrink-0 text-red" /><span class="text-body">another network, another asset</span></div>
  </div>
</div>
<div v-click="3" class="pane flex flex-col px-5 py-4">
  <div class="eyebrow">new opcodes</div>
  <div class="mt-1.5 text-lg text-white font-semibold">OP_CAT · OP_CSFS</div>
  <div class="mt-auto space-y-1.5 pt-4 text-sm">
    <div class="flex items-start gap-2"><div class="i-ph-check-circle-fill mt-0.5 shrink-0 text-green" /><span class="text-body">more expressive constructions</span></div>
    <div class="flex items-start gap-2"><div class="i-ph-x-circle-fill mt-0.5 shrink-0 text-red" /><span class="text-body">needs a soft fork</span></div>
  </div>
</div>
</div>

<div v-click="4" class="pane-violet mx-auto mt-8 flex max-w-3xl items-center gap-4 px-6 py-4">
  <div class="i-ph-shield-check-duotone shrink-0 text-3xl text-violet" />
  <div>
    <div class="text-lg text-white">Shielded Bitcoin: the Zcash privacy model, with the data on Bitcoin</div>
    <div class="mt-0.5 text-sm text-muted">no soft fork · no new chain</div>
  </div>
</div>

<!--
*[CUT] In a short version, reveal all four panes and give one sentence on each.*

What do we already have?

**[click]** On Bitcoin itself: CoinJoin, PayJoin, Silent Payments. CoinJoin and PayJoin make
the usual graph heuristics less reliable. Silent Payments avoid address reuse. All three are
useful. None of them hides amounts, and the structure of the transactions stays public.

**[click]** Separate chains. Shielded Zcash transfers and Monero aim to hide sender, recipient
and amount. But they are different networks with different assets. To use them, you leave
Bitcoin.

**[click]** New opcodes. Proposals such as OP_CAT and OP_CSFS would allow more expressive
constructions on Bitcoin. Those constructions depend on a soft fork.

**[click]** Shielded Bitcoin tries to sit in the gap: the privacy model Zcash uses, with all
the data published on Bitcoin, and no change to Bitcoin.
-->

---
clicks: 4
---

# Two approaches to privacy

<ProtocolComparison :clicks="$clicks" />

<!--
*[CUT] Skip this comparison in the short version. Reveal rows in four groups; the column headings stay in place.*

Glass Coins, previously called Shielded CSV, is another proposal for private transfers using
Bitcoin. It sends private coin data and proofs to recipients. Shielded Bitcoin publishes
encrypted notes and proofs on Bitcoin, using a Zcash-style note model.

**[click]** That difference affects capacity. The CSV paper estimates about a hundred
transfers per second, using compact, batched nullifiers. For Shielded Bitcoin's two-input,
two-output OP_RETURN example, the block-space estimate is roughly two to three per second.
These assume full blocks and different publication methods. They are not measured throughput
or a universal speed ratio; a witness carrier changes the Shielded Bitcoin calculation.

**[click]** Both designs hide the shielded sender, recipient and amounts from public
observers. These checks describe what the protocol hides, not immunity from metadata analysis.

**[click]** CSV also hides the output count and pays publishers within the private protocol.
The publisher sees its own fee payment; the Bitcoin mining fee is still public. Shielded
Bitcoin exposes its output count and carrier fee. The wallet funding that fee can reveal
information about the sender.

**[click]** Recovery is the other tradeoff. Seed and Bitcoin history cannot replace lost
private CSV data. Shielded Bitcoin publishes what wallets need to recover transfer history,
assuming the agreed starting state and bootstrap recovery data. This comparison covers
transfers; neither column establishes the security of a complete BTC peg.
-->

---
layout: center
class: text-center
---

<div class="mb-5 flex justify-center"><div class="i-ph-shield-check-duotone text-6xl text-violet glow-pulse" /></div>

# Encrypted notes, published on Bitcoin

<div class="mt-4 text-xl text-muted">
  checked by anyone who replays the chain
</div>

<!--
Here is the whole idea in a few sentences.

Value is held as encrypted records called notes. Spending a note publishes a marker called a
nullifier. A zero-knowledge proof shows that the spend is valid. All of it is published on
Bitcoin.

Bitcoin does not check any of it. Software that anyone can run reads the data in Bitcoin's
order and checks it. With the same protocol parameters, starting state and Bitcoin history,
every correct copy gets the same result.

The rest of the talk takes those sentences apart, one piece at a time.
-->

---
layout: section
---

<div class="eyebrow mb-3 !text-violet">part 1</div>

# The model

<div class="mt-3 text-muted">Who does what, and what a note is</div>

<!--
First, who does what.
-->

---
clicks: 6
---

# Three roles

<ThreeRoles class="mt-6" :clicks="$clicks" />

<!--
*Start with Bitcoin at the bottom. Let each moving token arrive before the next click.*

There are three roles. Start at the bottom.

**[click]** Bitcoin. It stores bytes and puts them in order. That is all it does here. A miner
who includes a Shielded Bitcoin transfer does not check whether the transfer is valid.
Bitcoin's rules only care that the Bitcoin transaction carrying it is valid.

**[click]** Indexers. An indexer is software that reads every Bitcoin block, in order, finds
the Shielded Bitcoin data, checks each transfer, and keeps the resulting state. The paper
calls this process replay. Anyone can run one. The indexer role needs no user spending keys
and gives no authority to spend notes.

**[click]** Wallets. A wallet holds the user's keys. It builds transfers, produces the proof,
and scans for notes that belong to it.

Now the flow.

**[click]** A wallet publishes a transfer to Bitcoin. The paper calls the published data an
envelope.

**[click]** Indexers read it from the chain, in block order, and replay it.

**[click]** And wallets get the state back from indexers: the note tree, its roots, and the
Merkle paths they need to build their next transfer.

The line to remember: Bitcoin provides publication and ordering. Validity is checked above it.
-->

---
clicks: 4
---

# A note

<NoteAnatomy class="mt-7" :clicks="$clicks" />

<!--
The basic object is a note: a record of value that can be created once and spent once.

**[click]** Its plaintext is three fields. An amount, in satoshis. A diversifier, d, which
says which of the recipient's addresses it was sent to. And rseed, fresh randomness for this
note.

**[click]** Two more values are derived from rseed, so they are not extra fields in the note
plaintext. Rho goes into the nullifier, which we will get to. sk_eph is a one-time secret used
to encrypt this note.

**[click]** The plaintext never goes on chain. The sender encrypts it to the recipient's
address. What Bitcoin carries is a one-time public key, pk_eph, and the ciphertext, ct_note.
Anyone can read those bytes. The recipient can decrypt the note. The sender can also recover
it. An outside observer without the relevant secrets cannot.

**[click]** One more detail that matters later. Each note gets a leaf in a global tree, and
that leaf is computed from these public bytes. So every indexer can compute it without knowing
anything about what is inside the note.
-->

---
clicks: 3
---

# The note tree

<NoteTree class="mt-5"
  :leaves="$clicks >= 2 ? 5 : $clicks >= 1 ? 3 : 0"
  pane="roots"
  :roots="[
    ...($clicks >= 1 ? [{ label: 'block h', seed: 'root-3', note: '3 leaves' }] : []),
    ...($clicks >= 2 ? [{ label: 'block h+1', seed: 'root-5', note: '+2 leaves' }] : []),
    ...($clicks >= 3 ? [{ label: 'block h+2', seed: 'root-5', note: 'no transfers' }] : []),
  ]" />

<!--
*Point to the root when defining it. Leaves stay in place throughout.*

That is the note tree. Its root is a hash that commits to all its leaves. A Merkle path lets a
wallet prove that one leaf is included under that root. The tree only grows.

**[click]** Every accepted transfer appends one leaf per new note. Each leaf gets a position,
in order. Leaves are never removed and never changed.

**[click]** A new transfer is accepted: two new notes, so two new leaves, at positions three
and four. The root changes.

On the right is the root history. After an indexer finishes replaying a block, it stores the
root of the tree for that block height.

**[click]** If a block has no Shielded Bitcoin transfers, the root simply carries over. So
every block height has a root. That matters when we get to anchors.
-->

---
clicks: 4
---

# Spending publishes a nullifier

<div class="mt-3 flex h-7 items-center gap-3">
  <div v-click="1" class="flex items-center gap-2">
    <span class="sym text-sm text-violetlt">nf = H(sk_nf, ρ, pos)</span>
    <span class="text-xs text-muted">— requires the recipient’s nullifier secret</span>
  </div>
</div>

<NoteTree class="mt-1"
  :leaves="5"
  pane="nullifiers"
  :existing="['old-nf-1', 'old-nf-2']"
  :highlight="2"
  :unknown="$clicks >= 4"
  :nf-at="$clicks >= 2 ? 'set' : $clicks >= 1 ? 'leaf' : null"
  :dup-at="$clicks === 3 ? 'set' : null" />

<div class="relative -mt-5 h-8">
  <div class="absolute inset-x-0 flex justify-end transition-opacity duration-500" :class="$clicks === 3 ? 'opacity-100' : 'opacity-0'" style="transition-delay: .9s">
    <span class="chip-red !text-xs !px-3.5 !py-1.5"><span class="i-ph-x-circle-fill" /> already in the set — rejected</span>
  </div>
  <div class="absolute inset-x-0 flex justify-center transition-opacity duration-500" :class="$clicks >= 4 ? 'opacity-100' : 'opacity-0'">
    <span class="chip-violet !text-xs !px-3.5 !py-1.5"><span class="i-ph-eye-duotone" /> public data: a nullifier, with no direct link to its leaf</span>
  </div>
</div>

<!--
*Pause at the rejected second spend. The leaf remains in the tree.*

How do you spend a note without saying which one?

Here is the same tree. In our view — which nobody else has — the note at position two is
Alice's.

**[click]** To spend it, her wallet computes its nullifier. The nullifier is a hash of three
things: her nullifier key, the note's rho, and the note's position in the tree. It requires
the recipient's nullifier secret. Knowing the note plaintext, as its sender does, is not
enough.

**[click]** The transfer publishes the nullifier. When it is accepted, the nullifier goes into
the nullifier set: the list of every spend ever accepted.

Note what did not happen. The leaf is still in the tree. It is not removed and not marked.
Spending is recorded only in the nullifier set.

**[click]** Now suppose Alice tries to spend the same note a second time. Same key, same rho,
same position — so the same nullifier. It is already in the set, so the transfer is rejected.
That is the whole double-spend rule: one note has exactly one nullifier, and a nullifier is
accepted only once.

**[click]** And this is what everyone else sees. A nullifier, and a tree of leaves. The
published nullifier does not identify its leaf. Metadata may still help an observer narrow the
candidates; we will return to that.
-->

---
clicks: 6
---

# The proof

<ProofStatement class="mt-6" :clicks="$clicks" />

<!--
*[CUT] Keep the six clicks, but shorten the explanation to membership, authority, correct outputs and exact balance.*

So an indexer sees a nullifier it cannot link to a note. How does it know the spend is valid?
That is the job of the zero-knowledge proof.

**[click]** On the left is what the wallet knows and never publishes: the notes being spent,
their positions and Merkle paths, the spend key, and the new notes with their recipients.

**[click]** On the right is the public statement — the values the proof is checked against.
The anchor root, the nullifiers, the new notes' public keys and ciphertexts, and h_body, a
hash of the whole envelope. We will see h_body in a moment.

**[click]** The proof connects the two. It shows that the private values on the left satisfy
the rules with respect to the public values on the right. Under the proof system's
assumptions, the proof reveals no additional private witness data.

So what does it establish?

**[click]** The notes being spent exist in the tree. And the sender holds the key that can
spend them.

**[click]** Each nullifier is the correct one for one of those notes. And each recipient
ciphertext encrypts the note used in the balance calculation. A wallet still checks decryption
and consistency before it recognises an output as its own.

**[click]** Every amount is in range, and inputs equal outputs exactly, so no value is
created. And the proof is bound to this exact envelope.

Every indexer verifies every proof, which is why the paper wants proofs that are small and
cheap to check. The profile in the paper uses Groth16, with proofs of about 192 bytes. We will
come back to what that choice costs.
-->

---
clicks: 6
transition: none
---

# The transfer envelope

<EnvelopeBar class="mt-9" :step="$clicks" />

<!--
*[CUT] For the shorter talk, reveal the bar quickly: nullifiers, encrypted outputs, recovery data, proof. Do not read byte counts.*

This is the envelope: everything one transfer puts on Bitcoin. The bar shows the relative
field sizes for a transfer with two inputs and two outputs; the header is widened so its label
fits.

**[click]** A small header: the protocol version, the anchor height, and how many inputs and
outputs there are.

**[click]** The nullifiers, one per input.

**[click]** For each output, its one-time public key and its ciphertext.

**[click]** ct_out. This is an encrypted copy, for the sender, of what they need to recover
their own outgoing payments later. It is encrypted under the sender's outgoing viewing key.

**[click]** And the proof.

**[click]** In total, 610 bytes. In the paper's profile it is carried in a single OP_RETURN
output.

That last part depends on relay policy, not on consensus. Bitcoin Core 30 raised the default
OP_RETURN limit far enough for this, but node operators can set it back, so how well these
transactions relay depends on what people run. The paper compares a lighter witness carrier
using two transactions. That comparison is outside the specified OP_RETURN profile; indexers
using this profile ignore witness bytes.
-->

---
clicks: 3
---

# Bound to the body

<EnvelopeBar class="mt-9" full :bind="$clicks" />

<div v-click="3" class="mt-1 text-center text-lg text-white">
  Change one byte, and the proof no longer verifies.
</div>

<!--
*[CUT] Optional slide in the short version. The changed field is ct_out. Advance from slide 12 without resetting the canvas.*

Same envelope. There is a problem to solve here.

The proof takes some fields directly as public inputs: the nullifiers, the output keys, the
ciphertexts. Others it does not see individually: the header, the anchor height, and the
recovery copy, ct_out. Without something extra, those could be changed after the proof was
made, and the proof would still verify.

**[click]** So the wallet hashes every byte of the envelope except the proof. That hash is
h_body.

**[click]** And h_body is a public input of the proof. The proof is valid only for that exact
value.

**[click]** Now change one byte of ct_out. The body changes, so h_body changes, so the proof
is checked against a statement it was not made for. It does not verify, and the whole envelope
is rejected.

The new leaves are also computed from h_body, so they are tied to this exact envelope as well.
-->

---
layout: section
---

<div class="eyebrow mb-3 !text-violet">part 2</div>

# Replay

<div class="mt-3 text-muted">How the state is computed, and who you trust for it</div>

<!--
Now what indexers actually do.
-->

---
clicks: 4
---

# Every indexer runs the same checks

<ReplayPipeline class="mt-7" :clicks="$clicks" />

<div v-click="4" class="-mt-1 text-center text-lg text-white">
  All checks pass, or <span class="text-violetlt">nothing changes</span>.
</div>

<!--
*Let the valid envelope finish before showing the rejected one.*

For every candidate envelope, in Bitcoin order, an indexer runs five checks, always in the
same order. Parse it. Recompute h_body. Check that the anchor is in the allowed window. Check
that its nullifiers are distinct and none is already spent. Verify the proof.

**[click]** A valid envelope passes all five, and only then does the state change: the new
leaves are appended and the nullifiers are added.

**[click]** Here is one that reuses a nullifier. It passes the first three checks and fails
the fourth. It is rejected, and the state is exactly as it was before. There are no partial
updates.

**[click]** When the indexer finishes a block, it stores the root of the tree for that height.

**[click]** The order and the rules are part of the protocol. If two indexers accepted
slightly different things, they would end up with different states from the same chain. The
paper is explicit that there is no implementation-defined acceptance rule.
-->

---
clicks: 4
---

# Same blocks, same state

<IndexerAgreement class="mt-6" :clicks="$clicks" />

<!--
That is the property everything else rests on.

**[click]** Two correct indexers using the same completed profile, starting state and blocks
compute the same state and root. They do not talk to each other, and there is no extra
consensus protocol. Bitcoin's order is the only coordination.

**[click]** What can a dishonest indexer do? It can leave envelopes out. It can serve old
data. It can report a root that is simply wrong.

**[click]** What it cannot do is make that wrong root match an independent replay of the same
blocks. A wallet that replays for itself, or checks the indexer's answer against Bitcoin data,
sees the mismatch.

**[click]** The flip side: a wallet that does neither is trusting its indexer. The paper says
so directly. A full replay is expensive, and a cheap way for a light wallet to verify the
state is listed as future work.
-->

---
layout: center
class: text-center
---

<div class="mb-5 flex justify-center"><div class="i-ph-warning-duotone text-6xl text-amber" /></div>

# Confirmed is not the same as accepted

<div class="mx-auto mt-4 max-w-2xl text-xl text-muted">
  Bitcoin confirms the carrier transaction whether or not the transfer inside it is valid.
</div>

<!--
*Pause after the final sentence. Replay acceptance and confirmation depth are separate requirements.*

A consequence that is easy to miss.

A Bitcoin full node checks Bitcoin transaction validity. Those checks do not validate the
shielded transfer carried inside the transaction.

Bitcoin will confirm the carrier transaction as long as it is a valid Bitcoin transaction. The
envelope inside can still be rejected by replay — a bad proof, a reused nullifier, an expired
anchor. Rejected envelopes stay in Bitcoin's history. They simply have no effect on the
shielded state.

A wallet needs replay acceptance as well as its chosen Bitcoin confirmation depth before
treating a payment as final.
-->

---
clicks: 4
---

# The anchor

<div class="mt-2 text-muted">Which root the proof is built against</div>

<AnchorWindow class="mt-8" :clicks="$clicks" />

<!--
*The drawing compresses a 100-block window into ten boxes. It is schematic, not a scale drawing.*

One field in the header needs its own slide: the anchor.

Each block has a stored root. H is the block being replayed right now.

**[click]** A transfer must prove its notes are in one recent root. The allowed heights form a
window: from H minus W up to H minus one. In the paper's profile W is 100 blocks, about
sixteen hours. The drawing shows ten.

It cannot use H itself, because the root for H only exists once H has been fully replayed.
That also means a note cannot be spent in the same block it was created in.

**[click]** Alice's wallet picks one height in the window — that is h_anchor — and builds its
proof against that block's root. The envelope carries only the height, four bytes. Indexers
look up the root themselves.

Why is an older root acceptable? Because the tree only grows. If a note is in an older root,
it is still in the tree. Whether it has been spent since is decided by the current nullifier
set, not by the root.

**[click]** Now suppose the envelope is not mined quickly — fees spiked, or the wallet was
offline. Blocks pass, and the anchor falls out of the window. The envelope is now invalid.

**[click]** Expiry does not destroy the notes. This rejected envelope did not spend them. The
wallet picks a newer anchor, fetches new Merkle paths, and builds a fresh proof.
-->

---
layout: section
---

<div class="eyebrow mb-3 !text-violet">part 3</div>

# Keys

<div class="mt-3 text-muted">Who can spend, and who can only read</div>

<!--
Now the wallet side.
-->

---
clicks: 6
---

# One seed, separate capabilities

<KeyTree class="mt-8" :clicks="$clicks" />

<!--
*[CUT] Short version: one seed, spending authority, two read-only viewing keys. Reveal all six steps.*

All keys come from one seed, through one-way derivations.

**[click]** The seed gives a master secret.

**[click]** From it, the spend key. This is the only key that can authorize spending a note.

**[click]** From the spend key, the nullifier key. It is derived from the spend key on
purpose, and the proof checks that derivation, so one spend authority always produces one
nullifier per note. If it were an independent secret, a note could be spent twice under two
different nullifiers.

**[click]** Also from the spend key, the incoming viewing key. It can find and decrypt notes
sent to you, but it cannot spend them. Your addresses come from it: a diversifier, d, and a
public key, pk_d. One wallet can make many addresses from the same viewing key.

**[click]** From the master secret, separately, the outgoing viewing key. It decrypts the
ct_out copies, so it can recover what you sent.

**[click]** The spend key authorises spending. The nullifier key can identify spends but
cannot authorise them alone. Keep both private. The two viewing keys are read-only.
-->

---
clicks: 5
---

# Disclosure is read-only

<div class="mt-7 grid grid-cols-2 gap-4">
<div v-click="1" class="pane-cyan flex items-start gap-4 px-5 py-4">
  <div class="i-ph-tray-arrow-down-duotone mt-0.5 shrink-0 text-2xl text-cyan" />
  <div>
    <div class="text-white font-semibold">Incoming view <span class="sym ml-1 text-xs text-cyan">vk_in</span></div>
    <div class="mt-1 text-sm text-muted">everything you received</div>
  </div>
</div>
<div v-click="2" class="pane-cyan flex items-start gap-4 px-5 py-4">
  <div class="i-ph-tray-arrow-up-duotone mt-0.5 shrink-0 text-2xl text-cyan" />
  <div>
    <div class="text-white font-semibold">Outgoing view <span class="sym ml-1 text-xs text-cyan">vk_out</span></div>
    <div class="mt-1 text-sm text-muted">everything you sent</div>
  </div>
</div>
<div v-click="3" class="pane flex items-start gap-4 px-5 py-4">
  <div class="i-ph-magnifying-glass-duotone mt-0.5 shrink-0 text-2xl text-violet" />
  <div>
    <div class="text-white font-semibold">Note opening</div>
    <div class="mt-1 text-sm text-muted">one note, checked against the chain</div>
  </div>
</div>
<div v-click="4" class="pane flex items-start gap-4 px-5 py-4">
  <div class="i-ph-file-text-duotone mt-0.5 shrink-0 text-2xl text-violet" />
  <div>
    <div class="text-white font-semibold">Derived report</div>
    <div class="mt-1 text-sm text-muted">a bounded claim, with evidence for independent checks</div>
  </div>
</div>
</div>

<div v-click="5" class="mt-8 flex items-center justify-center gap-3">
  <div class="i-ph-lock-key-duotone text-3xl text-amber" />
  <div class="text-xl text-white">None of them can spend. There is no master disclosure key.</div>
</div>

<!--
*[CUT] Optional in the short version. Keep the distinction between seeing a payment and proving a balance.*

Which makes selective disclosure possible — to an auditor, an accountant, a counterparty.

**[click]** Share the incoming viewing key, and someone can find and decrypt matching received
outputs in accepted history.

**[click]** Share the outgoing viewing key, and they can see what you sent. Neither key shows
which of your notes were spent in a given transfer.

**[click]** Or open one specific note, and let them check it against the chain.

**[click]** Or give a report — a balance at some height, totals over a period — with evidence
for the checks they need to make. Openings can substantiate particular entries; they do not by
themselves prove that nothing was omitted, or establish a spendable balance.

**[click]** None of these can spend. There is no global disclosure key, and no backdoor.

One limit: a viewing key, once shared, works on the whole history. Limiting an audit to one
month is a policy, not a cryptographic limit. For a narrow audit, disclose notes or a report,
not the key.
-->

---
layout: section
---

<div class="eyebrow mb-3 !text-violet">part 4</div>

# One transfer

<div class="mt-3 text-muted">Alice pays Bob, end to end</div>

<!--
Let us put it all together with one transfer. Alice pays Bob.
-->

---
clicks: 5
transition: none
---

# Alice pays Bob

<TransferCanvas class="mt-6" :step="$clicks" />

<!--
*Amounts in the diagram are BTC-denominated examples; notes store integer satoshis. Wait for moving tokens to arrive.*

Alice on the left, Bob on the right, indexers at the top, Bitcoin at the bottom. Alice already
has two notes. How value enters the system is a separate question, still outside this paper.

**[click]** Bob gives Alice an address. That is the only thing that has to pass between them.

**[click]** Alice's wallet picks the 0.30 note, and gets from an indexer what it needs to
prove that note is in the tree: a recent root, and the Merkle path to her leaf.

**[click]** It creates two new notes: 0.20 for Bob, and 0.10 back to herself as change. 0.30
in, 0.30 out, exactly. There is no fee inside a shielded transfer. The Bitcoin fee is paid by
the Bitcoin transaction that carries the envelope.

**[click]** It encrypts both notes, computes the nullifier of the note it is spending, adds
her recovery copy, hashes the body, and produces the proof.

**[click]** It publishes the envelope in a Bitcoin transaction, and a miner includes it in a
block.

At this point Alice's wallet treats the 0.30 note as locked, not spent. It is spent when
replay accepts the envelope.
-->

---
clicks: 3
---

# Alice pays Bob

<TransferCanvas class="mt-6" :step="5 + $clicks" />

<!--
*Keep the same canvas. This example is one input and two outputs, unlike the size example on slide 12.*

Same picture. The envelope is in a block.

**[click]** Indexers replay the block. The envelope passes all five checks. Two leaves are
appended, one nullifier is added, and the root changes.

**[click]** Bob's wallet tries his incoming viewing key on each new output. One decrypts. His
wallet checks it against the public data — the ephemeral key and the leaf have to match — and
records its position. A later transfer can spend it using an allowed anchor. It cannot be
spent in the block that created it, and Bob's wallet also applies its confirmation policy.

**[click]** Alice's 0.30 note is now spent, because its nullifier is in the set. Her 0.10
change arrives the same way Bob's note did.

An outside observer sees a Bitcoin transaction carrying an envelope: one nullifier and two
encrypted outputs. The shielded amounts and participants are not directly revealed. The
carrier transaction and its fee funding are public.
-->

---
clicks: 3
---

# Recovery from seed and history

<div class="mt-9 grid grid-cols-[auto_auto_1fr] items-center gap-8">
<div class="space-y-3">
  <div class="pane-amber flex items-center gap-3 px-5 py-3">
    <div class="i-ph-plant-duotone text-2xl text-amber" />
    <div><div class="text-white font-semibold">the seed</div><div class="text-xs text-muted">32 random bytes</div></div>
  </div>
  <div class="text-center text-lg text-muted">+</div>
  <div class="pane-orange flex items-center gap-3 px-5 py-3">
    <BtcMark :size="24" />
    <div><div class="text-white font-semibold">the Bitcoin chain</div><div class="text-xs text-muted">every envelope ever published</div></div>
  </div>
</div>
<div v-click="1" class="flex flex-col items-center gap-1">
  <div class="text-xs text-cyan">replay</div>
  <div class="i-ph-arrow-right-bold text-2xl text-cyan" />
</div>
<div v-click="1" class="pane-violet px-6 py-4">
  <div class="eyebrow !text-violetlt">published transfer history, rebuilt</div>
  <div class="mt-2.5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-body">
    <div class="flex items-center gap-2"><div class="i-ph-check-bold text-green" />every note received</div>
    <div class="flex items-center gap-2"><div class="i-ph-check-bold text-green" />everything sent</div>
    <div class="flex items-center gap-2"><div class="i-ph-check-bold text-green" />tree positions</div>
    <div class="flex items-center gap-2"><div class="i-ph-check-bold text-green" />which notes are spent</div>
    <div class="flex items-center gap-2"><div class="i-ph-check-bold text-green" />the balance</div>
  </div>
</div>
</div>

<div v-click="2" class="pane mx-auto mt-8 flex max-w-3xl items-center gap-4 px-6 py-3.5">
  <div class="i-ph-hard-drives-duotone shrink-0 text-2xl text-muted" />
  <div class="text-sm text-body">In client-side validation designs such as Shielded CSV, the owner keeps the data needed to spend. Lose it, and the chain cannot give it back.</div>
</div>

<div v-click="3" class="mt-5 flex justify-center">
  <span class="chip-amber !text-xs !px-3.5 !py-1.5"><span class="i-ph-warning-duotone" /> the positions come from replay — your own, or a trusted indexer's</span>
</div>

<!--
*The recovery claim concerns the transfer history. Do not extend it to an unspecified peg or bootstrap process.*

For notes created by accepted transfers, the recovery data is published on Bitcoin.

**[click]** So with only the seed and the chain, a wallet can rebuild itself: every note
received, everything sent, the tree positions, which notes are spent, and the balance. Cached
plaintexts are an optimisation, not something you have to back up.

**[click]** That is a real difference from client-side validation designs such as Shielded
CSV, where the owner has to keep the data needed to spend, and losing it cannot be fixed from
the chain.

**[click]** The condition: recovery needs the replayed positions, so the wallet either replays
the chain itself, or trusts an indexer. This covers published transfer history; the paper
separately mentions deployment-defined recovery data for any initial notes.
-->

---
layout: section
---

<div class="eyebrow mb-3 !text-violet">part 5</div>

# Privacy

<div class="mt-3 text-muted">What is hidden, and what is not</div>

<!--
Now the privacy boundary: what an observer learns.
-->

---
clicks: 3
---

# What an observer sees

<div class="mt-7 grid grid-cols-2 gap-6">
<div v-click="1" class="pane-green px-6 py-4">
  <div class="flex items-center gap-2"><div class="i-ph-eye-slash-duotone text-xl text-green" /><span class="eyebrow !text-green">hidden</span></div>
  <div class="mt-3 space-y-2 text-[0.95rem] text-body">
    <div>the amounts</div>
    <div>the sender</div>
    <div>the recipient</div>
    <div>which earlier note was spent</div>
    <div>which inputs became which outputs</div>
  </div>
</div>
<div v-click="2" class="pane-red px-6 py-4">
  <div class="flex items-center gap-2"><div class="i-ph-eye-duotone text-xl text-red" /><span class="eyebrow !text-red">visible</span></div>
  <div class="mt-3 space-y-2 text-[0.95rem] text-body">
    <div>that a transfer happened, and when</div>
    <div>how many inputs and outputs</div>
    <div>the anchor height, and the envelope size</div>
    <div>the carrier transaction and its fee-funding inputs</div>
    <div>amounts and timing when value enters or leaves</div>
  </div>
</div>
</div>

<div v-click="3" class="mt-7 text-center text-lg text-white">
  It hides <span class="text-green">what</span> a transfer says — not <span class="text-red">that</span> it happened.
</div>

<!--
**[click]** The shielded data does not directly reveal to an outside observer: the amounts.
The sender. The recipient. Which earlier note was spent. And which inputs became which
outputs.

**[click]** Visible: that a transfer happened, and when. How many inputs and outputs it has —
a one-to-two transfer and a two-to-one transfer look different. The anchor height, so how old
the root was, and the envelope size. The Bitcoin transaction that carries it, including the
inputs that funded its fee and any ownership inferences an observer can make from them. And
anything at the boundary: amounts and timing when value enters or leaves the system.

**[click]** So the protocol hides the contents of a transfer. It does not hide that a transfer
took place. Its privacy claim concerns the transfer contents, subject to the metadata that
remains visible.

And this is about outside observers. Bob knows what Alice sent him. Alice knows what she sent.
-->

---
clicks: 3
---

# The privacy set

<div class="mt-2 text-muted">Which leaf did that nullifier spend?</div>

<NoteTree class="mt-3"
  :leaves="8"
  unknown
  root-label="anchor root"
  :struck="$clicks >= 2 ? [0, 1, 5, 6, 7] : $clicks >= 1 ? [1, 5] : []"
  :candidates="$clicks >= 3 ? [2, 3, 4] : []" />

<div class="relative -mt-[260px] ml-auto h-[250px] w-[285px] space-y-3">
  <div class="pane px-4 py-3">
    <div class="flex items-center gap-2 text-sm text-white"><span class="font-mono text-violetlt">?</span> every leaf under the anchor root</div>
  </div>
  <div v-click="1" class="pane flex items-center gap-2 px-4 py-3 text-sm text-white">
    <div class="i-ph-x-bold text-red" /> notes excluded using private knowledge
  </div>
  <div v-click="2" class="pane flex items-center gap-2 px-4 py-3 text-sm text-white">
    <div class="i-ph-x-bold text-red" /> ruled out by timing and amounts
  </div>
  <div v-click="3" class="pane-green flex items-center gap-2 px-4 py-3 text-sm text-white">
    <span class="font-mono text-green">?</span> what is left is the real privacy set
  </div>
</div>

<!--
*Crosses show candidates excluded by an informed observer. They are not public spent flags on tree leaves.*

How much privacy is that in practice?

When Alice spends a note, the candidates for "which note was it" are the leaves under the
anchor root. Here, eight.

**[click]** But an observer often knows more. For example, it can exclude notes it owns and
knows it has not spent. Knowledge of payments it made or received can narrow the possibilities
too. Sending a note does not reveal its nullifier.

**[click]** Timing and amounts at the boundary rule out more. A distinctive entry amount
followed by a matching exit soon afterwards may narrow the candidates. These are inferences
from extra information, not links exposed by a nullifier.

**[click]** What is left is the real privacy set. It can be much smaller than the tree. It can
be one.

The paper says this plainly: the size of the tree is only an upper bound. Real privacy depends
on how many people use the system, and how they use it.
-->

---
clicks: 4
---

# Metadata that can still link you

<div class="mt-7 space-y-3">
<div v-click="1" class="pane flex items-center gap-5 px-6 py-3.5">
  <div class="i-ph-coins-duotone shrink-0 text-2xl text-orange" />
  <div class="w-36 text-white font-semibold">Fees</div>
  <div class="text-sm text-muted">the carrier transaction is paid from some Bitcoin wallet — reuse it, and your transfers link</div>
</div>
<div v-click="2" class="pane flex items-center gap-5 px-6 py-3.5">
  <div class="i-ph-shapes-duotone shrink-0 text-2xl text-violet" />
  <div class="w-36 text-white font-semibold">Shape</div>
  <div class="text-sm text-muted">input and output counts are public; no standard shape is fixed yet</div>
</div>
<div v-click="3" class="pane flex items-center gap-5 px-6 py-3.5">
  <div class="i-ph-clock-countdown-duotone shrink-0 text-2xl text-cyan" />
  <div class="w-36 text-white font-semibold">Anchor age</div>
  <div class="text-sm text-muted">an unusual age stands out from what other wallets use</div>
</div>
<div v-click="4" class="pane flex items-center gap-5 px-6 py-3.5">
  <div class="i-ph-users-three-duotone shrink-0 text-2xl text-pink" />
  <div class="w-36 text-white font-semibold">Shared h_body</div>
  <div class="text-sm text-muted">two people paid in the same transfer can tell they had the same sender</div>
</div>
</div>

<!--
Four specific leaks, all named in the paper.

**[click]** Fees. The Bitcoin transaction that carries the envelope has to pay a fee, from
some Bitcoin wallet. If you always pay from the same wallet, your transfers can be linked at
the Bitcoin layer, even though their contents are hidden.

**[click]** Shape. Input and output counts are public. A single standard shape, such as two-in
two-out, would remove that signal, at the cost of padding. The paper leaves the choice open.

**[click]** Anchor age. If most wallets anchor a few blocks deep and yours repeatedly chooses
a root near the old end of the allowed window, that stands out.

**[click]** Shared h_body. All the outputs of one transfer are tied to the same h_body. Two
people paid in the same transfer can compare notes and learn they had the same sender. Wallets
should send unrelated payments in separate transfers.

Network-level observation — who broadcast a transaction first — is outside the paper's model
as well.
-->

---
layout: section
---

<div class="eyebrow mb-3 !text-violet">part 6</div>

# Open questions

<div class="mt-3 text-muted">What this paper does not cover</div>

<!--
Finally, what the paper does not do.
-->

---
clicks: 5
---

# Outside this paper

<div class="mt-6 grid grid-cols-6 gap-4">
<div v-click="1" class="pane-red col-span-6 flex items-center gap-5 px-6 py-3.5">
  <div class="i-ph-arrows-left-right-bold shrink-0 text-2xl text-red" />
  <div class="w-44 shrink-0 text-white font-semibold">Getting BTC in and out</div>
  <div class="text-sm text-body">peg-in and peg-out are left to a separate paper. The non-custodial claim covers transfers only.</div>
</div>
<div v-click="2" class="pane col-span-3 px-5 py-3.5">
  <div class="flex items-center gap-2.5"><div class="i-ph-gas-pump-duotone text-xl text-orange" /><span class="text-white font-semibold">Private fees</span></div>
  <div class="mt-1 text-sm text-muted">a fee vault is the stated direction</div>
</div>
<div v-click="3" class="pane col-span-3 px-5 py-3.5">
  <div class="flex items-center gap-2.5"><div class="i-ph-device-mobile-duotone text-xl text-cyan" /><span class="text-white font-semibold">Light clients</span></div>
  <div class="mt-1 text-sm text-muted">checking a root without a full replay</div>
</div>
<div v-click="4" class="pane col-span-3 px-5 py-3.5">
  <div class="flex items-center gap-2.5"><div class="i-ph-users-four-duotone text-xl text-violet" /><span class="text-white font-semibold">Trusted setup</span></div>
  <div class="mt-1 text-sm text-muted">Groth16 needs a ceremony for each circuit</div>
</div>
<div v-click="5" class="pane col-span-3 px-5 py-3.5">
  <div class="flex items-center gap-2.5"><div class="i-ph-scales-duotone text-xl text-amber" /><span class="text-white font-semibold">Cost</span></div>
  <div class="mt-1 text-sm text-muted">several times the fee of an ordinary payment</div>
</div>
</div>

<!--
*Keep the peg and setup limitations even when cutting for time. The fee multiple is an attributed estimate, not a benchmark.*

**[click]** Getting bitcoin in and out. This is the big one. The paper specifies transfers
between notes. It does not specify how real BTC becomes a note, or how a note becomes BTC
again. Those are peg-in and peg-out, and they are left to a separate paper. The paper's non-
custodial claim covers transfers only — not entry and exit.

**[click]** Paying fees privately. The direction they describe is a fee vault, built with the
same mechanism as the peg. It is not specified yet.

**[click]** Light clients. A short proof that a root is the correct replay would let small
wallets check the state cheaply. That is open.

**[click]** Trusted setup. Groth16 needs a setup ceremony for each circuit, which means one
for each supported transfer shape. The security claims assume nobody kept the ceremony's
trapdoor. Anyone who had it could make false proofs verify.

**[click]** Cost. 610 bytes for a two-in two-out envelope. In the September 26 CoinDesk
report, Komarov estimated a transfer at roughly 700 virtual bytes, against 100 to 200 for an
ordinary payment — about four times the fee at the same fee rate.

This talk describes the September specification. The September 26 report said there was no
announced launch date.
-->

---
clicks: 4
---

# PIPEs, briefly

<div class="mt-2 text-muted">The mechanism the paper expects to use for peg-in and peg-out</div>

<div class="mt-10 grid grid-cols-[1fr_2rem_1fr_2rem_1fr_2rem_1fr] items-stretch">
<div v-click="1" class="pane-orange flex flex-col items-center px-3 py-5 text-center">
  <div class="i-ph-key-duotone text-3xl text-orange" />
  <div class="mt-2 text-white font-semibold">a Bitcoin key</div>
  <div class="mt-1 text-xs text-muted">controls some coins</div>
</div>
<div v-click="2" class="flex items-center justify-center"><div class="i-ph-caret-right-fill text-white/30" /></div>
<div v-click="2" class="pane-violet flex flex-col items-center px-3 py-5 text-center">
  <div class="i-ph-lock-key-duotone text-3xl text-violet" />
  <div class="mt-2 text-white font-semibold">encrypted under a statement</div>
  <div class="mt-1 text-xs text-muted">witness encryption</div>
</div>
<div v-click="3" class="flex items-center justify-center"><div class="i-ph-caret-right-fill text-white/30" /></div>
<div v-click="3" class="pane-cyan flex flex-col items-center px-3 py-5 text-center">
  <div class="i-ph-seal-check-duotone text-3xl text-cyan" />
  <div class="mt-2 text-white font-semibold">a valid proof decrypts it</div>
  <div class="mt-1 text-xs text-muted">nothing else does</div>
</div>
<div v-click="4" class="flex items-center justify-center"><div class="i-ph-caret-right-fill text-white/30" /></div>
<div v-click="4" class="pane-green flex flex-col items-center px-3 py-5 text-center">
  <div class="i-ph-signature-duotone text-3xl text-green" />
  <div class="mt-2 text-white font-semibold">an ordinary signature</div>
  <div class="mt-1 text-xs text-muted">Bitcoin sees a normal spend</div>
</div>
</div>

<div v-click="4" class="mt-9 flex justify-center">
  <span class="chip-amber !text-xs !px-3.5 !py-1.5"><span class="i-ph-flask-duotone" /> practical witness encryption is still a research direction</span>
</div>

<!--
*[CUT] Optional in the short version. Do not describe practical witness encryption as settled.*

Since peg-in and peg-out are the obvious question: the paper says they are expected to use
Bitcoin PIPEs v2, also from [alloc] init. Here is the idea.

**[click]** Take an ordinary Bitcoin private key that controls some coins.

**[click]** Encrypt that key with witness encryption, under a statement — for example, "there
is a valid proof that this withdrawal is authorised by the shielded state".

**[click]** Anyone who has a valid proof for that statement can decrypt the key. That
restriction depends on the witness-encryption security assumptions.

**[click]** With the key, they produce a normal Schnorr signature. To Bitcoin, it is an
ordinary spend.

The PIPEs v2 paper presents its concrete witness-encryption construction as a research
direction. It does not establish a ready-to-deploy peg for this transfer protocol.
-->

---
clicks: 2
---

# Extensions sketched in the paper

<div class="mt-8 grid grid-cols-2 gap-6">
<div v-click="1" class="pane-violet px-6 py-5">
  <div class="flex items-center gap-3"><div class="i-ph-swap-duotone text-2xl text-violet" /><span class="text-lg text-white font-semibold">Atomic swaps</span></div>
  <div class="mt-3 text-sm text-body">A reserved slot in each leaf, <span class="sym text-violetlt">h_aux</span>, can commit to a hash-lock.</div>
  <div class="mt-2 text-sm text-muted">One preimage then unlocks a shielded note and an ordinary Bitcoin HTLC — a swap between shielded and transparent bitcoin.</div>
</div>
<div v-click="2" class="pane-cyan px-6 py-5">
  <div class="flex items-center gap-3"><div class="i-ph-certificate-duotone text-2xl text-cyan" /><span class="text-lg text-white font-semibold">Opt-in compliance evidence</span></div>
  <div class="mt-3 text-sm text-body">A proof that a note descends from approved deposits, through certified addresses only.</div>
  <div class="mt-2 text-sm text-muted">Optional. Notes without it stay valid, and on chain the two look the same.</div>
</div>
</div>

<!--
*[CUT] Optional in the short version. These are sketches of extensions, not core transfer features.*

Two extensions the paper sketches. Neither is part of the core specification.

**[click]** Atomic swaps. Each note leaf has a reserved slot, h_aux, for binding extra data to
the note when it is created. It is unused in this version. The motivating use is to commit a
hash-lock there, so that one preimage unlocks both a shielded note and an ordinary Bitcoin
HTLC. A liquidity provider could then swap between shielded and transparent bitcoin.

**[click]** Opt-in compliance evidence. An institution could ask for proof that a note
descends from approved deposits, and passed only through certified addresses — without seeing
the path itself. It is optional: notes without it are still valid, and on chain the two cannot
be told apart.
-->

---
clicks: 3
---

# What to take away

<div class="mt-11 space-y-8">
  <div v-click="1" class="flex items-baseline gap-6">
    <span class="font-mono text-2xl text-violet font-bold">1</span>
    <div>
      <div class="text-2xl text-white">Bitcoin publishes and orders. Replay enforces the rules.</div>
      <div class="mt-1 text-base text-muted">and every correct replay reaches the same state</div>
    </div>
  </div>
  <div v-click="2" class="flex items-baseline gap-6">
    <span class="font-mono text-2xl text-violet font-bold">2</span>
    <div>
      <div class="text-2xl text-white">The contents are hidden. The transfer is not.</div>
      <div class="mt-1 text-base text-muted">amounts, sender, recipient, and which note — but not timing, shape or fees</div>
    </div>
  </div>
  <div v-click="3" class="flex items-baseline gap-6">
    <span class="font-mono text-2xl text-violet font-bold">3</span>
    <div>
      <div class="text-2xl text-white">Transfers are specified. Getting BTC in and out is not.</div>
      <div class="mt-1 text-base text-muted">that part will decide how much trust the system really needs</div>
    </div>
  </div>
</div>

<!--
Three things to take with you.

**[click]** One. Bitcoin only publishes and orders. The rules are enforced by replay, above
it, and every correct replay reaches the same state. Agreement assumes the same protocol
parameters and starting state.

**[click]** Two. Notes, nullifiers and proofs hide the contents of a transfer: the amounts,
the sender, the recipient, and which note was spent. They do not hide that a transfer
happened, its shape, or its fees.

**[click]** Three. The transfer layer is specified. Getting real bitcoin in and out is not —
and that is the part that will decide how much trust the whole system really needs.
-->

---
layout: center
class: text-center
---

# Thank you!

<div class="mt-7 grid grid-cols-[auto_1fr] items-center gap-12 text-left">
<div class="flex flex-col items-center">
<img src="/paper-qr.svg" alt="allocinit.xyz/uploads/shielded-bitcoin.pdf" class="h-44 w-44 rounded-xl bg-white p-2.5">
<div class="mt-3 font-mono text-[0.68rem] text-violetlt">allocinit.xyz/uploads/shielded-bitcoin.pdf</div>
<div class="mt-1 text-xs text-muted">the paper</div>
</div>
<div class="space-y-3">
<div class="pane-violet flex items-start gap-4 px-5 py-3.5">
<div class="i-ph-file-text-duotone mt-0.5 shrink-0 text-2xl text-violet" />
<div><div class="text-white">Shielded Bitcoin: Private Transfers on the Bitcoin L1</div><div class="mt-0.5 text-xs text-muted">Shikhelman, Komarov, Moskvin — [alloc] init, 24 September 2026</div></div>
</div>
<div class="pane flex items-start gap-4 px-5 py-3.5">
<div class="i-ph-file-text-duotone mt-0.5 shrink-0 text-2xl text-cyan" />
<div><div class="text-white">Bitcoin PIPEs v2</div><div class="mt-0.5 text-xs text-muted">Abdalla et al. — IACR ePrint 2026/186</div></div>
</div>
</div>
</div>

<!--
*Leave the QR code on screen during questions.*

The QR code opens the Shielded Bitcoin paper. The sources also include PIPEs v2 for the
proposed boundary mechanism. The fee estimate came from Komarov's comments reported by
CoinDesk.

Happy to take questions.
-->
