<script setup lang="ts">
// Fixed 871px table; clicks reveal capacity, core privacy, metadata, then recovery
const props = withDefaults(defineProps<{ clicks?: number }>(), { clicks: 0 })
const rows = [
  { label: 'Sender', csv: 'Hidden', bitcoin: 'Hidden', csvPrivate: true, bitcoinPrivate: true, step: 2 },
  { label: 'Recipient', csv: 'Hidden', bitcoin: 'Hidden', csvPrivate: true, bitcoinPrivate: true, step: 2 },
  { label: 'Amounts', csv: 'Hidden', bitcoin: 'Hidden', csvPrivate: true, bitcoinPrivate: true, step: 2 },
  { label: 'Fees', csv: 'Private publisher payment', bitcoin: 'Public carrier fee', csvPrivate: true, bitcoinPrivate: false, step: 3 },
  { label: 'Output count', csv: 'Hidden', bitcoin: 'Visible', csvPrivate: true, bitcoinPrivate: false, step: 3 },
]
</script>

<template>
  <div class="comparison">
    <div class="table-shell">
      <table aria-label="Shielded CSV and Shielded Bitcoin comparison">
        <colgroup><col class="criterion-col"><col><col></colgroup>
        <thead>
          <tr>
            <th scope="col"><span class="table-kicker">Protocol design</span></th>
            <th scope="col"><span class="protocol-name">Glass Coins</span><span class="protocol-model">Shielded CSV · client-side validation</span></th>
            <th scope="col"><span class="protocol-name">Shielded Bitcoin</span><span class="protocol-model">Zcash-style notes · public replay</span></th>
          </tr>
        </thead>
        <tbody>
          <tr class="capacity-row reveal" :class="{ 'reveal-off': props.clicks < 1 }">
            <th scope="row">Throughput<span class="cell-note">estimated L1 capacity*</span></th>
            <td><span class="capacity">≈100 <span>TPS</span></span><span class="cell-note">64 B / transfer · batched witness data</span></td>
            <td><span class="capacity">≈2–3 <span>TPS</span></span><span class="cell-note">OP_RETURN · two inputs, two outputs</span></td>
          </tr>
          <tr v-for="row in rows" :key="row.label" class="privacy-row reveal" :class="{ 'reveal-off': props.clicks < row.step }">
            <th scope="row">{{ row.label }}</th>
            <td v-for="protocol in ['csv', 'bitcoin'] as const" :key="protocol">
              <span class="result" :class="row[`${protocol}Private`] ? 'private-result' : 'public-result'">
                <span :class="row[`${protocol}Private`] ? 'i-ph-check-circle-fill' : 'i-ph-x-circle-fill'" aria-hidden="true" />
                {{ row[protocol] }}
              </span>
            </td>
          </tr>
          <tr class="recovery-row reveal" :class="{ 'reveal-off': props.clicks < 4 }">
            <th scope="row">Recovery<span class="cell-note">seed + Bitcoin history</span></th>
            <td><span class="result public-result"><span class="i-ph-x-circle-fill" aria-hidden="true" />Needs private data backup</span></td>
            <td><span class="result private-result"><span class="i-ph-check-circle-fill" aria-hidden="true" />Published transfer history</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="comparison-footnotes">
      <span>Privacy: hidden from public observers · publisher payments ≠ Bitcoin mining fees</span>
      <span>*Full blocks, 10-minute average; carrier assumptions differ · estimates, not benchmarks</span>
      <span class="source-links"><a href="https://github.com/ShieldedCSV/ShieldedCSV/releases/latest/download/shieldedcsv.pdf">CSV paper</a><span>·</span><a href="https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf">Shielded Bitcoin paper</a></span>
    </div>
  </div>
</template>

<style scoped>
.comparison { width: 871px; margin-top: 20px; }
.table-shell { overflow: hidden; border: 1px solid rgba(161, 140, 255, .22); border-radius: 15px; background: rgba(17, 20, 42, .65); }
.comparison table { width: 100%; margin: 0; border-collapse: collapse; table-layout: fixed; font-size: 14px; line-height: 1.2; }
.criterion-col { width: 24%; }
.comparison th, .comparison td { padding: 0 18px; border: 0; text-align: left; vertical-align: middle; }
.comparison th { font-weight: 500; color: var(--s-text); }
.comparison td { border-left: 1px solid rgba(161, 140, 255, .10); }
.comparison thead { background: rgba(161, 140, 255, .09); }
.comparison thead th { height: 65px; border-bottom: 1px solid rgba(161, 140, 255, .22); }
.table-kicker { font-size: 10px; text-transform: uppercase; letter-spacing: .14em; color: var(--s-muted); }
.protocol-name { display: block; font-size: 22px; font-weight: 700; color: var(--s-violetlt); letter-spacing: -.02em; }
.protocol-model { display: block; margin-top: 6px; font-size: 11px; color: var(--s-muted); }
.capacity-row { height: 66px; }
.capacity { font-family: 'JetBrains Mono', monospace; font-size: 25px; font-weight: 600; color: white; }
.capacity span { font-size: 13px; font-weight: 400; color: var(--s-muted); }
.cell-note { display: block; margin-top: 5px; font-size: 10px; font-weight: 400; color: var(--s-muted); }
.comparison .privacy-row th, .comparison .privacy-row td { height: 32px; border-top: 1px solid rgba(255, 255, 255, .045); }
.result { display: flex; align-items: center; gap: 9px; font-size: 12px; white-space: nowrap; }
.result > span { flex-shrink: 0; font-size: 17px; }
.private-result { color: var(--s-green); }
.public-result { color: var(--s-red); }
.comparison .recovery-row th, .comparison .recovery-row td { height: 53px; border-top: 1px solid rgba(161, 140, 255, .25); background: rgba(161, 140, 255, .04); }
.comparison-footnotes { display: flex; position: relative; flex-direction: column; gap: 5px; margin-top: 10px; color: var(--s-muted); font-size: 10px; line-height: 1.25; }
.source-links { position: absolute; right: 0; top: 0; display: flex; gap: 7px; font-size: 9px; }
.source-links a { color: var(--s-violetlt); border: none; }
</style>
