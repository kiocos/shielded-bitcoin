import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { decks } from '../site/decks.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = resolve(root, 'dist/pages')
const { values } = parseArgs({ options: { base: { type: 'string', default: process.env.PAGES_BASE_PATH || '/' } } })
const base = `/${values.base.split('/').filter(Boolean).join('/')}${values.base.split('/').filter(Boolean).length ? '/' : ''}`
if (!/^\/(?:[A-Za-z0-9._-]+\/)*$/.test(base) || base.split('/').some(part => part === '.' || part === '..'))
  throw new Error('Use a URL base path such as /shielded-bitcoin/ or /')
if (new Set(decks.map(deck => deck.slug)).size !== decks.length || decks.some(deck => !/^[a-z0-9-]+$/.test(deck.slug)))
  throw new Error('Every deck needs a unique URL slug')

function run(args, cwd = root) {
  const result = spawnSync(process.execPath, args, { cwd, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`Command failed: node ${args.join(' ')}`)
}
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

for (const deck of decks) run(deck.prepare)
await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
for (const deck of decks) {
  console.log(`\nBuilding ${deck.slug} at ${base}${deck.slug}/`)
  run([
    resolve(root, 'node_modules/@slidev/cli/bin/slidev.mjs'), 'build',
    '--base', `${base}${deck.slug}/`, '--router-mode', 'hash',
    '--out', resolve(output, deck.slug),
  ], resolve(root, deck.directory))
  if (deck.script) await cp(resolve(root, deck.script), resolve(output, deck.slug, 'presenter-script.md'))
}

const cards = decks.map(deck => `<article class="deck${deck.featured ? ' featured' : ''}">
  <span class="label">${escapeHtml(deck.label)}</span>
  <h2>${escapeHtml(deck.title)}</h2>
  <p class="description">${escapeHtml(deck.description)}</p>
  <div class="metadata"><span>${escapeHtml(deck.language)}</span><span>${escapeHtml(deck.format)}</span><span>${escapeHtml(deck.duration)}</span></div>
  <div class="actions">
    <a class="primary" href="./${deck.slug}/#/1" aria-label="Open ${escapeHtml(deck.title)}">${deck.script ? 'Open slides' : 'Open course'} <span aria-hidden="true">↗</span></a>
    ${deck.script ? `<a class="secondary" href="./${deck.slug}/#/presenter/1" aria-label="Presenter mode: ${escapeHtml(deck.title)}">Presenter</a><a class="secondary" href="./${deck.slug}/presenter-script.md" download="${deck.slug}-presenter-script.md">Download script</a>` : ''}
  </div>
</article>`).join('\n')
const template = await readFile(resolve(root, 'site/index.html'), 'utf8')
await writeFile(resolve(output, 'index.html'), template.replace('<!-- DECKS -->', cards))
await writeFile(resolve(output, '.nojekyll'), '')
await writeFile(resolve(output, 'site.json'), JSON.stringify({ base, decks: decks.map(({ slug, title }) => ({ slug, title })) }, null, 2))
console.log(`\nPublished output ready: ${output}\nBase path: ${base}\nPreview: npm run pages:preview`)
