<script setup lang="ts">
/**
 * The Bitcoin mark, from public/brand/bitcoin.svg
 *
 * Built against BASE_URL rather than a bare "/brand/..." path: Vite rewrites
 * absolute asset URLs it can see in a template, but not ones computed in
 * script, and a bare path 404s on any deploy served from a subdirectory (a
 * GitHub Pages project site, for one)
 */
withDefaults(defineProps<{ size?: number; glow?: boolean }>(), { size: 28, glow: false })

const src = `${import.meta.env.BASE_URL}brand/bitcoin.svg`
</script>

<template>
  <img
    :src="src"
    alt=""
    class="inline-block shrink-0 select-none"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      filter: glow ? 'drop-shadow(0 0 10px rgba(247,147,26,.55))' : undefined,
    }"
  >
</template>
