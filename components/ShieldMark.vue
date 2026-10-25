<script setup lang="ts">
/**
 * The cover mark: a shield drawn around the Bitcoin mark.
 *
 * Everything here is a keyframe animation rather than a Vue transition, because
 * Slidev hides inactive slides with display:none — which restarts CSS
 * animations, so the drawing replays every time the cover is shown.
 *
 * The stroke is drawn with a fixed dasharray in viewBox units. That is safe
 * here because the SVG scales uniformly (no preserveAspectRatio="none") and the
 * stroke is not non-scaling, so the dash length always matches the path.
 */
withDefaults(defineProps<{ size?: number }>(), { size: 176 })

const base = import.meta.env.BASE_URL
const SHIELD = 'M60 6 L106 22 V64 C106 98 86 120 60 134 C34 120 14 98 14 64 V22 Z'
</script>

<template>
  <div class="relative grid place-items-center" :style="{ width: `${size}px`, height: `${size * 1.15}px` }">
    <!-- slow orbit behind the shield -->
    <svg class="orbit absolute inset-0 h-full w-full" viewBox="0 0 120 138" aria-hidden="true">
      <ellipse cx="60" cy="70" rx="58" ry="58" fill="none" stroke="rgba(76,201,240,.28)" stroke-width=".6" stroke-dasharray="1.5 4" />
      <circle cx="60" cy="12" r="1.6" fill="#4cc9f0" />
      <circle cx="118" cy="70" r="1.1" fill="#a18cff" />
    </svg>

    <svg class="absolute inset-0 h-full w-full" viewBox="0 0 120 138" aria-hidden="true">
      <defs>
        <linearGradient id="shield-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e9e3ff" />
          <stop offset="45%" stop-color="#a18cff" />
          <stop offset="100%" stop-color="#4cc9f0" />
        </linearGradient>
        <radialGradient id="shield-fill" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stop-color="rgba(161,140,255,.30)" />
          <stop offset="100%" stop-color="rgba(161,140,255,0)" />
        </radialGradient>
      </defs>
      <path class="shield-fill" :d="SHIELD" fill="url(#shield-fill)" />
      <path class="shield-draw" :d="SHIELD" fill="none" stroke="url(#shield-stroke)" stroke-width="2.4" stroke-linejoin="round" />
    </svg>

    <img :src="`${base}brand/bitcoin.svg`" alt="" class="btc relative" :style="{ width: `${size * 0.42}px`, height: `${size * 0.42}px`, marginTop: `${size * 0.02}px` }">
  </div>
</template>

<style scoped>
.shield-draw {
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  filter: drop-shadow(0 0 6px rgba(161, 140, 255, 0.7));
  animation: draw 1.7s cubic-bezier(.6, .1, .2, 1) 0.15s forwards;
}
.shield-fill { opacity: 0; animation: fade-in 0.9s ease 1.1s forwards; }
.btc {
  opacity: 0;
  transform: scale(0.6);
  filter: drop-shadow(0 0 18px rgba(247, 147, 26, 0.45));
  animation: pop 0.6s cubic-bezier(.2, .9, .3, 1.25) 1.15s forwards;
}
.orbit { transform-origin: 50% 50.7%; opacity: 0; animation: fade-in 1s ease 1.4s forwards, spin 26s linear 1.4s infinite; }

@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes fade-in { to { opacity: 1; } }
@keyframes pop { to { opacity: 1; transform: scale(1); } }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
