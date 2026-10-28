<script setup lang="ts">
/**
 * The wallet's key hierarchy (paper §6, Table 1), left to right
 *
 *   seed → master ─┬─ spend key ─┬─ nullifier key
 *                  │             └─ incoming viewing key → addresses (d, pk_d)…
 *                  └─ outgoing viewing key
 *
 * Secret derivations use domain-separated KDFs; address generation also uses curve operations
 * The parentage is the point: the nullifier key hangs off the spend key (so one
 * spend authority gives one nullifier per note), the incoming viewing key also
 * hangs off it but is read-only, and the outgoing viewing key hangs off the
 * master, separate from both
 *
 * Colour: amber = private spending/nullifier material, cyan = viewing, violet = public
 */
const props = withDefaults(defineProps<{ clicks?: number }>(), { clicks: 0 })
const at = (n: number) => props.clicks >= n

type Node = { id: string; sym: string; name: string; x: number; y: number; w: number; tone: 'plain' | 'amber' | 'cyan' | 'violet'; at: number }
const nodes: Node[] = [
  { id: 'seed', sym: 'seed', name: 'one random seed', x: 0, y: 150, w: 128, tone: 'plain', at: 0 },
  { id: 'master', sym: 'sk_master', name: 'master secret', x: 168, y: 150, w: 132, tone: 'plain', at: 1 },
  { id: 'spend', sym: 'sk_spend', name: 'can spend', x: 350, y: 84, w: 150, tone: 'amber', at: 2 },
  { id: 'out', sym: 'vk_out', name: 'reads what you sent', x: 350, y: 236, w: 150, tone: 'cyan', at: 5 },
  { id: 'nf', sym: 'sk_nf', name: 'makes nullifiers', x: 552, y: 30, w: 146, tone: 'amber', at: 3 },
  { id: 'in', sym: 'vk_in', name: 'reads what you receive', x: 552, y: 152, w: 146, tone: 'cyan', at: 4 },
]
const edges = [
  ['seed', 'master', 1], ['master', 'spend', 2], ['master', 'out', 5],
  ['spend', 'nf', 3], ['spend', 'in', 4],
] as const

const H = 58
const byId = (id: string) => nodes.find(n => n.id === id)!
const path = (a: string, b: string) => {
  const p = byId(a)
  const q = byId(b)
  const x1 = p.x + p.w
  const x2 = q.x
  const mx = (x1 + x2) / 2
  return `M ${x1} ${p.y} C ${mx} ${p.y}, ${mx} ${q.y}, ${x2 - 4} ${q.y}`
}

const tone = {
  plain: 'border-white/20 bg-white/5',
  amber: 'border-amber/55 bg-amber/10',
  cyan: 'border-cyan/50 bg-cyan/8',
  violet: 'border-violet/50 bg-violet/10',
}
const symTone = { plain: 'text-body', amber: 'text-amber', cyan: 'text-cyan', violet: 'text-violetlt' }

const ADDR_X = 742
const addrs = [{ y: 108, d: 'd₁' }, { y: 152, d: 'd₂' }, { y: 196, d: 'd₃' }]
</script>

<template>
  <div class="relative mx-auto h-[300px] w-[871px]">
    <svg class="pointer-events-none absolute left-0 top-0" width="871" height="300" aria-hidden="true">
      <path v-for="[a, b, n] in edges" :key="`${a}-${b}`" :d="path(a, b)" fill="none"
            stroke="rgba(221,225,242,.35)" stroke-width="1.5"
            class="transition-opacity duration-500" :class="at(n) ? 'opacity-100' : 'opacity-0'" />
      <!-- incoming viewing key → its addresses -->
      <path v-for="a in addrs" :key="a.d" :d="`M ${552 + 146} 152 C ${720} 152, ${720} ${a.y}, ${ADDR_X - 4} ${a.y}`" fill="none"
            stroke="rgba(161,140,255,.45)" stroke-width="1.4"
            class="transition-opacity duration-500" :class="at(4) ? 'opacity-100' : 'opacity-0'" />
    </svg>

    <!-- Only sk_spend authorises spending; sk_nf alone does not -->
    <div class="pointer-events-none absolute rounded-3xl border border-dashed transition-all duration-500"
         :class="at(6) ? 'border-amber/50 bg-amber/4 opacity-100' : 'border-transparent opacity-0'"
         style="left: 338px; top: 40px; width: 174px; height: 82px" />
    <div class="absolute text-[0.62rem] font-bold uppercase tracking-[0.14em] text-amber transition-opacity duration-500"
         :class="at(6) ? 'opacity-100' : 'opacity-0'" style="left: 352px; top: 124px">spend authority</div>

    <div v-for="n in nodes" :key="n.id" class="reveal absolute" :class="at(n.at) || 'reveal-off'"
         :style="{ left: `${n.x}px`, top: `${n.y - H / 2}px`, width: `${n.w}px`, height: `${H}px` }">
      <div class="flex h-full flex-col justify-center rounded-xl border px-3.5 transition-all duration-500"
           :class="[tone[n.tone], at(6) && n.tone === 'cyan' ? '!border-cyan !shadow-[0_0_16px_rgba(76,201,240,.25)]' : '']">
        <div class="sym text-sm font-semibold" :class="symTone[n.tone]">{{ n.sym }}</div>
        <div class="text-[0.68rem] leading-tight text-muted">{{ n.name }}</div>
      </div>
    </div>

    <!-- addresses: public, many per wallet -->
    <div v-for="(a, i) in addrs" :key="a.d" class="reveal absolute" :class="at(4) || 'reveal-off'"
         :style="{ left: `${ADDR_X}px`, top: `${a.y - 16}px`, transitionDelay: `${i * 100}ms` }">
      <div class="flex h-8 w-[129px] items-center gap-2 rounded-lg border border-violet/45 bg-violet/10 px-2.5">
        <div class="i-ph-at-bold text-sm text-violet" />
        <span class="sym text-xs text-violetlt">({{ a.d }}, pk_{{ a.d }})</span>
      </div>
    </div>
    <div class="reveal absolute text-center text-[0.66rem] text-muted" :class="at(4) || 'reveal-off'"
         style="left: 742px; top: 218px; width: 129px">addresses — public,<br>as many as you like</div>

    <!-- read-only label -->
    <div class="absolute text-[0.62rem] font-bold uppercase tracking-[0.14em] text-cyan transition-opacity duration-500"
         :class="at(6) ? 'opacity-100' : 'opacity-0'" style="left: 352px; top: 278px">read-only</div>
  </div>
</template>
