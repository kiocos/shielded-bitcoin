<script setup lang="ts">
import { computed } from 'vue'

/**
 * Who does what, as a cycle with Bitcoin at the base.
 *
 *   wallets ── publish ──▶ Bitcoin ── read, in order ──▶ indexers
 *      ▲                                                    │
 *      └──────────────────── state ─────────────────────────┘
 *
 * Bitcoin sits at the bottom on purpose: it is the layer everything else reads
 * from, and the only one with consensus. The two other roles sit above it and
 * talk to each other only through what Bitcoin has published — plus the state
 * that indexers hand back to wallets.
 *
 *   1 Bitcoin   2 indexers   3 wallets
 *   4 an envelope is published   5 indexers read it   6 state goes back to wallets
 *
 * Fixed-pixel geometry (the slide's content box is 871px wide), so the arrows in
 * the SVG overlay land on the card edges exactly. Re-derive the arrow ends if a
 * card moves.
 */
const props = withDefaults(defineProps<{ clicks?: number }>(), { clicks: 0 })

const W = 871
const H = 360
const card = {
  wallet: { x: 0, y: 0, w: 300, h: 128 },
  indexer: { x: 571, y: 0, w: 300, h: 128 },
  bitcoin: { x: 255, y: 228, w: 361, h: 120 },
}

const at = (n: number) => props.clicks >= n

/** The travelling token: where it is, and what it is, at each click. */
const token = computed(() => {
  if (props.clicks >= 6)
    return { x: 300, y: 64, icon: 'i-ph-tree-structure-duotone', color: 'text-cyan', show: true }
  if (props.clicks >= 5)
    return { x: 721, y: 128, icon: 'i-ph-envelope-simple-fill', color: 'text-violet', show: true }
  if (props.clicks >= 4)
    return { x: 255, y: 284, icon: 'i-ph-envelope-simple-fill', color: 'text-violet', show: true }
  return { x: 150, y: 128, icon: 'i-ph-envelope-simple-fill', color: 'text-violet', show: false }
})
</script>

<template>
  <div class="relative mx-auto" :style="{ width: `${W}px`, height: `${H}px` }">
    <!-- arrows -->
    <svg class="pointer-events-none absolute inset-0" :width="W" :height="H" aria-hidden="true">
      <defs>
        <marker id="tr-arrow-v" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#a18cff" />
        </marker>
        <marker id="tr-arrow-c" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#4cc9f0" />
        </marker>
      </defs>
      <!-- publish: wallets → Bitcoin -->
      <path d="M150 136 C150 200 220 266 247 278" fill="none" stroke="#a18cff" stroke-width="1.6" stroke-dasharray="5 5"
            marker-end="url(#tr-arrow-v)" class="transition-opacity duration-500" :class="at(4) ? 'opacity-90' : 'opacity-0'" />
      <!-- read: Bitcoin → indexers -->
      <path d="M624 278 C652 266 721 200 721 136" fill="none" stroke="#4cc9f0" stroke-width="1.6" stroke-dasharray="5 5"
            marker-end="url(#tr-arrow-c)" class="transition-opacity duration-500" :class="at(5) ? 'opacity-90' : 'opacity-0'" />
      <!-- state: indexers → wallets -->
      <path d="M563 64 L308 64" fill="none" stroke="#4cc9f0" stroke-width="1.6" stroke-dasharray="5 5"
            marker-end="url(#tr-arrow-c)" class="transition-opacity duration-500" :class="at(6) ? 'opacity-90' : 'opacity-0'" />
    </svg>

    <!-- arrow labels -->
    <div class="absolute text-xs text-violetlt transition-opacity duration-500" :class="at(4) ? 'opacity-100' : 'opacity-0'"
         style="left: 60px; top: 222px">publish an envelope</div>
    <div class="absolute text-xs text-cyan transition-opacity duration-500" :class="at(5) ? 'opacity-100' : 'opacity-0'"
         style="left: 705px; top: 222px">read, in block order</div>
    <div class="absolute w-[263px] text-center text-xs text-cyan transition-opacity duration-500" :class="at(6) ? 'opacity-100' : 'opacity-0'"
         style="left: 304px; top: 38px">note tree · roots · Merkle paths</div>

    <!-- Bitcoin -->
    <div class="pane-orange reveal absolute px-5 py-4" :class="at(1) || 'reveal-off'"
         :style="{ left: `${card.bitcoin.x}px`, top: `${card.bitcoin.y}px`, width: `${card.bitcoin.w}px`, height: `${card.bitcoin.h}px` }">
      <div class="flex items-center gap-2.5">
        <BtcMark :size="24" />
        <div class="text-lg text-white font-bold">Bitcoin</div>
      </div>
      <div class="mt-2 space-y-0.5 text-sm text-body/90">
        <div>stores the envelope bytes, and orders them</div>
      </div>
      <div class="mt-2.5"><span class="chip-red"><span class="i-ph-x-circle-fill" /> checks nothing about the transfer</span></div>
    </div>

    <!-- indexers -->
    <div class="pane-cyan reveal absolute px-5 py-4" :class="at(2) || 'reveal-off'"
         :style="{ left: `${card.indexer.x}px`, top: `${card.indexer.y}px`, width: `${card.indexer.w}px`, height: `${card.indexer.h}px` }">
      <div class="flex items-center gap-2.5">
        <div class="i-ph-cpu-duotone text-2xl text-cyan" />
        <div class="text-lg text-white font-bold">Indexers</div>
      </div>
      <div class="mt-2 space-y-0.5 text-sm text-body/90">
        <div>replay every envelope, in order</div>
        <div>verify every proof</div>
        <div>keep the shielded state</div>
      </div>
    </div>

    <!-- wallets -->
    <div class="pane-violet reveal absolute px-5 py-4" :class="at(3) || 'reveal-off'"
         :style="{ left: `${card.wallet.x}px`, top: `${card.wallet.y}px`, width: `${card.wallet.w}px`, height: `${card.wallet.h}px` }">
      <div class="flex items-center gap-2.5">
        <div class="i-ph-wallet-duotone text-2xl text-violet" />
        <div class="text-lg text-white font-bold">Wallets</div>
      </div>
      <div class="mt-2 space-y-0.5 text-sm text-body/90">
        <div>hold the keys</div>
        <div>build and prove transfers</div>
        <div>find their own notes</div>
      </div>
    </div>

    <!-- the travelling token -->
    <div
      class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out"
      :style="{ left: `${token.x}px`, top: `${token.y}px`, opacity: token.show ? 1 : 0 }"
    >
      <div class="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-bg">
        <div class="text-xl" :class="[token.icon, token.color]" />
      </div>
    </div>
  </div>
</template>
