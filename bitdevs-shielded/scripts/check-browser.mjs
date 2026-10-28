import { chromium } from 'playwright-chromium'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { slides, mainCount, replayTo, privacyCandidates, totalSeconds } from '../talk.mjs'

const base = process.env.BITDEVS_URL || 'http://localhost:3032'
const output = '/tmp/bitdevs-shielded-qa'
await mkdir(output, { recursive: true })
assert.equal(totalSeconds, 1500)
assert.equal(replayTo(0).leaves, 8)
assert.equal(replayTo(1).leaves, 10)
for (let i = 2; i <= 4; i++) {
  assert.equal(replayTo(i).leaves, 10)
  assert.deepEqual(replayTo(i).spent, ['nf_A'])
}
assert.deepEqual(replayTo(4).log.map(e => e.failed), [-1, 3, 4, 2])
assert.deepEqual([0, 1, 2, 3].map(i => privacyCandidates(i).filter(c => !c.reason).length), [12, 8, 4, 1])
const browser = await chromium.launch({ headless: true })
const errors = []
const bounds = []
const checks = []
let states = 0
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  page.on('pageerror', e => { if (!e.message.includes('Wake Lock')) errors.push(e.message) })
  async function go(index, step = 0) {
    await page.goto(`${base}/${index + 1}?clicks=${step}`, { waitUntil: 'networkidle' })
    const root = page.locator(`[data-talk="${index + 1}"]`).first()
    await root.waitFor({ state: 'visible' })
    assert.equal(await root.getAttribute('data-step'), String(step))
    return root
  }
  async function inspect(root, id, step) {
    const problems = await root.evaluate(el => {
      const zones = ['.talk-heading', '.talk-stage', '.talk-insight', '.talk-footer']
      const result = []
      for (const selector of zones) {
        const zone = el.querySelector(selector)
        if (!zone) continue
        const box = zone.getBoundingClientRect()
        for (const n of zone.querySelectorAll('*')) {
          if (!n.childNodes.length || ![...n.childNodes].some(t => t.nodeType === 3 && t.textContent.trim())) continue
          if (n.closest('.off, .waiting')) continue
          const r = n.getBoundingClientRect()
          if (!r.width || !r.height) continue
          if (r.left < box.left - 3 || r.right > box.right + 3 || r.top < box.top - 3 || r.bottom > box.bottom + 3) result.push({ zone: selector, text: n.textContent.slice(0, 100), r: { x: r.x, y: r.y, bottom: r.bottom, right: r.right }, limit: { top: box.top, bottom: box.bottom, right: box.right } })
        }
      }
      return result
    })
    if (problems.length) bounds.push({ id, step, problems })
    states++
  }
  for (let index = 0; index < slides.length; index++) {
    const item = slides[index]
    let root = await go(index)
    for (let step = 0; step <= item.clicks; step++) {
      if (step > 0) {
        await page.keyboard.press('ArrowRight')
        await page.waitForFunction(({ n, step }) => document.querySelector(`[data-talk="${n}"]`)?.dataset.step === String(step), { n: index + 1, step })
        await page.waitForTimeout(370)
      }
      await inspect(root, item.id, step)
      if (step === item.clicks || ['publication', 'proof-making', 'proof-checking', 'binding-note', 'binding-body', 'replay-lab', 'privacy-lab'].includes(item.id)) await root.screenshot({ path: `${output}/${String(index + 1).padStart(2, '0')}-${item.id}-${step}.png` })
    }
    if ((index + 1) % 10 === 0) console.log(`Captured ${index + 1}/${slides.length} slides`)
  }
  checks.push(`${states} click states; arrow keys traverse every reveal`)
  let root = await go(slides.findIndex(s => s.id === 'replay-lab'))
  for (const [name, expectedStep] of [['A · valid payment', 1], ['B · reused nullifier', 2], ['C · bad proof', 3], ['D · expired anchor', 4]]) {
    await root.getByRole('button', { name, exact: true }).click()
    await page.waitForFunction(step => document.querySelector('[data-id="replay-lab"]')?.dataset.step === String(step), expectedStep)
    assert.equal(await root.locator('[data-leaves]').innerText(), '10')
    assert.match(await root.locator('[data-spent]').innerText(), /nf_A/)
  }
  await root.getByRole('button', { name: 'Reset', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('[data-id="replay-lab"]')?.dataset.step === '0')
  assert.equal(await root.locator('[data-leaves]').innerText(), '8')
  checks.push('Replay: cases, rejection order, atomicity and reset')
  root = await go(slides.findIndex(s => s.id === 'privacy-lab'))
  for (const [name, expected] of [['Anchor root', '8'], ['Known notes', '4'], ['Correlation', '1'], ['All leaves', '12']]) {
    await root.getByRole('button', { name, exact: true }).click()
    await root.locator('.candidate-count strong').filter({ hasText: new RegExp(`^${expected}$`) }).waitFor()
  }
  checks.push('Candidates: 12 → 8 → 4 → 1; reset')
  root = await go(mainCount - 1)
  await root.getByRole('button', { name: 'What is inside a proof? ↗', exact: true }).click()
  await page.waitForURL(`**/${slides.findIndex(s => s.id === 'proof-details') + 1}`)
  await page.locator('[data-id="proof-details"]').waitFor({ state: 'visible' })
  await page.locator('[data-id="proof-details"]').getByRole('button', { name: 'Open contents and appendix' }).click()
  const dialog = page.getByRole('dialog', { name: 'Presentation contents' })
  await dialog.getByRole('button', { name: new RegExp(`${mainCount}\\s*Questions`) }).click()
  await page.waitForURL(`**/${mainCount}`)
  checks.push('Appendix shortcuts, contents and return to Q&A')
  for (const viewport of [{ width: 1280, height: 720 }, { width: 1024, height: 768 }]) {
    await page.setViewportSize(viewport)
    root = await go(8, 3)
    await inspect(root, `proof-checking-${viewport.width}`, 3)
  }
  checks.push('16:9 and letterboxed 4:3 viewports')
  await page.setViewportSize({ width: 1440, height: 900 })
  const presenter = await context.newPage()
  try {
    await page.goto(`${base}/15?clicks=0`, { waitUntil: 'networkidle' })
    await presenter.goto(`${base}/presenter/15?clicks=0`, { waitUntil: 'networkidle' })
    const current = presenter.locator('[data-id="replay-lab"]:visible').first()
    await current.waitFor({ state: 'visible' })
    await current.getByRole('button', { name: 'A · valid payment', exact: true }).click()
    await page.waitForFunction(() => document.querySelector('[data-id="replay-lab"]')?.dataset.step === '1')
    assert.equal(await page.locator('[data-id="replay-lab"] [data-leaves]').innerText(), '10')
    await presenter.screenshot({ path: `${output}/presenter.png` })
    assert.match(await presenter.locator('body').innerText(), /The existing note history is on the right/)
    checks.push('Presenter: notes present and lab state synchronized with the audience')
  } finally { await presenter.close() }
  const report = { slides: slides.length, mainCount, states, checks, bounds, errors }
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
  assert.deepEqual(errors, [])
  assert.deepEqual(bounds, [])
} finally {
  await writeFile(`${output}/report.json`, JSON.stringify({ slides: slides.length, mainCount, states, checks, bounds, errors }, null, 2))
  await browser.close()
}
