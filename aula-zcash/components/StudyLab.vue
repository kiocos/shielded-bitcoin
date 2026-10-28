<script setup>
import { computed, ref, watch } from 'vue'
const props = defineProps({ type: String, mode: String })
const value = ref(60000)
const randomness = ref('teaching-randomness-01')
const secret = ref('bob-example-secret')
const position = ref(42)
const digest = ref('computing…')
const error = ref('')
const seen = ref([])
const hashMessage = ref('')
const pending = ref(false)
let request = 0
async function hash(...parts) {
  const bytes = new TextEncoder().encode(JSON.stringify(parts))
  const buffer = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join('')
}
const short = value => value ? `${value.slice(0, 9)}…${value.slice(-5)}` : '…'
watch([value, randomness, secret, position], async () => {
  if (props.type !== 'hashlab') return
  const seq = ++request
  pending.value = true
  hashMessage.value = ''
  try {
    const h = props.mode === 'commitment'
      ? await hash('TEACHING-COMMITMENT', value.value, randomness.value)
      : await hash('TEACHING-NULLIFIER', secret.value, randomness.value, position.value)
    if (seq === request) digest.value = h
  } catch {
    error.value = 'This lab requires Web Crypto on localhost or HTTPS'
  } finally {
    if (seq === request) pending.value = false
  }
}, { immediate: true })
function fresh() {
  randomness.value = Array.from(crypto.getRandomValues(new Uint8Array(24)), b => b.toString(16).padStart(2, '0')).join('')
}
function register() {
  if (seen.value.includes(digest.value)) hashMessage.value = 'REJECTED · this marker has already been recorded'
  else { seen.value.push(digest.value); hashMessage.value = 'RECORDED · the set now contains this marker' }
}

const leafIndex = ref(2)
const corrupt = ref(false)
const tree = ref({ leaves: [], pairs: [], root: '' })
const merkleResult = ref('')
const merkleExpression = ref('')
async function buildTree() {
  const leaves = await Promise.all(['A', 'B', 'C', 'D'].map(s => hash('LEAF', s)))
  const pairs = [await hash('NODE', leaves[0], leaves[1]), await hash('NODE', leaves[2], leaves[3])]
  tree.value = { leaves, pairs, root: await hash('NODE', ...pairs) }
}
async function calculatePath() {
  if (props.type !== 'merklelab') return
  try {
    if (!tree.value.root) await buildTree()
    const i = leafIndex.value
    const sibling = corrupt.value ? await hash('LEAF', 'wrong') : tree.value.leaves[i ^ 1]
    const pair = i % 2 ? await hash('NODE', sibling, tree.value.leaves[i]) : await hash('NODE', tree.value.leaves[i], sibling)
    merkleResult.value = i < 2 ? await hash('NODE', pair, tree.value.pairs[1]) : await hash('NODE', tree.value.pairs[0], pair)
    merkleExpression.value = i < 2 ? `H(H(${i % 2 ? 'sibling, leaf' : 'leaf, sibling'}), other pair)` : `H(other pair, H(${i % 2 ? 'sibling, leaf' : 'leaf, sibling'}))`
  } catch { error.value = 'Web Crypto is unavailable in this context' }
}
watch([leafIndex, corrupt], calculatePath, { immediate: true })

const input = ref(8)
const bob = ref(5)
const change = ref(3)
const integer = computed(() => [input.value, bob.value, change.value].every(n => Number.isInteger(n) && n >= 0 && n <= 16))
const equal = computed(() => input.value === bob.value + change.value)
const modular = computed(() => ((input.value - bob.value - change.value) % 17 + 17) % 17 === 0)

const anchor = ref(950)
const scenario = ref('valid')
const nullifiers = ref([])
const leavesCount = ref(8)
const result = ref('Choose a case and process the envelope')
const stopped = ref(-1)
const accepted = ref(null)
const stages = ['Parse', 'Binding', 'Anchor', 'Nullifiers', 'Proof', 'Apply']
const cases = [
  ['valid', 'Valid transfer · nf_A'], ['double', 'Another envelope · same nf_A'],
  ['parse', 'Non-canonical encoding'], ['binding', 'Body changed after proof generation'],
  ['proof', 'Invalid proof'], ['internal', 'Two inputs with repeated nf_A'],
]
function resetReplay() {
  nullifiers.value = []; leavesCount.value = 8; stopped.value = -1
  accepted.value = null; result.value = 'Initial state restored: 8 leaves and no nullifiers'
}
function replay() {
  const s = scenario.value
  const nf = s === 'internal' ? ['nf_A', 'nf_A'] : ['nf_A']
  const checks = [s !== 'parse', s !== 'binding', Number.isInteger(anchor.value) && anchor.value >= 900 && anchor.value <= 999,
    new Set(nf).size === nf.length && nf.every(x => !nullifiers.value.includes(x)), s !== 'proof']
  const failure = checks.findIndex(v => !v)
  accepted.value = failure < 0
  stopped.value = failure < 0 ? 5 : failure
  if (failure >= 0) {
    const reasons = ['Invalid encoding', 'The body does not match the proof statement', 'Anchor outside [900, 999]', 'Duplicate or already-spent nullifier', 'The proof does not verify']
    result.value = `REJECTED · ${reasons[failure]}; state unchanged`
  } else {
    nullifiers.value.push(...nf); leavesCount.value += 2
    result.value = 'ACCEPTED · 1 nullifier inserted, 2 leaves appended'
  }
}

const after = ref(false)
const disclosure = ref(false)
const own = ref(false)
const candidates = computed(() => Array.from({ length: 12 }, (_, i) => i).filter(i =>
  !(after.value && i >= 8) && !(disclosure.value && [0, 1, 4].includes(i)) && !(own.value && [2, 3, 5, 6].includes(i))))
</script>

<template>
  <div class="lab" :class="[type, mode]" @keydown.stop @click.stop>
    <p class="lab-label">Lab · {{ type === 'merklelab' || type === 'hashlab' ? 'Real SHA-256, teaching construction' : 'Teaching model, no actual ZK proof' }}</p>
    <template v-if="type === 'hashlab'">
      <div class="field-grid">
        <label v-if="mode === 'commitment'">Value <input v-model.number="value" aria-label="Note value" type="number" min="0" /></label>
        <label v-else>Example secret <input v-model="secret" aria-label="Example secret" /></label>
        <label>{{ mode === 'commitment' ? 'Randomness' : 'Example ρ' }} <input v-model="randomness" aria-label="Example randomness" /></label>
        <label v-if="mode === 'nullifier'">Position <input v-model.number="position" aria-label="Note position" type="number" min="0" /></label>
      </div>
      <div class="hash-result"><small>{{ mode === 'commitment' ? 'TEACHING COMMITMENT' : 'TEACHING NULLIFIER' }}</small><code>{{ digest }}</code></div>
      <div class="lab-buttons">
        <button @click="fresh">Generate new randomness</button>
        <button v-if="mode === 'nullifier'" :disabled="pending || !!error" @click="register">Record marker</button>
        <button v-if="mode === 'nullifier'" @click="seen = []; hashMessage = ''">Clear set</button>
      </div>
      <p v-if="hashMessage" role="status" :class="['lab-status', hashMessage.startsWith('REJECTED') ? 'red' : 'green']">{{ hashMessage }}</p>
      <p v-else class="lab-hint">{{ mode === 'commitment' ? 'Keep the value fixed. Change only the randomness and compare the output.' : 'Record it twice. Changing fields changes the hash, but the protocol circuit prevents arbitrary changes.' }}</p>
    </template>

    <template v-else-if="type === 'merklelab'">
      <div class="merkle-root"><span>Public root</span><code>{{ short(tree.root) }}</code></div>
      <div class="merkle-branches"><div v-for="(p, i) in tree.pairs" :key="i" :class="{ selected: Math.floor(leafIndex / 2) === i }"><small>H({{ i ? 'C, D' : 'A, B' }})</small><code>{{ short(p) }}</code></div></div>
      <div class="merkle-leaves"><button v-for="(leaf, i) in tree.leaves" :key="i" :aria-label="`Select leaf ${'ABCD'[i]}`" :aria-pressed="leafIndex === i" :class="{ selected: leafIndex === i }" @click="leafIndex = i"><b>{{ 'ABCD'[i] }}</b><code>{{ leaf.slice(0, 8) }}</code></button></div>
      <label class="check"><input v-model="corrupt" type="checkbox" /> Use an incorrect sibling in the path</label>
      <p class="path-expression">{{ merkleExpression }}</p>
      <div :class="['lab-status', merkleResult === tree.root ? 'green' : 'red']" role="status">Computed root: {{ short(merkleResult) }} · {{ merkleResult === tree.root ? 'MATCHES' : 'DOES NOT MATCH' }}</div>
    </template>

    <template v-else-if="type === 'prooflab'">
      <div class="field-grid three">
        <label>Input <input v-model.number="input" aria-label="Input" type="number" /></label>
        <label>Bob <input v-model.number="bob" aria-label="Output Bob" type="number" /></label>
        <label>Change <input v-model.number="change" aria-label="Change" type="number" /></label>
      </div>
      <div class="toy-equation">{{ input }} <span>?</span> {{ bob }} + {{ change }}</div>
      <div class="checks">
        <p :class="modular ? 'green' : 'red'">{{ modular ? '✓' : '×' }} Equality modulo 17</p>
        <p :class="integer ? 'green' : 'red'">{{ integer ? '✓' : '×' }} Integer values between 0 and 16</p>
        <p :class="equal ? 'green' : 'red'">{{ equal ? '✓' : '×' }} Integer conservation, without overflow</p>
      </div>
      <div class="lab-buttons"><button @click="input = 8; bob = 5; change = 20">Try creating 17 units</button><button @click="input = 8; bob = 5; change = 3">Restore valid values</button></div>
      <p :class="['lab-status', integer && equal ? 'green' : 'red']" role="status">{{ integer && equal ? 'PASSES these constraints' : 'FAILS: modular equality alone is insufficient' }}</p>
    </template>

    <template v-else-if="type === 'replaylab'">
      <div class="field-grid replay-fields">
        <label>Case published in block 1,000 <select v-model="scenario" aria-label="Replay case"><option v-for="c in cases" :key="c[0]" :value="c[0]">{{ c[1] }}</option></select></label>
        <label>h_anchor <input v-model.number="anchor" type="number" aria-label="Anchor height" /></label>
      </div>
      <div class="pipeline-stages"><div v-for="(s, i) in stages" :key="s" :class="{ passed: stopped >= i && (accepted || stopped > i), failed: stopped === i && accepted === false }"><span>{{ i + 1 }}</span>{{ s }}</div></div>
      <div class="state-pair"><div><small>TREE</small><b>{{ leavesCount }} leaves</b><span>Spent leaves are not removed</span></div><div><small>NULLIFIERS</small><b>{{ nullifiers.length ? '{ nf_A }' : '∅' }}</b><span>{{ nullifiers.length }} accepted marker</span></div></div>
      <div class="lab-buttons"><button @click="replay">Process envelope</button><button @click="resetReplay">Reset state</button></div>
      <p :class="['lab-status', accepted === null ? '' : accepted ? 'green' : 'red']" role="status">{{ result }}</p>
    </template>

    <template v-else-if="type === 'privacylab'">
      <div class="candidate-grid"><div v-for="i in 12" :key="i" :class="{ excluded: !candidates.includes(i - 1), future: i > 8 }"><span>ℓ{{ i - 1 }}</span><b>{{ candidates.includes(i - 1) ? '?' : '×' }}</b></div></div>
      <div class="privacy-controls">
        <label class="check"><input v-model="after" type="checkbox" /> Apply anchor: ℓ8–ℓ11 were created after it</label>
        <label class="check"><input v-model="disclosure" type="checkbox" /> Outside fact: ℓ0, ℓ1 and ℓ4 have proven spends</label>
        <label class="check"><input v-model="own" type="checkbox" /> I privately know ℓ2, ℓ3, ℓ5 and ℓ6 are unspent</label>
      </div>
      <p class="lab-status" role="status"><b>{{ candidates.length }} {{ candidates.length === 1 ? 'candidate' : 'candidates' }}</b> in this scenario · {{ candidates.length === 1 ? 'only possibility under the supplied facts' : 'not people or equal probabilities' }}</p>
    </template>
    <p v-if="error" class="red" role="alert">{{ error }}</p>
  </div>
</template>
