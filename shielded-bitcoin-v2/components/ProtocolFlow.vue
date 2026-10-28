<script setup lang="ts">
// Fixed-size cards reveal the dependency chain without moving earlier content
defineProps<{ clicks: number; variant: 'roles' | 'publish' | 'input' | 'outgoing' | 'recover' | 'recap' }>()
const flows = {
  roles: [
    ['i-ph-wallet-duotone', 'Wallet', 'prepare + prove', 'amber'],
    ['i-ph-currency-btc-fill', 'Bitcoin', 'publish + order', 'orange'],
    ['i-ph-cpu-duotone', 'Replay', 'verify + apply', 'cyan'],
  ],
  publish: [
    ['i-ph-envelope-simple-fill', 'Envelope', 'body + proof', 'violet'],
    ['i-ph-currency-btc-fill', 'Carrier confirms', 'Bitcoin orders the bytes', 'orange'],
    ['i-ph-list-checks-duotone', 'Replay decides', 'accepted or rejected', 'cyan'],
  ],
  input: [
    ['i-ph-file-lock-duotone', 'Reconstruct leaf', 'opening + creation record', 'amber'],
    ['i-ph-tree-structure-duotone', 'Check path', 'position → anchor root', 'cyan'],
    ['i-ph-fingerprint-duotone', 'Derive nullifier', 'sk_nf + ρ + pos', 'violet'],
  ],
  outgoing: [
    ['i-ph-list-bullets-bold', 'Output records', '(pk_d, sk_eph) per output', 'violet'],
    ['i-ph-file-lock-duotone', 'Encrypt batch', 'vk_out → ct_out', 'amber'],
    ['i-ph-clock-counter-clockwise-duotone', 'Recover later', 'sent-output details', 'cyan'],
  ],
  recover: [
    ['i-ph-key-duotone', 'Seed', 'spend + viewing capabilities', 'amber'],
    ['i-ph-scan-duotone', 'History', 'replay + incoming/outgoing scan', 'cyan'],
    ['i-ph-wallet-duotone', 'Wallet state', 'notes + positions + spent status', 'green'],
  ],
  recap: [
    ['i-ph-tree-structure-duotone', 'Select', 'note · root · path · nf', 'amber'],
    ['i-ph-shield-check-duotone', 'Construct', 'encrypt · bind · prove', 'violet'],
    ['i-ph-cpu-duotone', 'Accept', 'publish · replay · apply', 'cyan'],
    ['i-ph-scan-duotone', 'Receive', 'scan · decrypt · check', 'pink'],
  ],
}
const captions = {
  roles: 'Bitcoin consensus does not verify the shielded proof',
  publish: 'The carrier pays a Bitcoin fee outside the shielded value balance',
  input: 'One connected statement · no substituting a different note, value or spend marker',
  outgoing: 'Alice can recover what she sent · Bob alone retains his spending authority',
  recover: 'Published transfers + replayed positions · initial notes may need bootstrap data',
  recap: 'Alice’s one note → Bob’s note + Alice’s change',
}
</script>

<template>
  <div class="protocol-canvas">
    <div class="flow-cards" :style="{gridTemplateColumns:`repeat(${flows[variant].length}, 1fr)`}">
      <div v-for="(item,i) in flows[variant]" :key="item[1]" class="flow-item reveal" :class="[`pane-${item[3]}`,clicks >= i+1 || 'reveal-off']">
        <div class="flow-num">0{{ i+1 }}</div><span class="flow-icon" :class="[item[0],`text-${item[3]}`]" />
        <div class="flow-title">{{ item[1] }}</div><div class="flow-detail">{{ item[2] }}</div>
        <div v-if="i < flows[variant].length - 1" class="flow-arrow i-ph-arrow-right-bold" />
      </div>
    </div>
    <div class="flow-caption reveal" :class="clicks >= flows[variant].length || 'reveal-off'">{{ captions[variant] }}</div>
  </div>
</template>

<style scoped>
.protocol-canvas { position:relative;width:871px;height:330px;padding-top:32px }.flow-cards { display:grid;gap:27px }
.flow-item { position:relative;height:226px;padding:25px 17px;display:flex;flex-direction:column;align-items:center }.flow-num { position:absolute;left:16px;top:14px;font:11px 'JetBrains Mono',monospace;color:var(--s-muted) }.flow-icon { font-size:44px;margin-top:18px }.flow-title { font-size:21px;color:white;margin-top:26px;text-align:center }.flow-detail { font-size:12px;line-height:1.5;color:var(--s-muted);margin-top:10px;text-align:center }.flow-arrow { position:absolute;right:-23px;top:105px;color:var(--s-muted);font-size:18px }.flow-caption { position:absolute;bottom:14px;left:0;right:0;font-size:15px;text-align:center;color:var(--s-muted) }
</style>
