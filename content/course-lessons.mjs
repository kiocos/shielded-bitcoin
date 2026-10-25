const sb = (sections, page) => ({ title: `Shielded Bitcoin ${sections}`, url: `https://www.allocinit.xyz/posts/Shielded-Bitcoin-paper#page=${page}` })
const pipes = (sections, page) => ({ title: `PIPEs v2 ${sections}`, url: `https://www.allocinit.xyz/posts/Bitcoin-PIPEs-v2-paper#page=${page}` })

export const lessons = [
  {
    id: 'M01', number: 10, slug: 'bitcoin-public-ledger', title: 'Read a Bitcoin payment.',
    lede: 'Bitcoin records which outputs are spent and which new outputs are created. The amounts are public.',
    blocks: [
      ['A balance is a collection of outputs', `<p>A <strong>UTXO</strong> is an unspent transaction output: an amount of bitcoin with conditions for spending it. An ordinary payment consumes entire UTXOs and creates new outputs. The old output does not remain partly spent.</p><p>An input identifies an earlier output using its transaction identifier and output number. A signature commonly supplies spending authorization. The output’s spending conditions determine exactly what is required.</p>`],
      ['Payment, change and fee', `<p>Suppose Alice spends a 12,000-sat output. She creates 7,000 sats for Bob and 4,700 sats in change. The remaining <strong>300 sats are the Bitcoin fee</strong>. Change is an ordinary output back to Alice; the blockchain does not label it “change.”</p><div class="formula mono">12,000 = 7,000 + 4,700 + 300</div><p>An observer sees amounts, output scripts and links to earlier outputs. “That output belongs to Alice” requires additional information. Address clustering is an inference, not a name field written into every transaction.</p>`],
      ['Where Shielded Bitcoin changes the picture', `<p>A carrier transaction is still an ordinary Bitcoin transaction with visible funding and fees. It also publishes a shielded envelope. The private transfer inside that envelope has its own notes and validation rules. Its amounts balance exactly; its Bitcoin publication fee is paid outside the shielded balance.</p><p>A Bitcoin confirmation establishes inclusion in the chain. It does not establish that the envelope passes shielded replay.</p>`]
    ],
    lab: 'utxo',
    cases: [
      { prompt: 'An observer reads “7,000 sats” on the first output. What kind of information is that?', choices: ['Public fact', 'Ownership guess', 'Hidden information'], answer: 0, explanation: 'The output amount is directly visible in an ordinary Bitcoin transaction.' },
      { prompt: 'An observer calls the 4,700-sat output “Alice’s change” using its shape and timing alone. What is that?', choices: ['Public fact', 'Ownership guess', 'Hidden information'], answer: 1, explanation: 'The amount is public. Identifying its owner or purpose requires evidence beyond the bare output.' },
      { prompt: 'The carrier confirms, but its shielded proof is invalid. What happens to shielded state?', choices: ['State advances', 'State unchanged'], answer: 1, explanation: 'Replay rejects the envelope. Bitcoin inclusion and shielded acceptance are different events.' }
    ],
    recall: 'Explain the 12,000-sat example, including why the chain does not explicitly identify change.',
    sources: [{ title: 'Bitcoin Developer Guide: transactions', url: 'https://developer.bitcoin.org/devguide/transactions.html' }, sb('§§1, 11 and 15', 17)]
  },
  {
    id: 'M02', number: 11, slug: 'cryptographic-tools', title: 'Give each cryptographic tool one job.',
    lede: 'Hiding information, binding information and proving a rule are different tasks.',
    blocks: [
      ['Hashing and commitments', `<p>A <strong>hash function</strong> turns bytes into a fixed-size result. A cryptographic hash is designed to make it hard to find distinct inputs with the same result or recover a suitable input from a result. It is not encryption: there is no decryption key.</p><p>A bare hash does not necessarily hide its input. If the input is one of ten possible amounts, an observer can hash all ten and compare. A <strong>commitment</strong> binds someone to a value; a hiding commitment also conceals that value, usually using randomness. Binding and hiding are separate properties.</p>`],
      ['Encryption, signatures and proofs', `<dl><dt>Encryption</dt><dd>Protects a message so the intended key holder can recover it. The encrypted bytes are called ciphertext.</dd><dt>Digital signature</dt><dd>Lets someone verify authorization of a message using a public key. It does not conceal the message.</dd><dt>Zero-knowledge proof</dt><dd>Establishes a defined claim without disclosing the private evidence beyond what the public claim implies.</dd></dl>`],
      ['The same transfer uses several tools', `<p>Recipient ciphertexts carry private notes. Hashes bind envelope fields and tree structure. The proof connects private notes to public nullifiers, ciphertexts and a root. A Bitcoin signature authorizes the carrier’s spend.</p><p>None replaces all the others. An encrypted note can contain an invalid amount. A valid signature can authorize publication of an invalid envelope. Each verifier must check the rule that concerns it.</p>`]
    ],
    cases: [
      { prompt: 'Bob needs to recover a note while observers cannot read its plaintext. Which tool supplies that channel?', choices: ['Hash digest', 'Encrypted message', 'Digital signature', 'Validity proof'], answer: 1, explanation: 'Encryption provides recoverable confidentiality for the intended recipient.' },
      { prompt: 'An indexer needs evidence of a balanced private transfer. Which tool addresses that job?', choices: ['Hash digest', 'Encrypted message', 'Digital signature', 'Validity proof'], answer: 3, explanation: 'The transfer proof checks the balance relation together with the other constraints.' },
      { prompt: 'A Bitcoin key holder authorizes a specific carrier transaction. Which tool is used?', choices: ['Hash digest', 'Encrypted message', 'Digital signature', 'Validity proof'], answer: 2, explanation: 'The signature supplies authorization under Bitcoin’s spending rules, not shielded validity.' }
    ],
    recall: 'Explain why hashing a small secret amount does not by itself keep it private.',
    sources: [sb('§§3, 9, 12–14', 6), pipes('§§2.3–2.4', 8), { title: 'Thaler: commitments and proofs, chapters 11–12', url: 'https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.pdf#page=180' }]
  },
  {
    id: 'M04', number: 12, slug: 'notes-addresses-and-ciphertexts', title: 'Separate the note from what appears on Bitcoin.',
    lede: 'The private value record, its encrypted bytes and its tree leaf are three different objects.',
    blocks: [
      ['What a note contains', `<p>The note plaintext has three fields: <strong>v</strong>, its amount in sats; <strong>d</strong>, an identifier for a recipient receive path; and <strong>rseed</strong>, fresh randomness for this note.</p><div class="formula mono">note plaintext = (v, d, rseed)</div><p>The wallet derives other values from rseed, including the note-specific value used in its nullifier and an ephemeral encryption secret. “Ephemeral” means it belongs to this output’s encryption process; it is not the recipient’s spending key.</p>`],
      ['How Alice addresses Bob', `<p>Bob provides a payment address containing <code>d</code> and a public transmission key <code>pk_d</code>. Alice uses that address and fresh note randomness to encrypt the output. The envelope publishes an ephemeral public key <code>pk_eph</code> and recipient ciphertext <code>ct_note</code>.</p><p>Bob uses his viewing capability to detect and decrypt matching outputs. He checks that the recovered note agrees with the published ciphertext, public key and accepted leaf. The diversifier d identifies his receive path after decryption.</p>`],
      ['What goes into the tree', `<p>A <strong>leaf</strong> is a hash derived from public output data and binding fields, including the creation transfer’s body hash and the output’s index. An indexer can compute it without decrypting the note.</p><p>Knowing a note’s plaintext is not sufficient to spend it. Alice knows the note she created for Bob, but Bob’s spending secret is still needed. She also lacks Bob’s nullifier secret and therefore cannot simply recognize his later spend marker.</p>`]
    ],
    cases: [
      { prompt: 'Where is v, the output amount, in the recipient’s recovered record?', choices: ['Note plaintext', 'Public envelope', 'Nowhere stored'], answer: 0, explanation: 'v is inside the encrypted plaintext. Observers see ciphertext bytes, not an ordinary public amount field for this note.' },
      { prompt: 'Which item can an indexer compute without Bob’s viewing key?', choices: ['Private amount', 'Output leaf', 'Spend secret'], answer: 1, explanation: 'The leaf is derived from public envelope data. It is not the private note itself.' },
      { prompt: 'Alice knows the note she sent Bob. Can that knowledge alone authorize spending it?', choices: ['Yes, always', 'No, insufficient'], answer: 1, explanation: 'The proof also requires the spending authority associated with Bob’s receive key.' }
    ],
    recall: 'Describe what Alice creates, what Bitcoin carries, what the indexer stores and what Bob recovers.',
    sources: [sb('§§5–6, 9 and 12', 9)]
  },
  {
    id: 'M05', number: 13, slug: 'merkle-membership-and-growth', title: 'Prove that a leaf belongs to a tree.',
    lede: 'A Merkle root is one hash that binds the contents and arrangement of a tree.',
    blocks: [
      ['Build upward from the leaves', `<p>Start with four leaf positions. Hash the first two together, hash the next two together, then hash those results to obtain the root. The order matters. Changing a leaf changes the hashes above it, assuming the hash behaves securely.</p><p>A <strong>Merkle path</strong> provides the sibling at each level. Starting with one leaf and its position, you combine those siblings in the correct left/right order and recompute the root.</p>`],
      ['Growth means appending accepted outputs', `<p>New accepted output leaves fill the next positions. A fixed-depth implementation uses defined empty values for unused positions; adding a note need not add another level to the tree. The exact depth and empty-node rules belong to the completed profile.</p><p>Spending does not erase an old leaf. The tree records that outputs were created. The separate nullifier set records accepted spending. Membership alone cannot tell you that a note remains unspent.</p>`],
      ['One logical tree, replicated by indexers', `<p>For one protocol instance, all accepted output notes enter the same tree in replay order. Correct indexers reconstruct copies of that tree from the same profile, starting state and chain history. Their internal databases may differ; their accepted positions and roots must agree.</p><p>The transfer proof checks a private membership path under an allowed root. Observers see that a membership claim passed, without learning the selected leaf or path from the proof.</p>`]
    ],
    lab: 'merkle',
    cases: [
      { prompt: 'For leaf B in the four-leaf example, which siblings reconstruct the root?', choices: ['A, H(C,D)', 'C, H(A,B)', 'B, H(A,C)'], answer: 0, explanation: 'First combine A with B, then combine H(A,B) with the right subtree hash H(C,D).' },
      { prompt: 'Leaf B is spent. What happens to its existing tree position?', choices: ['It disappears', 'It remains', 'It moves'], answer: 1, explanation: 'The append-only tree keeps it. The accepted nullifier set prevents another spend.' },
      { prompt: 'Two indexers split this instance’s notes by customer. Are those separate customer trees the canonical state?', choices: ['Yes, automatically', 'No, incorrect'], answer: 1, explanation: 'Customer-specific indexes can be local conveniences, but canonical membership uses the shared protocol tree.' }
    ],
    recall: 'Explain why a membership proof needs sibling hashes and why it does not prove “unspent.”',
    sources: [sb('§§8–9 and Appendix B', 13)]
  },
  {
    id: 'M06', number: 14, slug: 'nullifiers-and-double-spends', title: 'Reject another spend without naming the input note.',
    lede: 'A nullifier is a public marker whose required value is tied to one note and its position.',
    blocks: [
      ['A fixed marker for the same input', `<p>When spending a note, the wallet derives its nullifier from its nullifier secret, a value derived from the note’s randomness, and the note’s canonical tree position.</p><div class="formula mono">nf = H_nf(sk_nf, ρ, pos)</div><p>The proof recomputes this relation. It also derives the nullifier secret from the spending secret, so the spender cannot choose an unrelated second secret just to obtain a fresh marker.</p>`],
      ['Two checks prevent two different attacks', `<p><strong>Repeat the same marker:</strong> replay finds it in the accepted nullifier set and rejects the new envelope. It also rejects repeated markers within one envelope.</p><p><strong>Invent a different marker:</strong> the marker may be absent from the set, but the transfer proof cannot establish the required derivation for that same input. Set membership and proof verification do different work.</p><p>Changing the carrier’s transaction identifier or using another valid anchor does not change the note’s required nullifier at its canonical position.</p>`],
      ['Why the public marker preserves privacy', `<p>Observers can detect a repeated marker without knowing which leaf produced it. The sender of a note cannot calculate the recipient’s marker from the sent plaintext alone; the recipient’s nullifier secret is needed.</p><p>The position distinguishes notes at different canonical positions. Following a chain reorganization, wallets must use the positions and spent state obtained from the surviving history, not stale local records.</p>`]
    ],
    cases: [
      { prompt: 'A second envelope repeats an already accepted nullifier. Assume its anchor is allowed. Which check rejects it first?', choices: ['Nullifier check', 'Transfer proof', 'Anchor check'], answer: 0, explanation: 'Replay checks accepted nullifiers before verifying the proof. It never applies this envelope.' },
      { prompt: 'A spender proposes a fresh but incorrect nullifier for the same input. It passes the public set check. What must fail?', choices: ['Nullifier check', 'Transfer proof', 'Anchor check'], answer: 1, explanation: 'The proof enforces the derivation from the actual note, spending lineage and position.' },
      { prompt: 'The first spend is removed by a reorganization. Is its marker still necessarily in current accepted state?', choices: ['Yes, permanently', 'No, replay'], answer: 1, explanation: 'Replay follows the active chain. A removed spend has no effect unless it is accepted again in the surviving history.' }
    ],
    recall: 'Explain separately why repeating a nullifier fails and why choosing a different one fails.',
    sources: [sb('§9, §19.2 and Appendix B', 15)]
  },
  {
    id: 'M07', number: 15, slug: 'transfer-proof-and-replay-checks', title: 'Say exactly what the transfer proof proves.',
    lede: 'The proof establishes a relationship between private wallet data and the public envelope.',
    blocks: [
      ['Inputs, outputs and the connecting rules', `<p>For inputs, the proof checks membership under the anchor root, the spender’s authority and the required nullifier derivation. For outputs, it checks that the ciphertexts encrypt the notes described in the witness.</p><p>All amounts must be in range. The total input value must equal the total output value <strong>exactly</strong>. The carrier pays the Bitcoin fee separately. The proof is bound to the canonical transfer body, so it cannot simply be attached to altered body data.</p>`],
      ['What stays private and what is public', `<p>The witness contains note plaintexts, spending secrets and membership paths. Public inputs include the anchor root, nullifiers, relevant output data and the body binding. The exact logical tuple and encoding are specified by the circuit and profile.</p><p>A proof checks the defined constraints. If the circuit forgot an essential rule, a mathematically valid proof would not add that missing rule. This is why the statement itself must be examined, not just the proof system’s name.</p>`],
      ['What replay must still check', `<p>Replay selects the root for the anchor height, checks that the height is allowed, checks public nullifier uniqueness and verifies the proof under the correct key. It also parses the envelope and recomputes its binding hash.</p><p>A valid proof does not establish that the current accepted nullifier set is empty for those inputs. That is a separate replay check. Nor does a valid private transfer prove that a complete BTC withdrawal mechanism exists.</p>`]
    ],
    cases: [
      { prompt: 'The output amounts exceed the input amounts. Which part must reject this attempted transfer?', choices: ['Transfer proof', 'Replay rule', 'Neither check'], answer: 0, explanation: 'The conservation constraint cannot be satisfied by those amounts.' },
      { prompt: 'A valid proof uses an anchor that has become too old at inclusion. Where is that rejected?', choices: ['Transfer proof', 'Replay rule', 'Neither check'], answer: 1, explanation: 'Anchor admissibility depends on the block in which replay processes the envelope.' },
      { prompt: 'A transfer discloses timing through its carrier. Does that alone violate a transfer-validity rule?', choices: ['Transfer proof', 'Replay rule', 'Neither check'], answer: 2, explanation: 'Timing leakage is part of the privacy model. A valid transfer is not a promise of no metadata.' }
    ],
    recall: 'Name three private-witness constraints and two public replay checks without merging their responsibilities.',
    sources: [sb('§§14–15, Appendices A.7 and B', 22)]
  },
  {
    id: 'M08', number: 16, slug: 'alice-pays-bob', title: 'Follow one payment from wallet to accepted state.',
    lede: 'Alice spends a 10,000-sat note, sends 6,000 to Bob and creates 4,000 in change.',
    blocks: [
      ['Start with an existing spendable note', `<p>Assume entry into the system has already happened. Alice’s wallet knows an accepted note, its position and the secrets needed to spend it. Bob gives her a shielded address. This example demonstrates a transfer; it does not supply the missing peg specification.</p><p>Alice synchronizes with current replayed state, checks spent status and selects an allowed anchor containing her input. She obtains the input’s membership path under that root.</p>`],
      ['Fix the transfer before making its proof', `<p>Alice creates Bob’s output and her change output with fresh randomness. She derives the input nullifier, encrypts the notes and constructs the outgoing recovery record. These fields determine the canonical body and its binding hash.</p><p>Only then does she produce a proof for that exact body and selected root. The public shape is one input and two outputs. Observers do not learn these three private amounts from the proof.</p>`],
      ['Publication, acceptance and receipt', `<p>A Bitcoin carrier publishes the envelope and pays its own fee. Inclusion lets indexers process it in Bitcoin order. If every replay check passes, the input nullifier is inserted and the two output leaves receive positions.</p><p>Bob can detect the output using his viewing capability and verify the recovered record against accepted state. Decryption by itself is not acceptance. Spending the new note requires a later allowed anchor containing it; the base rule does not allow same-block spending. Wallet confirmation policy may require additional depth.</p>`]
    ],
    sequence: [
      ['Synchronize and select', 'Choose a spendable input, allowed anchor and matching path.'],
      ['Construct output data', 'Create payment and change, derive the nullifier, and encrypt output and recovery data.'],
      ['Bind the body', 'Fix the canonical fields and compute their body hash.'],
      ['Generate the proof', 'Prove the constraints for those public inputs using Alice’s private witness.'],
      ['Publish on Bitcoin', 'Submit the carrier and obtain inclusion in the chain.'],
      ['Apply accepted replay', 'After every check passes, add the nullifier and output leaves.']
    ],
    cases: [
      { prompt: 'Bob decrypts a pending envelope before it has been accepted. Can he treat this as an accepted note?', choices: ['Yes, immediately', 'No, wait'], answer: 1, explanation: 'Detection can happen early, but acceptance and a canonical position must come from replay.' },
      { prompt: 'Alice changes Bob’s encrypted output after producing the proof. What must she do?', choices: ['Reuse unchanged', 'Rebuild consistently'], answer: 1, explanation: 'The body, binding hash and proof must agree. A substantive body change requires a new consistent construction.' }
    ],
    recall: 'Narrate the payment in one minute and identify the point at which shared state changes.',
    sources: [sb('§10 and Appendix C', 48)]
  },
  {
    id: 'M09', number: 17, slug: 'envelope-carrier-and-binding', title: 'Separate the envelope from its Bitcoin carrier.',
    lede: 'One describes a shielded transfer. The other publishes bytes under Bitcoin’s rules.',
    blocks: [
      ['The envelope’s contents', `<p>The body contains a header, anchor height, input/output counts, input nullifiers, output ephemeral public keys, recipient ciphertexts and an outgoing recovery ciphertext. The proof accompanies that body.</p><p>The binding value <code>h_body</code> hashes the canonical body, excluding the proof itself. A verifier recomputes it. The proof must be bound to the resulting public statement.</p><p>Consider <code>ct_out</code>, the sender’s encrypted recovery record. It is covered by the body binding even though it is not checked as a separate private-note encryption relation. Altering it while keeping the old proof breaks that binding.</p>`],
      ['Count the same object before comparing sizes', `<div class="table-wrap"><table><thead><tr><th>Object in the example profile</th><th>Size</th></tr></thead><tbody><tr><td>Two-input, two-output envelope</td><td>610 bytes</td></tr><tr><td>OP_RETURN output carrying that envelope</td><td>625 virtual bytes</td></tr><tr><td>Example witness carrier, commit + reveal</td><td>154 + 284 = 438 virtual bytes</td></tr></tbody></table></div><p>The 625 figure is an output, not a whole carrier transaction. The witness alternative uses two transactions and witness discounting. Bytes and virtual bytes measure different things: fee weight gives witness data a discount.</p><p>The 610-byte example is two inputs and two outputs. Do not reuse it as the exact size of Alice’s one-input walkthrough.</p>`],
      ['Policy and consensus are different', `<p>The paper’s OP_RETURN route depends on the relay policy it discusses for Bitcoin Core v30. Relay policy concerns which transactions nodes normally forward and miners commonly select. Consensus concerns whether a block is valid. A relay policy change is not automatically a consensus change.</p><p>The carrier fee remains publicly funded, creating a possible link to the publisher. The transfer’s private input/output balance does not subtract this fee.</p>`]
    ],
    cases: [
      { prompt: 'An attacker edits ct_out and attaches the old proof. Which response describes replay?', choices: ['Accept altered', 'Reject altered'], answer: 1, explanation: 'The recomputed body binding differs. The old proof is not valid for the altered public statement.' },
      { prompt: 'Someone calls 625 vB the complete size of every carrier transaction. Is that correct?', choices: ['Correct comparison', 'Different objects'], answer: 1, explanation: '625 vB is the example OP_RETURN output. A carrier also has its own inputs and other transaction overhead.' },
      { prompt: 'Someone re-randomizes a proof but keeps its same already-used nullifiers. Can replay accept another spend?', choices: ['Yes, refreshed', 'No, repeated'], answer: 1, explanation: 'Proof re-randomization does not give the same input a new valid nullifier.' }
    ],
    recall: 'Explain what a 610-byte envelope, a 625-vB output and a 438-vB carrier construction each measure.',
    sources: [sb('§§11, 13, 22.1 and Appendix A', 17)]
  },
  {
    id: 'M10', number: 18, slug: 'replay-and-indexer-trust', title: 'Reconstruct the same state independently.',
    lede: 'Indexers follow shared rules over ordered Bitcoin history. They do not vote on shielded validity.',
    blocks: [
      ['Four parts of shared state', `<dl><dt>Note tree</dt><dd>Accepted output leaves, appended in canonical order.</dd><dt>Nullifier set</dt><dd>Markers from accepted input spends.</dd><dt>Root history</dt><dd>The tree root after each retained block, including unchanged roots for blocks with no accepted transfers.</dd><dt>Accepted transfer history</dt><dd>The accepted envelopes in replay order.</dd></dl>`],
      ['The acceptance pipeline', `<div class="formula">Parse → body binding → anchor window → nullifiers → proof → apply</div><p>An envelope changes state only if every check passes. Invalid data can remain on Bitcoin with no effect on this state. Replay never appends outputs from a transfer and only afterward decides whether to reject its proof.</p><p>Roots used as anchors are recorded after the whole block, not after each envelope. Within a block, accepted nullifiers still update immediately, so a later envelope cannot spend an already-consumed input again.</p>`],
      ['What an indexer can and cannot make you believe', `<p>Given the same completed profile, valid initial state and inventory, and active chain prefix, correct implementations derive the same result. Their storage layouts can differ.</p><p>A service can omit information, return stale data or report an incorrect root. Independent correct replay exposes the disagreement. A wallet that simply accepts the service’s claims trusts it for those claims. The paper does not provide a finished light-client verification design.</p>`]
    ],
    lab: 'replay',
    cases: [
      { prompt: 'An envelope has a bad proof but two well-formed ciphertexts. What happens to the tree?', choices: ['Append both', 'Append neither'], answer: 1, explanation: 'Acceptance is all-or-nothing. Well-formed output bytes do not rescue an invalid transfer.' },
      { prompt: 'Two services disagree about a root. Does majority vote decide the canonical result?', choices: ['Yes, majority', 'No, replay'], answer: 1, explanation: 'Check the profile, starting state and chain prefix, then replay the rules. Indexer voting is not part of the protocol.' },
      { prompt: 'A block contains no accepted shielded transfers. What root does its history entry have?', choices: ['Previous root', 'Missing root', 'Random root'], answer: 0, explanation: 'The tree did not change, so the previous block’s root carries forward.' }
    ],
    recall: 'List the four state components and explain why matching Bitcoin histories alone are insufficient if profiles differ.',
    sources: [sb('§§8, 15, A11 and Appendix A.7', 13)]
  },
  {
    id: 'M11', number: 19, slug: 'anchors-and-reorganizations', title: 'Use a recent root without chasing every new leaf.',
    lede: 'An anchor selects a prior block’s tree root. Its admissibility is checked when the envelope is replayed.',
    blocks: [
      ['A bounded window of earlier roots', `<p>For replay in block H, the example profile permits anchor heights from <code>H − 100</code> through <code>H − 1</code>, inclusive. The window W is 100 blocks and the minimum depth is one block.</p><p>At H = 400, heights 300 through 399 are allowed. Height 400 is too new; height 299 is too old. An input created in block 400 cannot be spent in that same block because none of the allowed roots contains it.</p>`],
      ['An old root does not restore an old balance', `<p>The proof uses the selected root for membership, but replay uses the <strong>current</strong> accepted nullifier set. An old root that contains a now-spent note does not make that note spendable again.</p><p>If publication is delayed until the anchor expires, the wallet must synchronize and rebuild against an allowed root. Expiration rejects that envelope; it does not erase an otherwise valid input note.</p>`],
      ['What a chain reorganization changes', `<p>A reorganization replaces part of Bitcoin history. Replay rolls back the removed blocks and processes the surviving branch. Output positions, accepted nullifiers and roots can change. A proof for a removed or changed root may no longer verify against current state.</p><p>The one-block rule is an acceptance parameter, not a finality guarantee. Wallets may require deeper anchors and additional confirmations. Deeper choices reduce some reorganization exposure but do not make reorganization impossible.</p>`]
    ],
    lab: 'anchor',
    cases: [
      { prompt: 'A note is in an allowed old root, but its nullifier is already accepted in current state. Is it spendable?', choices: ['Yes, anchored', 'No, spent'], answer: 1, explanation: 'The live nullifier check rejects the repeated spend even though membership is valid.' },
      { prompt: 'A pending envelope’s anchor expires. Does that alone destroy its input note?', choices: ['Yes, destroyed', 'No, rebuild'], answer: 1, explanation: 'Resynchronize and rebuild if the input still exists and is unspent in active state.' },
      { prompt: 'The wallet wants greater reorganization protection than K_min = 1. Can its policy wait longer?', choices: ['Yes, locally', 'No, forbidden'], answer: 0, explanation: 'A stricter wallet confirmation policy can coexist with the network’s common acceptance rule.' }
    ],
    recall: 'At H = 501, state the inclusive allowed range, then explain why it cannot override spent status.',
    sources: [sb('§§8, 15, 19.1 and Appendix A.6', 13)]
  },
  {
    id: 'M12', number: 20, slug: 'wallet-keys-and-capabilities', title: 'Separate permission to spend from permission to read.',
    lede: 'One seed derives several capabilities. Sharing a child capability does not mean sharing all of them.',
    blocks: [
      ['Read the derivation from parent to child', `<div class="key-path"><div>Wallet seed → master secret</div><div>Master → spending secret → nullifier secret</div><div>Spending secret → incoming viewing key → receive keys</div><div>Master → outgoing recovery key</div></div><p>The profile uses fixed derivation rules and different labels for different jobs. The public payment address contains a diversifier and a transmission public key; it does not contain the spending secret.</p>`],
      ['What each capability permits', `<div class="table-wrap"><table><thead><tr><th>Capability</th><th>What it supplies</th></tr></thead><tbody><tr><td>Spending secret</td><td>Authority needed by the transfer circuit; derives incoming and nullifier capabilities.</td></tr><tr><td>Nullifier secret</td><td>Derives markers when combined with note data and positions. It cannot authorize a spend alone.</td></tr><tr><td>Incoming viewing key</td><td>Detects and decrypts matching received outputs. It does not identify their later spends by itself.</td></tr><tr><td>Outgoing recovery key</td><td>Recovers sender records from ct_out. It does not identify the private input notes consumed.</td></tr><tr><td>Seed or master secret</td><td>Root access to the wallet’s derived capabilities.</td></tr></tbody></table></div>`],
      ['Two disclosure mistakes to avoid', `<p>A nullifier secret is not an ordinary viewing key and should not be included in the paper’s read-only disclosure packages. Although it cannot spend alone, it enables sensitive spend-linking when combined with the corresponding note data.</p><p>A raw viewing key has broad reach over matching history. Asking its holder to inspect only one month does not cryptographically limit it to that month. Also, the paper’s diversified addresses should not be described as automatically unlinkable under every observation model.</p>`]
    ],
    cases: [
      { prompt: 'An auditor receives only the incoming viewing key. Can it authorize a spend?', choices: ['Yes, spending', 'No, viewing'], answer: 1, explanation: 'Incoming viewing is read-only. It does not reveal the spending secret through the intended derivation.' },
      { prompt: 'A sender knows the recipient note plaintext. What extra private capability is needed to derive that recipient’s nullifier?', choices: ['Outgoing recovery', 'Nullifier secret', 'Public address'], answer: 1, explanation: 'The recipient’s nullifier secret is required along with the note-derived value and canonical position.' },
      { prompt: 'Someone has the nullifier secret, note and position, but no spending secret. Does that alone authorize spending?', choices: ['Yes, sufficient', 'No, insufficient'], answer: 1, explanation: 'The spending circuit requires the spending lineage, not just a correct marker.' }
    ],
    recall: 'Explain what is lost when a viewing key leaks and how that differs from losing the spending secret.',
    sources: [sb('§§6–7 and Appendix B', 10)]
  },
  {
    id: 'M13', number: 21, slug: 'wallet-recovery', title: 'Recover the wallet from keys and accepted history.',
    lede: 'The seed regenerates capabilities. History supplies the encrypted records and replay supplies their positions.',
    blocks: [
      ['Recovery has several steps', `<p>First derive the wallet capabilities from the seed. Scan published history for incoming outputs and outgoing recovery records. Decrypt matching records and check that their contents agree with accepted envelope data.</p><p>Then obtain canonical positions and tree information through replay or an indexer. Derive the wallet’s nullifiers and compare them with accepted spent state. A recovered plaintext by itself does not tell you that the note is accepted or unspent.</p>`],
      ['Work out a recovered balance', `<p>In this teaching example, every amount below is visible to the recovering wallet. Assume no additional notes and all surviving anchors needed for spending are available.</p><div class="table-wrap"><table><thead><tr><th>Recovered record</th><th>Value</th><th>Accepted state</th></tr></thead><tbody><tr><td>A</td><td>8,000 sats</td><td>Accepted, nullifier already used</td></tr><tr><td>B</td><td>5,000 sats</td><td>Accepted, nullifier unused</td></tr><tr><td>C, change</td><td>2,000 sats</td><td>Accepted, nullifier unused</td></tr><tr><td>D</td><td>9,000 sats</td><td>Decrypted from a rejected envelope</td></tr></tbody></table></div><p>The balance includes B and C: <strong>7,000 sats</strong>. A was spent. D never became an accepted note. Adding every decrypted value would give a false balance.</p>`],
      ['What “seed and history” assumes', `<p>The seed cannot recreate missing blockchain data or tell you the canonical position without processing state. A wallet using an indexer without independent checks trusts its state answers. Notes supplied at activation may also need deployment-defined bootstrap recovery data.</p><p>The design publishes transfer data on Bitcoin so recovery need not depend on a sender handing over a private transfer-history file. This is a data-availability distinction from client-side validation, not a guarantee that scanning is free or instantaneous.</p>`]
    ],
    cases: [
      { prompt: 'Which records in the table contribute to the current balance?', choices: ['A and B', 'B and C', 'C and D'], answer: 1, explanation: 'B and C are accepted and unspent. Decryptability alone is not enough.' },
      { prompt: 'You have a note plaintext but no verified position or accepted-state information. Is recovery complete?', choices: ['Yes, complete', 'No, incomplete'], answer: 1, explanation: 'Position and accepted spent status are needed to construct a correct spending witness.' },
      { prompt: 'A trusted indexer reports D as accepted, while your independent replay rejects it. Which state follows the protocol?', choices: ['Indexer assertion', 'Correct replay'], answer: 1, explanation: 'The state follows deterministic acceptance rules, not a service’s unverified statement.' }
    ],
    recall: 'Explain why seed recovery requires history, positions and nullifier checks, not just successful decryption.',
    sources: [sb('§§1.1, 16 and Appendix C.12', 23)]
  },
  {
    id: 'M14', number: 22, slug: 'privacy-and-public-metadata', title: 'Separate hidden contents from observable behavior.',
    lede: 'A private proof can protect its witness while the surrounding transaction still gives an observer useful clues.',
    blocks: [
      ['What the observer gets', `<p>Public data includes nullifiers, ciphertexts, input/output counts, the anchor height, envelope size, carrier transaction and publication timing. Fee funding can connect publication to a known Bitcoin wallet. Entry and exit can expose amounts and timing at the boundary.</p><p>The transfer proof does not reveal the private amounts or identify the input leaves. But hiding a field is not a guarantee that all outside evidence becomes useless.</p>`],
      ['The root gives an upper bound, not a privacy score', `<p>Input leaves must occur under the chosen anchor root. That bounds the initial candidates. Additional knowledge can rule some out, and candidates need not be equally likely.</p><p>Imagine four leaves A, B, C and D. If D was created after the anchor, it cannot be this input. If the observer owns A and knows they did not authorize this spend, that can exclude A under the stated ownership assumptions. B and C remain candidates. The root alone did not provide a uniform “four-person anonymity set.”</p><p>Knowing a note’s plaintext because you sent it is different: that alone does not reveal its recipient-derived nullifier.</p>`],
      ['Several clues can reinforce each other', `<p>A distinctive two-input payment, unusually old anchor and reused fee source can form a recognizable pattern. Outputs in the same envelope share its body binding; co-recipients can recognize that they received outputs from the same transfer, without learning every private amount.</p><p>The paper separates chain-visible leakage from network and mempool observation, which need further analysis. Its zero-knowledge proof does not conceal the network origin of a broadcast.</p>`]
    ],
    cases: [
      { prompt: 'An observer reads the input/output count from an envelope. What does that tell them?', choices: ['Transfer shape', 'Private amounts', 'Input identities'], answer: 0, explanation: 'Arity reveals shape. By itself it does not identify the private amounts or the spent leaves.' },
      { prompt: 'An observer knows only the plaintext of a note they sent. Can they directly compute the recipient’s later nullifier?', choices: ['Yes, directly', 'No, insufficient'], answer: 1, explanation: 'They still need the recipient’s nullifier secret and the canonical position.' },
      { prompt: 'After the stated exclusions in the four-leaf example, which leaves remain candidates?', choices: ['A and B', 'B and C', 'C and D'], answer: 1, explanation: 'A is excluded by the specified ownership knowledge and D by anchor timing. This still does not assign equal probabilities to B and C.' }
    ],
    recall: 'Give one hidden field, one directly visible field and one inference that requires outside evidence.',
    sources: [sb('§20 and §22.3', 31)]
  },
  {
    id: 'M15', number: 23, slug: 'disclosure-and-audit-evidence', title: 'Disclose enough to support a specific claim.',
    lede: 'Read access, a selected opening and a complete balance proof are different things.',
    blocks: [
      ['Four disclosure choices', `<dl><dt>IncomingView</dt><dd>A viewing capability for detecting and decrypting matching received outputs.</dd><dt>OutgoingView</dt><dd>A recovery capability for sender records. It does not identify the consumed input notes.</dd><dt>NoteOpening</dt><dd>Selected data allowing a verifier to check a particular note or output against accepted history.</dd><dt>DerivedReport</dt><dd>A bounded statement with supporting evidence the auditor can recompute.</dd></dl>`],
      ['Scope is part of the question', `<p>Fix a replay height and ask exactly what is being checked: one received payment, a set of outgoing payments, or a balance. An opening can support a statement about that object. It does not automatically prove that no other notes exist.</p><p>A wallet-generated report is an assertion unless its supporting evidence establishes the requested claim. Receipt history alone does not prove current unspent balance: later spends are not exposed by an incoming viewing key alone.</p>`],
      ['Read-only can still reveal too much', `<p>Raw viewing keys work on matching accessible history beyond the period an auditor was asked to inspect. A policy saying “only read September” is not a cryptographic restriction on a raw key. Selective openings can reveal less when the audit is local.</p><p>The defined disclosure materials exclude the wallet seed, spending secret and nullifier secret. No global disclosure key exists, and the read-only modes do not authorize spending. A proper claim must still distinguish proof of received data, ownership and completeness.</p>`]
    ],
    cases: [
      { prompt: 'An auditor only needs to check one accepted output. Which choice is usually the narrowest starting point?', choices: ['Incoming view', 'Outgoing view', 'Note opening'], answer: 2, explanation: 'Open the specific object with the accepted-state evidence needed for the claim instead of giving broad history access.' },
      { prompt: 'An auditor needs independently recoverable sender records for a broad history review. Which capability matches that job?', choices: ['Incoming view', 'Outgoing view', 'Note opening'], answer: 1, explanation: 'OutgoingView uses the sender recovery channel, while still not identifying the transfer’s private input notes.' },
      { prompt: 'A report lists only two notes and says “this is my complete balance,” without evidence of completeness. How should the claim be treated?', choices: ['Proven complete', 'Unsupported assertion'], answer: 1, explanation: 'Listed openings can substantiate those notes. They do not establish that the list is complete or that all listed notes remain unspent.' }
    ],
    recall: 'Explain why restricting an audit’s stated scope does not restrict the cryptographic reach of a raw viewing key.',
    sources: [sb('§7', 11)]
  },
  {
    id: 'M16', number: 24, slug: 'covenants-and-key-release', title: 'Ask what a spending rule actually restricts.',
    lede: 'A covenant constrains how a coin may be spent, for example by restricting the next transaction’s outputs.',
    blocks: [
      ['Authorization and transaction restrictions', `<p>A signature can show that a key holder authorized a transaction. A covenant-like condition can additionally require the transaction to have specified properties. For example: “this output may only be spent into a transaction paying this destination.”</p><p>This example describes a desired rule. It does not assert that arbitrary output restrictions are available as ordinary Bitcoin script operations today. Different proposals pursue different enforcement mechanisms.</p>`],
      ['Follow the key after the condition is met', `<p>Now imagine an ordinary signing key encrypted behind a condition. Once someone satisfies the condition, they recover the key. If the key itself can sign any message, that person can choose a different transaction afterward.</p><p>The condition controlled <strong>key release</strong>. It did not, by itself, permanently bind every later signature to one approved destination or transaction template. A complete design must explain how any continuing restriction is enforced.</p>`],
      ['How this applies to PIPEs v2', `<p>PIPEs aims to obtain ordinary Bitcoin signatures through conditional access to encrypted key material. Bitcoin can then verify its usual signature rather than executing the higher-level proof logic.</p><p>The paper explicitly limits the construction’s guarantee to witness-gated key release. A recovered key can sign arbitrary messages. Calling the primitive “covenant-like” should not hide that limitation or imply a complete withdrawal policy has already been specified.</p>`]
    ],
    cases: [
      { prompt: 'A key is released after a proof, then can sign any transaction. Which property is directly supplied?', choices: ['Conditional release', 'Transaction restriction'], answer: 0, explanation: 'The cryptographic condition controls recovery of the key, not every future use of it.' },
      { prompt: 'A verifier rejects a spend unless its outputs match the required destination. Which property is being enforced?', choices: ['Conditional release', 'Transaction restriction'], answer: 1, explanation: 'That rule restricts the transaction itself. This is stronger than merely releasing an unconstrained key.' },
      { prompt: 'Does an ordinary valid Bitcoin signature reveal whether an external PIPE proof was checked by Bitcoin?', choices: ['Yes, directly', 'No, separately'], answer: 1, explanation: 'Bitcoin checks its ordinary transaction and signature rules. The external condition is enforced by the proposed cryptographic construction.' }
    ],
    recall: 'Give one example of a destination restriction, then explain why releasing a normal key alone does not enforce it.',
    sources: [pipes('§§1.1–1.3 and 4', 3)]
  },
  {
    id: 'M17', number: 25, slug: 'witness-encryption-in-detail', title: 'Encrypt for a condition instead of a named recipient.',
    lede: 'Witness encryption uses a statement for encryption and satisfying evidence for decryption.',
    blocks: [
      ['Name the three objects', `<p><strong>The message</strong> is what you want to keep secret. <strong>The statement</strong> describes a condition. <strong>The witness</strong> is data that passes that condition’s check.</p><p>The encryption algorithm takes the public statement and message. The decryption algorithm uses a satisfying witness to recover the message. The encryptor need not have the witness in order to encrypt.</p><div class="formula">Encrypt(statement, message) → ciphertext<br>Decrypt(ciphertext, satisfying witness) → message</div>`],
      ['An example of the interface', `<p>Use the earlier statement “some selection from 3, 6, 11, 15, 22, 29 totals 31.” The selection 3, 6, 22 is a witness. In a WE construction for that relation, it would enable recovery of the encrypted message.</p><p>This tiny example is easy to solve, so it supplies no useful secrecy. It explains the interface. A browser that runs an if-statement and then displays a hidden string is not implementing witness encryption: anyone can inspect its code.</p>`],
      ['A proof can itself be the witness', `<p>Suppose the chosen condition is “this SNARK proof verifies for these public inputs and this verification key.” The witness for that condition is the proof. It is a different object from the private witness used to produce the proof.</p><p>Anyone possessing a qualifying WE witness can use it. Decryption does not depend on the name of the person who found it. If an application publishes the qualifying proof, its design must account for others being able to use it.</p>`],
      ['The security assumption matters', `<p>PIPEs requires an <strong>extractable-security</strong> form of WE: roughly, learning protected message information should require possessing the necessary witness. Basic WE definitions and stronger guarantees should not be treated as interchangeable.</p><p>The candidate construction in these papers is a research proposal with heuristic security and high modeled costs. The conceptual interface is much simpler than a practical implementation.</p>`]
    ],
    cases: [
      { prompt: 'Must the encryptor already possess a satisfying witness to encrypt under a public statement?', choices: ['Yes, required', 'No, unnecessary'], answer: 1, explanation: 'Encryption uses the statement and message. A satisfying witness is used for decryption.' },
      { prompt: 'The WE condition is “Verify(public inputs, proof) accepts.” Which object is the WE witness?', choices: ['Signing key', 'SNARK proof', 'Bitcoin address'], answer: 1, explanation: 'The proof is evidence for this verification condition. The encrypted signing key is the message.' },
      { prompt: 'Someone copies a valid WE witness published by another person. Does their different identity prevent decryption by itself?', choices: ['Yes, identity', 'No, evidence'], answer: 1, explanation: 'The decryption condition concerns the witness, not the social identity of its holder.' }
    ],
    recall: 'Describe the message, statement and witness in both the number example and the proposed Bitcoin-key example.',
    sources: [pipes('§2.5 and §5.3', 10)]
  },
  {
    id: 'M18', number: 26, slug: 'pipes-and-the-peg-boundary', title: 'Trace a PIPE from setup to a Bitcoin signature.',
    lede: 'The proposed mechanism makes a signing key recoverable under a condition. A complete BTC peg needs additional rules.',
    blocks: [
      ['Set up the encrypted key', `<p>The construction generates signing key material and encrypts the secret key under a chosen statement using WE. It publishes the corresponding public key and encrypted material. A setup consistency proof establishes that the encrypted key matches that public key and the prescribed construction.</p><p>That proof does not show that nobody retained the secret key. Someone who already knows it can bypass the intended decryption route. The paper discusses multiparty setup to address this trust issue; the setup assumptions still need to be stated.</p>`],
      ['Recover, sign, verify', `<div class="flow"><div><strong>Satisfy condition</strong><small>Supply a qualifying witness</small></div><span aria-hidden="true">→</span><div><strong>Recover key</strong><small>Use WE decryption</small></div><span aria-hidden="true">→</span><div><strong>Sign transaction</strong><small>Bitcoin checks its normal rules</small></div></div><p>A condition may be expressed through acceptance of a SNARK proof. This does not make Bitcoin a SNARK verifier. It receives an ordinary signature, and the released key is not inherently restricted to one transaction afterward.</p>`],
      ['A primitive is not the complete peg', `<p><strong>Peg-in</strong> connects committed Bitcoin value to spendable shielded notes. <strong>Peg-out</strong> connects a valid exit from those notes to ordinary Bitcoin ownership. The transfer paper leaves both outside its specification.</p><p>A full design must state how entry notes are issued, how duplicate exits are prevented, how withdrawal conditions bind the intended payout, what chain state is authoritative, how reorganizations are handled, and which setup parties could bypass the intended path.</p><p>Do not answer those questions by assuming the transfer proof already covers them. The transfer proof, PIPE condition proof and PIPE setup proof have distinct statements and verifiers.</p>`]
    ],
    cases: [
      { prompt: 'Which proof checks that an encrypted signing key corresponds to the published public key?', choices: ['Transfer proof', 'Condition proof', 'Setup proof'], answer: 2, explanation: 'The setup consistency proof concerns the construction of the encrypted key, not a private transfer’s balance.' },
      { prompt: 'The setup operator secretly kept the Bitcoin signing key. Does a valid setup consistency proof alone stop bypass spending?', choices: ['Yes, prevents', 'No, insufficient'], answer: 1, explanation: 'Consistency of encryption does not prove erasure of a retained key.' },
      { prompt: 'The transfer proof is valid. Does the transfer paper thereby specify the correct Bitcoin withdrawal destination?', choices: ['Yes, specified', 'No, separate'], answer: 1, explanation: 'Peg rules are separate. The base transfer statement is not an automatic withdrawal authorization.' }
    ],
    recall: 'Name the three proof roles and one unresolved rule needed for a complete peg.',
    sources: [pipes('§§1.1, 4 and 5.3–5.4', 12), sb('§1.2 and §22', 4)]
  },
  {
    id: 'M20', number: 27, slug: 'security-assumptions-and-failures', title: 'Connect each assumption to the guarantee it supports.',
    lede: '“Secure” is too broad to explain what happens when one component fails.',
    blocks: [
      ['Validity and privacy are separate guarantees', `<p><strong>Proof soundness</strong> prevents invalid transfers from passing the proof check under its assumptions. If it fails, an attacker might prove amounts that do not balance or spend without the required authority.</p><p><strong>Zero knowledge</strong> protects the private witness from extra disclosure through the proof. A privacy failure does not necessarily mean every balance check stops working. Conversely, a validity failure need not be described as automatic decryption of all historical notes.</p>`],
      ['Setup, encryption and hashes', `<p>The Groth16 profile needs correctly generated parameters with the secret setup material destroyed. Retained setup secrets can undermine soundness. Public verification does not remove that setup assumption.</p><p>Hash security supports binding of bodies, leaves and paths. Encryption must meet the paper’s confidentiality, integrity and recipient-privacy requirements. The recipient channel must also bind its key and note opening: the same ciphertext should not validly open as different notes under different keys. An arbitrary encryption library is not automatically a suitable implementation.</p>`],
      ['Local compromise and bad state answers', `<p>A stolen spending secret threatens the associated notes directly. A leaked viewing key threatens the privacy of matching history but does not grant spending authority by itself. A dishonest indexer can mislead a wallet that trusts its answers, while correct independent replay still defines state.</p><p>Bitcoin history and the agreed starting state are also inputs to the guarantees. Reorganizations require replay and wallet resynchronization. Data publication is useful only when the needed history is available to the recovering participant.</p>`],
      ['The boundary adds assumptions', `<p>A PIPE deployment would additionally depend on its WE construction, setup and application-specific rules. The candidate WE security analysis is heuristic; its large size estimate is not a report of a finished production system. Keep these assumptions separate from the transfer layer’s checks.</p>`]
    ],
    cases: [
      { prompt: 'A raw incoming viewing key is leaked, but spending keys remain secret. What is the direct consequence described by that capability?', choices: ['Reading exposure', 'Spending authority', 'Consensus failure'], answer: 0, explanation: 'The holder can detect and decrypt matching incoming history. It does not gain spending authority from that key alone.' },
      { prompt: 'A compromised proof setup lets invalid balance proofs verify. Which guarantee is directly threatened?', choices: ['Transfer validity', 'Network anonymity', 'Block availability'], answer: 0, explanation: 'This is a soundness failure: invalid private state transitions could appear to satisfy the proof.' },
      { prompt: 'A server returns a fabricated root, and the wallet performs no independent validation. What describes the remaining dependency?', choices: ['Server trust', 'Miner voting', 'Key erasure'], answer: 0, explanation: 'The wallet trusts the server’s state answer. Independent replay is the way to check the claimed state under the specification.' }
    ],
    recall: 'Compare a leaked viewing key, a stolen spending key and a compromised setup without calling them the same failure.',
    sources: [sb('§§17–19 and Appendix A.1', 26), pipes('§5.4', 17)]
  },
  {
    id: 'M21', number: 28, slug: 'tradeoffs-and-open-work', title: 'Compare designs by what they validate and reveal.',
    lede: 'Different privacy systems solve different parts of the problem. Their tradeoffs need more than one ranking.',
    blocks: [
      ['Use a few concrete comparison questions', `<p>Where is validity checked? What information is public? Which data must the recipient keep? What extra assumptions or boundary mechanisms are needed? These questions give a more useful comparison than “which is most private?”</p><div class="table-wrap"><table class="comparison-table"><thead><tr><th>Approach</th><th>Useful distinction</th><th>Limit to remember</th></tr></thead><tbody><tr><td>CoinJoin / PayJoin</td><td>Collaborative transactions make common ownership heuristics less reliable.</td><td>Ordinary Bitcoin amounts and transaction structure remain public.</td></tr><tr><td>Silent Payments</td><td>Senders derive one-time destinations from a reusable address without publishing that address as the destination.</td><td>This does not hide the ordinary output amount; recipients need scanning.</td></tr><tr><td>Zcash shielded transfers</td><td>Shielded validity is part of its own chain’s consensus.</td><td>It is not Bitcoin consensus validating a Shielded Bitcoin envelope.</td></tr><tr><td>Monero, in the paper’s comparison</td><td>A separate chain using its own mechanisms for sender, recipient and amount privacy.</td><td>Its design should not be described as the same note-and-SNARK system.</td></tr><tr><td>Shielded CSV</td><td>Client-side validation makes retained private transfer data part of the model.</td><td>Recovery has different data-availability requirements.</td></tr><tr><td>Shielded Bitcoin proposal</td><td>Published envelopes support replay of a shared private-transfer state.</td><td>Replay validates transfers; peg, metadata, setup and deployment choices still matter.</td></tr></tbody></table></div>`],
      ['Costs belong to different objects', `<p>A transfer proof, transfer envelope, carrier transaction and WE ciphertext have different roles and sizes. The approximately 192-byte proof does not imply a 192-byte payment. The modeled WE ciphertext around 338 TB is not added to every ordinary shielded transfer envelope.</p><p>Common input/output shapes could reduce distinguishing patterns, but arity also affects ciphertext counts, circuits and setup choices. A small proof does not remove wallet proving cost or indexer replay cost.</p>`],
      ['What a deployable system still needs', `<p>The papers leave work on the full peg, private fee funding, light-client verification, concrete interoperable profile choices, network privacy and the practical WE construction. Describe each claimed benefit together with its scope.</p><p>For presentation claims, distinguish a specified rule, an assumption, a modeled estimate and an open design task. “The paper proposes” is different evidence from “a deployment measured.”</p>`]
    ],
    cases: [
      { prompt: '“The candidate WE ciphertext is about 338 TB at the selected parameters.” What kind of claim is that?', choices: ['Specified rule', 'Modeled estimate', 'Deployment measurement'], answer: 1, explanation: 'The papers provide a model and selected parameters, not a universal size bound or end-to-end deployment benchmark.' },
      { prompt: '“Rejected envelopes do not change replayed state.” What kind of claim is that?', choices: ['Specified rule', 'Modeled estimate', 'Deployment measurement'], answer: 0, explanation: 'This is part of the transfer acceptance semantics.' },
      { prompt: 'Does a reusable Silent Payments address make the ordinary Bitcoin output amount confidential?', choices: ['Yes, hidden', 'No, public'], answer: 1, explanation: 'Destination unlinkability and amount confidentiality are separate properties.' }
    ],
    recall: 'Compare Shielded Bitcoin with one ordinary Bitcoin privacy technique and one system with its own consensus.',
    sources: [sb('§§2 and 22', 4), { title: 'BIP 78: PayJoin', url: 'https://bips.dev/78/' }, { title: 'BIP 352: Silent Payments', url: 'https://bips.dev/352/' }, pipes('§§5.3–5.4', 17)]
  },
  {
    id: 'M22', number: 29, slug: 'presentation-and-questions', title: 'Explain the system without relying on the page.',
    lede: 'Use a short talk, then unfamiliar questions, to find what needs another pass.',
    blocks: [
      ['A ten-minute structure', `<ol><li><strong>Minute 1:</strong> explain Bitcoin’s public transaction graph and the privacy goal.</li><li><strong>Minutes 2–4:</strong> introduce notes, the shared tree, nullifiers and the private transfer proof.</li><li><strong>Minutes 5–6:</strong> follow Alice’s payment through publication and accepted replay.</li><li><strong>Minutes 7–8:</strong> explain metadata, indexer trust and recovery.</li><li><strong>Minutes 9–10:</strong> distinguish the transfer protocol from proposed PIPE key release and the unfinished peg.</li></ol><p>This is a practice outline. The existing presenter script and Slidev deck remain the presentation artifacts.</p>`],
      ['Make each answer checkable', `<p>Start with a direct answer. Name the mechanism or rule that supports it. Add the limitation that matters to the question. If the paper leaves the mechanism unspecified, say that directly rather than filling the gap with a plausible design.</p><p>For example: “Indexers cannot spend notes merely by indexing them; they do not receive the spending secret. But a wallet that accepts an indexer’s state without checking it trusts that service’s answers.”</p>`],
      ['Listen for these errors in your own explanation', `<ul><li>Giving Bitcoin responsibility for the shielded proof check.</li><li>Removing spent leaves from the note tree.</li><li>Assuming a valid proof also establishes current nullifier freshness.</li><li>Calling an encrypted signing key a persistent transaction restriction.</li><li>Describing modeled WE costs as a deployed benchmark.</li><li>Claiming a complete, trustless peg from the transfer paper alone.</li></ul>`]
    ],
    rehearsal: [
      ['A carrier confirms with an invalid shielded proof. What happens?', 'The bytes remain published, but replay rejects the envelope. No output leaves or nullifiers are applied. Bitcoin inclusion is not shielded acceptance.'],
      ['Why can’t Alice choose a different marker for a note she already spent?', 'The proof constrains the nullifier to the input note, its position and the spending-derived nullifier secret. Reusing the correct marker fails the public set check; inventing one fails the proof relation.'],
      ['Two indexers show different roots. Which one is authoritative?', 'The correct result follows replay for the same completed profile, starting state and active chain prefix. Check those inputs and the rules; indexers do not decide by vote.'],
      ['Can someone holding a viewing key spend the wallet’s notes?', 'The defined incoming and outgoing viewing capabilities are read-only. They can disclose broad matching history but do not authorize spending. The nullifier secret is separate and is not part of the disclosure modes.'],
      ['How do ordinary BTC enter and leave this system?', 'The transfer paper does not specify the complete peg. PIPEs proposes conditional key release as a primitive, but a full design must define issuance, exits, payout binding, reorganization handling and setup assumptions.'],
      ['Why can a 192-byte proof coexist with a huge WE ciphertext?', 'They are different objects. The proof establishes a statement; the candidate WE ciphertext encodes machinery for a condition, potentially a proof verifier. Short evidence does not automatically make that encoded verifier small.']
    ],
    cases: [
      { prompt: 'An audience member asks for an unspecified peg recovery rule. What is the defensible response?', choices: ['Invent plausible behavior', 'State specification boundary', 'Promise automatic recovery'], answer: 1, explanation: 'Identify what the paper leaves open and what a complete design would have to specify.' }
    ],
    recall: 'Deliver the ten-minute outline, then answer three randomly chosen questions without reading their model answers.',
    sources: [sb('§§1.2, 17–22 and Appendix C', 4), pipes('§§1.1, 4 and 5.4', 3)]
  },
  {
    id: 'E01', number: 30, slug: 'optional-swaps-and-lineage', title: 'Understand what the optional extensions add.',
    lede: 'A reserved commitment slot and optional lineage evidence support different proposed extensions.',
    blocks: [
      ['The reserved leaf slot', `<p>The leaf formula reserves <code>h_aux</code> for auxiliary commitments. In the base profile it has the canonical null value and is not serialized as extra data. The base transfer layer does not interpret a nontrivial extension condition.</p><p>An extension needs its own opening relation, an extended circuit and any additional public data in its own envelope format. Merely changing an unused hash field would not make all base implementations enforce a new rule.</p>`],
      ['The atomic-swap sketch', `<p>An <strong>HTLC</strong> is a hash-and-time-based spending arrangement: one path requires a secret whose hash matches the condition, and a refund path becomes available after a deadline.</p><p>The paper sketches a swap between a shielded note and transparent Bitcoin using a liquidity provider and a Bitcoin HTLC. The same secret should unlock the relevant conditions. An additional binding proof connects the circuit’s hash representation and Bitcoin’s hash condition to the same secret.</p><p>This sketches required relationships. It is not a complete deployment specification for timeout choices, publication failures or the entire peg.</p>`],
      ['Certified-recipient lineage', `<p>A separate optional layer lets an authority approve specific entry inputs and certify exact recipient addresses. A recursive proof—one that checks earlier proof evidence—can carry forward a claim that all inputs had the required lineage and the output used a certified address.</p><p>The recipient checks this evidence. Bitcoin consensus and base replay do not make it mandatory; notes without it remain valid. Its matching real/dummy encrypted formats aim to hide its presence from ciphertext-only observers.</p><p>The certificate records approval under a policy at a particular time. It does not establish current ownership, guarantee the authority’s judgment or approve all earlier Bitcoin history. A claim about current status needs the additional authenticated status evidence described by the extension.</p>`]
    ],
    cases: [
      { prompt: 'A base transfer has no optional lineage proof. Is it invalid solely for that reason?', choices: ['Yes, invalid', 'No, optional'], answer: 1, explanation: 'The lineage layer is opt-in. Bitcoin and base replay do not require it.' },
      { prompt: 'One input lacks the required lineage. Can a preserving step simply omit that input from its lineage proof?', choices: ['Yes, omit', 'No, include'], answer: 1, explanation: 'The preserving claim covers all consumed inputs; omitting one would fail to establish the stated lineage property.' },
      { prompt: 'A deal-specific proof shows that two swap legs were constructed for the same deal. Does it alone prove settlement?', choices: ['Yes, settled', 'No, constructed'], answer: 1, explanation: 'Construction consistency and completed settlement are distinct claims.' }
    ],
    recall: 'Explain what base replay does with optional lineage evidence and what additional rules an h_aux extension needs.',
    sources: [sb('§§22.4–22.5 and Appendix D', 40)]
  },
  {
    id: 'E02', number: 31, slug: 'reading-the-circuit-and-profile', title: 'Read the circuit and profile as two connected specifications.',
    lede: 'The circuit defines the statement. The profile fixes the concrete choices that make implementations agree.',
    blocks: [
      ['Trace one private input', `<ol><li>Start with its plaintext and spending secret.</li><li>Derive the correct recipient-related and nullifier material from the required secret lineage.</li><li>Reconstruct the note’s ciphertext relationship and public creation leaf.</li><li>Use the position and sibling hashes to establish membership under the anchor root.</li><li>Compute the nullifier and match the public marker.</li><li>Include the amount in the range and conservation constraints.</li></ol><p>The proof must connect all these checks for the same input. Independent claims about unrelated notes would be insufficient.</p>`],
      ['Read the public tuple carefully', `<p>Appendix B’s logical public inputs include the root, body binding, counts and the relevant nullifier and output vectors. Some fields are supplied through the body binding rather than as separate semantic checks. Do not infer that a body-bound field has no effect because it lacks its own input slot.</p><p>For outputs, ciphertext consistency connects the hidden note and the published ciphertext. For the whole transfer, the proof enforces exact conservation and body binding. Replay supplies separate anchor and nullifier-freshness checks.</p>`],
      ['Know which choices must be shared', `<p>A completed profile fixes encoding, hash and curve choices, tree conventions, encryption requirements, proof verification keys, carrier location, anchor rules and deterministic processing. Different acceptance rules produce different states even from identical Bitcoin blocks.</p><p>Internal database layout is a local choice. A wallet may also choose stricter confirmation or anchor-depth policy within the accepted rules. Changing the network’s allowed anchor window is not a private storage choice.</p>`],
      ['Read a byte layout without confusing it with security', `<p>The following calculator reproduces the paper’s field-size model. It assumes the stated encoding sizes and a 192-byte proof. Choosing different counts here does not assert that a deployed circuit or setup for those counts exists.</p><p>A byte count cannot show that an encryption implementation meets the required key-privacy and note-opening guarantees. Those need the specified construction and security analysis.</p>`]
    ],
    lab: 'envelope',
    cases: [
      { prompt: 'One indexer accepts an older anchor than the shared profile allows. Is this merely a local implementation preference?', choices: ['Local preference', 'Acceptance disagreement'], answer: 1, explanation: 'That indexer can accept transfers the other implementations reject, producing different canonical state.' },
      { prompt: 'A wallet waits for more confirmations than the minimum before treating a received note as settled. What kind of choice is that?', choices: ['Local policy', 'Consensus change'], answer: 0, explanation: 'A stricter wallet policy does not change which envelopes replay accepts.' },
      { prompt: 'The arithmetic circuit changes but an implementation keeps the old Groth16 verification key. Is that a valid upgrade procedure?', choices: ['Yes, compatible', 'No, mismatched'], answer: 1, explanation: 'The setup and verification key must correspond to the actual circuit and agreed profile version.' }
    ],
    recall: 'Follow one input through Appendix B, then identify two shared profile choices and one local implementation choice.',
    sources: [sb('Appendices A–B', 42)]
  },
]
