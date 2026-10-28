# Shielded Bitcoin — from notes to a payment

A new, separate English presentation: **34 slides, 110 click cues and approximately 3,664 spoken words**. Allow roughly **27–31 minutes**, including short visual pauses, at 140–155 words per minute. This is a rehearsal estimate, not a measured delivery time.

Start with the **[presenter script](presenter-script.md)**. The slides are its visual companion, with synchronized presenter notes. The [source map](SOURCES.md) records claims, adaptation decisions and Q&A answers.

The teaching sequence is guided by the protocol sections of [Mastering Zcash](https://maxdesalle.com/mastering-zcash/). The technical specification is the [Shielded Bitcoin paper](https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf). The article’s philosophy, political commentary, history, economics and unrelated comparisons are omitted. Its protocol-specific details are not substituted for Shielded Bitcoin’s design.

## Open the new version

From the project root, with the existing dependencies installed:

```sh
npm run v2
```

Open **http://localhost:3033**. Press `p` for presenter mode and use the arrow keys for each reveal.

You can also run `npm run dev` from inside this folder. It uses the shared dependencies in the parent folder. If needed, install them with `npm install` at the project root.

The root **`npm run dev` still opens the original deck**. `npm run bitdevs` and `npm run study` still open their existing presentations. This folder has its own script, slide source, components, styles, assets and generated notes; it does not import components from those versions.

## Running order

| Slides | Explanation |
|---|---|
| 1–4 | A public payment, the checks privacy must preserve, and who performs them |
| 5–11 | Notes, public leaves, the tree, private membership, nullifiers and keys |
| 12–20 | Alice selects an input, chooses an anchor, constructs outputs, encrypts, binds and proves |
| 21–27 | Bitcoin publication, replay acceptance, Bob’s scan, independent verification and recovery |
| 28–31 | Metadata, the effective privacy set, publication cost and open deployment questions |
| 32–34 | The complete payment, takeaways and questions |

The same one-input/two-output payment runs through the wallet examples. The paper’s 610-byte envelope is a separately labeled two-input/two-output illustration. The ordinary Bitcoin opening includes a fee; the shielded transfer conserves note value exactly and pays its carrier fee separately.

## Editing and checks

Edit narration in `presenter-script.md`, then run from the project root:

```sh
npm run v2:sync
npm run v2:check
npm run v2:build
```

`slides.md` is generated from the script and `presentation.mjs`. The generator checks section order, IDs, titles and click counts. Visuals live in `components/`, with a fixed 871-pixel content width on a 980 × 551.25 canvas. Copied visual foundations belong to this version, so editing them here does not alter earlier decks.

The new diagrams explain output-derived leaves, private Merkle membership, encryption and recipient scanning. Repeated payment views keep their positions. Components take `$clicks` as a prop; reveal state is controlled by Slidev and survives stepping backward. Reduced-motion settings shorten decorative and reveal animations.

To export the final state of every slide:

```sh
npm run v2:pdf
```

The result is [output/shielded-bitcoin-v2.pdf](output/shielded-bitcoin-v2.pdf). This command uses Slidev’s `--per-slide` mode because the one-piece PDF export in the installed version truncated the document. For PNGs, run from this folder:

```sh
../node_modules/.bin/slidev export --format png --output /tmp/shielded-bitcoin-v2-png --wait 2500
```

Add `--with-clicks` for all reveal states. The wait permits the cover and replay animations to finish. Browser validation should use T3’s collaborative preview when available, with one task-owned tab and sequential checks. The animations illustrate the protocol; they do not implement its cryptography.

## Validation of this version

Checked on October 28, 2026:

- Production build and exact script/notes synchronization pass
- All 144 states pass content-boundary, image, icon and counter checks at 1280 × 800 and 1024 × 768
- All 34 final slide layouts were visually reviewed; a 1920 × 1080 viewport and system light mode were also sampled
- Keyboard advance/back restores the reveal state; presenter mode displays the matching narration and source links
- The final PDF has 34 pages with the expected titles and counters; all rendered PDF pages were visually reviewed
- Every pre-existing presentation file matches the preservation baseline; the root default command remains `slidev`

To repeat the browser checks in a task-owned T3 preview tab at the v2 dev URL, evaluate `import('/scripts/browser-audit.mjs').then(m => m.runBrowserAudit())`. It checks every reveal and restores the original route. The intentionally clipped cover background and moving anchor track are excluded from text-boundary checks.
