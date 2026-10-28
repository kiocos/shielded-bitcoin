import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { lessons, chapters } from '../course.mjs'

const front = `---\ntheme: default\ntitle: From Zcash to Shielded Bitcoin\ninfo: An interactive course to understand and explain the protocol\nauthor: Study material\ncolorSchema: dark\nlang: en\naspectRatio: 16/9\ncanvasWidth: 1200\nfonts:\n  sans: Inter\n  mono: monospace\n  provider: none\ndrawings:\n  enabled: false\ntransition: fade-out\nmdc: true\nlayout: none\n---\n`
const body = lessons.map((lesson, i) => `${i ? `---\nlayout: none\ntitle: ${JSON.stringify(lesson.title)}\n---\n` : ''}\n<StudyPage :index="${i}" />\n\n<!--\n${chapters[lesson.chapter]} · ${lesson.title}\n\n${lesson.read.join('\n\n')}\n\nKey point: ${lesson.takeaway}\n\n${lesson.refs.map(s => `${s.label}: ${s.detail}\n${s.url}`).join('\n\n')}\n-->\n`).join('\n')
writeFileSync(fileURLToPath(new URL('../slides.md', import.meta.url)), front + body)
console.log(`Generated ${lessons.length} screens with explanations and sources`)
