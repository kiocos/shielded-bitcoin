<script setup lang="ts">
// One fixed 871 × 340 canvas for public payments, note creation, input selection and accepted state
const props = withDefaults(defineProps<{ clicks?: number; mode?: 'public' | 'notes' | 'select' | 'state' }>(), { clicks: 0, mode: 'notes' })
const at = (n: number) => props.clicks >= n
</script>

<template>
  <div class="payment-canvas" :data-mode="mode">
    <div class="canvas-label">{{ mode === 'public' ? 'public Bitcoin transaction' : mode === 'state' ? 'wallet annotations over accepted public records' : 'wallet view · amounts and owners are private' }}</div>
    <svg width="871" height="340" class="edges" aria-hidden="true">
      <path d="M246 169 H371 V94 H602" class="reveal" :class="at(mode === 'notes' ? 2 : mode === 'state' ? 2 : 1) || 'reveal-off'" />
      <path d="M371 169 V258 H602" class="reveal" :class="at(mode === 'public' ? 2 : mode === 'state' ? 2 : 3) || 'reveal-off'" />
      <path d="M594 87 L602 94 L594 101 M594 251 L602 258 L594 265" class="reveal" :class="at(3) || 'reveal-off'" />
    </svg>
    <div class="pay-note alice" :class="[mode !== 'public' && !at(1) ? 'reveal-off' : '', 'reveal']" style="left:0;top:91px;width:246px;height:156px">
      <div class="note-owner"><span class="i-ph-wallet-duotone" /> Alice</div>
      <div class="pay-value">100,000 <small>sat</small></div>
      <div class="note-detail">{{ mode === 'public' ? 'earlier Bitcoin output' : mode === 'state' ? 'old leaf remains in the tree' : 'one accepted note' }}</div>
    </div>
    <div class="pay-note bob reveal" :class="at(mode === 'public' ? 1 : 2) || 'reveal-off'" style="left:602px;top:32px;width:269px;height:125px">
      <div class="note-owner"><span class="i-ph-user-circle-fill" /> Bob</div>
      <div class="pay-value">60,000 <small>sat</small></div>
      <div class="note-detail">{{ mode === 'select' ? 'address: (d, pk_d)' : mode === 'state' ? 'new leaf · position assigned' : 'new output' }}</div>
    </div>
    <div class="pay-note alice reveal" :class="at(mode === 'public' || mode === 'state' ? 2 : 3) || 'reveal-off'" style="left:602px;top:195px;width:269px;height:125px">
      <div class="note-owner"><span class="i-ph-arrow-u-down-left-bold" /> Alice’s change</div>
      <div class="pay-value">{{ mode === 'public' ? '39,500' : '40,000' }} <small>sat</small></div>
      <div class="note-detail">{{ mode === 'state' ? 'new leaf · position assigned' : 'a separate output' }}</div>
    </div>
    <div class="pay-center reveal" :class="at(mode === 'notes' ? 2 : 1) || 'reveal-off'">
      <span :class="mode === 'public' ? 'i-ph-arrows-split-bold' : 'i-ph-shield-check-duotone'" />
      <div>{{ mode === 'state' ? 'nf_A recorded' : mode === 'public' ? 'transaction' : '1 input → 2 outputs' }}</div>
    </div>
    <div class="pay-foot reveal" :class="at(3) || 'reveal-off'">
      <span :class="mode === 'public' ? 'chip-red' : 'chip-green'">{{ mode === 'public' ? 'references + amounts are public' : mode === 'state' ? 'new root · old note cannot be spent again' : mode === 'select' ? 'fresh rseed for each output' : '100,000 = 60,000 + 40,000' }}</span>
    </div>
    <div v-if="mode === 'public'" class="fee-chip reveal" :class="at(2) || 'reveal-off'">500 sat · Bitcoin fee</div>
  </div>
</template>

<style scoped>
.payment-canvas { width:871px;height:350px;position:relative }
.canvas-label { position:absolute;top:0;left:0;color:var(--s-muted);font-size:12px;letter-spacing:.04em }
.edges { position:absolute;inset:0;fill:none;stroke:#a18cff66;stroke-width:2 }
.pay-note { position:absolute;border:1px solid;border-radius:16px;padding:16px 20px;background:#14152a }
.alice { border-color:#ffc24b66;color:#ffc24b }.bob { border-color:#f472b677;color:#f472b6 }
.note-owner { display:flex;align-items:center;gap:8px;font-size:15px }.note-owner span { font-size:20px }
.pay-value { margin-top:9px;color:white;font-family:'JetBrains Mono',monospace;font-size:27px;line-height:1.2 }
.pay-value small { font-size:13px;color:var(--s-muted) }.note-detail { font-size:11px;color:var(--s-muted);margin-top:9px }
.pay-center { position:absolute;left:287px;top:128px;width:168px;height:80px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#070912;border-radius:14px;color:var(--s-violetlt);font-size:12px;gap:10px }
.pay-center>span { font-size:30px }.pay-foot { position:absolute;top:313px;left:0 }
.fee-chip { position:absolute;left:281px;top:270px;font-size:12px;color:var(--s-orange) }
</style>
