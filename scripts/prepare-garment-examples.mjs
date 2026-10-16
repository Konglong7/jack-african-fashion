// Prepare the five owner-approved photos; preserve all original pixels and files.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const sources = [
  ['embellished-pleated-dresses', '7月11日/098601bdeff437c46f676530c9c1975a.jpg'],
  ['tiered-floral-dresses', '7月11日/4ce493fe3c5578b2469aa04705d5ec13.jpg'],
  ['floral-dress-assortment', '7月16/074c23546d3f151635227ef79fd35625.jpg'],
  ['floral-lace-long-dresses', '7月16/1b38559e213bf42d9cda79dd75536b9a.jpg'],
  ['pleated-evening-dresses', '7月16/38ecb64a2fc2720e5d3405a00239f738.jpg']
];
const destination = path.join(process.cwd(), 'public/images/garment-examples');
await mkdir(destination, { recursive: true });
const manifestPath = 'src/lib/generated/imageVariants.json';
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const evidence = [];
for (const [slug, relative] of sources) {
  const source = path.join(process.cwd(), '上新', relative);
  const input = await readFile(source);
  const hash = createHash('sha256').update(input).digest('hex');
  const metadata = await sharp(input).metadata();
  const publicPath = `/images/garment-examples/${slug}-${hash.slice(0, 12)}.webp`;
  await sharp(input)
    .rotate()
    .webp({ quality: 86, effort: 5 })
    .toFile(path.join(process.cwd(), 'public', publicPath));
  const variants = {};
  for (const width of [64, 160, 320, 480, 640, 960]) {
    const filename = `${slug}-${hash.slice(0, 12)}-${width}.webp`;
    await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(path.join(destination, filename));
    variants[width] = `/images/garment-examples/${filename}`;
  }
  manifest[publicPath] = variants;
  if (
    createHash('sha256')
      .update(await readFile(source))
      .digest('hex') !== hash
  )
    throw new Error('Original changed');
  evidence.push({
    slug,
    source,
    source_sha256: hash,
    width: metadata.width,
    height: metadata.height,
    publicPath,
    variants
  });
}
await writeFile(manifestPath, JSON.stringify(manifest));
await writeFile(
  'artifacts/jack-fashion-seo-ai-20261003/garment-photo-usage.json',
  JSON.stringify(evidence, null, 2)
);
console.log(
  JSON.stringify(
    evidence.map(({ slug, width, height, publicPath }) => ({ slug, width, height, publicPath })),
    null,
    2
  )
);
