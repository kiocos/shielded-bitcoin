<script setup lang="ts">
import { computed } from 'vue'

/**
 * A small piece of the public Bitcoin transaction graph, and what can be read
 * off it. Drawn once and annotated in place, click by click:
 *
 *   0 — addresses and transactions, the bare graph
 *   1 — every amount is on it
 *   2 — clustering: inputs spent together, and the change, read as one owner
 *   3 — one address tied to an identity, and the whole cluster with it
 *
 * Everything is in one SVG with a fixed viewBox and uniform scaling, so text and
 * strokes scale together and nothing has to be re-derived at another size.
 */
const props = withDefaults(defineProps<{ clicks?: number }>(), { clicks: 0 })

type Addr = { id: string; x: number; y: number; label: string }
type Tx = { id: string; x: number; y: number }

const addrs: Addr[] = [
  { id: 'a1', x: 70, y: 66, label: 'bc1q…3fa' },
  { id: 'a2', x: 70, y: 224, label: 'bc1q…8d1' },
  { id: 'a3', x: 430, y: 52, label: 'bc1q…k7m' },
  { id: 'a4', x: 430, y: 238, label: 'bc1q…2wq' },
  { id: 'a5', x: 790, y: 34, label: 'bc1q…9xe' },
  { id: 'a6', x: 790, y: 132, label: 'bc1q…u4t' },
  { id: 'a7', x: 790, y: 250, label: 'bc1q…h0c' },
]
const txs: Tx[] = [
  { id: 't1', x: 250, y: 145 },
  { id: 't2', x: 610, y: 84 },
  { id: 't3', x: 610, y: 244 },
]
const R = 16
const TX = { hw: 30, hh: 17 }

const node = (id: string) => addrs.find(a => a.id === id) ?? txs.find(t => t.id === id)!
const isTx = (id: string) => id.startsWith('t')

/** Trim a segment so it starts and ends on the node outlines, not their centres. */
function trim(fromId: string, toId: string) {
  const p = node(fromId)
  const q = node(toId)
  const dx = q.x - p.x
  const dy = q.y - p.y
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  const cut = (id: string) => isTx(id)
    ? Math.min(TX.hw / Math.abs(ux || 1e-6), TX.hh / Math.abs(uy || 1e-6))
    : R
  const a = cut(fromId) + 2
  const b = cut(toId) + 7
  return { x1: p.x + ux * a, y1: p.y + uy * a, x2: q.x - ux * b, y2: q.y - uy * b }
}

const edges = [
  { from: 'a1', to: 't1', amt: '0.30', dy: -8 },
  { from: 'a2', to: 't1', amt: '0.25', dy: 16 },
  { from: 't1', to: 'a3', amt: '0.50', dy: -8 },
  { from: 't1', to: 'a4', amt: '0.0495', dy: 16 },
  { from: 'a3', to: 't2', amt: '0.50', dy: -8 },
  { from: 't2', to: 'a5', amt: '0.20', dy: -8 },
  { from: 't2', to: 'a6', amt: '0.2996', dy: 16 },
  { from: 'a4', to: 't3', amt: '0.0495', dy: -8 },
  { from: 't3', to: 'a7', amt: '0.0492', dy: -8 },
].map(e => ({ ...e, ...trim(e.from, e.to) }))

const cluster = new Set(['a1', 'a2', 'a4'])
const clusterEdges = new Set(['a1-t1', 'a2-t1', 't1-a4'])

const showAmounts = computed(() => props.clicks >= 1)
const showCluster = computed(() => props.clicks >= 2)
const showIdentity = computed(() => props.clicks >= 3)

const addrStroke = (id: string) => (showCluster.value && cluster.has(id)) ? '#ffc24b' : 'rgba(221,225,242,.45)'
const addrFill = (id: string) => (showCluster.value && cluster.has(id)) ? 'rgba(255,194,75,.18)' : '#0d1022'
const edgeStroke = (key: string) => {
  if (showIdentity.value && key === 't1-a3')
    return '#ffc24b'
  if (showCluster.value && clusterEdges.has(key))
    return 'rgba(255,194,75,.7)'
  return 'rgba(221,225,242,.28)'
}
</script>

<template>
  <svg viewBox="0 0 860 290" class="w-full" aria-hidden="true">
    <defs>
      <marker id="pg-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="rgba(221,225,242,.55)" />
      </marker>
      <filter id="pg-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    <!-- the cluster hull, behind everything -->
    <path
      d="M40 40 Q20 145 40 250 Q160 300 455 268 Q470 230 440 205 Q300 190 290 145 Q300 90 110 38 Q60 26 40 40 Z"
      fill="rgba(255,194,75,.06)" stroke="rgba(255,194,75,.35)" stroke-dasharray="4 5"
      style="transition: opacity .6s ease" :style="{ opacity: showCluster ? 1 : 0 }"
    />

    <!-- edges -->
    <g v-for="e in edges" :key="`${e.from}-${e.to}`">
      <line
        :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2"
        :stroke="edgeStroke(`${e.from}-${e.to}`)" stroke-width="1.6" marker-end="url(#pg-arrow)"
        style="transition: stroke .5s ease"
      />
      <text
        :x="(e.x1 + e.x2) / 2" :y="(e.y1 + e.y2) / 2 + e.dy"
        text-anchor="middle" class="font-mono" font-weight="600" fill="#f7931a"
        style="font-size: 12.5px; transition: opacity .5s ease" :style="{ opacity: showAmounts ? 1 : 0 }"
      >{{ e.amt }}</text>
    </g>

    <!-- transactions -->
    <g v-for="t in txs" :key="t.id">
      <rect :x="t.x - TX.hw" :y="t.y - TX.hh" :width="TX.hw * 2" :height="TX.hh * 2" rx="7"
            fill="rgba(247,147,26,.10)" stroke="rgba(247,147,26,.55)" stroke-width="1.3" />
      <text :x="t.x" :y="t.y + 4.5" text-anchor="middle" class="font-mono" style="font-size: 12px" fill="#f7931a">tx</text>
    </g>

    <!-- addresses -->
    <g v-for="a in addrs" :key="a.id">
      <circle :cx="a.x" :cy="a.y" :r="R" :fill="addrFill(a.id)" :stroke="addrStroke(a.id)" stroke-width="1.6"
              style="transition: fill .5s ease, stroke .5s ease" />
      <text :x="a.x" :y="a.y + 33" text-anchor="middle" class="font-mono" style="font-size: 11px" fill="#8a90ae">{{ a.label }}</text>
    </g>

    <!-- the clustering heuristic, named where it applies -->
    <g style="transition: opacity .5s ease" :style="{ opacity: showCluster ? 1 : 0 }">
      <text x="150" y="268" text-anchor="middle" style="font-size: 12px" fill="#ffc24b" font-weight="600">likely one owner</text>
    </g>

    <!-- identity -->
    <g style="transition: opacity .5s ease" :style="{ opacity: showIdentity ? 1 : 0 }" filter="url(#pg-glow)">
      <rect x="20" y="0" width="100" height="24" rx="12" fill="rgba(255,107,129,.16)" stroke="rgba(255,107,129,.6)" />
      <text x="70" y="16.5" text-anchor="middle" style="font-size: 11.5px" font-weight="700" fill="#ff6b81">KYC'd withdrawal</text>
    </g>
    <g style="transition: opacity .5s ease .25s" :style="{ opacity: showIdentity ? 1 : 0 }">
      <text x="340" y="20" text-anchor="middle" style="font-size: 12.5px" font-weight="700" fill="#ffc24b">likely Alice’s 0.50 payment</text>
    </g>
  </svg>
</template>
