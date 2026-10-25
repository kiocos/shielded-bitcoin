import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, relative, resolve } from 'node:path'
import { generateLessons } from './generate-course-lessons.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const read = path => readFile(resolve(root, path), 'utf8')
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const curriculum = JSON.parse(await read('curriculum.json'))
await generateLessons()
const modules = curriculum.phases.flatMap(phase => phase.modules)
const allModules = [...modules, ...curriculum.optional_extensions]
for (const module of allModules) {
  const material = curriculum.materials[module.primary_material]
  if (!material || module.material_status !== 'available') throw new Error(`Module ${module.id} needs an available primary lesson`)
  await read(material.path)
}
const ids = new Set(modules.map(module => module.id))
if (ids.size !== modules.length) throw new Error('Curriculum module IDs must be unique')
const seen = new Set()
for (const module of modules) {
  for (const prerequisite of module.prerequisites) {
    if (!seen.has(prerequisite)) throw new Error(`Prerequisite ${prerequisite} must precede ${module.id}`)
  }
  seen.add(module.id)
}
const sourceLink = source => {
  const document = curriculum.sources[source.key]
  if (!document) throw new Error(`Unknown source: ${source.key}`)
  return `<a href="${escape(document.url)}${source.page ? `#page=${source.page}` : ''}" target="_blank" rel="noreferrer">${escape(document.title)} ${escape(source.sections)}</a>`
}
const relatedMaterials = module => (module.materials ?? []).map(key => {
  const material = curriculum.materials[key]
  if (!material) throw new Error(`Unknown material: ${key}`)
  return `<a href="../${escape(material.path)}" data-inline-lesson="${escape(material.panel)}">${escape(material.title)}</a>`
}).join(' · ')
const primaryLink = module => {
  const material = curriculum.materials[module.primary_material]
  return `<a class="module-start" href="../${escape(material.path)}" data-inline-lesson="${escape(material.panel)}">Open lesson →</a>`
}
const phaseHtml = curriculum.phases.map((phase, index) => `<section class="course-stage" aria-labelledby="stage-${escape(phase.id)}">
<header class="stage-header"><span class="stage-number">${String(index + 1).padStart(2, '0')}</span><h2 id="stage-${escape(phase.id)}">${escape(phase.title)}</h2></header>
<p class="stage-outcome">${escape(phase.outcome)}</p>
${phase.modules.map(module => `<details class="module" id="module-${escape(module.id)}"><summary><span class="module-code">${escape(module.id)}</span><span class="module-title">${escape(module.title)}</span><span class="module-duration">${module.minutes} min</span></summary>
<div class="module-content">${primaryLink(module)}<p><strong>You’ll be able to:</strong> ${escape(module.win)}.</p><p><strong>Topics:</strong> ${escape(module.topics)}.</p><p><strong>Practice:</strong> ${escape(module.exercise)}.</p>
<p class="small">Suggested background: ${module.prerequisites.length ? module.prerequisites.map(id => `<a href="#module-${escape(id)}">${escape(id)}</a>`).join(', ') : 'no prior knowledge assumed'}.</p>
<p class="source">Reading: ${module.sources.map(sourceLink).join('; ')}.</p>
${module.materials?.length > 1 ? `<p class="small">Related practice: ${relatedMaterials({...module, materials: module.materials.filter(key => key !== module.primary_material)})}.</p>` : ''}</div></details>`).join('\n')}
<p class="checkpoint"><strong>Stage checkpoint:</strong> ${escape(phase.checkpoint)}.</p></section>`).join('\n')
const assessed = modules.filter(module => module.learning_status !== 'not_assessed').length
const minutes = modules.reduce((sum, module) => sum + module.minutes, 0)
const planBody = `<header><div class="eyebrow">Your course plan · presentation and Q&amp;A</div><h1 tabindex="-1">Understand Shielded Bitcoin, end to end.</h1><p class="lede">Build the complete system model, then examine its privacy, trust assumptions and unresolved parts.</p></header>
<div class="plan-meta"><span><strong>${modules.length}</strong> core modules</span><span><strong>${curriculum.optional_extensions.length}</strong> optional extensions</span><span><strong>${allModules.length}/${allModules.length}</strong> primary lessons available</span><span><strong>${assessed}/${modules.length}</strong> understanding checks recorded</span></div>
<p class="small">About ${Math.round(minutes / 60 * 10) / 10} hours of lesson work, plus later recall and rehearsal. Estimates are flexible: familiar foundations can move quickly after a check.</p>
<div class="plan-next"><strong>The complete course is available.</strong><p>Start with <a href="0010-bitcoin-public-ledger.html" data-inline-lesson="m01">Bitcoin’s public ledger</a> for the full sequence, or resume <a href="0005-statements-and-witnesses.html" data-inline-lesson="statements">statements and witnesses</a> for the proof foundations. Every module below has a lesson and practice. The two optional extensions are included.</p></div>
<div class="controls plan-controls"><button data-expand-modules="true">Show all lesson details</button><button data-expand-modules="false">Show titles only</button></div>
${phaseHtml}
<section><h2>How the teaching adapts</h2><div class="study-loop"><span>Short HTML lesson</span><span>→</span><span>Practice</span><span>→</span><span>Teach-back</span><span>→</span><span>Later recall</span></div><p>Open any lesson whenever it helps. Your explanations guide what to review, deepen or skip; they are not a condition for receiving material. Each stage has a checkpoint connecting its ideas.</p><p>All 26 core modules and both extensions have their own primary lesson. Three earlier overview exercises remain available as additional practice.</p><p class="small">Your mission, preferences, curriculum and demonstrated understanding persist in workspace files. A page visit or a generated lesson never counts as mastery. Browser exercise answers and rehearsal drafts currently stay in the page; discuss them with me so I can record the evidence.</p></section>
<section><h2>Optional deeper study</h2>${curriculum.optional_extensions.map(extension => `<details id="module-${escape(extension.id)}"><summary>${escape(extension.title)}</summary>${primaryLink(extension)}<p>${escape(extension.goal)}.</p><p class="source">${sourceLink(extension.source)}.</p></details>`).join('')}</section>
<p class="small">Scope: conceptual and technical understanding for a defensible presentation. Implementing production cryptography is a separate project. Primary materials: ${Object.values(curriculum.sources).map(source => `<a href="${escape(source.url)}" target="_blank" rel="noreferrer">${escape(source.title)}</a>`).join(' · ')}.</p>
<nav class="page-nav"><a href="../reference/shielded-bitcoin-concept-map.html" data-inline-lesson="reference">Glossary &amp; proof map</a><a href="0001-notes-nullifiers-and-proofs.html" data-inline-lesson="notes">Existing notes exercise</a></nav>`
await writeFile(resolve(root, 'lessons/plan.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Shielded Bitcoin · Course plan</title><link rel="stylesheet" href="../assets/teach.css"><link rel="stylesheet" href="../assets/curriculum.css"><link rel="stylesheet" href="../assets/course-labs.css"><script defer src="../assets/teach.js"></script><script defer src="../assets/curriculum.js"></script></head><body><main class="page" data-curriculum>${planBody}</main></body></html>`)
const primaryKeys = new Set(allModules.map(module => module.primary_material))
const pages = [
  ['plan', 'Course plan', 'lessons/plan.html'],
  ...allModules.map(module => {
    const material = curriculum.materials[module.primary_material]
    return [material.panel, `${module.id} · ${module.title}`, material.path]
  }),
  ...Object.entries(curriculum.materials).filter(([key]) => !primaryKeys.has(key)).map(([, material]) => [material.panel, `Practice · ${material.title}`, material.path]),
  ['reference', 'Reference', 'reference/shielded-bitcoin-concept-map.html'],
  ['proof-reference', 'Proof glossary', 'reference/proof-foundations.html'],
]
const css = `${await read('assets/teach.css')}\n${await read('assets/curriculum.css')}\n${await read('assets/foundations.css')}\n${await read('assets/course-labs.css')}`
const ui = `${await read('assets/teach.js')}\n${await read('assets/curriculum.js')}`
const labs = `${await read('assets/shielded-labs.js')}\n${await read('assets/foundations.js')}\n${await read('assets/course-labs.js')}`
const sections = await Promise.all(pages.map(async ([id, , path]) => {
  const source = await read(path)
  let body = source.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1]
  if (!body) throw new Error(`Missing lesson body: ${path}`)
  body = body.replace(/href="([^"]+)"/g, (attribute, href) => {
    if (/^(?:[a-z]+:|#|\/)/i.test(href)) return attribute
    const suffixAt = href.search(/[?#]/)
    const pathname = suffixAt < 0 ? href : href.slice(0, suffixAt)
    const suffix = suffixAt < 0 ? '' : href.slice(suffixAt)
    const target = relative(resolve(root, 'lessons'), resolve(root, dirname(path), pathname))
    return `href="${escape(target)}${suffix}"`
  })
  return `<section id="${id}" data-course-panel${id === 'plan' ? ' data-curriculum' : ''}>${body}</section>`
}))
const nav = `<button data-open-lesson="plan" aria-controls="plan" aria-pressed="false">Course plan</button><div><label for="course-lesson-select">Open a lesson or reference</label><select id="course-lesson-select" data-lesson-select>${pages.map(([id, title]) => `<option value="${escape(id)}">${escape(title)}</option>`).join('')}</select></div>`
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Shielded Bitcoin · Interactive lessons</title><style>${css}</style></head>
<body data-initial-lesson="plan"><div class="page"><nav class="course-toolbar" aria-label="Choose a lesson">${nav}</nav>${sections.join('\n')}</div><script>${ui}</script><script>${labs}</script></body></html>`
await writeFile(resolve(root, 'lessons/index.html'), html)
await writeFile(resolve(root, 'lessons/foundations.html'), html.replace('data-initial-lesson="plan"', 'data-initial-lesson="statements"').replace('<title>Shielded Bitcoin · Interactive lessons</title>', '<title>Shielded Bitcoin · Proof foundations</title>'))
process.stdout.write(`Built ${allModules.length} primary lessons, ${pages.length - allModules.length - 3} supporting lessons and 2 references into both standalone collections\n`)
