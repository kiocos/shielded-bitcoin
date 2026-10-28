<script setup lang="ts">
import { computed } from 'vue'
import { shortHex } from '../utils/hex'

/**
 * What every indexer does with every candidate envelope, in the paper's
 * normative order (Appendix A.7, Figure 5): five checks, then — only if all five
 * pass — the state change. Two envelopes run through it:
 *
 *   1 a valid one: every check passes, leaves and nullifiers are added
 *   2 one that repeats a nullifier: it fails at that check, and nothing changes
 *   3 the block ends: the root is stored for that height
 *
 * The run is animated with CSS transition delays rather than timers: on the
 * click every stage changes class at once, and its delay makes it light up as
 * the token passes over it. Stepping back replays it, which is fine
 */
const props = withDefaults(defineProps<{ clicks?: number }>(), { clicks: 0 })

const stages = [
  { name: 'parse', desc: 'format, version, counts', icon: 'i-ph-brackets-curly-bold' },
  { name: 'binding', desc: 'recompute h_body', icon: 'i-ph-hash-bold' },
  { name: 'anchor', desc: 'h_anchor in the window', icon: 'i-ph-clock-countdown-duotone' },
  { name: 'nullifiers', desc: 'distinct, none spent', icon: 'i-ph-fingerprint-duotone' },
  { name: 'proof', desc: 'verify π', icon: 'i-ph-seal-check-duotone' },
  { name: 'apply', desc: 'add leaves and nullifiers', icon: 'i-ph-database-duotone' },
]
const BOX = 128
const GAP = 20.6
const cx = (i: number) => i * (BOX + GAP) + BOX / 2
const STEP_MS = 380

const runA = computed(() => props.clicks === 1)
const runB = computed(() => props.clicks >= 2)
const FAIL = 3

type Status = 'idle' | 'pass' | 'fail'
const status = (i: number): Status => {
  if (runA.value)
    return 'pass'
  if (runB.value)
    return i < FAIL ? 'pass' : i === FAIL ? 'fail' : 'idle'
  return 'idle'
}
const delay = (i: number) => (runA.value || (runB.value && i <= FAIL)) ? `${(i + 1) * STEP_MS}ms` : '0ms'

const tokenA = computed(() => ({
  left: `${props.clicks >= 1 ? cx(5) : cx(0) - 70}px`,
  opacity: props.clicks === 1 ? 1 : 0,
  transition: props.clicks === 1 ? `left ${6 * STEP_MS}ms linear, opacity .3s ease` : 'opacity .3s ease',
}))
const tokenB = computed(() => ({
  left: `${props.clicks >= 2 ? cx(FAIL) : cx(0) - 70}px`,
  opacity: props.clicks >= 2 ? 1 : 0,
  transition: props.clicks >= 2 ? `left ${(FAIL + 1) * STEP_MS}ms linear, opacity .3s ease` : 'opacity .3s ease',
}))

const applied = computed(() => props.clicks >= 1)
const stored = computed(() => props.clicks >= 3)
</script>

<template>
  <div class="relative mx-auto h-[300px] w-[871px]">
    <!-- the track the envelopes travel along -->
    <div class="absolute left-0 right-0 top-[19px] h-px bg-white/10" />

    <div class="absolute top-0 z-10 -translate-x-1/2" :style="tokenA">
      <div class="flex items-center gap-1.5 rounded-full border border-violet/60 bg-[#1b1740] px-2.5 py-1 shadow-[0_0_16px_rgba(161,140,255,.45)]">
        <div class="i-ph-envelope-simple-fill text-sm text-violet" />
        <span class="text-[0.66rem] font-semibold text-violetlt">envelope</span>
      </div>
    </div>
    <div class="absolute top-0 z-10 -translate-x-1/2" :style="tokenB">
      <div :class="runB ? 'shake-late' : ''">
        <div class="flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors duration-300"
             :style="{ transitionDelay: runB ? `${(FAIL + 1) * STEP_MS}ms` : '0ms' }"
             :class="runB ? 'border-red/70 bg-[#3a1420]' : 'border-violet/60 bg-[#1b1740]'">
          <div class="i-ph-envelope-simple-fill text-sm" :class="runB ? 'text-red' : 'text-violet'" />
          <span class="text-[0.66rem] font-semibold" :class="runB ? 'text-red' : 'text-violetlt'">reuses a nullifier</span>
        </div>
      </div>
    </div>

    <!-- the stages -->
    <div v-for="(s, i) in stages" :key="s.name" class="absolute top-[52px]" :style="{ left: `${cx(i) - BOX / 2}px`, width: `${BOX}px` }">
      <div class="relative rounded-xl border px-3 py-3 text-center transition-all duration-300"
           :style="{ transitionDelay: delay(i) }"
           :class="{
             'border-white/14 bg-white/3': status(i) === 'idle',
             'border-green/60 bg-green/10 shadow-[0_0_18px_rgba(70,217,160,.25)]': status(i) === 'pass',
             'border-red/70 bg-red/12 shadow-[0_0_18px_rgba(255,107,129,.3)]': status(i) === 'fail',
             '!border-cyan/50': i === 5 && status(i) === 'idle',
           }">
        <div class="mx-auto text-2xl transition-colors duration-300" :style="{ transitionDelay: delay(i) }"
             :class="[s.icon, status(i) === 'pass' ? 'text-green' : status(i) === 'fail' ? 'text-red' : i === 5 ? 'text-cyan' : 'text-body/60']" />
        <div class="mt-1.5 text-sm font-semibold text-white">{{ s.name }}</div>
        <div class="mt-0.5 text-[0.64rem] leading-tight text-muted">{{ s.desc }}</div>
        <div class="absolute -right-2 -top-2 transition-opacity duration-300" :style="{ transitionDelay: delay(i) }"
             :class="status(i) === 'idle' ? 'opacity-0' : 'opacity-100'">
          <div class="text-xl" :class="status(i) === 'fail' ? 'i-ph-x-circle-fill text-red' : 'i-ph-check-circle-fill text-green'" />
        </div>
      </div>
      <!-- arrow to the next stage -->
      <div v-if="i < 5" class="absolute top-[42px] i-ph-caret-right-fill text-xs text-white/25" :style="{ left: `${BOX + 4}px` }" />
    </div>

    <!-- the shielded state -->
    <div class="absolute left-0 top-[190px] grid w-full grid-cols-3 gap-5">
      <div class="pane flex items-center gap-3 px-4 py-3">
        <div class="i-ph-tree-structure-duotone text-2xl text-violet" />
        <div>
          <div class="text-[0.66rem] text-muted">note tree</div>
          <div class="font-mono text-sm text-white">
            1 204 leaves
            <span class="ml-1 text-green transition-opacity duration-300" :class="applied ? 'opacity-100' : 'opacity-0'"
                  :style="{ transitionDelay: runA ? `${6 * STEP_MS}ms` : '0ms' }">+2</span>
          </div>
        </div>
      </div>
      <div class="pane flex items-center gap-3 px-4 py-3">
        <div class="i-ph-list-checks-duotone text-2xl text-violet" />
        <div>
          <div class="text-[0.66rem] text-muted">nullifier set</div>
          <div class="font-mono text-sm text-white">
            583 entries
            <span class="ml-1 text-green transition-opacity duration-300" :class="applied ? 'opacity-100' : 'opacity-0'"
                  :style="{ transitionDelay: runA ? `${6 * STEP_MS}ms` : '0ms' }">+1</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors duration-500"
           :class="stored ? 'border-cyan/50 bg-cyan/8' : 'border-white/12 bg-white/4'">
        <div class="i-ph-stack-duotone text-2xl text-cyan" />
        <div>
          <div class="text-[0.66rem] text-muted">at the end of the block</div>
          <div class="font-mono text-sm" :class="stored ? 'text-white' : 'text-muted/50'">
            R[H] = <Scramble :value="stored ? shortHex('root-after-block', 4) : '····…····'" />
          </div>
        </div>
      </div>
    </div>

    <!-- the verdict for the second envelope -->
    <div class="absolute left-0 right-0 top-[262px] flex justify-center transition-opacity duration-500"
         :style="{ transitionDelay: runB && clicks === 2 ? `${(FAIL + 2) * STEP_MS}ms` : '0ms' }"
         :class="clicks === 2 ? 'opacity-100' : 'opacity-0'">
      <span class="chip-red !text-xs !px-3.5 !py-1.5"><span class="i-ph-x-circle-fill" /> rejected — the state is exactly as it was</span>
    </div>
  </div>
</template>

<style scoped>
.shake-late { animation: shake-once 0.45s cubic-bezier(.36, .07, .19, .97) 1.6s both; }
</style>
