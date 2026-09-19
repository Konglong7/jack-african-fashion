// One-shot bulk add: 306 watermark collages (2026-08-16 .. 2026-09-06).
// Run: node scripts/bulk-add-20260809.mjs   (from project root)
// Idempotent: skips slugs that already exist.
// Order: oldest batch first -> newest batch gets the largest IDs -> shows on top.
import { copyFileSync, readdirSync, readFileSync, writeFileSync } from 'fs';

const BATCHES = [
  { prefix: '0816', date: '2026-08-16' },
  { prefix: '0817', date: '2026-08-17' },
  { prefix: '0824', date: '2026-08-24' },
  { prefix: '0826', date: '2026-08-26' },
  { prefix: '0827', date: '2026-08-27' },
  { prefix: '0831', date: '2026-08-31' },
  { prefix: '0906', date: '2026-09-06' }
];

const OUTPUT_DIR = 'public/images/products';

const SIZES = ['Free Size', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];
const COLORS = [
  { name: 'As Shown', hex: '#c2410c' },
  { name: 'Black', hex: '#111111' },
  { name: 'Wine', hex: '#7b1e3b' },
  { name: 'Royal Blue', hex: '#1e3a8a' },
  { name: 'Emerald', hex: '#0f766e' },
  { name: 'Gold', hex: '#d4a017' }
];
const FEATURES = [
  'True plus size grading up to 5XL',
  'Premium fabric that holds shape wash after wash',
  'Double-stitched seams for wholesale durability',
  'Available for ready stock and custom orders'
];

// Collect codes in chronological order.
const codes = [];
for (const { prefix, date } of BATCHES) {
  const files = readdirSync(OUTPUT_DIR)
    .filter((f) => f.startsWith(`new-${prefix}`) && f.endsWith('.jpg'))
    .sort();
  if (files.length === 0) throw new Error(`No converted images for batch ${prefix} (${date})`);
  for (const file of files) {
    codes.push({ code: file.replace(/^new-/, '').replace(/\.jpg$/, ''), date, file });
  }
}
console.log(`Found ${codes.length} converted images`);

// Backup current data.
const DATA_FILE = 'data/products.json';
copyFileSync(DATA_FILE, 'data/products.json.pre-20260907.bak');
console.log('Backup: data/products.json.pre-20260907.bak');

const products = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
const existingSlugs = new Set(products.map((p) => p.slug));
let nextId = products.reduce((max, p) => {
  const n = parseInt(p.id, 10);
  return !isNaN(n) && n > max ? n : max;
}, 0) + 1;

const additions = [];
for (const { code, date, file } of codes) {
  const slug = `new-arrival-dress-${code}`;
  if (existingSlugs.has(slug)) continue;
  const name = `New Arrival Wholesale Dress ${code}`;
  const image = `/images/products/${file}`;
  const description = `New arrival wholesale dress (style ${code}, released ${date}). Same style shown in multiple colors in the photo — send your preferred color and size ratio on WhatsApp for a factory quotation. Guangzhou ready stock and custom production for African boutiques and importers.`;
  additions.push({
    id: String(nextId++),
    slug,
    name,
    category: 'Plus Size Dresses',
    image,
    images: [image],
    moq: 30,
    moqOptions: [30, 100, 300],
    stockType: 'Ready Stock & Custom',
    tags: ['New Arrival', 'Plus Size', 'Wholesale', date],
    sizes: SIZES,
    colors: COLORS,
    description,
    features: FEATURES,
    whatsappMessage: `Hello Jack, I'm interested in the ${name} (style ${code}). Please share the wholesale price, available colors and current stock.`,
    isNew: true,
    isPopular: false,
    detailPage: {
      detailSections: [{ enabled: true, title: 'Style Highlights', body: description, image, layout: 'full-width' }]
    }
  });
  existingSlugs.add(slug);
}

writeFileSync(DATA_FILE, `${JSON.stringify([...products, ...additions], null, 2)}\n`);
console.log(`Added: ${additions.length} | Total: ${products.length + additions.length}`);
