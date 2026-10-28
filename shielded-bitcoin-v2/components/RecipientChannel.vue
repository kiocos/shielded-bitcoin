<script setup lang="ts">
// Four reveals connect sender randomness, shared-secret derivation, ciphertext and recipient decryption
defineProps<{ clicks: number }>()
</script>

<template>
  <div class="channel-canvas">
    <div class="channel-card sender pane-amber">
      <div class="eyebrow !text-amber">Alice creates Bob’s note</div><div class="channel-mono">(60,000, d_B, rseed)</div>
      <div class="reveal" :class="clicks >= 1 || 'reveal-off'"><div class="channel-down">↓ derive</div><div class="channel-mono">sk_eph → pk_eph</div></div>
    </div>
    <div class="channel-card shared pane-violet reveal" :class="clicks >= 2 || 'reveal-off'">
      <div class="eyebrow !text-violet">sender’s shared secret</div><div class="channel-mono">ECDH(sk_eph, pk_d)</div><div class="channel-caption">key schedule + encryption</div>
    </div>
    <div class="channel-card published pane-violet reveal" :class="clicks >= 3 || 'reveal-off'">
      <div class="eyebrow !text-violet">published output</div><div class="channel-mono">pk_eph · ct_note</div><div class="channel-caption cipher">98a41f…7e2c90</div>
    </div>
    <div class="channel-card receiver pane-pink reveal" :class="clicks >= 4 || 'reveal-off'">
      <div class="eyebrow !text-pink">Bob derives the same secret</div><div class="channel-mono">ECDH(sk_view, pk_eph)</div><div class="channel-caption">decrypt → (v, d, rseed)</div>
    </div>
    <div class="channel-link first reveal" :class="clicks >= 2 || 'reveal-off'"><span class="i-ph-arrow-down-bold" /></div>
    <div class="channel-link across reveal" :class="clicks >= 3 || 'reveal-off'"><span class="i-ph-arrow-right-bold" /></div>
    <div class="channel-link second reveal" :class="clicks >= 4 || 'reveal-off'"><span class="i-ph-arrow-down-bold" /></div>
    <div class="channel-bottom reveal" :class="clicks >= 4 || 'reveal-off'">The proof checks ciphertext consistency with the output value</div>
  </div>
</template>

<style scoped>
.channel-canvas { position:relative;width:871px;height:350px }.channel-card { position:absolute;width:380px;padding:18px 22px }.sender { left:0;top:0;height:152px }.shared { left:0;top:193px;height:115px }.published { right:0;top:0;height:152px }.receiver { right:0;top:193px;height:115px }.channel-mono { font:17px 'JetBrains Mono',monospace;color:white;margin-top:10px }.channel-down { color:var(--s-muted);font-size:12px;margin-top:12px }.channel-caption { font-size:13px;color:var(--s-muted);margin-top:10px }.channel-link { position:absolute;display:flex;justify-content:center;font-size:22px;color:var(--s-violet) }.first { left:175px;top:162px }.second { right:175px;top:162px }.across { left:380px;top:40px;width:111px;height:214px;border-bottom:1px solid #a18cff55;border-right:1px solid #a18cff55;border-radius:0 0 15px 0;align-items:flex-start }.across span { position:absolute;right:-8px;top:-8px;background:#070912 }.channel-bottom { position:absolute;bottom:0;left:0;right:0;text-align:center;font-size:14px;color:var(--s-muted) }
</style>
