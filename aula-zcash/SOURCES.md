# Sources and technical decisions

Sources consulted on **27 October 2026**. This is an original teaching synthesis, not a translation of the article or an implementation of either protocol.

| Source | Version / sections used | Role in the course |
| --- | --- | --- |
| [Mastering Zcash — Maxime Desalle](https://maxdesalle.com/mastering-zcash/) | Article dated 12 Jan 2026, consulted 27 Oct 2026; §§3–4, 6.1–6.2 and 8.2 | Teaching sequence and identification of simplifications |
| [Zcash Protocol Specification](https://zips.z.cash/protocol/protocol.pdf) | v2026.7.0-344-g2bdf39 [NU6.2], 21 Oct 2026, 236 pages | Notes, keys, Action statement, receipt, signatures and balance |
| [ZIP 224](https://zips.z.cash/zip-0224) | Orchard proposal, Final status | Generational differences, Halo 2 and pools |
| [Orchard Book — Nullifiers](https://zcash.github.io/orchard/design/nullifiers.html) | Formula, note structure and rationale | Actual formula; roles of nk, ψ, ρ and cm |
| [Orchard Book — Commitments](https://zcash.github.io/orchard/design/commitments.html) | Commit, ShortCommit and HomomorphicCommit | Note versus value commitments |
| [Orchard Book — Commitment tree](https://zcash.github.io/orchard/design/commitment-tree.html) | Structure and anchors | Global tree, depth 32 and block boundaries |
| [Orchard Book — Actions](https://zcash.github.io/orchard/design/actions.html) | Design rationale | Actions, dummies and partial arity hiding |
| [Shielded Bitcoin](https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf) | Clara Shikhelman, Mikhail Komarov, Aleksei Moskvin; 24 Sep 2026; 56 pages | Transfer protocol, assumptions, profile and limits |
| [Bitcoin PIPEs v2](https://eprint.iacr.org/2026/186) | ePrint 2026/186 | Witness encryption, witness signatures and the proposed boundary |
| [Bitcoin Core 30.0](https://bitcoincore.org/en/releases/30.0/#policy) | Release notes, Policy | datacarriersize and policy versus consensus |
| [Stephen Cook — The P versus NP Problem](https://www.claymath.org/wp-content/uploads/2022/06/pvsnp.pdf) | §1, official Clay Mathematics Institute document | P, NP and checking relations |
| [Justin Thaler — Proofs, Arguments, and Zero-Knowledge](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.pdf) | Manuscript dated 18 Jul 2023; §§3.1–3.2, 7.4 and 11.1 | Arguments, knowledge and zero knowledge |
| [Bitcoin Developer Guide — Transactions](https://developer.bitcoin.org/devguide/transactions.html) | Inputs, outputs and change | Review of public UTXO payments |

## Distinctions to preserve

- The Orchard full viewing key is `(ak, nk, rivk)`. It derives nullifiers for known notes but excludes `ask`, which is required for spending authorization. See Zcash §3.1, §4.2.3 and §4.15.
- The Orchard nullifier is not simply `Hash(nk, rho, psi)`. Its formula includes the PRF, curve operations, `cm` and coordinate extraction. The Orchard Book describes the construction; the specification is normative.
- Orchard `cmx` is an extracted note commitment. A Shielded Bitcoin leaf derives from public ciphertext data, `h_body` and the output index. They are different objects.
- The note ciphertext encryption relation is part of Shielded Bitcoin validity. The Orchard Action statement does not enforce that complete relation. See Zcash §4.18.4 and §4.20.1; Shielded Bitcoin §14.1 and §16.3. This does not guarantee that any accepted output is recoverable by any wallet, or that the sender selected the address Bob intended to use.
- The logical statement in Shielded Bitcoin Appendix B includes `N` and `M`. `header`, `h_anchor` and `ct_out` are bound through `h_body`, without individual slots in that tuple.
- Replay checks nullifier uniqueness; the circuit checks derivation. State changes only after every check passes, in the A.7 order.
- The tree does not remove spent leaves. A reorganization can, however, remove the suffix of leaves and nullifiers originating in abandoned blocks.
- Alice’s example payment has one input and two outputs. The 610-byte estimate is for two inputs and two outputs. The 625 vB figure is the OP_RETURN output’s contribution, not the entire carrier.
- The witness template’s 438 vB spans two transactions. The OP_RETURN profile does not automatically accept this alternative carrier.
- `K_min = 1` is a replay rule. Confirmations, wallet construction depth and reorg tolerance are additional questions.
- The Shielded Bitcoin abstract broadly describes enforcement through PIPEs. The operational division is specified in §§1.2, 2, 15 and A.1: indexers verify transfers; the PIPEs direction concerns the peg boundary, outside this specification.
- The course does not claim that the peg is specified, that witness encryption is already practical, that all leaves have equal anonymity probabilities, or that Shielded Bitcoin disclosure keys are equivalent to the Orchard FVK.

## Notation and teaching scope

A generic `H` in a diagram means a hash function appropriate to that context, not that every protocol hash is identical. SHA-256 in the labs is an experimental choice. Example inputs, four-leaf trees, modulus 17 and numerical fees are teaching examples. Equations are identified as protocol formulas or models as appropriate.

P/NP is introduced only to explain a checkable relation and the term “NP statement” in PIPEs. The course does not rely on a claim that proof generation is NP-hard. The ZK proof and note ciphertext remain separate objects.
