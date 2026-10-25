<script setup lang="ts">
import { useNav, useSlideContext } from '@slidev/client'

// The rendered slide owns its page number, including print/export and overview.
// Navigation is shared across the deck and stays on page 1 during print export.
const { $page } = useSlideContext()
const { total } = useNav()
</script>

<template>
  <div class="slidev-global-pageno">{{ $page }}/{{ total }}</div>
</template>

<style>
/* Bottom-right rather than bottom-left: Slidev's nav bar lives bottom-left. */
.slidev-global-pageno {
  position: absolute;
  right: 3.4rem;
  bottom: 1.9rem;
  z-index: 20;
  pointer-events: none;
  user-select: none;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.66rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  color: var(--s-muted);
  opacity: 0.5;
}
</style>
