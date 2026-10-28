# From Zcash to Shielded Bitcoin

A self-paced course in English: **59 screens, 6 labs, 4 checkpoints with explained answers and 6 rehearsal questions**. The three presentation decks and their scripts remain separate from this course.

From the project root:

```sh
npm run study
```

Open **http://localhost:3031**. Use the arrow keys or navigation buttons. Read the “Understand the connection” column; it scrolls independently when needed. The course does not require a presenter. Use “Check the sources” to open references for each screen.

“Index” searches concepts and jumps between chapters. “Reading” gathers the complete text, formulas, tables, checkpoint answers and references on a searchable page. “Print / save PDF” prints that reading view, not the interactive controls. Your last visited screen is saved locally and appears as “Resume” on the first screen. It does not record mastery or completion.

## Suggested sequence

| Session | Screens | Focus |
| --- | --- | --- |
| 1 · 30–45 min | 1–16 | UTXO, note, commitment, Merkle, nullifier, witness and circuit |
| 2 · 30–45 min | 17–37 | Orchard and the specific differences in Shielded Bitcoin |
| 3 · 30–45 min | 38–59 | Carrier, replay, recovery, privacy and explaining the paper |

These are suggested study sessions, not presentation durations. Pause at the labs and predict results before changing inputs.

## Labs

| Screen | Experiment | What is computed |
| --- | --- | --- |
| 7 | Commitment randomness | Real SHA-256 over a teaching serialization |
| 9 | Merkle path | Full hashes; result compared with the root |
| 11 | Spending identity | Teaching hash and duplicate detection |
| 15 | Balance constraints | Modular versus integer equality and ranges |
| 42 | Replay | Check order, anchors, duplicates and simulated atomic state mutation |
| 48 | Privacy candidates | Exclusions conditioned on explicitly supplied facts |

These models are not cryptographic implementations of Orchard or Shielded Bitcoin. They use no real keys and move no funds. The replay lab simulates parsing, binding and proof verification outcomes; window, uniqueness and state application rules execute in the browser. The circuit lab generates no ZK proofs. Hash labs use real SHA-256, but their constructions are teaching models.

## Sources and editing

The [source map](SOURCES.md) records the consulted versions and technical distinctions. References also appear beside each explanation.

Edit content in [course.mjs](course.mjs). Components and labs live in `components/`; the theme is in `study.css`. The deck and its notes are generated from the same source:

```sh
npm run study:generate
npm run study:build
```

The build goes into `aula-zcash/dist/` and can be served by an ordinary static HTTP server. The course shares dependencies installed at the project root. Fonts have local fallbacks; studying does not require a font CDN. External source links require internet access. Web Crypto in the labs requires localhost or HTTPS.

The published course uses `/study/`. The existing source directory and internal lesson IDs remain unchanged to preserve navigation and editing commands.

## Validation

The original Portuguese revision was checked across all 59 screens, all six labs, four checkpoints, both walkthroughs, search, navigation, resume, continuous reading and print output. The English revision passed all 59 screen layout checks and 31 functional checks, covering labs, quizzes, walkthroughs, search, navigation, resume, reading and printing. No browser errors or content overflows were found.

A standalone browser check is available for local development:

```sh
node aula-zcash/scripts/check-browser.mjs
```

It uses one Chromium instance, closes it in `finally` and saves evidence under `/tmp/zcash-study-qa`. In T3 Code, prefer the collaborative preview tools and follow their documented fallback conditions.
