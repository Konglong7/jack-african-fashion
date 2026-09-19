// One-shot bulk add: 39 Plus Size Dresses from 上新/7月8日 batch.
// Run: node scripts/bulk-add-psd.mjs   (from project root)
// Idempotent: skips slugs that already exist, so re-runs are safe.
// 素材来源：本地原始图片批次 上新/7月8日（该素材目录不入库，仓库内不包含）。
// 本脚本只写入 data/products.json，不拷贝图片；需先把图片按 psd0708-<nn>-<descriptor>.<ext> 命名放入 public/images/products/。
import { readFileSync, writeFileSync } from 'fs';

const items = [
  { nn: '01', d: 'v-neck-pleated-maxi-dress', n: 'V-Neck Pleated Maxi', ext: 'jpg', full: 'A graceful pleated maxi dress with a V-neckline in vibrant African print, tailored for plus-size figures and available for wholesale bulk purchase.', c: [{ name: 'Royal Blue', hex: '#1E3A8A' }, { name: 'Golden Yellow', hex: '#FBBF24' }] },
  { nn: '02', d: 'puff-sleeve-shift-dress', n: 'Puff Sleeve Shift Dress', ext: 'jpg', full: 'A stylish shift dress with puff sleeves in bold African wax print, offering comfortable elegance for curves and excellent wholesale margins.', c: [{ name: 'Emerald Green', hex: '#059669' }, { name: 'Coral', hex: '#F87171' }] },
  { nn: '03', d: 'ruffle-hem-wrap-gown', n: 'Ruffle Hem Wrap Gown', ext: 'jpg', full: 'A flowing wrap gown with ruffle hem in vivid African print, designed to flatter fuller silhouettes and ready for wholesale boutique orders.', c: [{ name: 'Magenta', hex: '#C026D3' }, { name: 'Black', hex: '#000000' }] },
  { nn: '04', d: 'ankara-v-neck-print-dress', n: 'Ankara V-Neck Print Dress', ext: 'jpg', full: 'Vibrant Ankara wax print dress with a flattering V-neckline and short sleeves, tailored for plus size figures, available for wholesale bulk purchase.', c: [{ name: 'Golden Yellow', hex: '#f5c518' }, { name: 'Teal Blue', hex: '#1f8a8c' }] },
  { nn: '05', d: 'floral-ruffle-hem-maxi-dress', n: 'Floral Ruffle Hem Maxi', ext: 'jpg', full: 'Elegant floral print maxi dress with a cascading ruffle hem, designed to flatter plus size silhouettes, offered at competitive wholesale pricing.', c: [{ name: 'Emerald Green', hex: '#2e7d5b' }, { name: 'Soft Cream', hex: '#f0e6d2' }] },
  { nn: '06', d: 'puff-sleeve-wrap-dress', n: 'Puff Sleeve Wrap Dress', ext: 'jpg', full: 'Chic wrap dress with statement puff sleeves and bold African-inspired print, crafted for plus size comfort and style, available for bulk wholesale orders.', c: [{ name: 'Burnt Orange', hex: '#d9622b' }, { name: 'Deep Navy', hex: '#1c2a4a' }] },
  { nn: '07', d: 'ankara-print-maxi-dress', n: 'Ankara Print Maxi Dress', ext: 'jpg', full: 'Vibrant Ankara print maxi dress with fitted bodice and flowing skirt, designed for curvy figures and ready for wholesale bulk orders.', c: [{ name: 'Orange', hex: '#E2541F' }, { name: 'Yellow', hex: '#F2C040' }, { name: 'Blue', hex: '#1B4A7C' }] },
  { nn: '08', d: 'floral-wrap-dress', n: 'Floral Wrap Dress', ext: 'jpg', full: 'Flattering floral wrap dress with V-neckline and tie waist, crafted for plus-size comfort and available for bulk B2B purchasing.', c: [{ name: 'Red', hex: '#B03030' }, { name: 'Green', hex: '#2E6B3F' }, { name: 'Cream', hex: '#F0E2C8' }] },
  { nn: '09', d: 'puff-sleeve-contrast-shift-dress', n: 'Puff Sleeve Contrast Shift Dress', ext: 'jpg', full: 'Elegant shift dress with statement puff sleeves and relaxed fit, offering plus-size-friendly tailoring for wholesale buyers.', c: [{ name: 'Mustard', hex: '#D4A038' }, { name: 'Black', hex: '#1C1C1C' }] },
  { nn: '10', d: 'long-sleeve-v-neck-maxi-dress', n: 'Long Sleeve V-Neck Maxi Dress', ext: 'jpg', full: 'Elegant Ankara print maxi dress featuring long sleeves and a flattering V-neckline, cut for curves and available for wholesale bulk purchase.', c: [{ name: 'Royal Blue', hex: '#1B3B6F' }, { name: 'Gold', hex: '#D4A017' }] },
  { nn: '11', d: 'floral-ankara-maxi-dress', n: 'Floral Ankara Maxi Dress', ext: 'jpg', full: 'Vibrant floral-inspired African wax print maxi dress with short sleeves, cut for curvy figures and ready for wholesale bulk orders.', c: [{ name: 'Magenta', hex: '#C2185B' }, { name: 'Royal Blue', hex: '#1E5BB8' }, { name: 'Leaf Green', hex: '#3A9D23' }] },
  { nn: '12', d: 'geometric-print-maxi-dress', n: 'Geometric Print Maxi', ext: 'jpg', full: 'Bold geometric African wax print maxi dress with flowing silhouette, plus-size friendly fit, ideal for retail wholesale stock.', c: [{ name: 'Crimson', hex: '#B71C1C' }, { name: 'Goldenrod', hex: '#F5A623' }, { name: 'Forest Green', hex: '#2E6B2F' }] },
  { nn: '13', d: 'bold-ankara-long-gown', n: 'Bold Ankara Long Gown', ext: 'jpg', full: 'Statement-making bold Ankara print long gown with vibrant contrast patterns, designed for curvy women and bulk purchasing.', c: [{ name: 'Tangerine', hex: '#E85D04' }, { name: 'Cobalt', hex: '#1A4FA0' }, { name: 'Charcoal', hex: '#1C1C1C' }] },
  { nn: '14', d: 'leaf-motif-ankara-dress', n: 'Leaf Motif Ankara Dress', ext: 'jpg', full: 'Elegant leaf-motif African wax print dress with relaxed maxi cut, flatters fuller figures and ships wholesale-ready.', c: [{ name: 'Emerald', hex: '#2E8B57' }, { name: 'Sunflower', hex: '#F2C203' }, { name: 'Ivory', hex: '#F4ECD8' }] },
  { nn: '15', d: 'abstract-ankara-shift-gown', n: 'Abstract Ankara Shift Gown', ext: 'jpg', full: 'Abstract African wax print shift gown with bold color blocking, plus-size comfortable fit, perfect for wholesale catalog sourcing.', c: [{ name: 'Teal', hex: '#0F76A0' }, { name: 'Coral', hex: '#FF6F61' }, { name: 'Marigold', hex: '#FFB300' }] },
  { nn: '16', d: 'flutter-sleeve-belted-dress', n: 'Flutter Sleeve Belted Midi Dress', ext: 'jpg', full: 'Elegant lavender midi dress with delicate flutter cap sleeves, a flattering V-neckline, and a self-tie waist belt for a feminine silhouette. Ideal for plus-size wholesale buyers seeking versatile occasion wear.', c: [{ name: 'Lavender', hex: '#B8A9D4' }, { name: 'Light Purple', hex: '#D5C8E8' }, { name: 'Soft Mauve', hex: '#C4B0D9' }] },
  { nn: '17', d: 'puff-sleeve-square-neck-dress', n: 'Puff Sleeve Square Neck Midi Dress', ext: 'jpg', full: 'Charming white midi dress featuring short gathered puff sleeves and a classic square neckline with a smocked empire waist. A timeless piece perfect for plus-size retailers looking for clean, elegant everyday styles.', c: [{ name: 'White', hex: '#F5F0EB' }, { name: 'Cream', hex: '#EDE7DF' }, { name: 'Ivory', hex: '#FAF6F0' }] },
  { nn: '18', d: 'boat-neck-belted-dress', n: 'Boat Neck Belted Midi Dress', ext: 'jpg', full: 'Sophisticated burnt orange midi dress with a wide boat neckline, three-quarter sleeves, and a coordinating self-tie belt. Relaxed yet polished — a must-stock color for plus-size wholesale collections.', c: [{ name: 'Burnt Orange', hex: '#C46A3C' }, { name: 'Terracotta', hex: '#D4845A' }, { name: 'Rust', hex: '#B85C38' }] },
  { nn: '19', d: 'tiered-ruffle-square-neck-midi-dress', n: 'Tiered Ruffle Square Neck Midi Dress', ext: 'jpg', full: 'Beautiful beige midi dress with a structured square neckline, short puff sleeves, and a flowing tiered ruffle hem. Lightweight and flattering — an excellent plus-size option for spring and summer wholesale orders.', c: [{ name: 'Beige', hex: '#D9CCBB' }, { name: 'Sand', hex: '#E8DCC8' }, { name: 'Warm Nude', hex: '#CEBFA8' }] },
  { nn: '20', d: 'mock-neck-gathered-a-line-dress', n: 'Mock Neck Gathered A-Line Dress', ext: 'jpg', full: 'Vibrant hot pink sleeveless midi dress with a gathered mock neckline and a relaxed A-line silhouette that drapes beautifully. A bold, eye-catching colorway that plus-size wholesale buyers will love for party and event seasons.', c: [{ name: 'Hot Pink', hex: '#E8487A' }, { name: 'Magenta', hex: '#D63670' }, { name: 'Deep Pink', hex: '#C42862' }] },
  { nn: '21', d: 'one-shoulder-ankara-dress', n: 'One-Shoulder Ankara Dress', ext: 'jpg', full: 'Striking one-shoulder Ankara dress with bold print, tailored for plus-size figures and offered at competitive wholesale pricing.', c: [{ name: 'Coral Red', hex: '#E84A4A' }, { name: 'Mustard', hex: '#E8B817' }] },
  { nn: '22', d: 'ruffle-tiered-ankara-dress', n: 'Ruffle Tiered Ankara Dress', ext: 'jpg', full: 'Flirty ruffle-tiered Ankara dress designed to flatter curves, perfect for boutiques seeking wholesale African fashion inventory.', c: [{ name: 'Plum Purple', hex: '#6B3A6B' }, { name: 'Cream', hex: '#F5E6D3' }] },
  { nn: '23', d: 'ankara-print-off-shoulder-dress', n: 'Ankara Print Off Shoulder Dress', ext: 'jpg', full: 'Vibrant Ankara print off-shoulder dress with puff sleeves and fitted waist, designed for curves and perfect for wholesale buyers seeking standout African fashion.', c: [{ name: 'Orange', hex: '#E07A2B' }, { name: 'Blue', hex: '#2A4A7F' }, { name: 'Yellow', hex: '#F5C936' }] },
  { nn: '24', d: 'floral-wrap-maxi-dress', n: 'Floral Wrap Maxi Dress', ext: 'jpg', full: 'Elegant floral wrap maxi dress with flowing skirt and V-neckline, cut to flatter fuller figures and ideal for bulk orders of stylish African-inspired wear.', c: [{ name: 'Green', hex: '#2F5A3D' }, { name: 'Cream', hex: '#EFE3C8' }, { name: 'Red', hex: '#B22234' }] },
  { nn: '25', d: 'short-sleeve-pleated-tunic', n: 'Short Sleeve Pleated Tunic', ext: 'jpg', full: 'Breathable short-sleeve pleated tunic with colorful geometric print, offering all-day comfort for curvy customers and bulk boutique sourcing needs.', c: [{ name: 'Teal', hex: '#1F7A6D' }, { name: 'Magenta', hex: '#C02A6F' }, { name: 'Gold', hex: '#D4A017' }] },
  { nn: '26', d: 'ankara-print-v-neck-dress', n: 'Ankara Print V-Neck Dress', ext: 'jpg', full: 'Vibrant African wax print midi dress with flattering V-neckline and short sleeves, crafted for curvy figures and ideal for wholesale boutique stock.', c: [{ name: 'Golden Yellow', hex: '#E8A317' }, { name: 'Black', hex: '#1A1A1A' }, { name: 'Royal Blue', hex: '#1E3A8A' }] },
  { nn: '27', d: 'floral-wrap-midi-dress', n: 'Floral Wrap Midi Dress', ext: 'jpg', full: 'Elegant floral wrap dress with adjustable tie waist and flowing skirt, designed to flatter plus-size silhouettes and perfect for wholesale fashion retailers.', c: [{ name: 'Rose Pink', hex: '#D64D6E' }, { name: 'Cream', hex: '#F5E6D3' }, { name: 'Emerald Green', hex: '#2E7D5B' }] },
  { nn: '28', d: 'puff-sleeve-print-maxi-dress', n: 'Puff Sleeve Print Maxi', ext: 'jpg', full: 'Statement puff sleeve maxi dress with bold African print, tailored for plus-size comfort and available for bulk wholesale orders to stock boutique collections.', c: [{ name: 'Burnt Orange', hex: '#C2522D' }, { name: 'Deep Teal', hex: '#1F6E6B' }, { name: 'Ivory', hex: '#F4EDE0' }] },
  { nn: '29', d: 'leaf-print-short-sleeve-maxi-dress', n: 'Leaf Print Short Sleeve Maxi Dress', ext: 'jpg', full: 'A flowing botanical leaf print maxi dress with short sleeves and V-neckline, tailored for plus-size comfort and ready for wholesale bulk orders.', c: [{ name: 'Olive Green', hex: '#6b7a4e' }, { name: 'Beige', hex: '#d4c5a0' }, { name: 'Brown', hex: '#5c4023' }] },
  { nn: '30', d: 'puff-sleeve-floral-maxi-dress', n: 'Puff Sleeve Floral Maxi Dress', ext: 'jpg', full: 'Elegant puff sleeve maxi dress featuring a vibrant floral print, designed flatteringly for plus-size figures and available for bulk wholesale purchase.', c: [{ name: 'Teal', hex: '#2a7a7a' }, { name: 'Navy Blue', hex: '#1e4d6b' }, { name: 'Off White', hex: '#f5f0e8' }] },
  { nn: '31', d: 'ankara-wrap-belt-dress', n: 'Ankara Wrap Belt Dress', ext: 'jpg', full: 'Stylish Ankara wrap dress with tie waist belt, short sleeves, and bold geometric print, crafted for plus-size fashion wholesale buyers seeking statement pieces.', c: [{ name: 'Burnt Orange', hex: '#c4621f' }, { name: 'Chocolate Brown', hex: '#6b3a1a' }, { name: 'Cream', hex: '#e8d5b0' }] },
  { nn: '32', d: 'floral-puff-sleeve-wrap-dress', n: 'Floral Puff Sleeve Wrap Dress', ext: 'jpg', full: 'Elegant floral wrap dress with puff sleeves and V-neckline, tailored for curvy figures and crafted for wholesale boutique sourcing in plus sizes.', c: [{ name: 'Coral', hex: '#FF7F50' }, { name: 'Forest Green', hex: '#228B22' }, { name: 'Black', hex: '#000000' }] },
  { nn: '33', d: 'ankara-print-midi-dress', n: 'Ankara Print Midi Dress', ext: 'jpg', full: 'Vibrant Ankara print midi dress with short sleeves and fitted waist, designed for plus-size comfort and available for bulk wholesale orders.', c: [{ name: 'Royal Blue', hex: '#4169E1' }, { name: 'Orange', hex: '#FFA500' }, { name: 'Golden Yellow', hex: '#FFD700' }] },
  { nn: '34', d: 'ankara-print-flowing-maxi-dress', n: 'Ankara Print Maxi Dress', ext: 'jpg', full: 'Bold Ankara print maxi dress with flowing silhouette and short sleeves, perfect for plus-size retail and wholesale boutique stocking.', c: [{ name: 'Brown', hex: '#8B4513' }, { name: 'Orange', hex: '#FF8C00' }, { name: 'Cream', hex: '#FFFDD0' }] },
  { nn: '35', d: 'off-shoulder-ankara-maxi-dress', n: 'Ankara Print Off Shoulder Dress', ext: 'jpg', full: 'Vibrant Ankara print off-shoulder dress with puff sleeves and flowing maxi length, cut for curvy figures and ready for bulk wholesale orders.', c: [{ name: 'Orange', hex: '#d97a3c' }, { name: 'Yellow', hex: '#e8c84a' }, { name: 'Green', hex: '#3a6b3a' }] },
  { nn: '36', d: 'puff-sleeve-belted-dress', n: 'Puff Sleeve Belted Dress', ext: 'jpg', full: 'Elegant royal blue dress with voluminous lantern puff sleeves, deep V-neckline, and a self-tie gathered waist belt that flatters plus-size figures. A-line flared silhouette in crinkled textured fabric, perfect for wholesale bulk orders.', c: [{ name: 'Royal Blue', hex: '#2856a8' }, { name: 'Navy', hex: '#1a3469' }] },
  { nn: '37', d: 'ankara-fit-and-flare-dress', n: 'Ankara Fit And Flare Dress', ext: 'png', full: 'Vibrant African wax print fit-and-flare dress with bold geometric motifs in red and golden yellow. Long sleeves with round neckline and gathered full skirt, offering a comfortable plus-size-friendly silhouette ideal for boutique wholesale purchases.', c: [{ name: 'Crimson Red', hex: '#c0281e' }, { name: 'Golden Yellow', hex: '#e8b830' }, { name: 'Black', hex: '#1a1a1a' }] },
  { nn: '38', d: 'mandarin-button-tunic-dress', n: 'Mandarin Button Tunic Dress', ext: 'jpg', full: 'Short-sleeve mandarin collar tunic dress in rich purple and white African geometric print with button-down front placket. Relaxed plus-size-friendly fit with side pockets, versatile for casual or office wear. Great for wholesale fashion buyers.', c: [{ name: 'Purple', hex: '#5c3d7a' }, { name: 'White', hex: '#f0eef2' }] },
  { nn: '39', d: 'lace-trim-v-neck-dress', n: 'Lace Trim V Neck Dress', ext: 'jpg', full: 'Classic black midi dress with delicate scalloped lace trim along the V-neckline and short sleeve hems. Flattering A-line silhouette with a fitted bodice and flared skirt, a plus-size-friendly wardrobe staple. A must-have for wholesale dress collections.', c: [{ name: 'Black', hex: '#1a1a1a' }] }
];

const FEATURES = [
  'True plus size grading up to 5XL',
  'Premium fabric that holds shape wash after wash',
  'Double-stitched seams for wholesale durability',
  'Available for ready stock and custom orders'
];
const SIZES = ['XL', 'XXL', '3XL', '4XL', '5XL'];

function styleTag(d) {
  if (d.includes('ankara')) return 'Ankara';
  if (d.includes('floral')) return 'Floral';
  if (d.includes('geometric')) return 'Geometric';
  if (d.includes('leaf')) return 'Leaf Print';
  if (d.includes('abstract')) return 'Abstract';
  if (d.includes('lace')) return 'Lace';
  return 'Dress';
}

const FILE = 'data/products.json';
const products = JSON.parse(readFileSync(FILE, 'utf-8'));

let maxId = 0;
for (const p of products) {
  const n = parseInt(p.id, 10);
  if (!isNaN(n) && n > maxId) maxId = n;
}
const existingSlugs = new Set(products.map((p) => p.slug));
// also guard against intra-batch dup descriptors
const seenDescriptors = new Set();
for (const it of items) {
  if (seenDescriptors.has(it.d)) throw new Error(`Duplicate descriptor in batch: ${it.d}`);
  seenDescriptors.add(it.d);
}

let nextId = maxId + 1;
const toAdd = [];
const skipped = [];
for (const it of items) {
  const slug = `plus-size-${it.d}`;
  if (existingSlugs.has(slug)) { skipped.push(slug); continue; }
  const imgFile = `psd0708-${it.nn}-${it.d}.${it.ext}`;
  const imgPath = `/images/products/${imgFile}`;
  toAdd.push({
    id: String(nextId++),
    slug,
    name: it.n,
    category: 'Plus Size Dresses',
    image: imgPath,
    images: [imgPath],
    moq: 30,
    moqOptions: [30, 100, 300],
    stockType: 'Ready Stock & Custom',
    tags: ['Plus Size', 'Wholesale', styleTag(it.d)],
    sizes: SIZES,
    colors: it.c,
    description: it.full,
    features: FEATURES,
    whatsappMessage: `Hello Jack, I'd like the wholesale price for the ${it.n}. How many pieces per size ratio?`,
    isNew: true,
    isPopular: false,
    detailPage: {
      detailSections: [
        { enabled: true, title: 'Style Highlights', body: it.full, image: imgPath, layout: 'full-width' }
      ]
    }
  });
}

const all = products.concat(toAdd);
writeFileSync(FILE, JSON.stringify(all, null, 2) + '\n', 'utf-8');
console.log(`Existing: ${products.length} | Added: ${toAdd.length} | Skipped(dup): ${skipped.length} | Total now: ${all.length}`);
if (skipped.length) console.log('Skipped slugs:\n' + skipped.join('\n'));
