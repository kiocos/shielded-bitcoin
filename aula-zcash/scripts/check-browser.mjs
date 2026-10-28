import { chromium } from 'playwright-chromium'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { lessons } from '../course.mjs'

const base = process.env.STUDY_URL || 'http://localhost:3031'
const output = '/tmp/zcash-study-qa'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
const errors = []
const checks = []
const overflow = []
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('pageerror', e => { if (!e.message.includes('Wake Lock')) errors.push(e.message) })
  async function go(id) {
    const n = lessons.findIndex(l => l.id === id) + 1
    await page.goto(`${base}/${n}`, { waitUntil: 'networkidle' })
    const root = page.locator(`[data-lesson="${n}"]`)
    await root.waitFor({ state: 'visible' })
    return root
  }
  async function assertText(locator, expected) {
    await locator.filter({ hasText: expected }).waitFor({ state: 'visible' })
    checks.push(expected)
  }
  for (let i = 0; !process.env.STUDY_SKIP_CAPTURE && i < lessons.length; i++) {
    const root = await go(lessons[i].id)
    const issues = await root.evaluate(el => {
      const bounds = el.querySelector('.visual-zone').getBoundingClientRect()
      const nodes = [...el.querySelectorAll('.visual-zone *')].filter(n => n.namespaceURI !== 'http://www.w3.org/2000/svg' && !n.classList.contains('walk-watermark') && n.childNodes.length && [...n.childNodes].some(t => t.nodeType === 3 && t.textContent.trim()))
      return nodes.flatMap(n => {
        const r = n.getBoundingClientRect()
        if (!r.width || !r.height) return []
        return r.left < bounds.left - 2 || r.right > bounds.right + 2 || r.top < bounds.top - 2 || r.bottom > bounds.bottom + 2 ? [{ text: n.textContent.slice(0, 80), x: Math.round(r.x), y: Math.round(r.y), bottom: Math.round(r.bottom), zoneBottom: Math.round(bounds.bottom) }] : []
      })
    })
    if (issues.length) overflow.push({ page: i + 1, id: lessons[i].id, issues })
    await root.screenshot({ path: `${output}/${String(i + 1).padStart(2, '0')}-${lessons[i].id}.png` })
  }
  console.log(`Layout: ${process.env.STUDY_SKIP_CAPTURE ? 'previous captures preserved' : `${lessons.length} screens captured`}; ${overflow.length} overflows`)

  let root = await go('lab-commitment')
  const initial = await root.locator('.hash-result code').innerText()
  await root.getByRole('button', { name: 'Generate new randomness' }).click()
  await page.waitForFunction(old => document.querySelector('.study-page .hash-result code')?.textContent !== old, initial)
  assert.match(await root.locator('.hash-result code').innerText(), /^[a-f0-9]{64}$/)
  checks.push('SHA-256 changes with randomness')

  root = await go('lab-nullifier')
  await root.getByRole('button', { name: 'Record marker' }).click()
  await assertText(root.getByRole('status'), 'RECORDED')
  await root.getByRole('button', { name: 'Record marker' }).click()
  await assertText(root.getByRole('status'), 'REJECTED')
  await root.getByLabel('Note position').fill('43')
  await page.waitForTimeout(100)
  await root.getByRole('button', { name: 'Record marker' }).click()
  await assertText(root.getByRole('status'), 'RECORDED')

  root = await go('lab-merkle')
  for (const leaf of 'ABCD') {
    await root.getByRole('button', { name: `Select leaf ${leaf}` }).click()
    await page.waitForTimeout(100)
    assert.ok(!(await root.getByRole('status').innerText()).includes('DOES NOT'))
  }
  await root.getByRole('checkbox').check()
  await assertText(root.getByRole('status'), 'DOES NOT MATCH')
  checks.push('Four Merkle paths; incorrect sibling rejected')

  root = await go('lab-circuito')
  await assertText(root.getByRole('status'), 'PASSES')
  await root.getByRole('button', { name: 'Try creating 17 units' }).click()
  await assertText(root.getByRole('status'), 'FAILS')
  assert.match(await root.locator('.checks p').first().innerText(), /✓/)
  checks.push('Modular equality does not authorize value creation')

  root = await go('lab-replay')
  const state = () => root.locator('.state-pair').innerText()
  await root.getByRole('button', { name: 'Process envelope' }).click()
  await assertText(root.getByRole('status'), 'ACCEPTED')
  assert.match(await state(), /10 leaves/)
  await root.getByLabel('Replay case').selectOption('double')
  await root.getByRole('button', { name: 'Process envelope' }).click()
  await assertText(root.getByRole('status'), 'REJECTED')
  assert.match(await state(), /10 leaves/)
  for (const type of ['parse', 'binding', 'proof', 'internal']) {
    await root.getByRole('button', { name: 'Reset state' }).click()
    await root.getByLabel('Replay case').selectOption(type)
    await root.getByRole('button', { name: 'Process envelope' }).click()
    await assertText(root.getByRole('status'), 'REJECTED')
    assert.match(await state(), /8 leaves/)
  }
  await root.getByLabel('Replay case').selectOption('valid')
  for (const [height, valid] of [[899, false], [900, true], [999, true], [1000, false]]) {
    await root.getByRole('button', { name: 'Reset state' }).click()
    await root.getByLabel('Anchor height').fill(String(height))
    await root.getByRole('button', { name: 'Process envelope' }).click()
    await assertText(root.getByRole('status'), valid ? 'ACCEPTED' : 'REJECTED')
    assert.match(await state(), valid ? /10 leaves/ : /8 leaves/)
  }
  checks.push('Replay: atomicity, duplicates, proofs and inclusive anchor boundaries')
  await root.screenshot({ path: `${output}/replay-rejected.png` })

  root = await go('privacy-lab')
  await assertText(root.getByRole('status'), '12 candidates')
  for (const box of await root.getByRole('checkbox').all()) await box.check()
  await assertText(root.getByRole('status'), '1 candidate')

  root = await go('binding')
  await root.getByRole('button', { name: 'ct_out original' }).click()
  await assertText(root.getByRole('status'), 'fails')

  for (const mode of ['zcash-fluxo', 'alice-bob']) {
    root = await go(mode)
    while (await root.getByRole('button', { name: 'Next step', exact: true }).isEnabled()) await root.getByRole('button', { name: 'Next step', exact: true }).click()
    assert.match(await root.locator('.walk-scene').innerText(), /Bob/)
  }
  checks.push('Walkthroughs advance to Bob’s detection')
  for (const lesson of lessons.filter(l => l.visual.type === 'quiz')) {
    root = await go(lesson.id)
    await root.locator('.quiz-choice').nth(lesson.visual.correct).click()
    await root.getByRole('button', { name: 'Show explained answer' }).click()
    assert.equal(await root.locator('.quiz-choice.correct').count(), 1)
    await assertText(root.getByRole('status'), lesson.visual.answer.slice(0, 20))
    await root.screenshot({ path: `${output}/quiz-${lesson.id}.png` })
  }

  root = await go('inicio')
  await root.getByRole('button', { name: '☷ Index' }).click()
  await root.getByLabel('Search concepts').fill('nullifier')
  assert.ok(await root.locator('.index-grid>button').count() > 1)
  await root.locator('.index-grid>button').filter({ hasText: 'Spend without pointing to the leaf' }).click()
  await page.waitForURL(`${base}/10`)
  await root.waitFor({ state: 'hidden' })
  await page.locator('[data-lesson="10"]').getByRole('button', { name: 'Next screen', exact: true }).click()
  await page.waitForURL(`${base}/11`)
  assert.equal(await page.evaluate(() => localStorage.getItem('zcash-sb-study-page-v1')), '11')
  checks.push('Search, navigation and resume position')

  root = await go('inicio')
  await root.getByRole('button', { name: 'Reading', exact: true }).click()
  assert.equal(await root.locator('.reader-content article').count(), lessons.length)
  await root.screenshot({ path: `${output}/reading.png` })
  await page.emulateMedia({ media: 'print' })
  await page.pdf({ path: `${output}/reading.pdf`, printBackground: true, format: 'A4' })
  await page.emulateMedia({ media: 'screen' })
  await root.getByRole('button', { name: 'Close panel' }).click()
  checks.push('Complete continuous reading and print export')

  for (const scheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: scheme })
    const bg = await root.evaluate(el => getComputedStyle(el).backgroundColor)
    assert.equal(bg, 'rgb(8, 11, 20)')
  }
  await page.setViewportSize({ width: 1280, height: 800 })
  root = await go('comparacao')
  await root.screenshot({ path: `${output}/comparison-1280.png` })
  checks.push('Stable dark theme and 1280 × 800 viewport')

  assert.deepEqual(errors, [])
  await writeFile(`${output}/report.json`, JSON.stringify({ pages: lessons.length, checks, errors, overflow }, null, 2))
  console.log(JSON.stringify({ pages: lessons.length, checks: checks.length, errors, overflow }, null, 2))
  if (overflow.length) process.exitCode = 1
} finally {
  await browser.close()
}
