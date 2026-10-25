<script setup lang="ts">
import { computed } from 'vue'
import { fakeHex, shortHex } from '../utils/hex'

/**
 * One transfer, Alice to Bob, end to end — the walkthrough of the paper's
 * Appendix C on one canvas. Two slides drive it with a single `step`, and the
 * second opens exactly where the first left off:
 *
 *   building (slide A)                    settling (slide B)
 *   1 Bob's address reaches Alice         6 indexers read the block and accept it
 *   2 she picks a note; gets its path     7 Bob tries his viewing key, finds his note
 *   3 she creates two output notes        8 Alice's note is spent; her change arrives
 *   4 nullifier, recovery copy, proof
 *   5 the envelope goes into a block
 *
 * Amounts are illustrative. They balance exactly — 0.30 in, 0.20 + 0.10 out —
 * because the shielded transfer has no fee field: the Bitcoin fee is paid by the
 * carrier transaction, from Bitcoin, which the notes call out.
 *
 * Fixed-pixel geometry on the 871px content box. Tokens travel on clear lanes:
 * the address along y≈182 between the indexer card and the Bitcoin row, the
 * envelope from the build zone to the new block, then straight up.
 */
const props = withDefaults(defineProps<{ step?: number }>(), { step: 0 })
const at = (n: number) => props.step >= n

const ALICE = { x: 0, y: 0, w: 200, h: 206 }
const BOB = { x: 671, y: 0, w: 200, h: 206 }
const IDX = { x: 262, y: 0, w: 347, h: 124 }
const BTC = { x: 262, y: 232, w: 347, h: 70 }
const BUILD = { x: 0, y: 222, w: 200, h: 112 }

const BLOCK_X = (i: number) => 372 + i * 46
const NEW_BLOCK = { x: BLOCK_X(4) + 20, y: BTC.y + 35 }

const outputsEncrypted = computed(() => at(4))
const outBob = computed(() => outputsEncrypted.value ? fakeHex('o-bob', 10) : '0.20 → Bob')
const outChange = computed(() => outputsEncrypted.value ? fakeHex('o-chg', 10) : '0.10 → me')

const leaves = computed(() => at(6) ? '1 206' : '1 204')
const nullifiers = computed(() => at(6) ? '584' : '583')
const root = computed(() => shortHex(at(6) ? 'tc-root-2' : 'tc-root-1', 4))

/** Every travelling token: where it is now, and whether it is visible. */
const addrTok = computed(() => ({
  left: `${at(1) ? 100 : 770}px`, top: '182px', opacity: at(1) && !at(5) ? 1 : 0,
}))
const pathTok = computed(() => ({
  left: `${at(2) ? 152 : 400}px`, top: `${at(2) ? 66 : 96}px`, opacity: at(2) && !at(5) ? 1 : 0,
}))
const envTok = computed(() => {
  if (at(6))
    return { left: `${NEW_BLOCK.x}px`, top: `${NEW_BLOCK.y}px`, opacity: 0 }
  if (at(5))
    return { left: `${NEW_BLOCK.x}px`, top: `${NEW_BLOCK.y}px`, opacity: 1 }
  return { left: '100px', top: `${BUILD.y + 56}px`, opacity: 0 }
})
const readTok = computed(() => ({
  left: `${NEW_BLOCK.x}px`, top: `${at(6) ? IDX.y + IDX.h + 4 : NEW_BLOCK.y}px`, opacity: at(6) && !at(7) ? 1 : 0,
}))
const scanTok = computed(() => ({
  left: `${at(7) ? BOB.x + 100 : IDX.x + IDX.w - 40}px`, top: `${at(7) ? 104 : 70}px`, opacity: at(7) ? 1 : 0,
}))
</script>

<template>
  <div class="relative mx-auto h-[336px] w-[871px]">
    <!-- Alice -->
    <div class="pane-amber absolute" :style="{ left: `${ALICE.x}px`, top: `${ALICE.y}px`, width: `${ALICE.w}px`, height: `${ALICE.h}px` }">
      <div class="flex items-center gap-2 px-4 pt-3">
        <div class="i-ph-user-circle-fill text-2xl text-amber" />
        <span class="text-base font-bold text-white">Alice</span>
        <span class="ml-auto text-[0.62rem] text-muted">her notes</span>
      </div>
      <div class="absolute left-4 top-[52px] flex h-[30px] items-center gap-1.5 rounded-lg border px-2.5 transition-all duration-500"
           :class="at(8) ? 'border-white/10 bg-white/3 opacity-45' : at(2) ? 'border-amber bg-amber/18 shadow-[0_0_14px_rgba(255,194,75,.4)]' : 'border-amber/35 bg-amber/8'">
        <div class="i-ph-lock-simple-fill text-xs text-amber" />
        <span class="font-mono text-sm text-white" :class="at(8) ? 'line-through' : ''">0.30</span>
      </div>
      <div class="absolute left-[104px] top-[60px] text-[0.6rem] font-bold uppercase tracking-wider text-red transition-opacity duration-500 delay-500"
           :class="at(8) ? 'opacity-100' : 'opacity-0'">spent</div>
      <div class="absolute left-4 top-[90px] flex h-[30px] items-center gap-1.5 rounded-lg border border-amber/35 bg-amber/8 px-2.5">
        <div class="i-ph-lock-simple-fill text-xs text-amber" />
        <span class="font-mono text-sm text-white">0.12</span>
      </div>
      <div class="absolute left-4 top-[128px] flex h-[30px] items-center gap-1.5 rounded-lg border border-green/60 bg-green/12 px-2.5 transition-all duration-500 delay-500"
           :class="at(8) ? 'opacity-100 scale-100' : 'opacity-0 scale-75'">
        <div class="i-ph-lock-simple-fill text-xs text-green" />
        <span class="font-mono text-sm text-white">0.10</span>
        <span class="text-[0.6rem] text-green">change</span>
      </div>
    </div>

    <!-- Bob -->
    <div class="pane-pink absolute" :style="{ left: `${BOB.x}px`, top: `${BOB.y}px`, width: `${BOB.w}px`, height: `${BOB.h}px` }">
      <div class="flex items-center gap-2 px-4 pt-3">
        <div class="i-ph-user-circle-fill text-2xl text-pink" />
        <span class="text-base font-bold text-white">Bob</span>
      </div>
      <div class="absolute left-4 top-[52px] flex h-[30px] items-center gap-1.5 rounded-lg border border-pink/45 bg-pink/10 px-2.5">
        <div class="i-ph-at-bold text-xs text-pink" />
        <span class="sym text-xs text-pink">(d, pk_d)</span>
        <span class="text-[0.6rem] text-muted">his address</span>
      </div>
      <div class="absolute left-4 top-[128px] transition-all duration-500 delay-700"
           :class="at(7) ? 'opacity-100 scale-100' : 'opacity-0 scale-75'">
        <div class="flex h-[30px] items-center gap-1.5 rounded-lg border border-pink bg-pink/18 px-2.5 shadow-[0_0_14px_rgba(244,114,182,.4)]">
          <div class="i-ph-lock-key-open-duotone text-sm text-pink" />
          <span class="font-mono text-sm text-white">0.20</span>
        </div>
        <div class="mt-1 text-[0.6rem] leading-tight text-muted">decrypted with vk_in<br>received after replay</div>
      </div>
    </div>

    <!-- indexers -->
    <div class="absolute rounded-2xl border px-4 py-3 transition-all duration-500"
         :class="at(6) ? 'border-green/55 bg-green/6' : 'border-cyan/40 bg-cyan/6'"
         :style="{ left: `${IDX.x}px`, top: `${IDX.y}px`, width: `${IDX.w}px`, height: `${IDX.h}px`, transitionDelay: at(6) ? '700ms' : '0ms' }">
      <div class="flex items-center gap-2">
        <div class="i-ph-cpu-duotone text-lg text-cyan" />
        <span class="text-sm font-bold text-white">indexers</span>
        <span class="ml-auto chip-green !text-[0.6rem] transition-opacity duration-500 delay-700" :class="at(6) ? 'opacity-100' : 'opacity-0'">
          <span class="i-ph-check-circle-fill" /> accepted
        </span>
      </div>
      <div class="mt-2.5 grid grid-cols-3 gap-2">
        <div class="rounded-lg bg-white/4 px-2 py-1.5">
          <div class="text-[0.58rem] text-muted">leaves</div>
          <Scramble :value="leaves" charset="0123456789" class="text-xs text-white" />
        </div>
        <div class="rounded-lg bg-white/4 px-2 py-1.5">
          <div class="text-[0.58rem] text-muted">nullifiers</div>
          <Scramble :value="nullifiers" charset="0123456789" class="text-xs text-white" />
        </div>
        <div class="rounded-lg bg-white/4 px-2 py-1.5">
          <div class="text-[0.58rem] text-muted">root</div>
          <Scramble :value="root" class="text-xs text-white" />
        </div>
      </div>
    </div>

    <!-- Bitcoin -->
    <div class="pane-orange absolute" :style="{ left: `${BTC.x}px`, top: `${BTC.y}px`, width: `${BTC.w}px`, height: `${BTC.h}px` }">
      <div class="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
        <BtcMark :size="20" />
        <span class="text-sm font-bold text-white">Bitcoin</span>
      </div>
    </div>
    <div v-for="i in 5" :key="i" class="absolute grid place-items-center rounded-md border transition-all duration-500"
         :class="i === 5 ? (at(5) ? 'border-orange bg-orange/20 opacity-100 delay-700' : 'border-dashed border-orange/40 opacity-60') : 'border-orange/45 bg-orange/10'"
         :style="{ left: `${BLOCK_X(i - 1)}px`, top: `${BTC.y + 18}px`, width: '40px', height: '34px' }">
      <div v-if="i === 5" class="i-ph-envelope-simple-fill text-sm text-violet transition-opacity duration-500 delay-700" :class="at(5) ? 'opacity-100' : 'opacity-0'" />
    </div>

    <!-- the envelope, being built -->
    <div class="pane-violet absolute px-3.5 py-2.5" :style="{ left: `${BUILD.x}px`, top: `${BUILD.y}px`, width: `${BUILD.w}px`, height: `${BUILD.h}px` }">
      <div class="eyebrow !text-[0.58rem] !text-violetlt">Alice's envelope</div>
      <div class="mt-1.5 space-y-1">
        <div class="reveal flex items-center gap-2" :class="at(3) || 'reveal-off'">
          <span class="sym w-10 text-[0.62rem] text-violetlt">out</span>
          <Scramble :value="outBob" class="text-[0.68rem]" :class="outputsEncrypted ? 'cipher' : 'text-white'" />
        </div>
        <div class="reveal flex items-center gap-2" :class="at(3) || 'reveal-off'">
          <span class="sym w-10 text-[0.62rem] text-violetlt">out</span>
          <Scramble :value="outChange" class="text-[0.68rem]" :class="outputsEncrypted ? 'cipher' : 'text-white'" />
        </div>
        <div class="reveal flex items-center gap-1.5 pt-0.5" :class="at(4) || 'reveal-off'">
          <span class="chip-violet !px-1.5 !py-0 !text-[0.58rem]">nf</span>
          <span class="chip-amber !px-1.5 !py-0 !text-[0.58rem]">ct_out</span>
          <span class="chip-cyan !px-1.5 !py-0 !text-[0.58rem]">h_body</span>
          <span class="chip-violet !px-1.5 !py-0 !text-[0.58rem]">π</span>
        </div>
      </div>
    </div>

    <!-- tokens -->
    <div class="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-[900ms] ease-in-out" :style="addrTok">
      <div class="flex items-center gap-1.5 rounded-full border border-pink/60 bg-[#2a1226] px-2.5 py-1">
        <div class="i-ph-at-bold text-xs text-pink" />
        <span class="whitespace-nowrap text-[0.62rem] font-semibold text-pink">Bob's address</span>
      </div>
    </div>
    <div class="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-[900ms] ease-in-out" :style="pathTok">
      <div class="flex items-center gap-1 rounded-full border border-cyan/60 bg-[#0d2430] px-2 py-0.5">
        <div class="i-ph-tree-structure-duotone text-xs text-cyan" />
        <span class="whitespace-nowrap text-[0.58rem] font-semibold text-cyan">root + path</span>
      </div>
    </div>
    <div class="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-[900ms] ease-in-out" :style="envTok">
      <div class="grid h-8 w-8 place-items-center rounded-full border border-violet/60 bg-[#1b1740] shadow-[0_0_16px_rgba(161,140,255,.5)]">
        <div class="i-ph-envelope-simple-fill text-base text-violet" />
      </div>
    </div>
    <div class="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out" :style="readTok">
      <div class="grid h-8 w-8 place-items-center rounded-full border border-cyan/60 bg-[#0d2430]">
        <div class="i-ph-envelope-simple-fill text-base text-cyan" />
      </div>
    </div>
    <div class="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out" :style="scanTok">
      <div class="flex items-center gap-1 rounded-full border border-pink/60 bg-[#2a1226] px-2 py-0.5">
        <div class="i-ph-scan-duotone text-xs text-pink" />
        <span class="whitespace-nowrap text-[0.58rem] font-semibold text-pink">try vk_in</span>
      </div>
    </div>
  </div>
</template>
