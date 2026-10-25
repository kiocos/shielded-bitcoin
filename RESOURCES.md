# Shielded Bitcoin Resources

## Knowledge

- [Shielded Bitcoin: Private Transfers on the Bitcoin L1](https://www.allocinit.xyz/posts/Shielded-Bitcoin-paper), Shikhelman, Komarov, and Moskvin, September 24, 2026
  Primary transfer specification, 56 pages, checked October 25, 2026. Use §§5 and 9 for notes and nullifiers, §14 and Appendix B for proofs, §15 and Appendix A.7 for replay, §17 for assumptions, §19.2 for double-spend resistance, and §§1.2 and 22 for the peg boundary. The local deck's existing source map is supplementary context, not evidence of learner mastery.
- [Bitcoin PIPEs v2: Covenants and ZKPs on Bitcoin via Witness Encryption](https://www.allocinit.xyz/posts/Bitcoin-PIPEs-v2-paper), Abdalla et al.
  Primary PIPE construction, 22 pages, checked October 25, 2026. Use §1.1 for its explicit limitation to witness-gated key release without persistent transaction binding, §2.5 for extractable witness encryption, §4 for encrypting a Schnorr key, setup consistency proof and proposed MPC setup, and §§5.3–5.4 for the SNARK verifier, modeled approximately 338 TB ciphertext, and heuristic security status. This does not specify a complete Shielded Bitcoin peg.
- [Witness Encryption from Arithmetic Affine Determinant Programs](https://www.allocinit.xyz/posts/AADP-WE-paper), Soukhanov et al.
  Primary candidate WE construction, 38 pages, checked October 25, 2026. Introduction explains why succinct witnesses alone do not solve verifier encoding costs; §4.10, page 35, gives v = 14,083, g = 14,371 and the size formula. The approximately 338 TB figure is a modeling result at the paper's selected parameters, not an end-to-end benchmark or universal lower bound. Units follow the paper's reported label.
- [alloc init research overview](https://www.allocinit.xyz/)
  Navigation and terminology for PIPEs, programmable security vaults and Shielded Bitcoin, checked October 25, 2026. Use the papers for security claims. The overview listed the vault whitepaper as coming soon when checked.

### Mathematical prerequisites

These supplement alloc init’s papers, which assume familiarity with proof systems. Checked October 25, 2026.

- [Stephen Cook, The P versus NP Problem](https://www.claymath.org/wp-content/uploads/2022/06/pvsnp.pdf)
  Official Clay problem description. Sections 1–2 define P, NP, checking relations, witness length and NP-completeness. Polynomial time concerns input-length growth, not guaranteed practical speed. Use the definitions, not its dated comments on experimental quantum computing.
- [Clay Mathematics Institute: P vs NP](https://www.claymath.org/millennium/p-vs-np/)
  Confirms that the equality question remains unsolved. A large brute-force search space is not a proof that every algorithm must be slow.
- [Justin Thaler, Proofs, Arguments, and Zero-Knowledge](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.pdf)
  Author’s manuscript. Sections 3.1–3.2 cover completeness, soundness and arguments; chapter 6 covers circuits; section 7.4 covers knowledge soundness; section 11.1 explains zero knowledge through simulation. Recommended reading is a short selected section, not the full book at once.
- [Jens Groth, On the Size of Pairing-based Non-interactive Arguments](https://eprint.iacr.org/2016/260)
  Original Groth16 research. Connects arithmetic-circuit checks to succinct, non-interactive, zero-knowledge arguments and a three-group-element proof. Distinguish the abstract construction from Shielded Bitcoin’s concrete 192-byte profile and setup choices.

### Bitcoin prerequisites and comparisons

- [Bitcoin Developer Guide: transactions](https://developer.bitcoin.org/devguide/transactions.html)
  Primary developer documentation for inputs, outputs, UTXOs, change and fees. Used for the public-ledger lesson; no claim that its older transaction-type examples describe every current Bitcoin spend.
- [BIP 78: PayJoin](https://bips.dev/78/)
  Original proposal describing collaborative payment construction and the ownership heuristics it challenges.
- [BIP 352: Silent Payments](https://bips.dev/352/)
  Original specification for derived one-time payment destinations, reusable address use and receiver scanning. Destination privacy is distinct from amount confidentiality.
- Source review for the complete course covered Shielded Bitcoin §§6–8, 10–16, 17–22 and Appendices A–D, and PIPEs §§1.1, 2.5, 4 and 5.3–5.4. The presentation exercises preserve the transfer/peg boundary, setup assumptions and modeled-cost qualifications.

## Wisdom (Communities)

No community recommendation yet. The current work is conceptual preparation for a presentation; no community preference has been stated.

## Gaps

- The transfer paper does not specify a complete peg-in/peg-out protocol
- The AADP WE candidate has heuristic security and a modeled cost estimate; a complete validated deployment is not established by these sources
- “Compression” is not a named finished PIPEs feature in the checked papers: distinguish succinct witnesses, smaller verifier constraint systems, and any future ciphertext representation improvements
- Companion blog links from the website failed to load through the research tool; the lessons rely on the papers
