<script setup lang="ts">
import { computed } from 'vue'
import { fakeHex } from '../utils/hex'

/**
 * What a note is, and what of it reaches the chain.
 *
 * Left: the plaintext, which only wallets ever hold — three fields, nothing
 * else. Right: what Bitcoin carries for that note — an ephemeral public key and
 * a ciphertext. The arrow between them is encryption to the recipient.
 *
 *   1 the three plaintext fields
 *   2 the two values derived from the seed (not extra note-plaintext fields)
 *   3 encryption: the public side fills in
 *   4 the tree leaf is computed from the public side
 *
 * The field values are illustrative. The one real size is the diversifier: 11
 * bytes in the paper's implementation profile.
 */
const props = withDefaults(defineProps<{ clicks?: number }>(), { clicks: 0 })
const at = (n: number) => props.clicks >= n

const blank = (n: number) => '·'.repeat(n)
const pkEph = computed(() => at(3) ? fakeHex('pk-eph', 22) : blank(22))
const ct1 = computed(() => at(3) ? fakeHex('ct-note-1', 22) : blank(22))
const ct2 = computed(() => at(3) ? fakeHex('ct-note-2', 22) : blank(22))
const ct3 = computed(() => at(3) ? fakeHex('ct-note-3', 22) : blank(22))
</script>

<template>
  <div class="relative mx-auto grid w-[871px] grid-cols-[318px_1fr_318px] items-start">
    <!-- plaintext: wallets only -->
    <div class="pane-amber px-5 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="i-ph-note-duotone text-xl text-amber" />
          <span class="text-base text-white font-bold">a note</span>
        </div>
        <span class="chip-amber !text-[0.62rem]"><span class="i-ph-lock-key-open-duotone" /> only in wallets</span>
      </div>

      <div class="mt-3.5 space-y-2.5">
        <div class="reveal flex items-baseline gap-3" :class="at(1) || 'reveal-off'">
          <span class="sym w-12 text-amber">v</span>
          <div>
            <div class="font-mono text-sm text-white">50 000 sat</div>
            <div class="text-[0.7rem] text-muted">the amount</div>
          </div>
        </div>
        <div class="reveal flex items-baseline gap-3" :class="at(1) || 'reveal-off'" style="transition-delay: .12s">
          <span class="sym w-12 text-amber">d</span>
          <div>
            <div class="font-mono text-sm text-white">{{ fakeHex('d-bob', 22) }}</div>
            <div class="text-[0.7rem] text-muted">which of the recipient's addresses</div>
          </div>
        </div>
        <div class="reveal flex items-baseline gap-3" :class="at(1) || 'reveal-off'" style="transition-delay: .24s">
          <span class="sym w-12 text-amber">rseed</span>
          <div>
            <div class="font-mono text-sm text-white">{{ fakeHex('rseed', 22) }}</div>
            <div class="text-[0.7rem] text-muted">fresh randomness, new for every note</div>
          </div>
        </div>
      </div>

      <!-- derived from rseed, not extra plaintext fields -->
      <div class="reveal mt-3.5 border-t border-white/10 pt-3" :class="at(2) || 'reveal-off'">
        <div class="eyebrow !text-[0.6rem]">derived from rseed</div>
        <div class="mt-2 grid grid-cols-2 gap-2">
          <div class="rounded-lg bg-white/4 px-2.5 py-1.5">
            <div class="sym text-sm text-violetlt">ρ</div>
            <div class="text-[0.66rem] text-muted leading-tight">goes into the nullifier</div>
          </div>
          <div class="rounded-lg bg-white/4 px-2.5 py-1.5">
            <div class="sym text-sm text-violetlt">sk_eph</div>
            <div class="text-[0.66rem] text-muted leading-tight">one-time encryption secret</div>
          </div>
        </div>
      </div>
    </div>

    <!-- encryption -->
    <div class="flex flex-col items-center px-3 pt-24">
      <div class="reveal flex w-full flex-col items-center" :class="at(3) || 'reveal-off'">
        <div class="text-center text-xs text-violetlt leading-tight">encrypted to the<br>recipient's address</div>
        <div class="mt-2 flex w-full items-center">
          <div class="h-px flex-1 bg-gradient-to-r from-amber/50 to-violet/70" />
          <div class="i-ph-caret-right-fill -ml-1 text-sm text-violet" />
        </div>
        <div class="i-ph-lock-simple-fill mt-2 text-2xl text-violet glow-pulse" />
      </div>
    </div>

    <!-- public: what Bitcoin carries -->
    <div class="pane-violet px-5 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <BtcMark :size="18" />
          <span class="text-base text-white font-bold">on Bitcoin</span>
        </div>
        <span class="chip-violet !text-[0.62rem]"><span class="i-ph-eye-duotone" /> anyone can read</span>
      </div>

      <div class="mt-3.5 space-y-3">
        <div>
          <div class="sym text-xs text-violetlt">pk_eph</div>
          <Scramble :value="pkEph" class="text-sm" :class="at(3) ? 'text-body' : 'text-muted/40'" />
          <div class="text-[0.66rem] text-muted">one-time public key</div>
        </div>
        <div>
          <div class="sym text-xs text-violetlt">ct_note</div>
          <div class="text-sm leading-snug" :class="at(3) ? 'cipher' : 'text-muted/40'">
            <div><Scramble :value="ct1" :duration="800" /></div>
            <div><Scramble :value="ct2" :duration="950" /></div>
            <div><Scramble :value="ct3" :duration="1100" /></div>
          </div>
          <div class="text-[0.66rem] text-muted">the note, encrypted</div>
        </div>
      </div>

      <div class="reveal mt-3.5 border-t border-white/10 pt-3" :class="at(4) || 'reveal-off'">
        <div class="flex items-center gap-2 text-xs">
          <div class="i-ph-tree-structure-duotone text-base text-cyan" />
          <span class="text-body">its tree leaf is computed from these bytes</span>
        </div>
      </div>
    </div>
  </div>
</template>
