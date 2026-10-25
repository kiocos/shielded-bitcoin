<script setup lang="ts">
import { useSlideContext } from '@slidev/client'

// Hidden on two kinds of slide:
//   cover   — it already carries the full shield mark in the middle
//   section — the chapter dividers are deliberately bare
const { $frontmatter } = useSlideContext()
</script>

<template>
  <div v-if="$frontmatter.layout !== 'cover' && $frontmatter.layout !== 'section'" class="slidev-global-mark">
    <div class="i-ph-shield-check-duotone mark-icon" />
    <span>Shielded Bitcoin</span>
  </div>
</template>

<style>
/*
  Rendered above every content slide, top-right, roughly on the title's
  baseline: bottom-left is Slidev's own nav bar, and the bottom of the slide is
  occupied on the canvas-heavy slides. pointer-events-none so it can never
  swallow a click on the slide beneath.
*/
.slidev-global-mark {
  position: absolute;
  top: 2.85rem;
  right: 3.4rem;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  pointer-events: none;
  user-select: none;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--s-muted);
  opacity: 0.75;
}
.slidev-global-mark .mark-icon {
  font-size: 1rem;
  color: var(--s-violet);
}
</style>
