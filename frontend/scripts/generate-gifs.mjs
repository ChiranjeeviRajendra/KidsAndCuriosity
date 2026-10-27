import { Resvg } from '@resvg/resvg-js'
import gifenc from 'gifenc'
import { mkdir, writeFile } from 'node:fs/promises'
import { deviceSvg } from '../src/lib/devices.js'

const { GIFEncoder, quantize, applyPalette } = gifenc
await mkdir(new URL('../public/animations/', import.meta.url), { recursive: true })
const width = 480,
  height = 352
const grid = Array.from(
  { length: 21 },
  (_, i) => `<path d="M${i * 30} 0V440 M0 ${i * 30}H600" stroke="#9cba9b" stroke-opacity=".055"/>`,
).join('')
for (const type of ['fridge', 'engine', 'phone', 'fan']) {
  const gif = GIFEncoder()
  const svgAt = (progress, phase = 0) =>
    deviceSvg(type, progress, { phase, labels: false, id: 'gif' }).replace(
      'fill="none">',
      `fill="none"><rect width="600" height="440" fill="#203d32"/>${grid}`,
    )
  const render = (svg) => new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().pixels
  const poster = svgAt(1)
  // A shared palette prevents colours shifting between frames. Merge identical
  // hold frames so the pause is preserved without downloading duplicate images.
  const palette = quantize(render(poster), 128)
  await writeFile(new URL(`../public/animations/${type}-poster.svg`, import.meta.url), poster)
  let pending,
    lastProgress,
    frames = 0
  const flush = () => {
    if (!pending) return
    gif.writeFrame(pending.index, width, height, {
      palette: frames === 0 ? palette : undefined,
      delay: pending.delay,
      repeat: 0,
    })
    frames++
  }
  for (let i = 0; i < 60; i++) {
    const t = i / 60
    const raw =
      t < 0.12
        ? 0
        : t < 0.42
          ? (t - 0.12) / 0.3
          : t < 0.68
            ? 1
            : t < 0.96
              ? 1 - (t - 0.68) / 0.28
              : 0
    const progress = raw * raw * (3 - 2 * raw)
    if ((type === 'phone' || type === 'fridge') && progress === lastProgress) {
      pending.delay += 80
      continue
    }
    flush()
    pending = { index: applyPalette(render(svgAt(progress, i * 12)), palette), delay: 80 }
    lastProgress = progress
  }
  flush()
  gif.finish()
  const bytes = gif.bytes()
  await writeFile(new URL(`../public/animations/${type}-exploded.gif`, import.meta.url), bytes)
  console.log(`${type}: ${frames} frames, 4.8 second loop, ${(bytes.length / 1024).toFixed(0)} KB`)
}
