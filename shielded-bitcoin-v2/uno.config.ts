import { defineConfig } from 'unocss'

// Shielded Bitcoin palette. Exposed to UnoCSS so slides can use utilities
// (text-violet, border-cyan/40, …) instead of hand-written CSS. Presets are
// intentionally not declared here so Slidev's own presets — including
// presetIcons for Iconify — stay intact
//
// Colour grammar, applied the same way on every slide:
//   orange — Bitcoin, the public layer that stores and orders bytes
//   violet — shielded data: notes, ciphertexts, the proof
//   cyan   — indexers and replay
//   green  — accepted / valid / hidden from an observer
//   red    — rejected / leaked / visible to an observer
//   amber  — Alice, and secrets that carry spend authority
//   pink   — Bob
export default defineConfig({
  theme: {
    colors: {
      bg: '#070912',
      surface: '#11142a',
      violet: '#a18cff',
      violetlt: '#cfc4ff',
      cyan: '#4cc9f0',
      orange: '#f7931a',
      green: '#46d9a0',
      red: '#ff6b81',
      amber: '#ffc24b',
      pink: '#f472b6',
      body: '#dde1f2',
      muted: '#8a90ae',
    },
  },
  shortcuts: {
    // Frosted panel used by every card-like element in the deck
    'pane': 'bg-white/4 border border-white/12 rounded-2xl',
    'pane-violet': 'bg-violet/7 border border-violet/40 rounded-2xl',
    'pane-cyan': 'bg-cyan/6 border border-cyan/40 rounded-2xl',
    'pane-green': 'bg-green/7 border border-green/40 rounded-2xl',
    'pane-red': 'bg-red/7 border border-red/40 rounded-2xl',
    'pane-orange': 'bg-orange/7 border border-orange/40 rounded-2xl',
    'pane-amber': 'bg-amber/7 border border-amber/40 rounded-2xl',
    'pane-pink': 'bg-pink/7 border border-pink/40 rounded-2xl',
    // Small uppercase label above a group
    'eyebrow': 'text-[0.68rem] font-bold tracking-[0.16em] uppercase text-muted',
    // Pill used for the small facts that appear inside diagrams
    'chip': 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold whitespace-nowrap',
    'chip-violet': 'chip bg-violet/15 border-violet/45 text-violetlt',
    'chip-cyan': 'chip bg-cyan/15 border-cyan/45 text-cyan',
    'chip-green': 'chip bg-green/15 border-green/45 text-green',
    'chip-red': 'chip bg-red/15 border-red/45 text-red',
    'chip-orange': 'chip bg-orange/15 border-orange/45 text-orange',
    'chip-amber': 'chip bg-amber/15 border-amber/45 text-amber',
    'chip-pink': 'chip bg-pink/15 border-pink/45 text-pink',
    'chip-muted': 'chip bg-white/5 border-white/15 text-muted',
    // Monospace protocol symbol, e.g. sk_spend, h_body
    'sym': 'font-mono text-[0.92em] tracking-tight',
  },
  safelist: [
    'i-ph-currency-btc-fill', 'i-ph-list-bullets-bold', 'i-ph-clock-counter-clockwise-duotone',
    // Accents chosen by prop inside components, so the class strings never
    // appear literally in source for UnoCSS to scan
    ...['violet', 'violetlt', 'cyan', 'orange', 'green', 'red', 'amber', 'pink', 'muted', 'body', 'white'].flatMap(c => [
      `text-${c}`, `bg-${c}`, `border-${c}`,
      `bg-${c}/7`, `bg-${c}/10`, `bg-${c}/15`, `bg-${c}/20`, `bg-${c}/25`,
      `border-${c}/30`, `border-${c}/40`, `border-${c}/45`, `border-${c}/60`,
      `text-${c}/70`,
    ]),
    'pane', 'pane-violet', 'pane-cyan', 'pane-green', 'pane-red', 'pane-orange', 'pane-amber', 'pane-pink',
    'chip-violet', 'chip-cyan', 'chip-green', 'chip-red', 'chip-orange', 'chip-amber', 'chip-pink', 'chip-muted',
    'i-ph-wallet-duotone', 'i-ph-cpu-duotone', 'i-ph-envelope-simple-fill', 'i-ph-tree-structure-duotone',
    'i-ph-check-circle-fill', 'i-ph-x-circle-fill', 'i-ph-lock-simple-fill', 'i-ph-key-fill',
    'i-ph-eye-duotone', 'i-ph-eye-slash-duotone', 'i-ph-seal-check-duotone', 'i-ph-hash-bold',
    'i-ph-brackets-curly-bold', 'i-ph-clock-countdown-duotone', 'i-ph-fingerprint-duotone',
    'i-ph-file-lock-duotone', 'i-ph-shield-check-duotone', 'i-ph-plant-duotone', 'i-ph-key-duotone',
    'i-ph-binoculars-duotone', 'i-ph-arrow-down-bold', 'i-ph-arrow-up-bold', 'i-ph-arrow-right-bold',
    'i-ph-arrow-left-bold', 'i-ph-scan-duotone', 'i-ph-stack-duotone', 'i-ph-database-duotone',
    'i-ph-list-checks-duotone', 'i-ph-magnifying-glass-duotone', 'i-ph-identification-badge-duotone',
  ],
})
