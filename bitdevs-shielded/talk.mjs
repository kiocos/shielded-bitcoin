export const sources = {
  "sb": {
    "name": "Shielded Bitcoin",
    "url": "https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf"
  },
  "groth": {
    "name": "Groth16",
    "url": "https://eprint.iacr.org/2016/260"
  },
  "pipes": {
    "name": "Bitcoin PIPEs v2",
    "url": "https://eprint.iacr.org/2026/186"
  },
  "csv": {
    "name": "Shielded CSV",
    "url": "https://eprint.iacr.org/2025/068"
  },
  "zcash": {
    "name": "Zcash Orchard · ZIP 224",
    "url": "https://zips.z.cash/zip-0224"
  },
  "payjoin": {
    "name": "Payjoin · BIP 78",
    "url": "https://bips.dev/78/"
  },
  "silent": {
    "name": "Silent Payments · BIP 352",
    "url": "https://bips.dev/352/"
  },
  "lightning": {
    "name": "Lightning · BOLT 4",
    "url": "https://github.com/lightning/bolts/blob/master/04-onion-routing.md"
  },
  "liquid": {
    "name": "Liquid · technical overview",
    "url": "https://docs.liquid.net/docs/technical-overview"
  },
  "elements": {
    "name": "Elements · Confidential Transactions",
    "url": "https://elementsproject.org/features/confidential-transactions"
  },
  "cashu": {
    "name": "Cashu",
    "url": "https://cashu.space/"
  },
  "fedimint": {
    "name": "Fedimint · custody model",
    "url": "https://fedimint.org/users/intro/"
  },
  "core": {
    "name": "Bitcoin Core 30 · relay policy",
    "url": "https://bitcoincore.org/en/releases/30.0/#policy"
  }
}

export const chapters = ["The payment","Why the checks work","Publication and acceptance","Limits","Alternatives","Questions in more detail"]
export const slides = [
  {"id":"cover","title":"Shielded Bitcoin","subtitle":"Notes, nullifiers and proof verification on Bitcoin L1.","chapter":0,"kind":"cover","clicks":0,"seconds":20,"takeaway":"","refs":[["sb","Proposal · 24 Sep 2026"]]},
  {"id":"public","title":"Alice spends an output to pay Bob","subtitle":"Bitcoin exposes input references, output scripts and amounts.","chapter":0,"kind":"payment","clicks":2,"seconds":45,"takeaway":"Shielding must preserve authorization, value conservation and double-spend prevention.","refs":[["sb","§§1–4"]]},
  {"id":"roles","title":"Bitcoin consensus and shielded replay","subtitle":"Bitcoin validates the carrier transaction. Indexers validate its shielded envelope.","chapter":0,"kind":"roles","clicks":3,"seconds":60,"takeaway":"A confirmed carrier can contain a rejected shielded envelope.","refs":[["sb","§4 · §15 · A.1"]]},
  {"id":"note","title":"Note plaintext and published ciphertext","subtitle":"The wallet spends a private note whose encrypted output is already in the tree.","chapter":1,"kind":"note","clicks":3,"seconds":55,"takeaway":"The note plaintext is private. Its ephemeral public key and ciphertext are published.","refs":[["sb","§5 · §12"]]},
  {"id":"tree","title":"Merkle membership without revealing the leaf","subtitle":"The witness supplies the selected leaf’s position and authentication path.","chapter":1,"kind":"tree","clicks":3,"seconds":65,"takeaway":"Replay supplies the accepted anchor root. The proof hides which leaf was selected.","refs":[["sb","§8 · §9 · App. B, blocks 1–2"]]},
  {"id":"nullifier","title":"Nullifiers prevent double spending","subtitle":"The circuit derives the nullifier. Replay checks that it has not been used.","chapter":1,"kind":"nullifier","clicks":3,"seconds":60,"takeaway":"A new proof of the same note must expose the same nullifier.","refs":[["sb","§9 · App. B, block 4"]]},
  {"id":"publication","title":"What goes into the transfer envelope?","subtitle":"Separate the private witness, serialized envelope and proof’s public inputs.","chapter":1,"kind":"publication","clicks":3,"seconds":80,"takeaway":"The SNARK witness is private. It is not Bitcoin transaction witness data.","refs":[["sb","§14.2–14.3 · A.3"]]},
  {"id":"proof-making","title":"Groth16 proof generation","subtitle":"The prover needs a witness, public inputs and a circuit-specific proving key.","chapter":1,"kind":"proof-making","clicks":3,"seconds":80,"takeaway":"The proof establishes knowledge of a witness satisfying the circuit, under its security assumptions.","refs":[["sb","§14 · App. B"],["groth","Construction and zero knowledge"]]},
  {"id":"proof-checking","title":"What the Groth16 verifier actually checks","subtitle":"Public inputs, the verifying key and the serialized proof are sufficient.","chapter":1,"kind":"proof-checking","clicks":3,"seconds":75,"takeaway":"A valid proof satisfies the circuit. Replay must still check the anchor and nullifiers.","refs":[["groth","Groth16 construction"],["sb","§14 · A.1"]]},
  {"id":"binding-note","title":"What binds the amount to the original note?","subtitle":"Ciphertext consistency, leaf reconstruction and Merkle membership.","chapter":1,"kind":"binding-note","clicks":4,"seconds":80,"takeaway":"Changing the amount breaks ciphertext consistency; replacing the ciphertext changes the leaf.","refs":[["sb","A6 · App. B, blocks 1–3"]]},
  {"id":"constraints","title":"Each attack needs an explicit constraint","subtitle":"A valid witness satisfies the implemented circuit, including any omissions.","chapter":1,"kind":"constraints","clicks":4,"seconds":65,"takeaway":"Review the constraints and deployed verifying key, not just witness-generation code.","refs":[["sb","§14.1 · App. B"]]},
  {"id":"transfer","title":"Alice creates outputs; Bob decrypts his note","subtitle":"One input note is consumed logically; Bob’s note and Alice’s change are appended.","chapter":2,"kind":"transfer","clicks":4,"seconds":75,"takeaway":"The input leaf stays in the tree. Its nullifier enters the spent set.","refs":[["sb","§10 · §12 · §16 · App. C"]]},
  {"id":"binding-body","title":"h_body binds the proof to the envelope","subtitle":"Replay hashes the canonical body, excluding the proof itself.","chapter":2,"kind":"binding-body","clicks":3,"seconds":50,"takeaway":"Editing ct_out changes h_body. The original proof fails for the new public inputs.","refs":[["sb","§13 · §14.2 · App. B, block 8"]]},
  {"id":"replay","title":"Replay’s acceptance pipeline","subtitle":"Parsing, body binding, anchor eligibility, nullifiers, proof verification, then application.","chapter":2,"kind":"replay","clicks":3,"seconds":70,"takeaway":"Rejecting any check leaves both the note tree and the nullifier set unchanged.","refs":[["sb","§15 · A.7"]]},
  {"id":"replay-lab","title":"Lab: which envelopes change the state?","subtitle":"Predict acceptance or rejection at each replay check.","chapter":2,"kind":"replay-lab","clicks":4,"seconds":90,"takeaway":"Rejection is atomic: no part of the transfer is applied.","refs":[["sb","§15 · A.7"]],"lab":true},
  {"id":"confirmed","title":"Confirmed carrier, invalid shielded proof","subtitle":"Bitcoin and shielded replay enforce different rule sets.","chapter":2,"kind":"quiz","clicks":1,"seconds":30,"takeaway":"Bitcoin confirmation does not establish shielded validity.","refs":[["sb","§15 · A.4"]],"question":"What gets rejected?","options":["The Bitcoin block","The shielded envelope","Only Bob’s output"],"answer":1,"explanation":"The envelope remains in the history, but has no effect on shielded state."},
  {"id":"recovery","title":"Spending keys, viewing keys and recovery","subtitle":"Read access does not grant spend authority or replace verification.","chapter":2,"kind":"recovery","clicks":3,"seconds":60,"takeaway":"Recovery needs the seed, published history, replayed positions and applicable bootstrap data.","refs":[["sb","§§6–7 · §16 · A11"]]},
  {"id":"leakage","title":"The envelope still exposes metadata","subtitle":"Timing, arity, anchor age and carrier funding remain observable.","chapter":3,"kind":"leakage","clicks":2,"seconds":50,"takeaway":"Zero knowledge protects the witness, not every inference from public data.","refs":[["sb","§20.3–20.7"]]},
  {"id":"privacy-lab","title":"Lab: narrow the possible input leaves","subtitle":"Anchor eligibility and external knowledge constrain the anonymity set.","chapter":3,"kind":"privacy-lab","clicks":3,"seconds":60,"takeaway":"Leaves are not people. Remaining candidates need not be equally likely.","refs":[["sb","§20.6"]],"lab":true},
  {"id":"peg","title":"Peg-in and peg-out are outside this paper","subtitle":"Internal transfer validity does not specify custody or redemption of the backing BTC.","chapter":3,"kind":"peg","clicks":2,"seconds":60,"takeaway":"This paper’s non-custodial guarantee covers internal transfers.","refs":[["sb","§22.3"],["pipes","§1.1"]]},
  {"id":"cost","title":"Data availability, fees and setup assumptions","subtitle":"Encrypted outputs on Bitcoin support recovery but consume block space.","chapter":3,"kind":"publication-cost","clicks":2,"seconds":40,"takeaway":"The proposal still needs a complete peg, profile and secure setup.","refs":[["sb","A.3–A.4"],["core","Policy"]]},
  {"id":"native","title":"On Bitcoin: what are we trying to hide?","subtitle":"Different mechanisms protect different information.","chapter":4,"kind":"compare","clicks":2,"seconds":45,"takeaway":"Defeating ownership heuristics and hiding amounts are different properties.","refs":[["payjoin","Motivation · Design"],["silent","Abstract · Motivation"]],"headers":["Mechanism","What it changes","What stays public"],"rows":[["CoinJoin / Payjoin","Ambiguity and ownership heuristics","Amounts and transaction graph"],["Silent Payments","Reusable address → unique outputs","Amounts and transaction graph"]]},
  {"id":"layers","title":"Beyond ordinary on-chain payments","subtitle":"Privacy, custody and data availability come with different trade-offs.","chapter":4,"kind":"compare","clicks":3,"seconds":55,"takeaway":"Compare what each system reveals and whom it requires you to trust.","refs":[["lightning","Onion routing"],["liquid","Architecture"],["cashu","eCash"],["fedimint","Community custody"]],"headers":["System","Mechanism","Main trade-off"],"rows":[["Lightning","Channels + onion routing","Liquidity, channel state, on-chain boundaries"],["Liquid","Confidential amounts and asset types","L-BTC + federated peg; graph still visible"],["Cashu / Fedimint","Blind-signature eCash","Custody with a mint / federation"]]},
  {"id":"cousins","title":"The closest relatives","subtitle":"Who validates transfers? Where does recovery data live?","chapter":4,"kind":"compare","clicks":3,"seconds":65,"takeaway":"These are different architectures, at different stages of deployment and research.","refs":[["zcash","Orchard"],["csv","§6.2"],["sb","§2 · §16 · §22"]],"headers":["System","Validation","Data / boundary"],"rows":[["Zcash · Orchard","Its own network’s consensus","On-chain data · native asset ZEC"],["Shielded CSV · paper","Client-side validation + proofs","Coin data retained by the client"],["Shielded Bitcoin · paper","Replay over data published on Bitcoin","Public history · peg out of scope"]]},
  {"id":"recap","title":"One transfer, three validation boundaries","subtitle":"The circuit proves private relationships; replay checks state; Bitcoin orders envelopes.","chapter":4,"kind":"recap","clicks":3,"seconds":50,"takeaway":"Shielded validity, privacy and BTC redemption have separate requirements.","refs":[["sb","§§14–20 · §22"]]},
  {"id":"questions","title":"Questions","subtitle":"Where would you try to cheat?","chapter":4,"kind":"questions","clicks":0,"seconds":15,"takeaway":"","refs":[["sb","Full paper"]]},
  {"id":"proof-details","title":"What is serialized in a Groth16 proof?","subtitle":"Three elliptic-curve points, with no note plaintext or Merkle path.","chapter":5,"kind":"proof-details","clicks":2,"seconds":0,"takeaway":"Knowledge soundness and zero knowledge are different guarantees; both rely on assumptions.","refs":[["groth","Construction"],["sb","§14 · A.1"]]},
  {"id":"circuit-audit","title":"How do we review the circuit?","subtitle":"Start with attacks. Find the check that must reject each one.","chapter":5,"kind":"circuit-audit","clicks":3,"seconds":0,"takeaway":"A passing proof cannot certify that the programmer included every required check.","refs":[["sb","A.1 · App. B"]]},
  {"id":"statement","title":"The public statement and private witness","subtitle":"Appendix B’s interface, with protocol field names.","chapter":5,"kind":"statement","clicks":2,"seconds":0,"takeaway":"Header, h_anchor and ct_out have no separate statement slots; h_body binds their bytes.","refs":[["sb","§14.2–14.3 · App. B"]]},
  {"id":"keys","title":"What each wallet key authorizes","subtitle":"Spending authority, incoming view and outgoing recovery use different key material.","chapter":5,"kind":"keys","clicks":3,"seconds":0,"takeaway":"A viewing key is broad access. A date restriction is not enforced by the key.","refs":[["sb","§6 · §7 · §16"]]},
  {"id":"bytes","title":"What does publication cost?","subtitle":"Reference figures from the paper, not a fee quote.","chapter":5,"kind":"bytes","clicks":2,"seconds":0,"takeaway":"The example uses two inputs and two outputs. The carrier adds overhead.","refs":[["sb","A.3–A.4"]]},
  {"id":"pipes","title":"Why doesn’t PIPEs finish the peg?","subtitle":"Releasing a key and controlling its future use are different problems.","chapter":5,"kind":"pipes","clicks":3,"seconds":0,"takeaway":"The witness-encryption construction is research. A complete peg needs additional rules.","refs":[["pipes","§1.1 · construction and limitations"],["sb","§22.3"]]},
  {"id":"faq","title":"Questions worth being ready for","subtitle":"Short answers here; the script adds detail and sources.","chapter":5,"kind":"faq","clicks":3,"seconds":0,"takeaway":"Recovery, privacy and validation each have their own assumptions.","refs":[["sb","§10 · §16 · §19 · §20 · §22"]]},
  {"id":"sources","title":"Further reading","subtitle":"Primary sources and the reference map are in SOURCES.md.","chapter":5,"kind":"sources","clicks":0,"seconds":0,"takeaway":"The labs illustrate the mechanisms. They do not implement the protocol.","refs":[["sb","Specification and scope"]]},
]
export const mainCount = slides.findIndex(s => s.chapter === 5)
export const totalSeconds = slides.slice(0, mainCount).reduce((n, s) => n + s.seconds, 0)

export const replayCases = [
  { name: 'Initial state', nullifiers: [], outputs: 0 },
  { name: 'A · valid payment', nullifiers: ['nf_A'], outputs: 2, anchor: 950, proof: true },
  { name: 'B · reused nullifier', nullifiers: ['nf_A'], outputs: 2, anchor: 950, proof: true },
  { name: 'C · bad proof', nullifiers: ['nf_B'], outputs: 2, anchor: 950, proof: false },
  { name: 'D · expired anchor', nullifiers: ['nf_C'], outputs: 2, anchor: 899, proof: true },
]
export function replayTo(step) {
  let leaves = 8
  const spent = new Set()
  const log = []
  for (const env of replayCases.slice(1, step + 1)) {
    const failed = env.anchor < 900 || env.anchor > 999 ? 2 : env.nullifiers.some(n => spent.has(n)) || new Set(env.nullifiers).size !== env.nullifiers.length ? 3 : !env.proof ? 4 : -1
    if (failed === -1) { leaves += env.outputs; env.nullifiers.forEach(n => spent.add(n)) }
    log.push({ ...env, failed, accepted: failed === -1 })
  }
  return { leaves, spent: [...spent], log, current: log.at(-1) }
}
export function privacyCandidates(step) {
  return Array.from({ length: 12 }, (_, i) => ({ i, reason: step >= 1 && i >= 8 ? 'After the anchor' : step >= 2 && [0, 1, 4, 7].includes(i) ? 'Known to observer' : step >= 3 && [2, 3, 6].includes(i) ? 'Outside correlation' : '' }))
}
