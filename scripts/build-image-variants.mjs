// Add responsive WebP derivatives; never modify or remove original photos.
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const dimensionsOnly = process.argv.includes('--dimensions-only');
const publicRoot = path.join(root, 'public');
const widths = [64, 160, 320, 480, 640, 768, 960, 1280, 1920];
const sources = new Set();
function collect(value) {
  if (typeof value === 'string' && /^\/images\/.+\.(webp|png|jpe?g)$/i.test(value)) sources.add(value);
  else if (Array.isArray(value)) value.forEach(collect);
  else if (value && typeof value === 'object') Object.values(value).forEach(collect);
}
for (const file of ['data/products.json', 'data/site-content.json']) {
  collect(JSON.parse(await readFile(path.join(root, file), 'utf8')));
}
async function collectLiterals(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectLiterals(file);
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.includes('.test.')) {
      const source = await readFile(file, 'utf8');
      for (const match of source.matchAll(/['"](\/images\/[^'"\s]+\.(?:webp|png|jpe?g))['"]/gi)) collect(match[1]);
    }
  }
}
await collectLiterals(path.join(root, 'src'));
const manifest = {};
const dimensions = {};
const verification = [];
const output = path.join(publicRoot, 'images', 'optimized');
await mkdir(output, { recursive: true });
let derivativeBytes = 0;
for (const src of [...sources].sort()) {
  const original = path.resolve(publicRoot, '.' + src);
  if (!original.startsWith(publicRoot + path.sep)) throw new Error('Image outside public root');
  if (!existsSync(original)) continue; // Unknown/new uploads keep the Next optimizer fallback.
  const input = await readFile(original);
  const sourceHash = createHash('sha256').update(input).digest('hex');
  const hash = createHash('sha256').update('responsive-webp-v1-q78').update(input).digest('hex').slice(0, 20);
  const metadata = await sharp(input).metadata();
  const rotated = metadata.orientation >= 5;
  dimensions[src] = {
    width: rotated ? metadata.height : metadata.width,
    height: rotated ? metadata.width : metadata.height
  };
  if (dimensionsOnly) continue;
  const variants = {};
  for (const width of widths) {
    const filename = `${hash}-${width}.webp`;
    const destination = path.join(output, filename);
    if (!existsSync(destination)) {
      await sharp(input).rotate().resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 4 }).toFile(destination);
    }
    const bytes = await readFile(destination);
    const meta = await sharp(bytes).metadata();
    const originalRatio = metadata.orientation >= 5 ? metadata.height / metadata.width : metadata.width / metadata.height;
    if (Math.abs(meta.width / meta.height / originalRatio - 1) > 0.04) throw new Error('Derivative aspect ratio differs: ' + src);
    variants[width] = `/images/optimized/${filename}`;
    derivativeBytes += bytes.length;
    verification.push({ src, path: variants[width], source_sha256: sourceHash,
      sha256: createHash('sha256').update(bytes).digest('hex'), width: meta.width, height: meta.height, bytes: bytes.length });
  }
  manifest[src] = variants;
  if (createHash('sha256').update(await readFile(original)).digest('hex') !== sourceHash) throw new Error('Original changed: ' + src);
}
await mkdir(path.join(root, 'src/lib/generated'), { recursive: true });
await writeFile(path.join(root, 'src/lib/generated/imageDimensions.json'), JSON.stringify(dimensions));
if (dimensionsOnly) {
  console.log(JSON.stringify({ image_dimensions: Object.keys(dimensions).length }));
} else {
await writeFile(path.join(root, 'src/lib/generated/imageVariants.json'), JSON.stringify(manifest));
const evidence = path.join(root, 'artifacts/image-speed-moq-2026-10-01');
await mkdir(evidence, { recursive: true });
await writeFile(path.join(evidence, 'image-variants.json'), JSON.stringify({ source_count: Object.keys(manifest).length,
  derivative_count: verification.length, derivative_bytes: derivativeBytes, verification }, null, 2));
console.log(JSON.stringify({ sources: Object.keys(manifest).length, variants: verification.length, derivative_bytes: derivativeBytes }));
}
