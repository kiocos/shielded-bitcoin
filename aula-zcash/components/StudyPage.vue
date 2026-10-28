<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useNav } from '@slidev/client'
import { chapters, lessons } from '../course.mjs'
import StudyVisual from './StudyVisual.vue'
const props = defineProps({ index: Number })
const lesson = computed(() => lessons[props.index])
const nav = useNav()
const panel = ref('')
const resume = ref(0)
const sourceOpen = ref(false)
const search = ref('')
const reading = ref(null)
const more = ref(false)
function updateReading() {
  const el = reading.value
  more.value = !!el && el.scrollTop + el.clientHeight < el.scrollHeight - 4
}
const filtered = computed(() => lessons.map((l, i) => ({ ...l, page: i + 1 })).filter(l => `${l.title} ${l.lead} ${l.read.join(' ')}`.toLocaleLowerCase('en-US').includes(search.value.toLocaleLowerCase('en-US'))))
onMounted(() => {
  try { resume.value = Number(localStorage.getItem('zcash-sb-study-page-v1')) || 0 } catch {}
  nextTick(updateReading)
})
watch(sourceOpen, () => nextTick(updateReading))
watch(() => nav.currentPage.value, page => {
  if (props.index + 1 !== Number(page)) return
  try { localStorage.setItem('zcash-sb-study-page-v1', String(page)) } catch {}
})
function go(page) {
  panel.value = ''
  nav.go(page)
}
function openPanel(name) {
  panel.value = name
  nextTick(() => document.querySelector(`[data-lesson="${props.index + 1}"] .study-modal button`)?.focus())
}
function printReader() { window.print() }
</script>

<template>
  <div class="study-page" :data-lesson="index + 1">
    <nav class="chapter-track" aria-label="Chapters" @click.stop>
      <button v-for="(name, c) in chapters" :key="name" :class="{ active: lesson.chapter === c }" :title="name" @click="go(lessons.findIndex(l => l.chapter === c) + 1)"><span>{{ String(c).padStart(2, '0') }}</span>{{ name }}</button>
    </nav>
    <header class="lesson-header"><h1>{{ lesson.title }}</h1><p>{{ lesson.lead }}</p></header>
    <main class="lesson-main">
      <section class="visual-zone" aria-label="Diagram or exercise"><StudyVisual :visual="lesson.visual" /></section>
      <div class="reading-shell"><aside ref="reading" class="reading-zone" aria-label="Explanation" tabindex="0" @keydown.stop @click.stop @scroll="updateReading">
        <div class="reading-heading"><span>UNDERSTAND THE CONNECTION</span><button title="Open continuous reading" aria-label="Open continuous reading" @click="openPanel('reader')">↗</button></div>
        <p v-for="(p, i) in lesson.read" :key="i">{{ p }}</p>
        <div v-if="lesson.refs.length" class="inline-sources"><button :aria-expanded="sourceOpen" @click="sourceOpen = !sourceOpen">{{ sourceOpen ? '−' : '+' }} Check the sources ({{ lesson.refs.length }})</button><ul v-if="sourceOpen"><li v-for="s in lesson.refs" :key="s.url + s.detail"><a :href="s.url" target="_blank" rel="noopener noreferrer">{{ s.label }}</a><span>{{ s.detail }}</span></li></ul></div>
      </aside><div v-if="more" class="scroll-cue">Scroll the explanation to continue ↓</div></div>
    </main>
    <div class="takeaway"><span>KEY POINT</span><p>{{ lesson.takeaway }}</p></div>
    <footer class="study-footer" @click.stop>
      <div class="study-tools"><button @click="openPanel('index')">☷ Index</button><button @click="openPanel('reader')">Reading</button><button v-if="index === 0 && resume > 1 && resume <= lessons.length" @click="go(resume)">Resume at screen {{ resume }}</button></div>
      <span class="keyboard-hint">← → navigate · explore the diagram controls</span>
      <div class="pagination"><button :disabled="index === 0" aria-label="Previous screen" @click="go(index)">←</button><span>{{ String(index + 1).padStart(2, '0') }} / {{ lessons.length }}</span><button :disabled="index === lessons.length - 1" aria-label="Next screen" @click="go(index + 2)">→</button></div>
    </footer>
    <div v-if="panel" class="study-modal" role="dialog" aria-modal="true" :aria-label="panel === 'index' ? 'Course index' : 'Continuous reading'" @click.stop @keydown.stop @keydown.esc="panel = ''">
      <div class="modal-toolbar"><h2>{{ panel === 'index' ? 'Choose where to continue' : 'Continuous reading' }}</h2><div><button v-if="panel === 'reader'" @click="printReader">Print / save PDF</button><button aria-label="Close panel" @click="panel = ''">Close ×</button></div></div>
      <div v-if="panel === 'index'" class="index-content"><input v-model="search" type="search" aria-label="Search concepts" placeholder="Search: nullifier, ciphertext, fee…" /><div class="index-grid"><button v-for="l in filtered" :key="l.id" :class="{ current: l.page === index + 1 }" @click="go(l.page)"><span>{{ String(l.page).padStart(2, '0') }} · {{ chapters[l.chapter] }}</span><b>{{ l.title }}</b></button></div><p v-if="!filtered.length">No matching concepts</p></div>
      <div v-else class="reader-content">
        <p class="reader-intro">From Zcash to Shielded Bitcoin · study material in English · sources consulted on 27 October 2026</p>
        <article v-for="(l, i) in lessons" :key="l.id" :id="`leitura-${l.id}`">
          <small>{{ String(i + 1).padStart(2, '0') }} · {{ chapters[l.chapter] }}</small><h2>{{ l.title }}</h2><p class="reader-lead">{{ l.lead }}</p>
          <div v-if="['formula', 'code', 'table'].includes(l.visual.type)" class="reader-reference"><StudyVisual :visual="l.visual" /></div>
          <p v-for="(p, j) in l.read" :key="j">{{ p }}</p>
          <div v-if="l.visual.type === 'quiz'" class="reader-answer"><b>{{ l.visual.question }}</b><p>{{ l.visual.answer }}</p></div>
          <blockquote>{{ l.takeaway }}</blockquote>
          <ul class="reader-sources"><li v-for="s in l.refs" :key="s.url + s.detail"><a :href="s.url" target="_blank" rel="noopener noreferrer">{{ s.label }} — {{ s.detail }}</a></li></ul>
          <button class="back-to-slide" @click="go(i + 1)">Open screen {{ i + 1 }}{{ l.visual.type.endsWith('lab') ? ' and experiment' : '' }} →</button>
        </article>
      </div>
    </div>
  </div>
</template>
