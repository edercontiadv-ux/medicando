const sharp = require("sharp")
const path = require("path")

const outDir = path.resolve(__dirname, "..", "controle-medicamentos", "public")
const teal = "#0d5555"

async function generateIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${teal}"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
            font-family="Georgia, serif" font-size="${size * 0.5}px"
            font-weight="700" fill="white">M</text>
    </svg>`

  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(outDir, `icon-${size}.png`))
  console.log(`Generated icon-${size}.png`)
}

;(async () => {
  await generateIcon(192)
  await generateIcon(512)
  console.log("Done")
})()
