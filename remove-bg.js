// remove-bg.js
// Run: node remove-bg.js
// Requires: npm install sharp

import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./public/icons";          // your original icons
const outputDir = "./public/icons-clean";   // cleaned icons

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach((file) => {
  if (file.toLowerCase().endsWith(".png")) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    sharp(inputPath)
      .ensureAlpha() // make sure alpha channel exists
      .toBuffer()
      .then((data) => {
        return sharp(data)
          .removeAlpha() // drop any fake alpha
          .flatten({ background: { r: 255, g: 255, b: 255 } }) // normalize white
          .toBuffer();
      })
      .then((data) => {
        return sharp(data)
          .threshold(240) // everything near white = transparent
          .toColourspace("b-w")
          .toBuffer();
      })
      .then((mask) => {
        return sharp(inputPath)
          .joinChannel(mask) // use mask as alpha
          .png()
          .toFile(outputPath);
      })
      .then(() => {
        console.log(`✅ Processed: ${file}`);
      })
      .catch((err) => console.error(`❌ Error with ${file}:`, err));
  }
});
