# Shielded Bitcoin — handoff

Handoff from a previous agent session. Read all of this before changing anything.
Project root: `~/shielded-bitcoin` (not yet a git repo).

## What the user asked for

(Originally dictated by voice, cleaned up.)

1. A new folder `~/shielded-bitcoin` with a **Slidev** deck about **Shielded Bitcoin**, in the same
   style as the Boltz deck in `~/explaining-boltz/slidev` (Vue + UnoCSS + Iconify Phosphor icons,
   `v-click` / `$clicks`-driven animations, one evolving canvas per concept).
2. **No Boltz logo or branding.** Own colour scheme, **dark theme**, nice animations, illustrations.
3. The **most important deliverable is a `.md` presenter script** the user reads while presenting.
   The slides are its companion. Style must match `~/explaining-boltz/` (see
   `~/explaining-boltz/bitdevs/boltz-bitdevs-script.md` and `~/explaining-boltz/explaining-boltz.md`):
   direct, plain, clear, simple enough for everyone **without oversimplifying and without saying
   anything untrue**. **No analogies** (or almost none). No decorative/poetic writing.
4. Research the protocol from its whitepaper. The user said they would send links but never did;
   the sources below were found independently. If the user sends links later, check them against
   the deck.

## Status — updated 9 October 2026

Completed:
- `shielded-bitcoin-script.md`: the main deliverable, in English to match the deck/reference.
  34 timed sections, about 4,220 spoken words, 97 click cues, stage directions, a 23–24 minute
  cut plan, Q&A figures/answers, and a source/claim map. Full version: about 28–30 minutes at
  roughly 155 words/minute with short animation pauses; about 32 minutes at 140 words/minute.
- Spoken text and stage directions synchronized with all 34 slide notes. Edit the script first,
  then `npm run notes:sync`; `npm run notes:check` checks exact notes and declared click counts.
- PublicGraph SVG text sizes fixed using CSS, avoiding UnoCSS attributify's rem conversion.
- Page furniture moved from `global-top.vue` / `global-bottom.vue` to **`slide-top.vue` /
  `slide-bottom.vue`**. Per-slide context needs the per-slide layers; using it inside the global
  layers still repeats page 1 during export. The counter uses `$page`; the mark uses local
  frontmatter and stays hidden on the cover and section dividers.
- Root-history hashes now match the displayed tree root. The highlighted note remains position 2
  when switching to observer view, keeping its nullifier unchanged. The rejected duplicate is
  separate and disappears when showing only accepted state.
- `KeyTree` highlights only `sk_spend` as spending authority. `sk_nf` stays private but cannot
  authorise a spend by itself.
- Corrected/qualified narration about clustering, ciphertext consistency, confirmation depth,
  bootstrap recovery, private metadata, witness-carrier scope and Alice's one-input transfer.
- `README.md` has presentation commands and source links.
- `npm run build` and `npm run notes:check` pass. Final PNG export has 34 slides at
  `/tmp/sb-release-png`. All 34 print-context counters and sampled live counters verified.
  Visually reviewed all 34 final slide layouts, plus every click state of slides
  6, 8, 9, 11, 12, 14, 17, 19, 22, 23 and 27 in the live browser. No slide-content clipping found;
  background cipher lines and the moving block track intentionally extend inside clipped regions.

No Git repository or commit has been created. Do that only if the user asks.

## Resolved bugs and accuracy details

- SVG text must use CSS sizes, not `font-size="..."` attributes under attributify.
- Use `slide-top.vue` / `slide-bottom.vue`, not global layers, for per-slide furniture.
- Export with `--wait 2500` so the cover's shield, subtitle and credits finish appearing.
- The 610-byte size example is **two-input/two-output**. Alice's walkthrough is **one-input/two-output**.
- `ρ` and `sk_eph` are derived from `rseed`, not extra note-plaintext fields. Do not say they are
  "never transmitted": `sk_eph` is present inside the encrypted outgoing recovery batch.
- The envelope bar preserves relative field sizes except that its 12-byte header group is widened
  for label readability. Do not call the whole bar exactly to scale.
- The paper's Appendix B includes input/output counts in its logical public-input tuple. The body
  binding explanation uses header, anchor height and `ct_out` as fields without separate slots;
  do not assert that counts are absent from the logical statement.
- Replay agreement assumes the same completed profile, starting state/inventory and chain prefix.
  Seed recovery is described for published transfer history; the introduction separately mentions
  deployment-defined bootstrap recovery data for initial notes.
- Sender knowledge of a note's plaintext alone does not identify its nullifier. Slide 27's crosses
  illustrate exclusions justified by additional knowledge, not all notes an observer ever sent.
- `K_min = 1` is an acceptance rule, not a wallet finality guarantee. Both replay acceptance and the
  wallet's Bitcoin confirmation policy matter.

## Commands

```bash
cd ~/shielded-bitcoin
npm run dev                      # http://localhost:3030, press p for presenter mode
npx slidev build                 # must pass
npx slidev export --format png --output /tmp/sb-png --wait 2500   # final state of each slide
npx slidev export --format png --output /tmp/sb-png --with-clicks --wait 2500 # every click state
npm run qr                       # regenerate public/paper-qr.svg
```
macOS: there is no `timeout` command. Read the PNGs to check layout (they are 2× size).

## Sources (all claims must trace to these)

- **Paper:** "Shielded Bitcoin: Private Transfers on the Bitcoin L1" — Clara Shikhelman, Mikhail
  Komarov, Aleksei Moskvin, [alloc] init, 24 September 2026, 56 pages.
  https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf
  Extract text: `python3 -m venv /tmp/v && /tmp/v/bin/pip install pypdf` then read pages with
  `pypdf.PdfReader`. (A previous extraction may still exist at
  `/var/folders/b0/pt7f2pss6m17x1k_j184zjm80000gn/T/opencode/sb/paper.txt`.)
- **Bitcoin PIPEs v2** — Abdalla et al., [alloc] init, IACR ePrint 2026/186:
  https://eprint.iacr.org/2026/186 (witness encryption locks a Bitcoin key under an NP statement;
  a valid proof recovers it; output is an ordinary Schnorr signature; the concrete WE construction
  is presented as "a promising research direction").
- CoinDesk, 26 Sep 2026 (Komarov's ~700 vB estimate vs 100–200 vB for an ordinary payment, ≈4×
  fees; no launch date; criticism: trusted setup, no fee anonymisation, no peg mechanism):
  https://www.coindesk.com/tech/2026/09/26/bitcoin-could-soon-get-zcash-style-shielded-privacy-without-changing-its-rules
- Bitcoin Magazine announcement:
  https://bitcoinmagazine.com/technical/alloc-init-releases-shielded-bitcoin-proposal-for-private-bitcoin-transactions
- Blog (Notion, did not render for fetching):
  https://allocinit.notion.site/Shielded-Bitcoin-Private-Transfers-on-Bitcoin-L1-3e436974087f80f586acf2462bc547a5

## Technical facts — verified against the paper (do not "simplify" away)

- No consensus change, no new chain. Bitcoin only **publishes and orders** envelope bytes; it
  checks nothing about the transfer. **Indexers replay** accepted envelopes in Bitcoin order and
  verify proofs; any two correct implementations derive the same state (G1). No
  implementation-defined acceptance rule (A8).
- A **Bitcoin confirmation is not acceptance**: the carrier tx can confirm while replay rejects
  the envelope. Rejected envelopes remain visible on chain, with no state effect.
- **Note** plaintext = `(v, d, rseed)`: amount in sats, 11-byte diversifier, fresh randomness.
  `ρ` and `sk_eph` are derived from `rseed`; `pk_eph = [sk_eph]G_d`. On chain: `pk_eph` + `ct_note`.
  Leaf `ℓ = H_leaf(salt, h_body, j, pk_eph, ct_note, h_aux)` — computed by replay from public data.
- **Note tree** is append-only; **spent leaves are never removed**. Root stored per block `R[H]`;
  blocks with no transfers carry the root forward.
- **Nullifier** `nf = H_nf(sk_nf, ρ, pos)`. Same note → same nullifier → second spend rejected.
  `pos` in the hash avoids the Zerocash serial-number-reuse flaw. A nullifier cannot be linked to
  a leaf without wallet secrets. The *sender* of a note cannot compute it (needs recipient's sk_nf).
- **Proof** (Groth16 in the profile, ~192 B) proves: inputs in tree under `r_anchor`; spender
  authorised; nullifiers correct; ciphertexts encrypt the created notes; amounts in range;
  **Σin = Σout exactly**; bound to the envelope via `h_body`.
- **There is no fee inside a shielded transfer.** The Bitcoin fee is paid by the carrier
  transaction → fee-wallet linkage.
- **Envelope** (2-in/2-out): header 6 + anchor 4 + counts 2 + nf 64 + pk_eph 64 + ct_note 134
  (67/output) + ct_out 144 (2×64 + 16 tag) + π 192 = **610 bytes**; one OP_RETURN output = 625 vB.
  Witness carrier alternative: commit 154 vB + reveal 284 vB = 438 vB, two txs. OP_RETURN relies on
  **Bitcoin Core v30 relay policy** (datacarriersize default 83 → 100,000); policy, not consensus.
- **h_body** hashes the whole body except π and is a public input. Fields the proof does *not*
  take individually: header, h_anchor, **ct_out** — that is why the tamper animation edits
  ct_out. Groth16 re-randomisation: same nullifiers → rejected; only changes txid.
- **Replay order** (App. A.7): parse → body binding → anchor window → nullifiers → proof → apply.
  All-or-nothing.
- **Anchor window** `H−W ≤ h_anchor ≤ H−1`, **W = 100 (~16 h), K_min = 1**. Cannot anchor to H;
  a note cannot be spent in the block it was created. Expired anchor → rebuild, notes not lost.
  Wallets should anchor deeper for reorgs; unusual anchor ages fingerprint.
- **Keys**: seed (32 B) → sk_master → sk_spend → {sk_nf, vk_in → sk_view → pk_d}; sk_master →
  vk_out. sk_nf is derived from sk_spend *inside the circuit*. Viewing keys are read-only.
  **Do not claim diversified addresses are unlinkable** — the paper does not say so.
- **Disclosure**: IncomingView, OutgoingView, NoteOpening, DerivedReport. No global disclosure
  key. Raw viewing keys are broad (scope is policy, not crypto). Reports are assertions unless
  backed by openings.
- **Indexer trust**: can censor, serve stale data, report a wrong root — cannot make it match an
  independent replay. A wallet that neither replays nor verifies trusts its indexer (A11). Light
  client verification is future work.
- **Recovery**: seed + Bitcoin history → full wallet; needs replayed positions (own replay or
  trusted indexer). Contrast Shielded CSV: owner must retain client-side data.
- **Leakage**: visible = timing, arity (1→2 vs 2→1), anchor age, envelope size, carrier tx and fee
  funding, peg-in/out amounts and timing; co-recipients of one transfer share `h_body` → can tell
  they had the same sender. Privacy set ≤ leaves under anchor root, can collapse to 1. "Like Zcash
  and Monero, it preserves who paid whom and how much, not that a transfer happened."
  Network/mempool observation is out of scope.
- **Out of scope**: peg-in/peg-out (separate PIPEs v2 paper; the **non-custodial claim covers
  transfers only**), private fees (PIPE fee-vault direction), light clients, trusted setup (one
  ceremony per circuit/arity; security assumes nobody kept the trapdoor), standard arity.
- Extensions: `h_aux` reserved leaf slot (unused in this version) → atomic swaps with a Bitcoin
  HTLC; opt-in KYC lineage (App. D), indistinguishable from ordinary notes on chain.

Do **not** say: "no operators" (Bitcoin Magazine's wording, not the paper's); that Bitcoin
validates proofs; that peg-in/out is trustless or specified; that spent notes leave the tree; that
witness encryption is practical today.

## Deck design

- Palette (`uno.config.ts`): bg `#070912`, surface `#11142a`, violet `#a18cff`, violetlt
  `#cfc4ff`, cyan `#4cc9f0`, orange `#f7931a`, green `#46d9a0`, red `#ff6b81`, amber `#ffc24b`,
  pink `#f472b6`, body `#dde1f2`, muted `#8a90ae`. Fonts: Inter / JetBrains Mono.
- **Colour grammar, keep it consistent:** orange = Bitcoin · violet = shielded data (notes,
  ciphertexts, proof) · cyan = indexers/replay and read-only keys · green = accepted / hidden from
  observers · red = rejected / visible to observers · amber = Alice and spend-authority secrets ·
  pink = Bob.
- Shortcuts: `pane`, `pane-<color>`, `chip-<color>`, `eyebrow`, `sym` (mono protocol symbol).
- Layouts: `cover`; `section` dividers (gradient title, "part N" eyebrow, hides the top-right
  mark); `center` statement cards (need `class: text-center`); default content slides.
- Rules carried over from the Boltz deck (`~/explaining-boltz/CLAUDE.md` explains why):
  - Almost no text on slides; the notes carry the explanation.
  - Progressive reveal on every slide; nothing shifts position between clicks or between paired
    slides (fixed-size zones, opacity changes only).
  - Slidev mounts all slides at load → anything that must animate **on arrival** is a CSS
    keyframe animation, never a Vue transition keyed to mount.
  - Components do **not** use `v-click` internally; they take `clicks`/`step` props and use the
    global `reveal` + `reveal-off` classes (blur-in, same look as `v-click`, defined in
    `style.css`).
  - `Scramble.vue` animates hex only when its value changes (on a click), never on mount.
  - No blank lines inside deeply indented HTML in `slides.md` (markdown-it turns it into a code
    block).
  - Do not draw SVG lines with `stroke-dashoffset` + `vector-effect="non-scaling-stroke"`.
  - Components use **fixed-pixel geometry on the 871px content box** (980 − 2×3.4rem padding);
    if padding changes, everything must be re-derived.

## Slide map (34)

| # | Title | Clicks | Component / notes |
|---|---|---|---|
| 1 | Shielded Bitcoin (cover) | – | `ShieldMark`, `CipherRain` |
| 2 | Bitcoin's ledger is public | 3 | `PublicGraph` (SVG sizing fixed) |
| 3 | What exists today | 4 | markdown panes |
| 4 | Encrypted notes, published on Bitcoin | – | center card |
| 5 | part 1 · The model | – | section |
| 6 | Three roles | 6 | `ThreeRoles` (Bitcoin → indexers → wallets, then publish/read/state tokens) |
| 7 | A note | 4 | `NoteAnatomy` |
| 8 | The note tree | 3 | `NoteTree pane="roots"` |
| 9 | Spending publishes a nullifier | 4 | `NoteTree pane="nullifiers"` (derive, insert, double-spend rejected, observer view) |
| 10 | The proof | 6 | `ProofStatement` |
| 11 | The transfer envelope | 6 | `EnvelopeBar :step` (`transition: none` into 12) |
| 12 | Bound to the body | 3 | `EnvelopeBar full :bind` (tamper = ct_out) |
| 13 | part 2 · Replay | – | section |
| 14 | Every indexer runs the same checks | 4 | `ReplayPipeline` |
| 15 | Same blocks, same state | 4 | `IndexerAgreement` |
| 16 | Confirmed is not the same as accepted | – | center card |
| 17 | The anchor | 4 | `AnchorWindow` (draws 10 blocks for W=100; notes say so) |
| 18 | part 3 · Keys | – | section |
| 19 | One seed, separate capabilities | 6 | `KeyTree` |
| 20 | Disclosure is read-only | 5 | markdown panes |
| 21 | part 4 · One transfer | – | section |
| 22 | Alice pays Bob (building) | 5 | `TransferCanvas :step="$clicks"` (`transition: none` into 23) |
| 23 | Alice pays Bob (settling) | 3 | `TransferCanvas :step="5 + $clicks"` |
| 24 | Recovery from seed and history | 3 | markdown panes |
| 25 | part 5 · Privacy | – | section |
| 26 | What an observer sees | 3 | hidden vs visible panes |
| 27 | The privacy set | 3 | `NoteTree unknown :struck :candidates` + legend overlaid with negative margin (check layout) |
| 28 | Metadata that can still link you | 4 | rows: fees, shape, anchor age, shared h_body |
| 29 | part 6 · Open questions | – | section |
| 30 | Outside this paper | 5 | peg-in/out (red, full width), fees, light clients, trusted setup, cost |
| 31 | PIPEs, briefly | 4 | 4-step flow + research caveat |
| 32 | Extensions sketched in the paper | 2 | atomic swaps (h_aux), opt-in KYC lineage |
| 33 | What to take away | 3 | three numbered lines |
| 34 | Thank you! | – | QR to paper + sources |

Components: `BtcMark`, `CipherRain`, `ShieldMark`, `Scramble`, `PublicGraph`, `ThreeRoles`,
`NoteAnatomy`, `NoteTree`, `ProofStatement`, `EnvelopeBar`, `ReplayPipeline`,
`IndexerAgreement`, `AnchorWindow`, `KeyTree`, `TransferCanvas`. Each has a header comment
explaining its click sequence and geometry.

Layout risks to check in QA: `ThreeRoles` arrow endpoints and labels; `NoteTree` nullifier chip
travel positions; `TransferCanvas` token parking spots (overlaps with notes/labels);
`AnchorWindow` pins vs fixed labels; slide 27 legend overlay; slide 9 bottom chips; total height
of every slide ≤ ~469px of content.

## Q&A prep material (for the script)

Figures: 610-byte envelope breakdown above; 625 vB OP_RETURN output; 438 vB witness alternative;
W = 100 blocks ≈ 16 h, K_min = 1; Groth16 ≈ 192 B (Polymath ≈ 176, Pari ≈ 160 cited as
alternatives); seed 32 B; diversifier 11 B; Core v30 datacarriersize 83 → 100,000; ≈700 vB per
transfer, ≈4× fees (Komarov via CoinDesk).

Likely questions: Is it non-custodial? (transfers yes; peg not covered) · Who runs indexers, what
if they disagree? · Can the sender see when the recipient spends? (no, needs recipient's sk_nf) ·
What if the trusted setup was compromised? (false proofs could verify, e.g. unbalanced transfers)
· Reorgs? · Proof re-randomisation? · How is this different from Zcash (no own consensus;
validity outside Bitcoin consensus) and Shielded CSV (data availability)? · Why OP_RETURN, what
if relay policy tightens? · How do BTC get in? (PIPEs v2, research) · Fees and linkage.
Answer only from the paper; say "the paper does not specify this" where true.
