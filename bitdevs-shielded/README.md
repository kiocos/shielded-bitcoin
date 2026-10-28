# Shielded Bitcoin — BitDevs

An English talk for 25 minutes plus questions, following one payment from Alice to Bob. It has 26 main slides, 8 optional Q&A slides and 2 prediction labs.

There are no equations or worked calculations to present, including in the appendix. The slides use the paper’s terminology and field names: note plaintext, ct_note, Merkle paths, nullifiers, h_body, public inputs and circuit-specific keys. The proof section identifies the inputs to generation and the actual verifier operations, without deriving equations. Circuit review, double-spend prevention, replay and the peg remain explicit.

Start with the [presenter script](presenter-script.md). The slides carry the visuals; the script supplies the explanation, click cues, transitions and answers.

- [Main talk — PDF](output/shielded-bitcoin-bitdevs.pdf)
- [Talk with Q&A slides — PDF](output/shielded-bitcoin-with-appendix.pdf)
- [Source map and accuracy notes](SOURCES.md)

From the project root:

```sh
npm run bitdevs         # http://localhost:3032
npm run bitdevs:check
npm run bitdevs:build
```

Use the arrow keys to reveal each step. Press `p` for presenter mode. Contents / appendix lets you jump to a topic and return. The final main slide has shortcuts to the optional answers.

## Running order

| Slides | Story |
|---|---|
| 1–3 | Alice wants privacy. Bitcoin publishes; replay validates. |
| 4–6 | Her note must exist, belong to her and not be spent twice. |
| 7–11 | What she publishes, what a proof does, and where cheating fails. |
| 12–16 | Bob decrypts his note, replay checks the envelope, and the audience predicts acceptance. |
| 17–21 | Recovery, privacy clues, the peg and publication trade-offs. |
| 22–26 | Alternatives, the payment recap and questions. |

The timing targets in `talk.mjs` total 25 minutes and include pauses and lab predictions. They are rehearsal estimates, not a measured runtime. Keep longer discussions for the Q&A slides.

Protocol terms are defined when introduced, then used consistently. Ciphertext consistency, leaf reconstruction, Merkle membership, nullifier derivation and replay uniqueness remain separate checks. The amount-tampering example changes an input value as data; it asks for no calculation. Typography uses regular-weight labels and headings, with color and spacing providing hierarchy.

## The labs

Accept or reject? A valid payment updates the state. A second spend, a bad proof and an expired anchor each fail at a different check. The accepted note history is shown visually. The audience does not calculate balances or block windows.

Which note could it have been? Remove impossible candidates as the observer learns more. Counts are displayed for feedback, but the question is which information narrows the set. The exclusions are hypothetical and are not a privacy score.

Both labs use Slidev’s click state. Buttons and arrow keys stay synchronized between presenter and audience and are preserved in exports. They do not implement or test Groth16 or the protocol’s security.

## Editing and exporting

Edit the script, then run:

```sh
npm run bitdevs:sync
npm run bitdevs:check
npm run bitdevs:build
npm run bitdevs:pdf
```

`slides.md` is generated. The generator checks every script section and its click cues. Edit `presenter-script.md` rather than generated notes. Slide data is in `talk.mjs`, diagrams in `components/TalkDiagram.vue`, the frame in `components/TalkSlide.vue`, and layout in `style.css`.

The main export contains slides 1–26. To include all Q&A material:

```sh
cd bitdevs-shielded
../node_modules/.bin/slidev export --output output/shielded-bitcoin-with-appendix.pdf --wait 1000
```

Add `--with-clicks` to export intermediate states. The canvas is 1200 × 675; diagrams use a fixed 1096 × 372 area. Reveals keep their geometry and respect reduced motion. The diagrams need no external services or APIs.

## Validation

With the server on port 3032, run `npm run bitdevs:qa`. It uses one headless browser and closes it on completion. In T3, try collaborative preview first and follow its documented fallback rules.

The checks cover every reveal, layout bounds, lab controls and resets, Q&A navigation, presenter notes and audience synchronization, plus 16:9 and 4:3 viewports. Screenshots and the report are saved under `/tmp/bitdevs-shielded-qa`. Export checks also cover page counts, titles, counters and revealed text.

The current revision was checked with T3’s collaborative browser: all 121 reveal states, both labs, navigation, presenter synchronization and two additional viewport sizes passed. Rendered headings and labels use regular weight. Both PDFs were checked for page counts, titles, counters and final reveal content.
