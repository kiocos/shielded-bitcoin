<script setup lang="ts">
/**
 * What one transfer proof says, and what it keeps to itself
 *
 * Left, the private witness: everything the wallet knows and never publishes
 * Right, the public statement: the values the proof is checked against, all of
 * them in the envelope (the root is recomputed by the indexer from the anchor
 * height). Between them, the proof
 *
 * Below, the six things the proof establishes — the paper lists nine proved
 * conditions in §14.1; these are the same nine with the bookkeeping ones
 * (positions, the leaf fields matching h_body) folded into their neighbours
 *
 *   1 witness   2 statement   3 the proof   4–6 the conditions, two at a time
 */
const props = withDefaults(defineProps<{ clicks?: number }>(), { clicks: 0 })
const at = (n: number) => props.clicks >= n

const witness = [
  'the notes being spent',
  'their tree positions and Merkle paths',
  'the spend key',
  'the new notes, and who they are for',
]
const statement = [
  'the anchor root and input/output counts',
  'the nullifiers',
  'the output keys and ciphertexts',
  'h_body, the hash of the envelope',
]
const checks = [
  'the spent notes are in the tree',
  'the sender can spend them',
  'each nullifier comes from one of those notes',
  'each ciphertext holds a note being created',
  'amounts are in range, and inputs equal outputs',
  'it is bound to this exact envelope',
]
</script>

<template>
  <div class="mx-auto w-[871px]">
    <div class="grid grid-cols-[300px_1fr_300px] items-stretch">
      <div class="pane-amber reveal px-5 py-3.5" :class="at(1) || 'reveal-off'">
        <div class="flex items-center gap-2">
          <div class="i-ph-lock-key-duotone text-lg text-amber" />
          <span class="eyebrow !text-amber">private · stays in the wallet</span>
        </div>
        <div class="mt-2.5 space-y-1.5">
          <div v-for="w in witness" :key="w" class="flex items-center gap-2 text-[0.8rem] text-body">
            <div class="h-1 w-1 shrink-0 rounded-full bg-amber/70" />{{ w }}
          </div>
        </div>
      </div>

      <div class="reveal relative flex flex-col items-center justify-center" :class="at(3) || 'reveal-off'">
        <div class="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 items-center px-1">
          <div class="h-px flex-1 bg-gradient-to-r from-amber/60 to-violet/60" />
          <div class="w-20" />
          <div class="h-px flex-1 bg-gradient-to-r from-violet/60 to-cyan/60" />
        </div>
        <div class="relative grid h-20 w-20 place-items-center rounded-2xl border border-violet/60 bg-[#17143a] shadow-[0_0_40px_rgba(161,140,255,.35)]">
          <span class="font-mono text-4xl text-violetlt glow-pulse">π</span>
        </div>
        <div class="relative mt-2 text-center text-[0.7rem] text-violetlt leading-tight">zero-knowledge<br>proof</div>
      </div>

      <div class="pane-cyan reveal px-5 py-3.5" :class="at(2) || 'reveal-off'">
        <div class="flex items-center gap-2">
          <div class="i-ph-eye-duotone text-lg text-cyan" />
          <span class="eyebrow !text-cyan">public · supplied to the verifier</span>
        </div>
        <div class="mt-2.5 space-y-1.5">
          <div v-for="s in statement" :key="s" class="flex items-center gap-2 text-[0.8rem] text-body">
            <div class="h-1 w-1 shrink-0 rounded-full bg-cyan/70" />{{ s }}
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-x-8 gap-y-2.5">
      <div v-for="(c, i) in checks" :key="c"
           class="reveal flex items-center gap-3 rounded-xl bg-white/3 px-4 py-2"
           :class="at(4 + Math.floor(i / 2)) || 'reveal-off'"
           :style="{ transitionDelay: `${(i % 2) * 120}ms` }">
        <div class="i-ph-check-circle-fill shrink-0 text-lg text-green" />
        <span class="text-sm text-body">{{ c }}</span>
      </div>
    </div>
  </div>
</template>
