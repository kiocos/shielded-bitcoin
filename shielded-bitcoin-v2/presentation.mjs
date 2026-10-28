export const sources = {
  paper: 'https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf',
  teaching: 'https://maxdesalle.com/mastering-zcash/',
}

const slide = (id, title, clicks, refs, body, extra = {}) => ({ id, title, clicks, refs, body, ...extra })

export const slides = [
  slide('cover', 'Shielded Bitcoin', 0, '§§1–4', `
<CipherRain />
<div class="relative flex flex-col items-center text-center">
  <ShieldMark :size="140" />
  <h1>Shielded Bitcoin</h1>
  <div class="v2-cover-sub">From notes to a private payment</div>
  <div class="v2-cover-credit">Shikhelman · Komarov · Moskvin — [alloc] init</div>
  <div class="v2-cover-edition">A protocol walkthrough · version 2</div>
</div>`, { layout: 'cover' }),

  slide('public-payment', 'A public payment', 3, '§1; ordinary Bitcoin UTXO model', '<PaymentFlow :clicks="$clicks" mode="public" />'),

  slide('checks', 'Keep the checks. Hide the details.', 4, '§14.1; App. B', `
<div class="v2-four">
  <div v-click="1" class="v2-check pane-violet"><div class="i-ph-tree-structure-duotone text-violet" /><span>Exists</span><small>a real input</small></div>
  <div v-click="2" class="v2-check pane-amber"><div class="i-ph-key-duotone text-amber" /><span>Authorized</span><small>the right spending key</small></div>
  <div v-click="3" class="v2-check pane-red"><div class="i-ph-fingerprint-duotone text-red" /><span>Not spent twice</span><small>one accepted spend</small></div>
  <div v-click="4" class="v2-check pane-green"><div class="i-ph-scales-duotone text-green" /><span>Conserves value</span><small>inputs = outputs</small></div>
</div>`),

  slide('roles', 'Who checks a shielded payment?', 3, '§4; §15; A.1', '<ProtocolFlow variant="roles" :clicks="$clicks" />'),
  slide('notes', 'Value is held in notes', 3, '§5; §14.1; App. B, block 7', '<PaymentFlow :clicks="$clicks" mode="notes" />'),
  slide('note-fields', 'What is inside a note?', 4, '§5; §12', '<NoteAnatomy :clicks="$clicks" />'),
  slide('leaf', 'A leaf identifies a published output', 3, '§9; §12.1; App. B, blocks 1 and 5', '<LeafBuild :clicks="$clicks" />'),

  slide('tree', 'Record every accepted output', 3, '§8; §15', `
<NoteTree pane="roots" :leaves="$clicks >= 2 ? 6 : $clicks >= 1 ? 4 : 2" :roots="[{ label: 'H − 2', seed: 'root-2' }, ...($clicks >= 1 ? [{ label: 'H − 1', seed: 'root-4' }] : []), ...($clicks >= 2 ? [{ label: 'H', seed: 'root-6' }] : [])]" />
<div v-click="3" class="v2-under text-cyan">Each block has a root · spent leaves stay in the tree</div>`),

  slide('path', 'Prove membership without naming the leaf', 4, '§8; §14; App. B, block 2', '<MerkleWitness :clicks="$clicks" />'),

  slide('nullifier', 'Prevent spending the same note twice', 4, '§9; §14.2; §19.2; App. B, block 4', `
<NoteTree pane="nullifiers" :leaves="8" :highlight="2" :unknown="$clicks >= 4" :existing="['earlier-nf-1']" :nfAt="$clicks >= 2 ? 'set' : $clicks >= 1 ? 'leaf' : null" :dupAt="$clicks === 3 ? 'set' : null" />
<div class="v2-under"><span class="chip-violet">nf = H_nf(sk_nf, ρ, pos)</span><span v-click="4" class="chip-green ml-4">the leaf-to-nullifier link is private</span></div>`),

  slide('keys', 'Reading and spending are separate capabilities', 6, '§6; §7; §9', '<KeyTree :clicks="$clicks" />'),
  slide('payment-divider', 'Follow one payment', 0, '§10; App. C', '<div class="eyebrow mb-4 !text-violet">from wallet to wallet</div>\n<h1>Follow one payment</h1>\n<div class="mt-5 text-xl text-muted">Select → construct → publish → accept → receive</div>', { layout: 'section' }),
  slide('select', 'Alice chooses the input and destinations', 3, '§10; §13.1; C.2–C.5', '<PaymentFlow mode="select" :clicks="$clicks" />'),

  slide('anchor', 'Choose a recent accepted root', 4, '§8; A.6; C.3', `
<AnchorWindow :clicks="$clicks" />
<div class="v2-under mt-5"><span class="chip-cyan">H − 100 ≤ h_anchor ≤ H − 1</span><span class="chip-muted ml-4">profile defaults · window drawing compressed</span></div>`),

  slide('input', 'Reconstruct the input inside the circuit', 3, '§9; §14.3; App. B, blocks 1–4', '<ProtocolFlow variant="input" :clicks="$clicks" />'),
  slide('encrypt', 'Encrypt Bob’s new note', 4, '§6; §12.1; App. B, block 5', '<RecipientChannel :clicks="$clicks" />'),
  slide('outgoing', 'Keep an encrypted outgoing record', 3, '§12.2; §16.2; C.8', '<ProtocolFlow variant="outgoing" :clicks="$clicks" />'),

  slide('envelope', 'Package the public data', 6, '§11; §13; A.3–A.5', `
<EnvelopeBar :step="$clicks" />
<div class="v2-under mt-6"><span class="chip-violet">Size example: 2 inputs → 2 outputs</span><span class="chip-muted ml-4">Alice’s payment: 1 → 2</span></div>`, { transition: 'none' }),

  slide('binding', 'Bind the proof to this exact body', 3, '§13.3; §14.2; App. B, block 8', `
<EnvelopeBar full :bind="$clicks" />
<div class="v2-under mt-6"><span class="chip-violet">Same 2-input → 2-output illustration</span><span v-click="3" class="chip-red ml-4">edited ct_out → different h_body</span></div>`),

  slide('proof', 'Generate the proof', 6, '§14; A.1; App. B', '<ProofStatement :clicks="$clicks" />'),
  slide('publish', 'Publish in a Bitcoin transaction', 3, '§11; §15; A.4', '<ProtocolFlow variant="publish" :clicks="$clicks" />'),

  slide('replay', 'Replay checks before changing state', 4, '§15; A.7', `
<ReplayPipeline :clicks="$clicks" />
<div v-click="4" class="v2-under text-cyan">Every check must pass before any state change</div>`),

  slide('accepted', 'The accepted state records both events', 3, '§8; §15; C.11', '<PaymentFlow mode="state" :clicks="$clicks" />'),
  slide('scan', 'Bob finds his output', 3, '§16.1; C.12', '<ScanNotes :clicks="$clicks" />'),

  slide('confirmation', 'Confirmed does not mean accepted', 1, '§15; §16.3; §19.1', `
<div class="v2-verdicts">
  <div class="pane-orange v2-verdict"><div class="i-ph-currency-btc-fill text-orange" /><span>Carrier confirmed</span><small>bytes are in a Bitcoin block</small></div>
  <div v-click="1" class="pane-red v2-verdict"><div class="i-ph-x-circle-fill text-red" /><span>Envelope rejected</span><small>no shielded state change</small></div>
</div>`),

  slide('agreement', 'Independent replay gives the same result', 4, '§1.1; §17 A8/A11; §18 G1; §19.1', '<IndexerAgreement :clicks="$clicks" />'),
  slide('recover', 'Recover from keys and published history', 3, '§1.1; §7; §16; §19.4', '<ProtocolFlow variant="recover" :clicks="$clicks" />'),

  slide('privacy', 'What stays private? What stays public?', 3, '§20', `
<div class="v2-privacy-grid">
  <div v-click="1" class="pane-green v2-privacy-card"><div class="i-ph-eye-slash-duotone text-green" /><div class="eyebrow !text-green">protected by the model</div><div>note amounts</div><div>output → recipient</div><div>input leaf → nullifier</div></div>
  <div v-click="2" class="pane-red v2-privacy-card"><div class="i-ph-eye-duotone text-red" /><div class="eyebrow !text-red">still observable</div><div>timing · size · shape</div><div>anchor age</div><div>carrier · fee funding · peg</div></div>
</div>
<div v-click="3" class="v2-under mt-5 text-muted">Co-recipients can recognize their shared creation h_body</div>`),

  slide('privacy-set', 'Which earlier note could it be?', 3, '§20.3; §20.6', `
<NoteTree :leaves="8" rootLabel="current root" unknown :struck="$clicks >= 3 ? [0,1,3,4,5,6,7] : $clicks >= 2 ? [0,1,5,6,7] : $clicks >= 1 ? [6,7] : []" :candidates="$clicks >= 3 ? [2] : $clicks >= 2 ? [2,3,4] : $clicks >= 1 ? [0,1,2,3,4,5] : []" />
<div class="v2-privacy-legend">
  <div v-click="1" class="chip-muted">after the anchor</div>
  <div v-click="2" class="chip-muted">excluded by known ownership</div>
  <div v-click="3" class="chip-red">one candidate remains</div>
  <small>hypothetical exclusions · not a measured privacy score</small>
</div>`),

  slide('cost', 'Publication has a cost', 3, '§11; A.4', `
<div class="v2-costs">
  <div v-click="1" class="pane-violet v2-cost"><div class="eyebrow !text-violet">2 inputs → 2 outputs</div><div class="v2-number">610 <small>B</small></div><div>protocol envelope</div></div>
  <div v-click="2" class="pane-orange v2-cost"><div class="eyebrow !text-orange">OP_RETURN</div><div class="v2-number">625 <small>vB</small></div><div>one output only</div></div>
  <div v-click="3" class="pane-cyan v2-cost"><div class="eyebrow !text-cyan">witness alternative</div><div class="v2-number">438 <small>vB</small></div><div>commit + reveal transactions</div></div>
</div>
<div v-click="3" class="v2-under mt-6 text-muted">Paper’s size assumptions · different scopes, not a fee quote</div>`),

  slide('scope', 'What still needs to be specified?', 4, '§1.2; §17; §22; A.1', `
<div class="v2-open-grid">
  <div v-click="1" class="pane-red v2-open"><span class="i-ph-arrows-left-right-duotone text-red" /><div><strong>Peg-in / peg-out</strong><small>separate boundary protocol</small></div></div>
  <div v-click="2" class="pane-amber v2-open"><span class="i-ph-key-duotone text-amber" /><div><strong>Trusted setup</strong><small>Groth16 · circuit-specific keys</small></div></div>
  <div v-click="3" class="pane-violet v2-open"><span class="i-ph-code-duotone text-violet" /><div><strong>Completed profile</strong><small>encoding · encryption · circuit · arities</small></div></div>
  <div v-click="4" class="pane-cyan v2-open"><span class="i-ph-magnifying-glass-duotone text-cyan" /><div><strong>Private fees / light clients</strong><small>future work in the paper</small></div></div>
</div>`),

  slide('recap', 'One payment, end to end', 4, '§10; App. C', '<ProtocolFlow variant="recap" :clicks="$clicks" />'),

  slide('takeaway', 'Three things to remember', 3, '§§8–16; §21; §1.2', `
<div class="v2-takeaways">
  <div v-click="1"><span class="text-violet">01</span><div>Notes, creation history, spend markers</div></div>
  <div v-click="2"><span class="text-violet">02</span><div>One proof connects the private and public data</div></div>
  <div v-click="3"><span class="text-violet">03</span><div>Bitcoin publishes · replay accepts</div></div>
</div>`),

  slide('questions', 'Questions', 0, 'App. B; App. C; Mastering Zcash §§3.3–3.6 and §4 (teaching structure only)', `
<div class="v2-end">
  <div><h1>Questions</h1><div class="mt-5 text-lg text-muted">Shielded Bitcoin · from notes to a payment</div><div class="v2-end-links"><a href="https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf" target="_blank" rel="noopener">Shielded Bitcoin paper ↗</a><a href="https://maxdesalle.com/mastering-zcash/" target="_blank" rel="noopener">Teaching reference: Mastering Zcash ↗</a></div></div>
  <div class="v2-qr"><img src="/paper-qr.svg" alt="QR code linking to the Shielded Bitcoin paper" /><span>read the paper</span></div>
</div>`, { layout: 'center' }),
]
