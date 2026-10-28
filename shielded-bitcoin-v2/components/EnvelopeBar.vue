<script setup lang="ts">
import { computed } from 'vue'
import { fakeHex } from '../utils/hex'

/**
 * The transfer envelope, drawn to scale: one bar, one segment per field, each
 * segment's width proportional to its bytes in the paper's 2-input, 2-output
 * profile (Appendix A.4) — 610 bytes in all. The only exception is the header
 * group (12 bytes), which gets a floor so its label fits
 *
 * Two slides use it, and the second opens in the first one's final state:
 *
 *   anatomy (step 1–6): the fields arrive one group at a time, then the size
 *   binding (full, bind 1–3): everything but the proof is hashed into h_body; h_body
 *     is a public input of the proof; change one byte of ct_out and h_body
 *     changes, so the proof no longer verifies
 *
 * Fixed pixel widths so the bracket and the arrow land on segment edges
 */
const props = withDefaults(
  defineProps<{ step?: number; bind?: number; full?: boolean }>(),
  { step: 0, bind: 0, full: false },
)

const W = 871
const GAP = 4
const HEAD_MIN = 70

type Seg = { id: string; name: string; bytes: number; desc: string; at: number; tone: string }
const segs: Seg[] = [
  { id: 'head', name: 'header', bytes: 12, desc: 'version · anchor height · counts', at: 1, tone: 'head' },
  { id: 'nf', name: 'nf ×2', bytes: 64, desc: 'public spend markers', at: 2, tone: 'nf' },
  { id: 'pk', name: 'pk_eph ×2', bytes: 64, desc: 'one key per output', at: 3, tone: 'out' },
  { id: 'ct', name: 'ct_note ×2', bytes: 134, desc: 'one encrypted note per output', at: 3, tone: 'out' },
  { id: 'out', name: 'ct_out', bytes: 144, desc: "the sender's recovery copy", at: 4, tone: 'rec' },
  { id: 'pi', name: 'π', bytes: 192, desc: 'the proof', at: 5, tone: 'pi' },
]

const pxPerByte = (W - GAP * (segs.length - 1) - HEAD_MIN) / segs.slice(1).reduce((a, s) => a + s.bytes, 0)
const layout = (() => {
  let x = 0
  return segs.map((s) => {
    const w = s.id === 'head' ? HEAD_MIN : s.bytes * pxPerByte
    const seg = { ...s, x, w }
    x += w + GAP
    return seg
  })
})()
const body = layout.slice(0, 5)
const pi = layout[5]
const bodyW = body[4].x + body[4].w

/** `full` opens with every segment already there — the binding slide does */
const shown = (s: Seg) => props.full || props.step >= s.at
const tampered = computed(() => props.bind >= 3)
/**
 * The field that gets edited on the last click. ct_out on purpose: it is one of
 * the fields the proof does not take as an individual public input (§13.3), so
 * h_body is the only thing that protects it — which is the slide's point
 */
const TAMPER = 'out'

const tones: Record<string, string> = {
  head: 'border-white/20 bg-white/6',
  nf: 'border-violet/55 bg-violet/16',
  out: 'border-violet/45 bg-violet/10',
  rec: 'border-amber/40 bg-amber/8',
  pi: 'border-cyan/60 bg-gradient-to-r from-violet/20 to-cyan/16',
}

/** Enough hex to fill a segment: about four lines of 0.6rem mono */
const bytesFor = (s: Seg & { w: number }) => {
  const n = Math.max(8, Math.ceil((s.w - 16) / 5.8)) * 4
  const seed = s.id === TAMPER && tampered.value ? 'swapped' : `env-${s.id}`
  return fakeHex(seed, n)
}
const hBody = computed(() => tampered.value ? fakeHex('h-body-tampered', 16) : fakeHex('h-body', 16))
</script>

<template>
  <div class="relative mx-auto h-[262px]" :style="{ width: `${W}px` }">
    <!-- h_body, and the bracket over everything it hashes -->
    <div class="reveal absolute left-0 top-0" :class="bind >= 1 || 'reveal-off'" :style="{ width: `${bodyW}px` }">
      <div class="flex justify-center">
        <div class="flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition-colors duration-500"
             :class="tampered ? 'border-red/70 bg-red/12' : 'border-cyan/55 bg-[#0f2230]'">
          <span class="sym text-xs font-semibold" :class="tampered ? 'text-red' : 'text-cyan'">h_body</span>
          <Scramble :value="hBody" class="text-xs" :class="tampered ? 'text-red' : 'text-white'" />
        </div>
      </div>
      <div class="mx-auto mt-1 text-center text-[0.62rem] text-muted">hash of every byte except the proof</div>
      <div class="mt-1 h-3 w-full rounded-t-md border-x-2 border-t-2 transition-colors duration-500" :class="tampered ? 'border-red/50' : 'border-cyan/40'" />
    </div>

    <!-- h_body is a public input of the proof -->
    <svg class="pointer-events-none absolute left-0 top-0" :width="W" height="80" aria-hidden="true">
      <defs>
        <marker id="env-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#4cc9f0" />
        </marker>
      </defs>
      <path :d="`M ${bodyW / 2 + 118} 17 C ${pi.x + pi.w / 2 - 40} 12, ${pi.x + pi.w / 2} 20, ${pi.x + pi.w / 2} 62`"
            fill="none" stroke="#4cc9f0" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#env-arrow)"
            class="transition-opacity duration-500" :class="bind >= 2 ? 'opacity-90' : 'opacity-0'" />
    </svg>
    <div class="absolute text-[0.66rem] text-cyan transition-opacity duration-500" :class="bind >= 2 ? 'opacity-100' : 'opacity-0'"
         :style="{ left: `${pi.x + pi.w / 2 + 10}px`, top: '28px' }">a public input<br>of the proof</div>

    <!-- the bar -->
    <div v-for="s in layout" :key="s.id" class="reveal absolute" :class="shown(s) || 'reveal-off'"
         :style="{ left: `${s.x}px`, width: `${s.w}px`, top: '66px' }">
      <div class="mb-1 truncate font-mono text-[0.72rem] font-semibold"
           :class="s.id === 'pi' ? 'text-cyan' : s.id === 'head' ? 'text-body/80' : s.id === 'out' ? 'text-amber' : 'text-violetlt'">{{ s.name }}</div>
      <div class="relative h-16 overflow-hidden rounded-lg border px-2 py-1.5 transition-all duration-500"
           :class="[tones[s.tone], s.id === TAMPER && tampered ? '!border-red !bg-red/15 shake-once' : '']">
        <div class="break-all font-mono text-[0.6rem] leading-[1.35] transition-opacity duration-500" :style="s.id === 'pi' && tampered ? { opacity: 0 } : {}" :class="s.id === 'head' ? 'text-body/50' : s.id === TAMPER && tampered ? 'text-red' : 'cipher'">
          <Scramble :value="bytesFor(s)" :duration="900" />
        </div>
        <!-- the proof, refusing -->
        <div v-if="s.id === 'pi'" class="absolute inset-0 grid place-items-center bg-[#2a0f1a]/85 transition-opacity duration-500 delay-700"
             :class="tampered ? 'opacity-100' : 'opacity-0'">
          <div class="flex items-center gap-2 text-sm font-bold text-red"><span class="i-ph-x-circle-fill text-xl" /> does not verify</div>
        </div>
      </div>
      <div class="mt-1.5 text-[0.66rem] text-muted leading-tight">{{ s.desc }}</div>
    </div>

    <!-- size -->
    <div class="reveal absolute left-0 right-0 flex items-center justify-center gap-3" :class="(step >= 6 || full) || 'reveal-off'" style="top: 212px">
      <span class="chip-violet !text-xs !px-3.5 !py-1.5"><span class="i-ph-ruler-duotone" /> 610 bytes · 2 inputs, 2 outputs</span>
      <span class="chip-orange !text-xs !px-3.5 !py-1.5"><BtcMark :size="13" /> carried in one OP_RETURN output</span>
    </div>
  </div>
</template>
