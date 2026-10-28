<script setup>
import { computed, ref } from 'vue'
import { rehearsal, lessons } from '../course.mjs'
import StudyLab from './StudyLab.vue'
const props = defineProps({ visual: Object })
const selected = ref(-1)
const revealAnswer = ref(false)
const stage = ref(0)
const tampered = ref(false)
const prompt = ref(0)
const opened = ref(false)
const steps = computed(() => props.visual.mode === 'zcash' ? [
  ['Select', 'Alice chooses notes and paths to a permitted root'],
  ['Construct', 'Creates notes, commitments and ciphertexts; assembles Actions'],
  ['Prove and sign', 'Generates the bundle proof and required signatures'],
  ['Verify and include', 'Zcash nodes verify consensus rules'],
  ['Receive', 'Bob recovers the note, checks its commitment and applies his confirmation policy'],
] : [
  ['Select', '100,000 note + position + path → permitted anchor'],
  ['Create outputs', '60,000 for Bob + 40,000 change → ciphertexts'],
  ['Finalize body', 'Nullifier + ciphertexts + ct_out → canonical body → h_body'],
  ['Prove', 'Private witness + public statement → Groth16 proof'],
  ['Publish', 'The Bitcoin carrier pays its own fee and carries the envelope'],
  ['Replay', 'Parse → binding → anchor → nullifiers → proof → state'],
  ['Recover', 'Bob decrypts, checks, saves the position and watches confirmations'],
])
</script>

<template>
  <StudyLab v-if="visual.type.endsWith('lab')" :type="visual.type" :mode="visual.mode" />
  <div v-else-if="visual.type === 'cover'" class="cover-art">
    <svg viewBox="0 0 700 280" role="img" aria-label="Private notes connected to public verification and Bitcoin publication">
      <path class="cover-path" d="M110 140 H290 M410 140 H590" />
      <circle cx="110" cy="140" r="62" class="orb violet-fill"/><circle cx="350" cy="140" r="76" class="orb cyan-fill"/><circle cx="590" cy="140" r="62" class="orb orange-fill"/>
      <text x="110" y="152" class="big-svg violet">n</text><text x="350" y="154" class="big-svg cyan">π</text><text x="590" y="153" class="big-svg orange">₿</text>
      <text x="110" y="244" class="caption-svg">private notes</text><text x="350" y="258" class="caption-svg">verifiable validity</text><text x="590" y="244" class="caption-svg">L1 publication</text>
      <text x="230" y="115" class="small-svg">prove</text><text x="470" y="115" class="small-svg">publish</text>
    </svg>
    <div class="cover-caption">A course to read, experiment and return to the paper</div>
    <div class="cover-tags"><span>{{ lessons.length }} screens</span><span>6 labs</span><span>4 checkpoints + rehearsal</span></div>
  </div>

  <div v-else-if="visual.type === 'cards'" class="concept-cards">
    <div v-for="(item, i) in visual.items" :key="i" class="concept-card" :class="item[2]"><span class="card-number">0{{ i + 1 }}</span><div><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p></div></div>
  </div>
  <div v-else-if="visual.type === 'flow'" class="flow-cards">
    <template v-for="(item, i) in visual.items" :key="i"><div class="flow-card" :class="item[2]"><span class="card-number">0{{ i + 1 }}</span><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p></div><span v-if="i < visual.items.length - 1" class="flow-arrow">→</span></template>
  </div>
  <div v-else-if="visual.type === 'table'" class="table-wrap"><table><thead><tr><th v-for="h in visual.headers" :key="h">{{ h }}</th></tr></thead><tbody><tr v-for="(row, i) in visual.rows" :key="i"><td v-for="(cell, j) in row" :key="j">{{ cell }}</td></tr></tbody></table></div>
  <div v-else-if="visual.type === 'code'" class="code-visual"><small>{{ visual.label }}</small><pre>{{ visual.text }}</pre></div>
  <div v-else-if="visual.type === 'formula'" class="formula-visual"><div class="formula-main">{{ visual.text }}</div><dl><template v-for="item in visual.items" :key="item[0]"><dt>{{ item[0] }}</dt><dd>{{ item[1] }}</dd></template></dl></div>

  <div v-else-if="visual.type === 'payment'" class="payment-visual">
    <div class="payment-network" :class="visual.mode === 'bitcoin' ? 'orange' : 'violet'">{{ visual.mode === 'bitcoin' ? 'BITCOIN TRANSACTION · public amounts' : 'SHIELDED TRANSFER · private amounts' }}</div>
    <div class="payment-row"><div class="money-card amber"><small>ALICE · INPUT</small><b>100,000</b><span>sats</span></div><div class="split-lines"><span>→</span><span>→</span></div><div class="payment-outputs"><div class="money-card pink"><small>BOB</small><b>60,000 <span>sats</span></b></div><div class="money-card amber"><small>CHANGE</small><b>{{ visual.mode === 'bitcoin' ? '39,000' : '40,000' }} <span>sats</span></b></div></div></div>
    <div v-if="visual.mode === 'bitcoin'" class="fee-strip orange">100,000 − 60,000 − 39,000 = 1,000 sat fee</div>
    <div v-else class="fee-strip orange"><small>BITCOIN CARRIER · separate balance</small>12,000 input → 11,000 change + 1,000 fee</div>
    <p class="visual-caption">{{ visual.mode === 'bitcoin' ? 'The input publicly references the old output' : 'Alice’s whole note is consumed; both outputs are new notes' }}</p>
  </div>

  <div v-else-if="visual.type === 'tree'" class="tree-visual">
    <svg viewBox="0 0 700 325" role="img" aria-label="Binary tree: four commitments produce two intermediate nodes and one root">
      <g class="tree-lines"><path d="M100 250 L225 155 L350 60 L475 155 L600 250 M225 155 L265 250 M475 155 L435 250"/></g>
      <rect x="266" y="25" width="168" height="62" rx="14" class="node cyan-fill"/><text x="350" y="64" class="node-text cyan">public root</text>
      <rect x="145" y="125" width="160" height="60" rx="12" class="node"/><text x="225" y="162" class="node-text">H(A, B)</text>
      <rect x="395" y="125" width="160" height="60" rx="12" class="node"/><text x="475" y="162" class="node-text">H(C, D)</text>
      <g v-for="(x, i) in [100, 265, 435, 600]" :key="x"><rect :x="x - 64" y="225" width="128" height="60" rx="12" class="node violet-fill"/><text :x="x" y="263" class="node-text violet">{{ 'ABCD'[i] }}</text></g>
    </svg>
    <div class="legend-line"><span class="violet">● leaves: creation records</span><span class="cyan">● root: reference for the set</span></div>
    <p class="visual-caption">Teaching tree with 4 leaves · Orchard uses depth 32</p>
  </div>

  <div v-else-if="visual.type === 'nullifier'" class="nullifier-visual">
    <div class="state-pair"><div class="violet"><small>TREE</small><b>ℓ₀ · ℓ₁ · ℓ₂ · ℓ₃</b><span>All leaves remain here</span></div><div class="red"><small>SPENT SET</small><b>{ nf_a, nf_b }</b><span>No public map to the leaves</span></div></div>
    <div class="hidden-link">ℓ₂ <span>••• private link •••</span> nf_b</div>
    <div class="two-rules"><div class="violet"><b>Inside the proof</b><p>“This note requires this nullifier”</p></div><div class="cyan"><b>Against the state</b><p>“This nullifier has not appeared before”</p></div></div>
  </div>

  <div v-else-if="visual.type === 'actions'" class="actions-visual">
    <div class="action-head"><span>SPEND</span><span>CREATE</span></div>
    <div class="action-line"><span class="amber">Alice’s real note</span><b>Action 0</b><span class="pink">Note for Bob</span></div>
    <div class="action-line"><span class="muted">Input dummy</span><b>Action 1</b><span class="amber">Alice’s change</span></div>
    <div class="bundle-proof violet">One Halo 2 proof for the bundle</div>
    <p class="visual-caption">Example: 1 real input and 2 outputs · public count: 2 Actions</p>
  </div>

  <div v-else-if="visual.type === 'architecture'" class="architecture-visual">
    <div class="arch-row amber"><b>WALLET</b><span>Constructs notes, ciphertexts and proof</span></div><div class="arch-arrow">↓ envelope in the carrier</div>
    <div class="arch-row orange"><b>BITCOIN</b><span>Publishes and orders Bitcoin transactions</span></div><div class="arch-arrow">↓ public history</div>
    <div class="arch-row cyan"><b>REPLAY</b><span>Checks envelopes and reconstructs state</span></div>
    <p class="visual-caption">One chain order · shielded validity outside Bitcoin consensus</p>
  </div>

  <div v-else-if="visual.type === 'binding'" class="binding-visual" @click.stop>
    <div class="body-parts"><span>header</span><span>anchor</span><span>nf[]</span><span>outputs</span><button :class="tampered ? 'red' : 'violet'" @click="tampered = !tampered">{{ tampered ? 'ct_out MODIFIED' : 'ct_out original' }}</button></div>
    <div class="binding-arrow">↓ canonical serialization + H_body</div>
    <div :class="['binding-hash', tampered ? 'red' : 'violet']">{{ tampered ? 'h_body NEW' : 'h_body ORIGINAL' }}</div>
    <div class="binding-arrow">↓ verify the existing π</div>
    <div :class="['binding-result', tampered ? 'red' : 'green']" role="status">{{ tampered ? 'The old proof fails for the new statement' : 'The proof matches the original body' }}</div>
    <p class="visual-caption">Click ct_out to simulate tampering · π is excluded from its own hash</p>
  </div>

  <div v-else-if="visual.type === 'keys'" class="keys-visual">
    <div class="key-root amber">seed → sk_master</div><div class="key-branches">
      <div><div class="key-node amber">sk_spend <small>spending authority</small></div><div class="key-children"><div class="key-node amber">sk_nf <small>links note to spend</small></div><div class="key-node cyan">vk_in <small>↓ sk_view → pk_d</small></div></div></div>
      <div class="key-node cyan">vk_out <small>recovers outputs</small></div>
    </div><div class="legend-line"><span class="amber">● wallet secrets</span><span class="cyan">● reading without spending authority</span></div>
  </div>

  <div v-else-if="visual.type === 'envelope'" class="envelope-visual">
    <div class="byte-total"><b>610</b><span>bytes · 2 inputs / 2 outputs</span></div>
    <div class="byte-bar"><div v-for="(n, i) in [12,64,64,134,144,192]" :key="i" :style="{ flex: n, background: ['#8a90ae','#ff6b81','#4cc9f0','#a18cff','#cfc4ff','#7260b9'][i] }" /></div>
    <div class="byte-legend"><div v-for="(item, i) in [['Header + anchor + counts',12],['Nullifiers',64],['Ephemeral keys',64],['Note ciphertexts',134],['Recovery ct_out',144],['Proof π',192]]" :key="i"><span>{{ item[0] }}</span><b>{{ item[1] }} B</b></div></div>
    <p class="visual-caption">Body: 418 B · proof: 192 B · complete OP_RETURN output: 625 B</p>
  </div>

  <div v-else-if="visual.type === 'walk'" class="walk-visual" @click.stop>
    <div class="walk-track"><button v-for="(item, i) in steps" :key="i" :class="{ active: stage === i, done: stage > i }" :aria-label="`Step ${i + 1}: ${item[0]}`" :aria-pressed="stage === i" @click="stage = i">{{ i + 1 }}</button></div>
    <div class="walk-scene"><div class="walk-watermark">0{{ stage + 1 }}</div><small>{{ visual.mode === 'zcash' ? 'ORCHARD' : 'SHIELDED BITCOIN' }}</small><h3>{{ steps[stage][0] }}</h3><p>{{ steps[stage][1] }}</p></div>
    <div class="lab-buttons"><button :disabled="stage === 0" @click="stage--">Previous step</button><button :disabled="stage === steps.length - 1" @click="stage++">Next step</button></div>
  </div>

  <div v-else-if="visual.type === 'quiz'" class="quiz-visual" @click.stop>
    <p class="quiz-question">{{ visual.question }}</p>
    <button v-for="(item, i) in visual.options" :key="i" class="quiz-choice" :class="{ chosen: selected === i, correct: revealAnswer && visual.correct === i, incorrect: revealAnswer && selected === i && visual.correct !== i }" :aria-pressed="selected === i" @click="selected = i; revealAnswer = false"><b>{{ 'ABC'[i] }}</b><span>{{ item }}</span></button>
    <button class="answer-button" @click="revealAnswer = !revealAnswer">{{ revealAnswer ? 'Hide explanation' : 'Show explained answer' }}</button>
    <p v-if="revealAnswer" class="quiz-answer" role="status">{{ visual.answer }}</p>
  </div>
  <div v-else-if="visual.type === 'rehearsal'" class="rehearsal-visual" @click.stop @keydown.stop>
    <label>Choose a question<select v-model.number="prompt" aria-label="Rehearsal question" @change="opened = false"><option v-for="(p, i) in rehearsal" :key="i" :value="i">{{ p[0] }}</option></select></label>
    <p class="rehearsal-question">{{ rehearsal[prompt][0] }}</p>
    <p class="muted">Answer: problem → mechanism → limit</p>
    <button @click="opened = !opened">{{ opened ? 'Hide reference answer' : 'Check a possible answer' }}</button>
    <p v-if="opened" class="rehearsal-answer">{{ rehearsal[prompt][1] }}</p>
  </div>
</template>
