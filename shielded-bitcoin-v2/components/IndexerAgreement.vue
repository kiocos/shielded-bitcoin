<script setup lang="ts">
import { computed } from 'vue'
import { shortHex } from '../utils/hex'

/**
 * Replay agreement, and what a dishonest indexer can and cannot do
 *
 *   1 two honest indexers replay the same blocks and get the same root
 *   2 a third reports a different one
 *   3 a wallet that replays (or checks against Bitcoin data) gets the honest
 *     root, so the odd one out is visible
 *
 * The lie in step 2 is the only kind available: the indexer can report any root
 * it likes, or leave envelopes out, but it cannot make that root agree with an
 * independent replay of the same blocks. A wallet that never checks has no way
 * to notice — which is the trust assumption the slide closes on
 */
const props = withDefaults(defineProps<{ clicks?: number }>(), { clicks: 0 })
const at = (n: number) => props.clicks >= n

const honest = shortHex('replay-root', 5)
const bogus = shortHex('bogus-root', 5)
const blank = '·····…·····'

const cards = computed(() => [
  { name: 'indexer A', root: at(1) ? honest : blank, shown: at(1), bad: false },
  { name: 'indexer B', root: at(1) ? honest : blank, shown: at(1), bad: false },
  { name: 'indexer C', root: at(2) ? bogus : blank, shown: at(2), bad: true },
])

const CARD_W = 270
const GAP = (871 - CARD_W * 3) / 2
const cardX = (i: number) => i * (CARD_W + GAP)
</script>

<template>
  <div class="relative mx-auto h-[318px] w-[871px]">
    <!-- the shared input -->
    <div class="pane-orange absolute left-1/2 top-0 flex -translate-x-1/2 items-center gap-3 px-4 py-2.5">
      <BtcMark :size="20" />
      <div v-for="b in 6" :key="b" class="grid h-8 w-11 place-items-center rounded-md border border-orange/45 bg-orange/10">
        <div v-if="b % 2" class="i-ph-envelope-simple-fill text-xs text-violet/80" />
      </div>
      <span class="text-xs text-orange">the same blocks</span>
    </div>

    <!-- reading lines -->
    <svg class="pointer-events-none absolute left-0 top-0" width="871" height="140" aria-hidden="true">
      <path v-for="i in 3" :key="i" :d="`M 435 58 C 435 90, ${cardX(i - 1) + CARD_W / 2} 84, ${cardX(i - 1) + CARD_W / 2} 116`"
            fill="none" stroke="rgba(247,147,26,.45)" stroke-width="1.4" stroke-dasharray="4 4"
            class="transition-opacity duration-500" :class="cards[i - 1].shown ? 'opacity-100' : 'opacity-0'" />
    </svg>

    <!-- indexers -->
    <div v-for="(c, i) in cards" :key="c.name" class="reveal absolute top-[118px]" :class="c.shown || 'reveal-off'"
         :style="{ left: `${cardX(i)}px`, width: `${CARD_W}px` }">
      <div class="rounded-2xl border px-4 py-3 transition-all duration-500"
           :class="at(3) && c.bad ? 'border-red/70 bg-red/10' : at(3) ? 'border-green/55 bg-green/8' : 'border-cyan/40 bg-cyan/6'">
        <div class="flex items-center gap-2">
          <div class="i-ph-cpu-duotone text-lg text-cyan" />
          <span class="text-sm font-semibold text-white">{{ c.name }}</span>
          <div class="ml-auto text-lg transition-opacity duration-500" :class="[at(3) ? 'opacity-100' : 'opacity-0', c.bad ? 'i-ph-x-circle-fill text-red' : 'i-ph-check-circle-fill text-green']" />
        </div>
        <div class="mt-2 flex items-center gap-2">
          <span class="text-[0.66rem] text-muted">reports root</span>
          <Scramble :value="c.root" class="text-sm" :class="c.bad && at(3) ? 'text-red' : 'text-white'" />
        </div>
      </div>
    </div>

    <!-- the wallet that checks -->
    <div class="reveal absolute left-1/2 top-[218px] w-[380px] -translate-x-1/2" :class="at(3) || 'reveal-off'">
      <div class="pane-violet flex items-center gap-3 px-4 py-2.5">
        <div class="i-ph-wallet-duotone text-xl text-violet" />
        <div>
          <div class="text-sm text-white font-semibold">a wallet that replays for itself</div>
          <div class="mt-0.5 flex items-center gap-2">
            <span class="text-[0.66rem] text-muted">computes root</span>
            <Scramble :value="at(3) ? honest : blank" class="text-sm text-green" />
          </div>
        </div>
      </div>
    </div>

    <div class="reveal absolute left-0 right-0 top-[286px] flex justify-center" :class="at(4) || 'reveal-off'">
      <span class="chip-amber !text-xs !px-3.5 !py-1.5"><span class="i-ph-warning-duotone" /> a wallet that does not check is trusting its indexer</span>
    </div>
  </div>
</template>
