# Shielded Bitcoin

**[Open all presentations](https://kiocos.github.io/shielded-bitcoin/)** — four versions in English, each with its own permanent link.

All four versions can be published together on GitHub Pages, with a menu at the site root and a separate address for each deck. See **[Publishing all versions](site/README.md)**. Build with `npm run pages:build` and preview with `npm run pages:preview`.

New separate version: **[Shielded Bitcoin — from notes to a payment](shielded-bitcoin-v2/README.md)** — 34 slides, guided by the protocol teaching sequence of Mastering Zcash and specified by the Shielded Bitcoin paper. Start with the [new presenter script](shielded-bitcoin-v2/presenter-script.md). Run `npm run v2` and open http://localhost:3033. The original `npm run dev` and all earlier versions are preserved.

English BitDevs talk, without equations: **[Shielded Bitcoin — notes, proofs and replay](bitdevs-shielded/README.md)** — 25 minutes plus questions, 26 main slides, 8 Q&A slides and 2 prediction labs. Start with the [presenter script](bitdevs-shielded/presenter-script.md). Run `npm run bitdevs` and open http://localhost:3032.

Interactive course in English: **[From Zcash to Shielded Bitcoin](aula-zcash/README.md)** — 59 screens for self-paced study, with labs and explained answers. Run `npm run study` and open http://localhost:3031.

A 34-slide explanation of the September 2026 proposal: encrypted notes, nullifiers, proofs,
deterministic replay, wallet recovery and privacy limits. The talk distinguishes the specified
transfer layer from the unfinished peg, private-fee and deployment work.

Start with the **[presenter script](shielded-bitcoin-script.md)**: about 28–30 minutes at the stated
pace, with click cues, a shorter cut, Q&A preparation and a source map. The [Slidev deck](slides.md)
is its visual companion, with matching presenter notes.

```sh
npm install
npm run dev       # open the local URL; press p for presenter mode
npm run build
npm run export -- --format png --output /tmp/shielded-bitcoin-slides --wait 2500
```

Edit the spoken text and stage directions in the presenter script, then run `npm run notes:sync`.
Run `npm run notes:check` to check synchronization and click counts. Layout and illustration edits
belong in `slides.md` and `components/`. Add `--with-clicks` when exporting every build step.

Sources:

- [Shielded Bitcoin paper](https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf) — the transfer specification, assumptions and limitations.
- [Bitcoin PIPEs v2](https://eprint.iacr.org/2026/186) — the proposed direction for the peg; witness encryption remains research.
- [Bitcoin Core 30 release notes](https://bitcoincore.org/en/releases/30.0/#policy) — OP_RETURN relay policy.
- [CoinDesk, September 26, 2026](https://www.coindesk.com/tech/2026/09/26/bitcoin-could-soon-get-zcash-style-shielded-privacy-without-changing-its-rules) — attributed transfer-size and fee estimates.

The script's source map identifies the paper sections behind each part of the talk.

Interactive study: open [the complete course](lessons/index.html), or [resume the proof foundations](lessons/foundations.html).
All 26 core modules and both optional extensions have a primary HTML lesson. The collection contains
31 numbered lessons: those 28 primary pages plus three earlier overview exercises. Lessons use plain
English, a dark theme, primary-source links and immediate exercise feedback.

The course selector and previous/next links follow curriculum order. File numbers preserve creation
order. `curriculum.json` records each module’s primary lesson, suggested prerequisites and assessed
understanding separately from material availability.

The [protocol reference](reference/shielded-bitcoin-concept-map.html) and
[proof glossary](reference/proof-foundations.html) are printable. Goals, preferences and sources are in
`MISSION.md`, `NOTES.md` and `RESOURCES.md`. Learning records require actual learner evidence;
generating pages or clicking through exercises does not establish mastery. Exercise responses and
presentation drafts remain in the current page unless shared in chat.

New lesson content (0010–0031) is authored in `content/course-lessons.mjs`. The generator uses shared
components from `assets/` and produces individually self-contained HTML pages. Earlier pages remain
editable HTML sources with shared asset links. Run `node scripts/build-lessons.mjs` after editing
lesson content, assets or `curriculum.json`; it generates the new pages and rebuilds both self-contained
course collections. Open `lessons/index.html` locally without a server.
