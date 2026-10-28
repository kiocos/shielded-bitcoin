# Sources and scope

Sources were consulted on 27 October 2026. The deck explains the 24 September 2026 proposal. Comparisons describe mechanisms and trust models; they do not imply equal maturity or establish that a complete deployment has been audited.

## Main protocol

[Shielded Bitcoin: Private Transfers on the Bitcoin L1](https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf) — Clara Shikhelman, Mikhail Komarov and Aleksei Moskvin, 24 September 2026, 56 pages.

| Slides | Mechanism or claim | Paper reference |
|---|---|---|
| 1–3 | Public payment graph; Bitcoin publication versus replay | §§1–4, §15, A.1 |
| 4–5, A3 | Note contents, public record, tree membership and root | §5, §§8–9, App. B, blocks 1–2 |
| 6 | Derived spend markers and duplicate rejection | §9, §14.2, §15, App. B, block 4 |
| 7–9, A1/A3 | Private witness, public statement, proof and circuit keys | §§14.2–14.3, A.3, App. B |
| 10–11, A2 | Binding, authorization, output consistency and value preservation | §14.1, A3/A6, A.1, App. B |
| 12 | Alice to Bob; encryption and note discovery | §§10–12, §16, App. C |
| 13 | Body hash, complete-package binding and proof re-randomization | §13, §14.2, §19.5, App. B, block 8 |
| 14–16 | Replay order, eligible roots, duplicate markers and atomicity | §8, §15, A.6–A.7 |
| 17, A4 | Separate capabilities, recovery and indexer trust | §§6–7, §16, A11, §22.2 |
| 18–19 | Metadata, correlation and candidate set | §20, particularly §§20.3–20.7 |
| 20–21, A5/A6 | Peg boundary, publication, setup and profile choices | A3, A6, A.1, A.3–A.4, §22 |
| 24–25 | Public recovery history and architecture | §2, §16, §22 |
| A7 | Likely audience questions | §10, §16, §19, §20, §22, A11 |

Important distinctions preserved throughout:

- The SNARK’s private witness is not published. Bitcoin transaction witness data is a separate concept. Witness encryption is a separate mechanism again.
- The Alice-to-Bob walkthrough uses one input and two outputs. The 610-byte example uses two inputs and two outputs. The 625-vbyte figure is the output’s contribution, not the entire carrier transaction.
- Bitcoin does not verify the shielded proof. A carrier can confirm while its envelope is rejected with no shielded state effect.
- Nullifier uniqueness is a public replay check, not a private-set lookup proved inside the circuit.
- A Shielded Bitcoin leaf includes ciphertext and public creation context. It is not the simplified `H(v, r)` commitment used in some introductory ZK explanations.
- Ranges must prevent wraparound both for individual amounts and for accumulated sums.
- A6 assumes specific encryption properties. Choosing an arbitrary AEAD does not establish unique openings or key privacy.
- Binding ct_out bytes does not prove the truth of a derived report or automatically give the sender-recovery channel the same consistency relation as the recipient channel.
- The verifier derives the public root from correct history. Alice cannot establish validity by supplying an arbitrary root.
- Replay agreement assumes the same completed profile, starting state and chain prefix. A wallet that does not verify locally trusts its selected indexer.
- K_min = 1 is an acceptance minimum, separate from the wallet’s confirmation policy. Recovery also needs history, positions and any applicable bootstrap data.
- The OP_RETURN profile does not accept witness carriers as a local indexer preference. A different carrier requires a different shared profile.
- A.1 leaves concrete curves, hashes, encodings, gadgets and interfaces to an implementation specification. The deck does not assert that a complete audited circuit exists.

## Explaining proofs without equations

[On the Size of Pairing-based Non-interactive Arguments — Jens Groth](https://eprint.iacr.org/2016/260), §3, supports slides 8–9 and A1: circuit-specific proving and verifying keys, encoded proof points, public verification, knowledge soundness and zero knowledge.

The talk describes the mechanism in words: circuit constraints determine the relation; the prover combines private inputs, parameters and randomness; the verifier checks the proof against public inputs and the circuit’s verifying key. It does not derive the cryptographic security or treat the proof as an encrypted witness. The old Schnorr exercise, pairing equation, Sudoku grid and modular-arithmetic example have been removed from both the talk and appendix.

For concrete verifier code, see the [snarkjs Groth16 verifier](https://github.com/iden3/snarkjs/blob/master/src/groth16_verify.js). It is a general Groth16 reference, not a Shielded Bitcoin implementation. Verification includes point validity and a pairing check; it does not rerun the private computation using the witness.

The slides retain the paper’s field names and official terms. Ciphertext consistency uses the committing-encryption assumption; the input leaf includes public creation context; Merkle membership is checked against the root supplied by replay. The nullifier example uses named dummy values such as nf_A, not real cryptographic outputs. The amount-edit example changes a value from 100,000 sats to 1,000,000 sats to expose the failed constraint, without requiring a calculation.

## Landscape: primary sources

| Alternative | Source | Property used in the comparison |
|---|---|---|
| CoinJoin / Payjoin | [BIP 78](https://bips.dev/78/), Motivation and Design; Shielded Bitcoin §2 | Collaboration changes ownership heuristics; amounts and graph are not encrypted |
| Silent Payments | [BIP 352](https://bips.dev/352/), Abstract and Motivation | A reusable destination yields unique outputs; amounts and the graph remain public |
| Lightning | [BOLT 4](https://github.com/lightning/bolts/blob/master/04-onion-routing.md); [Lightning Labs: payments](https://docs.lightning.engineering/lightning-network-tools/lnd/payments) | Individual payments stay out of the global on-chain log; onion routing limits each hop’s view; custody depends on the wallet |
| Liquid | [Technical overview](https://docs.liquid.net/docs/technical-overview); [Elements: Confidential Transactions](https://elementsproject.org/features/confidential-transactions) | Confidential amounts and asset types, observable graph, sidechain and federated peg |
| Cashu | [Cashu](https://cashu.space/) | Blind-signature eCash with trust in the mint holding the backing |
| Fedimint | [User introduction](https://fedimint.org/users/intro/) | Community/federated custody, not unilateral BTC control by the token holder |
| Zcash Orchard | [ZIP 224](https://zips.z.cash/zip-0224); [protocol specification](https://zips.z.cash/protocol/protocol.pdf) | Its own network and asset, consensus validation, Halo 2 without trusted setup |
| Shielded CSV | [Paper 2025/068](https://eprint.iacr.org/2025/068), especially §6.2 | Client-side validation and retention of coin data; Bitcoin history alone does not recover that data |
| Bitcoin PIPEs v2 | [Paper 2026/186](https://eprint.iacr.org/2026/186), especially §1.1 | Witness-gated key release, not a persistent covenant or a complete production peg |
| Publication policy | [Bitcoin Core 30](https://bitcoincore.org/en/releases/30.0/#policy) | The relaxed datacarrier default is configurable policy, not consensus |

## What the labs demonstrate

Replay: the reducer applies envelopes only after the modeled checks pass. Proof verification is a simulated boolean result. The audience predicts acceptance or rejection. The cases cover acceptance, a reused nullifier, an invalid proof and an expired root reference. Only the first case changes state. This does not implement parsing, circuits, Groth16 or Bitcoin consensus.

Candidate set: 12 leaves → 8 under the anchor → 4 after external knowledge → 1 after further correlation. These exclusions are explicit assumptions of the example. They do not imply that a sender can track a note from its plaintext alone, and they do not measure entropy, people or the actual anonymity of a deployed network.
