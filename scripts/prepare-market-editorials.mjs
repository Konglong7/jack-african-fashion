// Prepare generated collection imagery without altering source PNGs or existing variants.
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const originalsDirectory = path.join(root, 'output/imagegen/jack-fashion-market-editorials-2026-10-04');
const originalManifestPath = path.join(originalsDirectory, 'manifest.json');
const originalManifest = JSON.parse(await readFile(originalManifestPath, 'utf8'));
const altTexts = {
  africa: 'Collection inspiration: floral maxi dress and coordinated skirt set',
  'middle-east': 'Collection inspiration: long-sleeved teal and plum occasion dresses',
  'europe-north-america': 'Collection inspiration: plus-size floral dress and wide-leg jumpsuit',
  'latin-america': 'Collection inspiration: floral wrap dress and coordinated trouser set',
  'southeast-asia': 'Collection inspiration: covered floral skirt set and lilac maxi dress'
};
const records = originalManifest.images;
if (!Array.isArray(records) || records.length !== 5 ||
    new Set(records.map((record) => record.slug)).size !== 5 ||
    records.some((record) => !Object.hasOwn(altTexts, record.slug))) {
  throw new Error('Expected the five regional collection images');
}
const destination = path.join(root, 'public/images/market-editorials');
const artifactDirectory = path.join(root, 'artifacts/jack-fashion-market-editorials-20261004');
await mkdir(destination, { recursive: true });
await mkdir(artifactDirectory, { recursive: true });
const variantManifestPath = path.join(root, 'src/lib/generated/imageVariants.json');
const variants = JSON.parse(await readFile(variantManifestPath, 'utf8'));
const oldVariants = structuredClone(variants);
const images = {};
const evidence = [];

for (const original of records) {
  if (original.file !== `${original.slug}.png`) throw new Error('Unexpected original filename');
  const source = path.join(originalsDirectory, original.file);
  const input = await readFile(source);
  const hash = createHash('sha256').update(input).digest('hex');
  if (original.sha256 && original.sha256 !== hash) throw new Error(`Original changed: ${original.slug}`);
  const metadata = await sharp(input).metadata();
  if (metadata.width !== 1536 || metadata.height !== 1024) throw new Error('Expected landscape 3:2 image');
  const basename = `collection-${original.slug}-${hash.slice(0, 12)}`;
  const src = `/images/market-editorials/${basename}.webp`;
  const mainPath = path.join(destination, `${basename}.webp`);
  await sharp(input).webp({ quality: 86, effort: 5 }).toFile(mainPath);
  const prepared = {};
  const variantBytes = {};
  for (const width of [64, 160, 320, 480, 640, 960, 1280, 1600]) {
    const filename = `${basename}-${width}.webp`;
    const outputPath = path.join(destination, filename);
    await sharp(input).resize({ width, withoutEnlargement: true })
      .webp({ quality: 83, effort: 4 }).toFile(outputPath);
    prepared[width] = `/images/market-editorials/${filename}`;
    variantBytes[width] = (await stat(outputPath)).size;
  }
  variants[src] = prepared;
  images[original.slug] = { src, alt: altTexts[original.slug], width: metadata.width, height: metadata.height };
  original.sha256 = hash;
  if (createHash('sha256').update(await readFile(source)).digest('hex') !== hash)
    throw new Error(`Source modified during encoding: ${original.slug}`);
  evidence.push({ slug: original.slug, source, sha256: hash,
    classification: original.classification, ...images[original.slug],
    bytes: (await stat(mainPath)).size, variants: prepared, variantBytes });
}
for (const [key, value] of Object.entries(oldVariants)) {
  if (JSON.stringify(variants[key]) !== JSON.stringify(value)) throw new Error(`Existing mapping changed: ${key}`);
}
await writeFile(variantManifestPath, JSON.stringify(variants));
await writeFile(originalManifestPath, JSON.stringify(originalManifest, null, 2));
await writeFile(path.join(artifactDirectory, 'image-usage.json'), JSON.stringify(evidence, null, 2));
const source = `// Generated collection inspiration; not a record of available products or premises.\n` +
  `export interface MarketEditorial {\n  src: string;\n  alt: string;\n  width: number;\n  height: number;\n}\n\n` +
  `export const MARKET_EDITORIALS: Record<string, MarketEditorial> = ${JSON.stringify(images, null, 2)};\n\n` +
  `export function getMarketEditorial(slug: string): MarketEditorial | undefined {\n  return MARKET_EDITORIALS[slug];\n}\n`;
await writeFile(path.join(root, 'src/lib/marketEditorials.ts'), source);
console.log(JSON.stringify(evidence.map(({ slug, bytes, variantBytes }) => ({ slug, bytes,
  mobileBytes: variantBytes[480], cardBytes: variantBytes[640], largeBytes: variantBytes[1280] })), null, 2));
