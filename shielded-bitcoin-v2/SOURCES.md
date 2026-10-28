# Sources and adaptation decisions

Protocol source: [Shielded Bitcoin: Private Transfers on the Bitcoin L1](https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf), Clara Shikhelman, Mikhail Komarov and Aleksei Moskvin, September 24, 2026, 56 pages. The PDF was retrieved and checked on October 28, 2026. Sections and appendices below refer to that copy.

Teaching reference: [Mastering Zcash](https://maxdesalle.com/mastering-zcash/), Maxime Desalle, especially §§3.3–3.6 and §4, retrieved October 28, 2026. Its contribution is the sequence: explain the validation problem, introduce the objects needed to solve it, then trace a payment through them. The presentation does not adapt the article’s philosophy, political commentary, economics, governance, history or comparisons with other projects. It does not treat the article as a technical specification of Shielded Bitcoin.

Tone and visual references: the original `../shielded-bitcoin-script.md` and `../slides.md`, plus `~/explaining-boltz/bitdevs/boltz-bitdevs-script.md` and the presentation design guidance in `~/explaining-boltz/CLAUDE.md`. The new script is original and uses direct explanation, minimal slide text, progressive reveals and fixed diagram positions.

## Claim map

| Slides | Mechanism or claim | Shielded Bitcoin source |
|---|---|---|
| 1–4 | Transfer-only scope, public Bitcoin data, validation requirements, wallet/Bitcoin/replay roles | §§1–4, §14.1, §15, A.1 |
| 5–7 | Note plaintext, derived rho/ephemeral key, ciphertext-derived leaf and creation context | §5, §9, §12, App. B blocks 1 and 5 |
| 8–9 | Append-only tree, per-block roots, private position and authentication path | §8, §14, §15, App. B block 2 |
| 10 | Nullifier derivation, uniqueness, secret/position binding | §9, §14.2, §19.2, App. B block 4 |
| 11 | Seed hierarchy, spend authority, read-only capabilities | §§6–7, §9 |
| 12–15 | Selection, destinations, anchor window, input reconstruction | §8, §10, §13, A.6, App. B blocks 1–4, C.2–C.5 |
| 16 | Recipient encryption and proof-enforced ciphertext consistency | §6, §12.1, App. B block 5 |
| 17 | Batched outgoing recovery, its binding and its limits | §12.2, §16.2, C.8 |
| 18–19 | Envelope fields, canonical body, h_body, proof-excluded hashing | §§11–14, A.3–A.5, App. B block 8 |
| 20 | Private witness, logical public statement, range and conservation constraints, Groth16 roles | §14, A.1, App. B |
| 21–23 | Carriers, deterministic acceptance order, atomic state mutation | §11, §15, A.4, A.7, C.11 |
| 24–27 | Detection, local consistency checks, reorgs, indexer trust and recovery | §7, §16, §17 A8/A11, §18 G1, §19.1/19.4, C.12 |
| 28–29 | Protected relations, exposed metadata, grouping and candidate-set limits | §20 |
| 30 | 610 B envelope, 625 vB OP_RETURN output, 438 vB witness transaction pair | A.4 |
| 31 | Peg boundary, setup assumptions, incomplete profile, private fees and light clients | §1.2, §17, §22, A.1 |
| 32–34 | Payment recap and reading directions | §10, §21, Apps. B–C |

## Differences that the adaptation preserves

| Topic | Shielded Bitcoin explanation used here |
|---|---|
| Validation | Bitcoin checks its carrier transaction; replay checks the transfer envelope above consensus |
| State | One tree of accepted output leaves, one spent-nullifier set and per-block roots reconstructed from a shared profile and initial inventory |
| Note format | Plaintext is `(v, d, rseed)`; rho and the ephemeral secret are derived from rseed |
| Leaf | Hashes published output bytes and creation context, including `h_body` and the creation output index |
| Two indices | `j` identifies an output within its creation transfer; `pos` is its later assigned global tree position |
| Encryption | The circuit proves ciphertext consistency with the output note used in conservation; this is essential, not optional wallet bookkeeping |
| Nullifier | Derived from `sk_nf`, rho and `pos`; `sk_nf` must itself be derived from `sk_spend` inside the circuit |
| Public inputs | Include the anchor root, input/output counts, nullifiers, output keys/ciphertexts and `h_body`; the serialized anchor height is body-bound and selects the root |
| Spending | Leaves are retained; replay inserts nullifiers and rejects duplicates, including duplicates inside one envelope |
| Fees | Shielded input value equals shielded output value exactly; the Bitcoin carrier pays the publication fee |
| Setup | Suggested Groth16 profile requires circuit-specific setup; no inference from Orchard’s different proof system |
| Recovery | Requires seed, history, profile and replayed positions; initial notes can require bootstrap recovery data |
| Privacy | Tree membership hides the selected path only when proved in zero knowledge; metadata and external knowledge can narrow the candidate set |
| Deployment | Peg, private fees, light clients and several concrete profile choices remain open in the paper |

## Examples and illustration conventions

- Payment amounts of 100,000 / 60,000 / 40,000 satoshis are invented teaching values. The public Bitcoin introduction instead shows 39,500 change and 500 fee. The difference is intentional and explained aloud.
- Alice’s payment has **one input and two outputs**. The envelope/cost illustration has **two inputs and two outputs**, matching A.4’s 610-byte example. The label stays visible on both envelope slides.
- The proof slot is shown while explaining the format, before proof generation. The spoken sequence explicitly finalizes the body, computes `h_body`, and only then generates the proof.
- The Merkle diagram has four leaves for readability. It is not a claim about the deployment’s tree depth. Hash strings are deterministic visual placeholders, not cryptographic calculations.
- Ownership colors, plaintext amounts and highlighted paths represent wallet knowledge. They do not claim these annotations are public.
- The privacy-set exclusions are hypothetical facts available to an observer. They are not inferred merely because the observer once sent those notes.
- The anchor animation compresses the suggested 100-block window into ten visible blocks. Root hashes in the root-history illustration match the displayed tree state.
- The envelope’s small leading field group is enlarged for labels. The complete Bitcoin carrier includes more than the envelope or its single OP_RETURN output.
- The 625 vB and 438 vB numbers describe different scopes. The cost slide and narration identify these scopes rather than presenting them as directly comparable complete payments.
- The core walkthrough has no production wallet, proof-speed claim, implementation benchmark, launch-date claim or assertion that a complete peg has been deployed.

## Useful answers during Q&A

**Does a confirmed Bitcoin transaction prove the shielded payment was accepted?** No. Replay may reject its envelope. Rejected data remains published, with no shielded state effect (§15).

**Can Alice tell when Bob spends the note she sent?** The plaintext alone is insufficient. Bob’s nullifier requires his nullifier secret. Alice’s outgoing recovery capability does not grant it (§9, §12.2, §16.2). Metadata could still support inference (§20).

**Can Bob spend with only his viewing key?** No. Viewing and spending are separate capabilities. The input authorization constraints require the appropriate spending key (§6, §9, App. B block 3).

**What if the setup was compromised?** Soundness can fail: false transfer statements may verify, including invalid value creation. The analysis assumes the relevant setup trapdoor was not retained (§17, §19, A.1).

**What if a wallet uses an indexer?** Local independent replay can detect inconsistent state. A wallet that does not verify locally is trusting the service’s response (§17 A11).

**What if a root expires or a reorganization changes it?** An expired envelope must be rebuilt against an eligible root. A reorganization requires replay of the changed chain prefix and may invalidate the former proof/path context (§8, §15, §19.1, A.6). This is distinct from losing the wallet seed.

**Can another proof encoding avoid the spent check?** A new proof encoding does not give the same input a new valid nullifier. Replay still rejects a repeated marker (§19).

**How do ordinary BTC become notes and come back out?** That boundary is outside this transfer paper. Its PIPEs v2 discussion is a research direction, not a peg protocol fully specified here (§1.2, §22).

**Why leave out extensions and competing systems?** This version concentrates on understanding a transfer. Atomic swaps, optional lineage, alternative privacy protocols and the broader PIPEs construction are outside that narrative; the earlier presentations remain available.
