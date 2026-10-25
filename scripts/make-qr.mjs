// Regenerates the QR on the closing slide: `npm run qr`
// Shipped as a static SVG so the deck has no runtime QR dependency, and so the
// code is identical every build. Change the target here and re-run.
import { writeFile } from 'node:fs/promises'
import QRCode from 'qrcode'

const target = 'https://www.allocinit.xyz/uploads/shielded-bitcoin.pdf'

const svg = await QRCode.toString(target, {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 1,
  color: { dark: '#070912', light: '#ffffff' },
})

await writeFile(new URL('../public/paper-qr.svg', import.meta.url), svg)
console.log(`wrote public/paper-qr.svg -> ${target}`)
