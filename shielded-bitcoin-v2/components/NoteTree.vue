<script setup lang="ts">
import { computed } from 'vue'
import { fakeHex, shortHex } from '../utils/hex'

/**
 * The note tree, and — on the right — either the root history or the nullifier
 * set. One canvas for three slides (the tree, spending, the privacy set), so the
 * audience meets the same picture each time and only what is on it changes
 * Nothing moves between slides: the leaf slots are fixed and always drawn
 *
 * Two facts the drawing has to get right, because they are easy to draw wrong:
 *
 *  - The tree is append-only. A spent note's leaf is never removed or changed;
 *    spending is recorded only in the nullifier set. So `spent` never empties a
 *    slot
 *  - A nullifier does not point at a leaf. The arrow from leaf to nullifier only
 *    exists in the god's-eye view (`highlight`), and `unknown` replaces it with
 *    what an observer actually has: a question mark on every candidate
 *
 * Fixed-pixel geometry (871px content box). Leaf centres are LEAF_X(i); the
 * internal nodes are midpoints of their children; re-derive the travel targets
 * for the nullifier chip if any of these change
 */
type Row = { label: string, seed: string, note?: string }

const props = withDefaults(defineProps<{
  /** How many leaf slots are filled, from position 0 */
  leaves?: number
  /** Positions that just arrived, for the staggered pop */
  pane?: 'none' | 'roots' | 'nullifiers'
  roots?: Row[]
  /** Nullifiers already in the set before this slide's story starts */
  existing?: string[]
  /** The god's-eye view: whose note this is */
  highlight?: number | null
  highlightLabel?: string
  /** The new nullifier, derived from `highlight` */
  nfAt?: 'leaf' | 'set' | null
  /** A second spend of the same note */
  dupAt?: 'leaf' | 'set' | null
  /** The observer's view: no highlight, a question on every filled leaf */
  unknown?: boolean
  /** Privacy set: leaves ruled out by side information */
  struck?: number[]
  /** Privacy set: the leaves still standing */
  candidates?: number[]
  rootLabel?: string
}>(), {
  leaves: 0, pane: 'none', roots: () => [], existing: () => [],
  highlight: null, highlightLabel: 'Alice', nfAt: null, dupAt: null, unknown: false,
  struck: () => [], candidates: () => [], rootLabel: 'root',
})

const SLOTS = 8
const TREE_W = 540
const LEAF_Y = 252
const LEAF = 44
const leafX = (i: number) => 36 + i * 67
const l2 = [0, 1, 2, 3].map(k => ({ x: (leafX(2 * k) + leafX(2 * k + 1)) / 2, y: 178, kids: [2 * k, 2 * k + 1] }))
const l1 = [0, 1].map(k => ({ x: (l2[2 * k].x + l2[2 * k + 1].x) / 2, y: 112, kids: [4 * k, 4 * k + 1, 4 * k + 2, 4 * k + 3] }))
const root = { x: (l1[0].x + l1[1].x) / 2, y: 44 }

const filled = (i: number) => i < props.leaves
const anyFilled = (kids: number[]) => kids.some(filled)

const rootHash = computed(() => shortHex(`root-${props.leaves}`, 4))

/** The nullifier for the highlighted note. Same value both times it is published */
const nfValue = computed(() => fakeHex(`nf-${props.highlight}`, 16))

/** Nullifier pane rows: existing entries, then the new one once it has arrived */
const PANE_X = 586
const ROW0 = 74
const ROW_H = 36
const nfRow = computed(() => props.existing.length)
const nfPos = computed(() => {
  if (props.nfAt === 'set')
    return { left: `${PANE_X + 18}px`, top: `${ROW0 + nfRow.value * ROW_H}px` }
  const x = props.highlight != null ? leafX(props.highlight) : 0
  return { left: `${x - 60}px`, top: `${LEAF_Y - 74}px` }
})
const dupPos = computed(() => {
  if (props.dupAt === 'set')
    return { left: `${PANE_X + 18}px`, top: `${ROW0 + (nfRow.value + 1) * ROW_H}px` }
  const x = props.highlight != null ? leafX(props.highlight) : 0
  return { left: `${x - 60}px`, top: `${LEAF_Y - 74}px` }
})

const isStruck = (i: number) => props.struck.includes(i)
const isCandidate = (i: number) => props.candidates.includes(i)
const showHighlight = (i: number) => !props.unknown && props.highlight === i
</script>

<template>
  <div class="relative mx-auto h-[318px] w-[871px]">
    <!-- edges -->
    <svg class="pointer-events-none absolute left-0 top-0" :width="TREE_W" height="318" aria-hidden="true">
      <g v-for="(n, k) in l2" :key="`l2-${k}`">
        <line v-for="c in n.kids" :key="c" :x1="n.x" :y1="n.y + 7" :x2="leafX(c)" :y2="LEAF_Y - LEAF / 2"
              :stroke="filled(c) ? 'rgba(161,140,255,.55)' : 'rgba(255,255,255,.12)'" stroke-width="1.4"
              style="transition: stroke .5s ease" />
      </g>
      <g v-for="(n, k) in l1" :key="`l1-${k}`">
        <line v-for="j in [0, 1]" :key="j" :x1="n.x" :y1="n.y + 7" :x2="l2[2 * k + j].x" :y2="l2[2 * k + j].y - 7"
              :stroke="anyFilled(l2[2 * k + j].kids) ? 'rgba(161,140,255,.55)' : 'rgba(255,255,255,.12)'" stroke-width="1.4"
              style="transition: stroke .5s ease" />
      </g>
      <line v-for="j in [0, 1]" :key="`r-${j}`" :x1="root.x" :y1="root.y + 15" :x2="l1[j].x" :y2="l1[j].y - 7"
            :stroke="anyFilled(l1[j].kids) ? 'rgba(161,140,255,.55)' : 'rgba(255,255,255,.12)'" stroke-width="1.4"
            style="transition: stroke .5s ease" />
      <circle v-for="(n, k) in [...l2, ...l1]" :key="`n-${k}`" :cx="n.x" :cy="n.y" r="6.5"
              :fill="anyFilled(n.kids) ? '#a18cff' : '#151832'" :stroke="anyFilled(n.kids) ? '#cfc4ff' : 'rgba(255,255,255,.2)'"
              stroke-width="1.2" style="transition: fill .5s ease, stroke .5s ease" />
    </svg>

    <!-- root -->
    <div class="absolute -translate-x-1/2 -translate-y-1/2" :style="{ left: `${root.x}px`, top: `${root.y}px` }">
      <div class="flex items-center gap-2 rounded-full border border-violet/50 bg-[#151832] px-3.5 py-1.5 shadow-[0_0_24px_rgba(161,140,255,.25)]">
        <span class="text-xs text-violetlt font-semibold">{{ rootLabel }}</span>
        <Scramble :value="rootHash" class="text-xs text-white" />
      </div>
    </div>

    <!-- leaves -->
    <div v-for="i in SLOTS" :key="i - 1" class="absolute -translate-x-1/2" :style="{ left: `${leafX(i - 1)}px`, top: `${LEAF_Y - LEAF / 2}px` }">
      <div class="relative grid place-items-center rounded-xl border-2 transition-all duration-500"
           :style="{ width: `${LEAF}px`, height: `${LEAF}px`, transitionDelay: filled(i - 1) ? `${(i - 1) * 60}ms` : '0ms' }"
           :class="[
             !filled(i - 1) ? 'border-dashed border-white/14 bg-transparent'
             : showHighlight(i - 1) ? 'border-amber bg-amber/15 shadow-[0_0_18px_rgba(255,194,75,.45)]'
               : isCandidate(i - 1) ? 'border-green bg-green/12 shadow-[0_0_16px_rgba(70,217,160,.4)]'
                 : 'border-violet/60 bg-violet/14',
             isStruck(i - 1) ? 'opacity-30' : 'opacity-100',
           ]">
        <div class="transition-all duration-500"
             :class="filled(i - 1) ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"
             :style="{ transitionDelay: filled(i - 1) ? `${(i - 1) * 60}ms` : '0ms' }">
          <div v-if="unknown && filled(i - 1) && !isStruck(i - 1)" class="font-mono text-lg font-bold" :class="isCandidate(i - 1) ? 'text-green' : 'text-violetlt'">?</div>
          <div v-else class="i-ph-lock-simple-fill text-lg" :class="showHighlight(i - 1) ? 'text-amber' : 'text-violetlt/80'" />
        </div>
        <div class="pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-500" :class="isStruck(i - 1) ? 'opacity-100' : 'opacity-0'">
          <div class="i-ph-x-bold text-3xl text-red" />
        </div>
      </div>
      <div class="mt-1 text-center font-mono text-[0.62rem] text-muted">pos {{ i - 1 }}</div>
      <div class="text-center text-[0.62rem] font-semibold text-amber transition-opacity duration-500" :class="showHighlight(i - 1) ? 'opacity-100' : 'opacity-0'">{{ highlightLabel }}</div>
    </div>

    <!-- right pane: root history -->
    <div v-if="pane === 'roots'" class="pane-cyan absolute top-2 h-[180px] w-[285px] px-4 py-3.5" :style="{ left: `${PANE_X}px` }">
      <div class="eyebrow !text-cyan">root after each block</div>
      <div class="mt-3 space-y-2">
        <div v-for="(r, k) in roots" :key="k" class="flex items-center gap-3 rounded-lg bg-white/4 px-3 py-1.5">
          <span class="w-16 font-mono text-[0.7rem] text-orange">{{ r.label }}</span>
          <Scramble :value="shortHex(r.seed, 4)" class="text-xs text-white" />
          <span v-if="r.note" class="ml-auto text-[0.62rem] text-muted">{{ r.note }}</span>
        </div>
      </div>
    </div>

    <!-- right pane: nullifier set -->
    <div v-if="pane === 'nullifiers'" class="pane-violet absolute top-2 h-[230px] w-[285px] px-4 py-3.5" :style="{ left: `${PANE_X}px` }">
      <div class="flex items-center gap-2">
        <div class="i-ph-list-checks-duotone text-lg text-violet" />
        <span class="eyebrow !text-violetlt">nullifier set</span>
      </div>
      <div class="mt-0.5 text-[0.66rem] text-muted">every spend ever accepted</div>
    </div>
    <template v-if="pane === 'nullifiers'">
      <div v-for="(seed, k) in existing" :key="seed" class="absolute flex h-7 items-center rounded-md bg-white/6 px-2.5"
           :style="{ left: `${PANE_X + 18}px`, top: `${ROW0 + k * ROW_H}px` }">
        <span class="font-mono text-xs text-body/70">{{ fakeHex(seed, 16) }}</span>
      </div>
    </template>

    <!-- the new nullifier, travelling from the note to the set -->
    <div v-if="nfAt" class="absolute z-10 flex h-7 items-center rounded-md border border-violet/60 bg-[#1d1840] px-2.5 shadow-[0_0_18px_rgba(161,140,255,.45)] transition-all duration-700 ease-in-out"
         :style="nfPos">
      <span class="font-mono text-xs text-violetlt">{{ nfValue }}</span>
    </div>

    <!-- the same nullifier, published a second time -->
    <div v-if="dupAt" class="absolute z-20 transition-all duration-700 ease-in-out" :style="dupPos">
      <div class="flex h-7 items-center rounded-md border px-2.5 transition-colors duration-300 delay-700"
           :class="dupAt === 'set' ? 'shake-late border-red bg-[#3a1420] shadow-[0_0_18px_rgba(255,107,129,.5)]' : 'border-violet/60 bg-[#1d1840]'">
        <span class="font-mono text-xs" :class="dupAt === 'set' ? 'text-red' : 'text-violetlt'">{{ nfValue }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* the duplicate shakes once it has landed, not while it travels */
.shake-late { animation: shake-once 0.45s cubic-bezier(.36, .07, .19, .97) 0.75s both; }
</style>
