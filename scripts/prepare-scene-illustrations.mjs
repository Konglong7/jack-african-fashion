// Encode the six AI illustrations for the website; preserve the original PNGs.
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceDirectory = path.join(root, 'output/imagegen/jack-fashion-scenes-2026-10-04');
const originals = JSON.parse(await readFile(path.join(sourceDirectory, 'manifest.json'), 'utf8'));
const records = Array.isArray(originals) ? originals : originals.images;
if (!Array.isArray(records) || records.length !== 6)
  throw new Error('Expected six AI illustrations');
const destination = path.join(root, 'public/images/scene-illustrations');
const evidenceDirectory = path.join(root, 'artifacts/jack-fashion-scenes-20261004');
await mkdir(destination, { recursive: true });
await mkdir(evidenceDirectory, { recursive: true });
const manifestPath = path.join(root, 'src/lib/generated/imageVariants.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const evidence = [];

for (const original of records) {
  const source = path.join(sourceDirectory, original.file);
  const input = await readFile(source);
  const hash = createHash('sha256').update(input).digest('hex');
  if (hash !== original.sha256) throw new Error(`Original hash mismatch: ${original.key}`);
  const metadata = await sharp(input).metadata();
  const filename = `ai-${original.key}-${hash.slice(0, 12)}`;
  const publicPath = `/images/scene-illustrations/${filename}.webp`;
  const output = path.join(destination, `${filename}.webp`);
  await sharp(input).webp({ quality: 86, effort: 5 }).toFile(output);
  const variants = {};
  const variantBytes = {};
  for (const width of [64, 160, 320, 480, 640, 960, 1280, 1600]) {
    const variantName = `${filename}-${width}.webp`;
    const variantFile = path.join(destination, variantName);
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(variantFile);
    variants[width] = `/images/scene-illustrations/${variantName}`;
    variantBytes[width] = (await stat(variantFile)).size;
  }
  manifest[publicPath] = variants;
  if (
    createHash('sha256')
      .update(await readFile(source))
      .digest('hex') !== hash
  ) {
    throw new Error(`Original changed: ${original.key}`);
  }
  evidence.push({
    id: original.key.slice(3),
    source,
    source_sha256: hash,
    classification: 'AI-generated illustration; not an actual premises or inventory photo',
    width: metadata.width,
    height: metadata.height,
    publicPath,
    bytes: (await stat(output)).size,
    variants,
    variantBytes
  });
}
await writeFile(manifestPath, JSON.stringify(manifest));
await writeFile(
  path.join(evidenceDirectory, 'image-usage.json'),
  JSON.stringify(evidence, null, 2)
);
console.log(
  JSON.stringify(
    evidence.map(({ id, width, height, publicPath, bytes, variantBytes }) => ({
      id,
      width,
      height,
      publicPath,
      bytes,
      mobileBytes: variantBytes[480],
      desktopBytes: variantBytes[960]
    })),
    null,
    2
  )
);
