<script setup lang="ts">
// Three reveals add output bytes, creation context and the leaf on a fixed 871 × 330 canvas
defineProps<{ clicks: number }>()
</script>

<template>
  <div class="leaf-canvas">
    <div class="leaf-input pane-violet reveal" :class="clicks >= 1 || 'reveal-off'" style="top:10px">
      <div class="eyebrow !text-violet">public output bytes</div>
      <div class="fields"><span>pk_eph</span><span>ct_note</span></div>
      <div class="caption">ephemeral key + encrypted note</div>
    </div>
    <div class="leaf-input pane-cyan reveal" :class="clicks >= 2 || 'reveal-off'" style="top:158px">
      <div class="eyebrow !text-cyan">creation context</div>
      <div class="fields"><span>h_body</span><span>j</span><span>salt · h_aux</span></div>
      <div class="caption">j = output index within this transfer</div>
    </div>
    <svg width="871" height="330" aria-hidden="true" class="leaf-lines reveal" :class="clicks >= 3 || 'reveal-off'">
      <path d="M383 72 H436 V156 H484 M383 220 H436 V156 M570 156 H668 M660 149 L668 156 L660 163" />
    </svg>
    <div class="hash-node reveal" :class="clicks >= 3 || 'reveal-off'"><span class="i-ph-hash-bold" /><span>H_leaf</span></div>
    <div class="leaf-result pane-violet reveal" :class="clicks >= 3 || 'reveal-off'">
      <span class="i-ph-tree-structure-duotone" /><div>leaf ℓ</div><small>computed by replay</small>
    </div>
    <div class="leaf-bottom reveal" :class="clicks >= 3 || 'reveal-off'">One accepted output → one append-only tree entry</div>
  </div>
</template>

<style scoped>
.leaf-canvas { position:relative;width:871px;height:330px }.leaf-input { position:absolute;left:0;width:383px;height:125px;padding:19px 22px }
.fields { display:flex;gap:16px;font-family:'JetBrains Mono',monospace;font-size:19px;margin-top:13px;color:white }.fields span:last-child { white-space:nowrap }
.caption { font-size:12px;color:var(--s-muted);margin-top:10px }.leaf-lines { position:absolute;inset:0;fill:none;stroke:#a18cff88;stroke-width:2 }
.hash-node { position:absolute;left:484px;top:113px;width:86px;height:86px;border:1px solid #a18cff77;border-radius:18px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:7px;background:#17142c;color:var(--s-violetlt);font-size:13px }.hash-node>span:first-child { font-size:27px }
.leaf-result { position:absolute;left:668px;top:88px;width:203px;height:136px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:7px;color:var(--s-violetlt);font-size:22px }.leaf-result>span { font-size:28px }.leaf-result small { font-size:12px;color:var(--s-muted) }
.leaf-bottom { position:absolute;bottom:0;left:0;width:871px;text-align:center;color:var(--s-muted);font-size:14px }
</style>
