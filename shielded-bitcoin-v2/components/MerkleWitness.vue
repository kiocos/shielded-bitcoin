<script setup lang="ts">
// Four reveals follow leaf 1 through two sibling hashes to the public root, then hide the path
defineProps<{ clicks: number }>()
const leaves = [75, 200, 325, 450]
</script>

<template>
  <div class="merkle-canvas">
    <div class="merkle-caption">{{ clicks >= 4 ? 'observer sees the root and proof' : 'inside Alice’s proof · selected leaf is private' }}</div>
    <svg width="530" height="315" class="merkle-lines" aria-hidden="true">
      <path d="M75 252 L137 160 L263 70 L388 160 L325 252 M200 252 L137 160 M450 252 L388 160" />
      <path class="active reveal" :class="clicks >= 1 && clicks < 4 || 'reveal-off'" d="M75 252 L137 160 L200 252" />
      <path class="active reveal" :class="clicks >= 2 && clicks < 4 || 'reveal-off'" d="M137 160 L263 70 L388 160" />
    </svg>
    <div class="merkle-root" :class="clicks >= 3 ? 'verified' : ''">r_anchor <span v-if="clicks >= 3">✓</span></div>
    <div class="node" style="left:105px;top:139px" :class="clicks >= 1 && clicks < 4 ? 'lit' : ''">h₀₁</div>
    <div class="node" style="left:356px;top:139px" :class="clicks >= 2 && clicks < 4 ? 'sibling' : ''">h₂₃</div>
    <div v-for="(x,i) in leaves" :key="i" class="merkle-leaf" :class="{ selected: i===1 && clicks < 4, sibling: i===0 && clicks>=1 && clicks<4 }" :style="{left:`${x-27}px`}">
      {{ clicks >= 4 ? '?' : `ℓ${i}` }}
    </div>
    <div class="path-panel pane reveal" :class="clicks >= 1 && clicks < 4 || 'reveal-off'">
      <div class="eyebrow !text-amber">private authentication path</div>
      <div class="path-row"><span class="chip-cyan">ℓ₀</span><span>first sibling</span></div>
      <div class="path-row reveal" :class="clicks >= 2 || 'reveal-off'"><span class="chip-cyan">h₂₃</span><span>next sibling</span></div>
      <div class="path-result reveal" :class="clicks >= 3 || 'reveal-off'">recomputed root = r_anchor</div>
    </div>
    <div class="zk-panel pane-violet reveal" :class="clicks >= 4 || 'reveal-off'">
      <div class="proof-symbol">π</div><div class="zk-title">membership proven</div><div class="zk-caption">leaf, position and path<br>stay in the private witness</div>
    </div>
    <div class="merkle-foot">A Merkle path proves membership · zero knowledge hides the selected path</div>
  </div>
</template>

<style scoped>
.merkle-canvas { position:relative;width:871px;height:350px }.merkle-caption { color:var(--s-muted);font-size:12px }.merkle-lines { position:absolute;top:0;left:0;fill:none;stroke:#a18cff44;stroke-width:2 }.merkle-lines .active { stroke:#ffc24b;stroke-width:3 }
.merkle-root { position:absolute;left:186px;top:45px;width:154px;height:49px;border:1px solid #a18cff88;border-radius:12px;background:#17142c;display:flex;align-items:center;justify-content:center;gap:10px;font-family:'JetBrains Mono',monospace;font-size:16px;color:var(--s-violetlt) }.merkle-root.verified { border-color:var(--s-green);color:var(--s-green) }
.node { position:absolute;width:64px;height:43px;display:grid;place-items:center;background:#11142a;border:1px solid #a18cff66;border-radius:9px;font:16px 'JetBrains Mono',monospace;color:var(--s-violetlt) }.node.lit { border-color:#ffc24b;color:#ffc24b }
.merkle-leaf { position:absolute;top:225px;width:54px;height:54px;display:grid;place-items:center;border-radius:11px;border:1px solid #a18cff77;background:#15142a;color:var(--s-violetlt);font:20px 'JetBrains Mono',monospace }.merkle-leaf.selected { color:#ffc24b;border-color:#ffc24b;background:#252016 }.sibling { border-color:#4cc9f0!important;color:#4cc9f0!important }
.path-panel,.zk-panel { position:absolute;left:560px;top:44px;width:311px;height:238px;padding:24px }.path-row { display:flex;gap:16px;align-items:center;margin-top:22px;color:var(--s-muted);font-size:14px }.path-result { margin-top:25px;font-size:14px;color:var(--s-green) }
.zk-panel { display:flex;flex-direction:column;align-items:center;justify-content:center }.proof-symbol { font:48px 'JetBrains Mono',monospace;color:var(--s-violetlt) }.zk-title { color:white;font-size:19px;margin-top:12px }.zk-caption { font-size:14px;text-align:center;margin-top:13px;color:var(--s-muted);line-height:1.6 }
.merkle-foot { position:absolute;bottom:0;left:0;right:0;text-align:center;color:var(--s-muted);font-size:13px }
</style>
