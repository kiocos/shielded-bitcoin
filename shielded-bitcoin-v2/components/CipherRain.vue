<script setup lang="ts">
import { fakeHex } from '../utils/hex'

/**
 * Faint rows of ciphertext drifting behind the cover. Decorative only, and kept
 * dim enough that it never competes with the title. Deterministic bytes, so
 * every export looks the same
 */
const rows = Array.from({ length: 11 }, (_, i) => ({
  text: fakeHex(`rain-${i}`, 150).replace(/(.{8})/g, '$1 '),
  top: 4 + i * 9,
  dir: i % 2 ? 'drift-l' : 'drift-r',
  dur: 60 + (i % 4) * 14,
  op: 0.035 + (i % 3) * 0.015,
}))
</script>

<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden select-none rain-mask" aria-hidden="true">
    <div
      v-for="(r, i) in rows" :key="i"
      class="absolute left-[-30%] whitespace-nowrap font-mono text-[0.7rem] tracking-[0.2em] text-violetlt"
      :class="r.dir"
      :style="{ top: `${r.top}%`, opacity: r.op, animationDuration: `${r.dur}s` }"
    >
      {{ r.text }}
    </div>
  </div>
</template>

<style scoped>
.rain-mask {
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, transparent 18%, #000 70%);
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, transparent 18%, #000 70%);
}
.drift-r { animation: drift-r linear infinite; }
.drift-l { animation: drift-l linear infinite; }
@keyframes drift-r { from { transform: translateX(-8%); } to { transform: translateX(8%); } }
@keyframes drift-l { from { transform: translateX(8%); } to { transform: translateX(-8%); } }
</style>
