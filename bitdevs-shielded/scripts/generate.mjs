import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { slides, mainCount, sources, totalSeconds } from '../talk.mjs'
const base = fileURLToPath(new URL('../', import.meta.url))
const script = readFileSync(`${base}presenter-script.md`, 'utf8')
const matches = [...script.matchAll(/^## .+ \{#([a-z0-9-]+)\}\n/gm)]
const notes = new Map(matches.map((m, i) => [m[1], script.slice(m.index + m[0].length, matches[i + 1]?.index ?? script.length).trim()]))
if (notes.size !== slides.length) throw new Error(`Script has ${notes.size} sections; deck has ${slides.length}`)
for (const s of slides) {
  if (!notes.has(s.id)) throw new Error(`Missing script section: ${s.id}`)
  const cues = [...notes.get(s.id).matchAll(/\[Click (\d+)\]/g)].map(m => Number(m[1]))
  if (JSON.stringify(cues) !== JSON.stringify(Array.from({ length: s.clicks }, (_, i) => i + 1))) throw new Error(`Click cue mismatch: ${s.id}: ${cues} / expected ${s.clicks}`)
}
const front = `---\ntheme: default\ntitle: Shielded Bitcoin — BitDevs\ninfo: Notes, proofs and replay · 25 minutes plus questions\nauthor: BitDevs\ncolorSchema: dark\nlang: en\naspectRatio: 16/9\ncanvasWidth: 1200\nfonts:\n  sans: Inter\n  mono: monospace\n  provider: none\ndrawings:\n  enabled: false\ntransition: fade-out\nlayout: none\nclicks: ${slides[0].clicks}\n---\n`
let elapsed = 0
const content = slides.map((s, i) => {
  const format = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
  const timing = i < mainCount ? `Target time: ${s.seconds}s · ${format(elapsed)}–${format(elapsed + s.seconds)}` : 'Appendix · outside the 25-minute talk'
  elapsed += s.seconds
  return `${i ? `---\nlayout: none\ntitle: ${JSON.stringify(s.title)}\nclicks: ${s.clicks}\n---\n` : ''}\n<TalkSlide :index="${i}" :step="$clicks" />\n\n<!--\n${timing}\n\n${notes.get(s.id)}\n\nSources:\n${s.refs.map(([key, detail]) => `${sources[key].name} — ${detail}\n${sources[key].url}`).join('\n\n')}\n-->\n`
}).join('\n')
const output = front + content
if (process.argv.includes('--check')) {
  if (readFileSync(`${base}slides.md`, 'utf8') !== output) throw new Error('Notes are out of sync; run npm run bitdevs:sync')
} else writeFileSync(`${base}slides.md`, output)
console.log(`${slides.length} slides · ${mainCount} main · ${slides.length - mainCount} appendix · ${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2,'0')} · notes and click cues are in sync`)
