import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { lessons } from '../content/course-lessons.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const read = path => readFile(resolve(root, path), 'utf8')
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const json = value => JSON.stringify(value).replaceAll('<', '\\u003c')
const sourceLinks = sources => sources.map(source => `<a class="reading-link" href="${esc(source.url)}" target="_blank" rel="noreferrer">${esc(source.title)}</a>`).join('')
const readableTables = body => body.replace(/<table class="comparison-table">([\s\S]*?)<\/table>/g, (_, content) => {
  const labeled = content.replace(/<tr>([\s\S]*?)<\/tr>/g, (row, cells) => {
    let index = 0
    return `<tr>${cells.replace(/<td>/g, () => {
      const label = ['', 'Useful distinction', 'Limit to remember'][index++]
      return label ? `<td data-label="${label}">` : '<td>'
    })}</tr>`
  })
  return `<table class="comparison-table">${labeled}</table>`
})

const labHTML = (kind, id) => {
  if (kind === 'utxo') return `<section class="panel interactive" data-utxo-lab><div class="eyebrow">Change the payment</div><h2>Spend one 12,000-sat output</h2><div class="lab-fields"><label>Payment, sats<input data-utxo-payment type="number" value="7000" min="0" step="1"></label><label>Change, sats<input data-utxo-change type="number" value="4700" min="0" step="1"></label></div><p class="feedback" data-utxo-result role="status" aria-live="polite"></p><p class="small">Try outputs totaling more than 12,000. This is an arithmetic exercise, not a transaction builder.</p></section>`
  if (kind === 'merkle') return `<section class="panel interactive" data-merkle-lab><div class="eyebrow">A four-position teaching tree</div><h2>Watch the root and path change</h2><div class="merkle-level"><div class="merkle-node" data-merkle-root></div></div><div class="merkle-level two"><div class="merkle-node" data-merkle-left></div><div class="merkle-node" data-merkle-right></div></div><div class="merkle-level four">${[0,1,2,3].map(() => '<div class="merkle-node" data-merkle-leaf></div>').join('')}</div><label for="${id}-merkle-select">Show the membership path for</label><select id="${id}-merkle-select">${['A','B','C','D'].map((letter, i) => `<option value="${i}"${i === 1 ? ' selected' : ''}>${letter} · position ${i}</option>`).join('')}</select><p class="feedback" data-merkle-path role="status" aria-live="polite"></p><div class="controls"><button data-merkle-append>Append leaf C</button><button data-merkle-reset>Reset</button></div><p class="small">H(a,b) denotes a hash operation; this display uses symbolic expressions, not real hashes. ∅ is an empty position. Four positions are used only to keep the example readable.</p></section>`
  if (kind === 'replay') return `<section class="panel interactive" data-replay-lab><div class="eyebrow">Predict, then replay</div><h2>Two independent copies</h2><div class="grid2">${['Indexer A','Indexer B'].map(name => `<div class="inset replay-state" data-replay-state><h3>${name}</h3><p data-replay-leaves></p><p><strong>Nullifiers:</strong> <span data-replay-nullifiers></span></p><p data-replay-history></p><p class="small"><strong>Finalized roots:</strong> <span data-replay-roots></span></p></div>`).join('')}</div><div class="controls"><button class="primary" data-replay-next>Process event 1</button><button data-replay-reset>Reset</button></div><p class="feedback" data-replay-result role="status" aria-live="polite">Both indexers start with two leaves and no accepted spends. Predict the next state before advancing.</p><p class="small">The example supplies proof results; it does not run cryptography. Parsing, binding and anchor checks are assumed to pass. Root names are symbolic. A block root is finalized only after its last event.</p></section>`
  if (kind === 'anchor') return `<section class="panel interactive" data-anchor-lab><div class="eyebrow">Boundary cases</div><h2>Is this anchor still allowed?</h2><div class="lab-fields"><label>Inclusion block H<input data-anchor-height type="number" value="400" min="100" step="1"></label><label>Chosen anchor height<input data-anchor-value type="number" value="300" min="0" step="1"></label></div><label><input data-anchor-removed type="checkbox"> A reorganization changed the root at this anchor height</label><div class="controls"><button data-anchor-advance>Advance inclusion by one block</button></div><p class="feedback" data-anchor-result role="status" aria-live="polite"></p><p class="small">Assume the deployment is active throughout this example and all needed root-history entries exist. W = 100 and K_min = 1.</p></section>`
  if (kind === 'envelope') return `<section class="panel interactive" data-envelope-lab><div class="eyebrow">Encoding-size model</div><h2>Reproduce the 610-byte example</h2><div class="lab-fields"><label>Input notes<select data-envelope-inputs>${[1,2,3,4].map(n => `<option${n === 2 ? ' selected' : ''}>${n}</option>`).join('')}</select></label><label>Output notes<select data-envelope-outputs>${[1,2,3,4].map(n => `<option${n === 2 ? ' selected' : ''}>${n}</option>`).join('')}</select></label></div><table><thead><tr><th>Field group</th><th>Bytes</th></tr></thead><tbody>${['Header + anchor + counts','Nullifiers: 32/input','Ephemeral keys: 32/output','Recipient ciphertexts: 67/output','Outgoing batch: 64/output + 16','Proof: 192'].map(label => `<tr><td>${label}</td><td data-envelope-field></td></tr>`).join('')}</tbody></table><p class="big violet" data-envelope-size></p><p class="small">Envelope bytes only. Carrier overhead, virtual-byte weighting, proving time and the large WE ciphertext are separate.</p></section>`
  return ''
}

const sequenceHTML = lesson => !lesson.sequence ? '' : `<section class="panel interactive" data-sequence-lab><div class="eyebrow">Build the sequence</div><h2>Choose the next required step</h2><script type="application/json" data-sequence-data>${json(lesson.sequence)}</script><div class="sequence-buttons">${[3,0,5,2,1,4].map(i => `<button data-sequence-step="${i}">${esc(lesson.sequence[i][0])}</button>`).join('')}</div><ol class="sequence-progress" data-sequence-progress></ol><p class="feedback" data-sequence-result role="status" aria-live="polite">Choose the first step, then continue in order.</p><div class="controls"><button data-sequence-reset>Start again</button></div></section>`

const rehearsalHTML = lesson => !lesson.rehearsal ? '' : `<section class="panel interactive" data-rehearsal-lab><div class="eyebrow">Practice before revealing</div><h2>Answer an audience question</h2><script type="application/json" data-rehearsal-data>${json(lesson.rehearsal)}</script><label for="${lesson.id}-question">Choose a question</label><select id="${lesson.id}-question">${lesson.rehearsal.map(([question], i) => `<option value="${i}">${esc(question)}</option>`).join('')}</select><p class="inset" data-rehearsal-prompt>${esc(lesson.rehearsal[0][0])}</p><label for="${lesson.id}-draft">Write your answer or say it aloud</label><textarea class="rehearsal-draft" id="${lesson.id}-draft" placeholder="Direct answer → mechanism → limitation"></textarea><div class="controls"><button data-rehearsal-reveal aria-expanded="false" aria-controls="${lesson.id}-model">Show or hide a model answer</button></div><p id="${lesson.id}-model" class="inset" data-rehearsal-answer hidden></p><div class="review-checks"><label><input type="checkbox"> I gave a direct answer</label><label><input type="checkbox"> I named the relevant mechanism</label><label><input type="checkbox"> I stated the scope or limitation</label></div><p class="small">This is a self-review rubric, not automatic grading. Drafts stay in this open page only. Share your answer in chat for feedback and a learning record.</p></section>`

function casesHTML(lesson, lessonIndex) {
  return `<section class="case-study" data-case-study><h2>Try new cases</h2><p class="small">Predict the answer before clicking. Each case gives immediate feedback.</p><div class="case-tabs" role="group" aria-label="Practice cases">${lesson.cases.map((_, i) => `<button data-case-select="${i}" aria-pressed="${i === 0}" aria-controls="${lesson.id}-case-${i}">Case ${i + 1}</button>`).join('')}</div>${lesson.cases.map((exercise, i) => {
    const counts = exercise.choices.map(choice => choice.trim().split(/\s+/).length)
    if (new Set(counts).size !== 1) throw new Error(`Unequal answer lengths in ${lesson.id} case ${i + 1}: ${counts}`)
    const target = (lessonIndex + i) % exercise.choices.length
    const offset = (exercise.answer - target + exercise.choices.length) % exercise.choices.length
    const choices = exercise.choices.map((_, j) => ({ text: exercise.choices[(j + offset) % exercise.choices.length], correct: (j + offset) % exercise.choices.length === exercise.answer }))
    return `<fieldset class="quiz" data-quiz data-case-item id="${lesson.id}-case-${i}"${i ? ' hidden' : ''}><legend>${esc(exercise.prompt)}</legend><div class="choices">${choices.map(choice => `<button${choice.correct ? ' data-correct="true"' : ''} data-feedback="${esc(exercise.explanation)}" aria-pressed="false">${esc(choice.text)}</button>`).join('')}</div><p class="feedback quiz-feedback" role="status" aria-live="polite"></p></fieldset>`
  }).join('')}</section>`
}

export async function generateLessons() {
  const curriculum = JSON.parse(await read('curriculum.json'))
  const modules = curriculum.phases.flatMap(phase => phase.modules)
  const sequence = [...modules, ...curriculum.optional_extensions]
  const css = `${await read('assets/teach.css')}\n${await read('assets/foundations.css')}\n${await read('assets/course-labs.css')}`
  const js = `${await read('assets/teach.js')}\n${await read('assets/course-labs.js')}`
  for (const [lessonIndex, lesson] of lessons.entries()) {
    const index = sequence.findIndex(module => module.id === lesson.id)
    if (index < 0) throw new Error(`Unknown module ${lesson.id}`)
    const module = sequence[index]
    const material = curriculum.materials[module.primary_material]
    if (!material) throw new Error(`Missing primary material for ${lesson.id}`)
    const navLink = (entry, label) => {
      const destination = curriculum.materials[entry.primary_material]
      return `<a href="../${esc(destination.path)}" data-inline-lesson="${esc(destination.panel)}">${esc(label)}</a>`
    }
    const navigation = `${index ? navLink(sequence[index - 1], `← ${sequence[index - 1].title}`) : ''}${index + 1 < sequence.length ? navLink(sequence[index + 1], `Next: ${sequence[index + 1].title} →`) : ''}<a href="plan.html" data-inline-lesson="plan">Full course</a><a href="../reference/shielded-bitcoin-concept-map.html" data-inline-lesson="reference">Quick reference</a>`
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(module.title)} · Shielded Bitcoin</title><style>${css}</style></head><body><main class="page" data-lesson="${esc(material.panel)}"><header><div class="eyebrow">${esc(lesson.id)} · ${lesson.id.startsWith('E') ? 'Optional extension' : 'Core course'} · about ${module.minutes || 10} minutes</div><h1 tabindex="-1">${esc(lesson.title)}</h1><p class="lede">${esc(lesson.lede)}</p><p class="lesson-objective">You’ll be able to: ${esc(module.win || module.goal)}.</p></header>${lesson.blocks.map(([heading, body]) => `<section><h2>${esc(heading)}</h2>${readableTables(body)}</section>`).join('\n')}${labHTML(lesson.lab, lesson.id)}${sequenceHTML(lesson)}${rehearsalHTML(lesson)}${casesHTML(lesson, lessonIndex)}<section><h2>Explain it back</h2><p>${esc(lesson.recall)}</p><p class="small">Ask me about anything you cannot explain yet. In a later session, try this prompt before reopening the explanation.</p></section><section><h2>Primary reading</h2><p class="small">Read the relevant section after the exercise; you do not need the whole paper at once.</p>${sourceLinks(lesson.sources)}</section><nav class="page-nav">${navigation}</nav></main><script>${js}</script></body></html>`
    await writeFile(resolve(root, material.path), html)
  }
  return lessons.length
}
