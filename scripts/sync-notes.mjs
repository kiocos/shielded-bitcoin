import { readFile, writeFile } from 'node:fs/promises'

// The presenter script is the editable source for spoken text and stage directions.
const script = await readFile(new URL('../shielded-bitcoin-script.md', import.meta.url), 'utf8')
const slidesURL = new URL('../slides.md', import.meta.url)
const slides = await readFile(slidesURL, 'utf8')
const talk = script.split('\n## CUT PLAN\n')[0]
const sections = [...talk.matchAll(/^## \d+:\d{2} — Slide (\d+) · .+\n([\s\S]*?)(?=^## \d+:\d{2} — Slide |$(?![\s\S]))/gm)]
const notes = [...slides.matchAll(/<!--\n([\s\S]*?)\n-->/g)]
if (sections.length !== notes.length || !sections.length)
  throw new Error(`Script has ${sections.length} slides; deck has ${notes.length} note blocks`)
let cursor = 0
const mismatches = []
const synced = slides.replace(/<!--\n([\s\S]*?)\n-->/g, (block, existing, offset) => {
  const [_, number, content] = sections[cursor]
  if (Number(number) !== cursor + 1) throw new Error(`Unexpected slide number ${number}`)
  const body = content.replace(/\n---\s*$/, '').trim().replace(/^> ?/gm, '')
  const slideSource = slides.slice(cursor ? notes[cursor - 1].index + notes[cursor - 1][0].length : 0, offset)
  const expectedClicks = Number(slideSource.match(/^clicks: (\d+)$/m)?.[1] || 0)
  const actualClicks = (body.match(/\*\*\[click\]\*\*/g) || []).length
  if (expectedClicks !== actualClicks)
    throw new Error(`Slide ${number}: ${actualClicks} script clicks, ${expectedClicks} declared clicks`)
  if (body !== existing) mismatches.push(number)
  cursor++
  return `<!--\n${body}\n-->`
})
if (process.argv.includes('--check')) {
  if (mismatches.length) throw new Error(`Notes differ on slides ${mismatches.join(', ')}; run npm run notes:sync`)
  console.log(`${notes.length} slide notes match the presenter script; all click counts match.`)
} else {
  if (mismatches.length) await writeFile(slidesURL, synced)
  console.log(`Synchronized ${mismatches.length} slide note blocks; all click counts match.`)
}
