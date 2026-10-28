import { readFileSync, writeFileSync } from 'node:fs'
import { slides, sources } from '../presentation.mjs'

// The presenter script is the single source for narration and click cues
const base = new URL('../', import.meta.url)
const script = readFileSync(new URL('presenter-script.md', base), 'utf8')
const sections = [...script.matchAll(/^## Slide (\d+) · (.+) \{#([a-z0-9-]+)\}\n/gm)]
if (sections.length !== slides.length) throw new Error(`${sections.length} script sections for ${slides.length} slides`)
let words = 0
let clicks = 0
const notes = slides.map((slide, i) => {
  const match = sections[i]
  if (Number(match[1]) !== i + 1 || match[2] !== slide.title || match[3] !== slide.id)
    throw new Error(`Script section mismatch at slide ${i + 1}`)
  const text = script.slice(match.index + match[0].length, sections[i + 1]?.index ?? script.length).trim()
  const cues = (text.match(/\*\*\[click\]\*\*/g) || []).length
  if (cues !== slide.clicks) throw new Error(`${slide.id}: ${cues} cues for ${slide.clicks} clicks`)
  words += text.replace(/^\*[^\n]+\*$/gm, '').replace(/\*\*\[click\]\*\*/g, '').split(/\s+/).filter(Boolean).length
  clicks += cues
  return text
})
const header = `---
theme: default
title: Shielded Bitcoin — from notes to a payment
info: A separate protocol presentation guided by the teaching sequence of Mastering Zcash
class: text-left
colorSchema: dark
lang: en
aspectRatio: 16/9
canvasWidth: 980
drawings:
  persist: false
transition: fade
mdc: true
fonts:
  sans: Inter
  mono: JetBrains Mono
layout: cover
clicks: 0
---
`
const result = header + slides.map((slide, i) => {
  const front = i ? `\n---\nlayout: ${slide.layout || 'default'}\ntitle: ${JSON.stringify(slide.title)}\nclicks: ${slide.clicks}\n${slide.transition ? `transition: ${slide.transition}\n` : ''}---\n` : ''
  const body = slide.layout ? slide.body : `\n# ${slide.title}\n\n<div class="v2-canvas">\n${slide.body.trim()}\n</div>`
  return `${front}\n${body.trim()}\n\n<!--\n${notes[i]}\n\nSource: Shielded Bitcoin — ${slide.refs}\n${sources.paper}\n${slide.id === 'questions' ? `\nTeaching sequence only:\n${sources.teaching}\n` : ''}-->\n`
}).join('')
const destination = new URL('slides.md', base)
if (process.argv.includes('--check')) {
  if (readFileSync(destination, 'utf8') !== result) throw new Error('Deck is out of sync; run npm run v2:sync')
} else writeFileSync(destination, result)
console.log(`${slides.length} slides · ${clicks} click cues · approximately ${words} spoken words · notes match`)
