import { slides } from '../presentation.mjs'

// Run inside the task-owned T3 preview tab using dynamic import and runBrowserAudit()
export async function runBrowserAudit() {
  const router = document.querySelector('#app').__vue_app__.config.globalProperties.$router
  const original = router.currentRoute.value.fullPath
  const style = document.createElement('style')
  style.textContent = '*,*::before,*::after{transition:none!important;animation-duration:.001ms!important;animation-delay:0ms!important}'
  document.head.append(style)
  const failures = []
  let states = 0
  const visible = (element) => {
    for (let node = element; node && node !== document.body; node = node.parentElement) {
      const css = getComputedStyle(node)
      if (css.display === 'none' || css.visibility === 'hidden' || Number(css.opacity) < .05) return false
    }
    return true
  }
  try {
    await document.fonts.ready
    for (const [index, slide] of slides.entries()) {
      for (let click = 0; click <= slide.clicks; click++) {
        const page = index + 1
        await router.replace({ path: `/${page}`, query: { clicks: String(click) } })
        await new Promise(resolve => setTimeout(resolve, 85))
        const layout = document.querySelector(`.slidev-page-${page} .slidev-layout`)
        if (!layout) throw new Error(`Missing layout ${page}`)
        const bounds = layout.getBoundingClientRect()
        const issues = []
        const walker = document.createTreeWalker(layout, NodeFilter.SHOW_TEXT)
        let node
        while ((node = walker.nextNode())) {
          const parent = node.parentElement
          if (!node.textContent.trim() || !visible(parent) || parent.closest('style,script')) continue
          // CipherRain is decorative; AnchorWindow intentionally clips its moving block track
          if (page === 1 && parent.closest('[aria-hidden="true"]')) continue
          if (page === 14 && parent.closest('.track-mask')) continue
          const range = document.createRange()
          range.selectNodeContents(node)
          for (const rect of range.getClientRects()) {
            if (rect.width && rect.height && (rect.left < bounds.left - 2 || rect.right > bounds.right + 2 || rect.top < bounds.top - 2 || rect.bottom > bounds.bottom + 2))
              issues.push(`Text outside slide: ${node.textContent.trim().slice(0,90)}`)
          }
        }
        for (const img of layout.querySelectorAll('img'))
          if (visible(img) && (!img.complete || !img.naturalWidth)) issues.push(`Image unavailable: ${img.getAttribute('src')}`)
        for (const icon of layout.querySelectorAll('[class*="i-ph-"]')) {
          if (!visible(icon)) continue
          const css = getComputedStyle(icon)
          if (css.maskImage === 'none' && css.backgroundImage === 'none') issues.push(`Icon unavailable: ${icon.className}`)
        }
        const counter = document.querySelector(`.slidev-page-${page} .slidev-global-pageno`)?.textContent.trim()
        if (counter !== `${page}/${slides.length}`) issues.push(`Wrong counter: ${counter}`)
        if (issues.length) failures.push({ page, click, issues })
        states++
      }
    }
    return { viewport: { width: innerWidth, height: innerHeight }, slides: slides.length, states, failures }
  } finally {
    style.remove()
    await router.replace(original)
  }
}
