<script setup>
import { computed, ref } from 'vue'
import { useNav } from '@slidev/client'
import { slides, chapters, mainCount, sources } from '../talk.mjs'
import TalkDiagram from './TalkDiagram.vue'
const props = defineProps({ index: Number, step: Number })
const item = computed(() => slides[props.index])
const nav = useNav()
const indexOpen = ref(false)
function go(page, step = 0) { indexOpen.value = false; nav.go(page, step) }
</script>

<template>
  <article class="talk-page" :data-talk="index + 1" :data-id="item.id" :data-step="step">
    <div class="talk-meta"><span class="chapter-label">{{ item.chapter === 5 ? 'APPENDIX' : `0${item.chapter + 1}` }} <b>{{ chapters[item.chapter] }}</b></span><span class="brand"><i class="i-ph-shield-check-duotone" /> BITDEVS</span></div>
    <header v-if="item.kind !== 'cover'" class="talk-heading"><h1>{{ item.title }}</h1><p>{{ item.subtitle }}</p></header>
    <main class="talk-stage" :class="{ 'cover-stage': item.kind === 'cover' }"><TalkDiagram :item="item" :step="step" @step="n => go(index + 1, n)" @go="id => go(slides.findIndex(s => s.id === id) + 1)" /></main>
    <div v-if="item.takeaway" class="talk-insight" :class="{ waiting: step < item.clicks }"><span>→</span>{{ item.takeaway }}</div>
    <footer class="talk-footer"><button aria-label="Open contents and appendix" @click.stop="indexOpen = true">☷ <span>Contents / appendix</span></button><div class="source-line"><template v-for="([key, detail], n) in item.refs" :key="key"><span v-if="n"> · </span><a :href="sources[key].url" target="_blank" rel="noopener noreferrer" @click.stop>{{ sources[key].name }} {{ detail }}</a></template></div><span class="slide-counter">{{ item.chapter === 5 ? `A${index - mainCount + 1}` : String(index + 1).padStart(2, '0') }}<span> / {{ item.chapter === 5 ? slides.length - mainCount : mainCount }}</span></span></footer>
    <div class="talk-progress"><div :style="{ width: `${(index + 1) / (index < mainCount ? mainCount : slides.length) * 100}%` }" /></div>
    <div v-if="indexOpen" class="talk-index" role="dialog" aria-modal="true" aria-label="Presentation contents" @click.stop @keydown.stop @keydown.esc="indexOpen = false">
      <div class="index-heading"><h2>Choose a topic</h2><button autofocus @click="indexOpen = false">Close ×</button></div>
      <div class="index-scroll"><div v-for="(chapter, c) in chapters" :key="c" class="index-chapter"><h3>{{ chapter }}</h3><div><button v-for="s in slides.map((s, i) => ({ ...s, page: i + 1 })).filter(s => s.chapter === c)" :key="s.id" @click="go(s.page)"><span>{{ s.page <= mainCount ? String(s.page).padStart(2, '0') : `A${s.page - mainCount}` }}</span>{{ s.title }}</button></div></div></div>
    </div>
  </article>
</template>
