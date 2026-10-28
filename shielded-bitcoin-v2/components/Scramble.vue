<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

/**
 * Text that re-rolls its characters when its value changes, settling left to
 * right on the new value. Used for every hash, root and ciphertext that changes
 * on a click: a root that is recomputed visibly *recomputes*
 *
 * Deliberately does nothing on mount. Slidev mounts every slide at page load
 * and hides the inactive ones, so an animation keyed to mount would play
 * invisibly at startup. It only runs when the value changes — which happens on
 * a click, while the slide is on screen
 *
 * Characters in `keep` (spaces, the ellipsis, punctuation) are never scrambled,
 * so the shape of the string holds still while its bytes change
 */
const props = withDefaults(
  defineProps<{ value: string; duration?: number; charset?: string; keep?: string }>(),
  { duration: 700, charset: '0123456789abcdef', keep: ' …·,.:()[]_-=+→' },
)

const shown = ref(props.value)
let raf = 0

watch(() => props.value, (to) => {
  cancelAnimationFrame(raf)
  const start = performance.now()
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / props.duration)
    let s = ''
    for (let i = 0; i < to.length; i++) {
      const ch = to[i]
      if (props.keep.includes(ch) || p >= (i + 1) / to.length)
        s += ch
      else
        s += props.charset[Math.floor(Math.random() * props.charset.length)]
    }
    shown.value = s
    if (p < 1)
      raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <span class="font-mono">{{ shown }}</span>
</template>
