<script setup lang="ts">
// Three reveals scan a fixed output row, open Bob’s note and verify its replayed position
defineProps<{ clicks: number }>()
</script>

<template>
  <div class="scan-canvas">
    <div class="eyebrow">published output records</div>
    <div class="scan-row">
      <div v-for="i in 6" :key="i" class="scan-output" :class="{ tried: clicks >= 1, found: clicks >= 2 && i === 4 }">
        <span :class="clicks >= 2 && i === 4 ? 'i-ph-lock-key-open-duotone' : 'i-ph-lock-simple-fill'" />
        <small>output {{ i-1 }}</small>
      </div>
    </div>
    <div class="scan-key reveal" :class="clicks >= 1 || 'reveal-off'"><span class="i-ph-scan-duotone" /> Bob’s incoming viewing capability</div>
    <div class="scan-plain pane-pink reveal" :class="clicks >= 2 || 'reveal-off'">
      <div class="eyebrow !text-pink">decryption succeeds</div><div class="scan-amount">60,000 <small>sat</small></div><div class="scan-detail">recover v · d · rseed</div>
    </div>
    <div class="scan-check pane-green reveal" :class="clicks >= 3 || 'reveal-off'">
      <div class="eyebrow !text-green">check before recording</div><div class="scan-check-row">✓ re-derived pk_eph matches</div><div class="scan-check-row">✓ leaf matches accepted position</div><div class="scan-detail">then apply the wallet’s confirmation policy</div>
    </div>
  </div>
</template>

<style scoped>
.scan-canvas { position:relative;width:871px;height:350px }.scan-row { display:grid;grid-template-columns:repeat(6,1fr);gap:18px;margin-top:20px }.scan-output { height:86px;border:1px solid #a18cff55;border-radius:12px;background:#14142a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--s-violet);transition:border-color .5s,color .5s }.scan-output>span { font-size:25px }.scan-output small { font:11px 'JetBrains Mono',monospace;color:var(--s-muted) }.scan-output.tried { border-color:#4cc9f099 }.scan-output.found { color:#f472b6;border-color:#f472b6;background:#291528;box-shadow:0 0 25px #f472b622 }.scan-key { display:flex;align-items:center;justify-content:center;gap:10px;color:var(--s-cyan);font-size:14px;margin-top:19px }.scan-key>span { font-size:20px }.scan-plain { position:absolute;left:0;top:196px;width:350px;height:147px;padding:19px 22px }.scan-amount { font:30px 'JetBrains Mono',monospace;color:white;margin-top:14px }.scan-amount small { color:var(--s-muted);font-size:13px }.scan-detail { margin-top:10px;font-size:12px;color:var(--s-muted) }.scan-check { position:absolute;right:0;top:196px;width:487px;height:147px;padding:19px 22px }.scan-check-row { margin-top:12px;font-size:15px;color:var(--s-green) }
</style>
