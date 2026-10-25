<script setup lang="ts">
import { computed } from 'vue'
import { fakeHex } from '../utils/hex'

/**
 * The anchor and its window.
 *
 * A row of Bitcoin blocks, each with the root that replay stored for it. The
 * rightmost is H, the block being replayed. A transfer names one earlier height,
 * h_anchor, and proves its notes are in the root stored at that height. Replay
 * accepts it only if H − W ≤ h_anchor ≤ H − 1.
 *
 *   1 the window          2 the wallet picks an anchor
 *   3 blocks pass before the envelope is mined: the anchor falls out → expired
 *   4 rebuild against a newer anchor — the notes were never at risk
 *
 * Not to scale: the paper's profile sets W = 100 blocks; ten are drawn. The
 * slide says so in its notes. Blocks live on a track that slides left as time
 * passes; the window and the H labels are fixed to the viewport, because they
 * are defined relative to whichever block is being replayed.
 */
const props = withDefaults(defineProps<{ clicks?: number }>(), { clicks: 0 })
const at = (n: number) => props.clicks >= n

const PITCH = 58
const BLOCK = 46
const SLOTS = 15
const H_SLOT = 14
const WIN_FROM = 4
const WIN_TO = 13
const TRACK = 28
const ANCHOR = 11
const SHIFT = 8

const shift = computed(() => at(3) ? SHIFT : 0)
const slotOf = (k: number) => k - shift.value
const inWindow = (k: number) => slotOf(k) >= WIN_FROM && slotOf(k) <= WIN_TO
const isH = (k: number) => slotOf(k) === H_SLOT

const firstExpired = computed(() => at(3))
</script>

<template>
  <div class="relative mx-auto h-[262px] w-[871px]">
    <!-- the window, fixed relative to H -->
    <div class="reveal absolute top-0" :class="at(1) || 'reveal-off'"
         :style="{ left: `${WIN_FROM * PITCH}px`, width: `${(WIN_TO - WIN_FROM + 1) * PITCH - (PITCH - BLOCK)}px` }">
      <div class="text-center text-xs font-semibold text-green">valid anchors — the last W blocks</div>
      <div class="mt-1 h-3 rounded-t-md border-x-2 border-t-2 border-green/50" />
    </div>

    <!-- the blocks -->
    <div class="absolute left-0 top-[40px] h-[210px] w-full overflow-hidden track-mask">
      <div class="absolute left-0 top-0 h-full transition-transform duration-[1400ms] ease-in-out"
           :style="{ transform: `translateX(${-shift * PITCH}px)` }">
        <div v-for="k in TRACK" :key="k" class="absolute top-0" :style="{ left: `${(k - 1) * PITCH}px` }">
          <div class="grid place-items-center rounded-lg border-2 transition-all duration-700"
               :style="{ width: `${BLOCK}px`, height: `${BLOCK}px`, transitionDelay: at(3) ? '1100ms' : '0ms' }"
               :class="isH(k - 1) ? 'border-dashed border-orange/70 bg-orange/5'
                   : inWindow(k - 1) && at(1) ? 'border-orange/60 bg-orange/14'
                     : 'border-orange/30 bg-orange/6'">
            <span class="font-mono text-[0.56rem]" :class="isH(k - 1) ? 'text-orange/70' : 'text-orange/80'">{{ isH(k - 1) ? 'replay' : fakeHex(`blk-${k}`, 4) }}</span>
          </div>
        </div>

        <!-- the first anchor -->
        <div class="reveal absolute top-[60px] flex flex-col items-center" :class="at(2) || 'reveal-off'"
             :style="{ left: `${ANCHOR * PITCH + BLOCK / 2}px`, transform: 'translateX(-50%)' }">
          <div class="h-10 w-px transition-colors duration-500" :style="{ transitionDelay: firstExpired ? '1300ms' : '0ms' }"
               :class="firstExpired ? 'bg-red/70' : 'bg-violet/70'" />
          <div class="rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-500"
               :style="{ transitionDelay: firstExpired ? '1300ms' : '0ms' }"
               :class="firstExpired ? 'border-red/70 bg-red/14 text-red' : 'border-violet/60 bg-violet/16 text-violetlt'">
            <span class="sym">h_anchor</span>
          </div>
          <div class="mt-1.5 whitespace-nowrap text-center text-[0.68rem] transition-colors duration-500" :style="{ transitionDelay: firstExpired ? '1300ms' : '0ms' }"
               :class="firstExpired ? 'text-red' : 'text-muted'">
            {{ firstExpired ? 'expired — out of the window' : 'proof built against this root' }}
          </div>
        </div>

        <!-- the rebuilt anchor -->
        <div class="reveal absolute top-[60px] flex flex-col items-center" :class="at(4) || 'reveal-off'"
             :style="{ left: `${(ANCHOR + SHIFT) * PITCH + BLOCK / 2}px`, transform: 'translateX(-50%)' }">
          <div class="h-10 w-px bg-green/70" />
          <div class="rounded-full border border-green/60 bg-green/14 px-3 py-1 text-xs font-semibold text-green">
            <span class="sym">new h_anchor</span>
          </div>
          <div class="mt-1.5 whitespace-nowrap text-center text-[0.68rem] text-muted">same notes, fresh proof</div>
        </div>
      </div>
    </div>

    <!-- fixed labels under the window edges and H -->
    <div class="absolute top-[94px] -translate-x-1/2 font-mono text-[0.66rem] text-muted transition-opacity duration-500" :class="at(1) ? 'opacity-100' : 'opacity-0'"
         :style="{ left: `${WIN_FROM * PITCH + BLOCK / 2}px` }">H − W</div>
    <div class="absolute top-[94px] -translate-x-1/2 font-mono text-[0.66rem] text-muted transition-opacity duration-500" :class="at(1) ? 'opacity-100' : 'opacity-0'"
         :style="{ left: `${WIN_TO * PITCH + BLOCK / 2}px` }">H − 1</div>
    <div class="absolute top-[94px] -translate-x-1/2 font-mono text-[0.66rem] font-bold text-orange"
         :style="{ left: `${H_SLOT * PITCH + BLOCK / 2}px` }">H</div>
  </div>
</template>

<style scoped>
.track-mask {
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 70px, #000 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 70px, #000 100%);
}
</style>
