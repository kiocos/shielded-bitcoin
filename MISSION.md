# Mission: Explain Shielded Bitcoin

## Why
Build a complete understanding of Shielded Bitcoin so the learner can explain it clearly in the presentation and handle audience questions accurately. Follow a coherent course from foundations through the full transfer lifecycle, wallet behavior, privacy, security and the proposed Bitcoin boundary. Individual questions guide emphasis within that course.

## Success looks like
- Explain statements, witnesses, P versus NP, zero knowledge and SNARKs in plain English, and connect each to the protocol
- Explain the full system and trace a transfer from wallet construction through publication, replay and receipt
- Explain why a hidden note cannot be spent twice, including both nullifier derivation and replay checks
- Say what a transfer proof proves and who verifies it
- Reconstruct the shared note tree, nullifier set and per-block roots from accepted transfers, and explain why indexers keep equivalent copies
- Explain a witness, witness encryption, and how PIPEs uses WE to control access to a Bitcoin signing key
- Explain what a covenant restricts and distinguish conditional key release from restrictions on transaction outputs
- Distinguish a small proof from the large WE ciphertext that encodes its verifier
- Separate the specified transfer protocol from proposed boundary mechanisms and research estimates
- Evaluate wallet recovery, disclosure, metadata leakage, failure scenarios and competing designs

## Constraints
- Use alloc init primary materials for protocol claims, supplemented by primary complexity and proof-system sources for prerequisites; cite the relevant sections
- Use short interactive HTML lessons with a dark theme
- Follow the complete curriculum in `curriculum.json`; make lessons available independently of assessment and adapt review to demonstrated understanding
- Use plain English that is easy to understand and accurate, introduce terms before notation, and avoid analogies
- Keep the existing slide deck and presenter script as presentation artifacts

## Out of scope
- No additional exclusions stated by the learner
