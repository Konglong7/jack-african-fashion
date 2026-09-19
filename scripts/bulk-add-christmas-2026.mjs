// Bulk add: 80 Christmas & Holiday 2026 wholesale dresses
// 素材来源：本地原始 PNG 素材目录（不入库，仓库内不包含）。
// 依赖：npm i -D sharp（package.json 未声明，需在运行前手动安装）
// Converts raw PNGs to web-optimized 1200px JPEGs into public/images/products/
// Adds products to data/products.json with backup
//
// 用法：MATERIALS_DIR=/path/to/raw-materials node scripts/bulk-add-christmas-2026.mjs
//      PowerShell: $env:MATERIALS_DIR='/path/to/raw-materials'; node scripts/bulk-add-christmas-2026.mjs
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

// 素材源目录：默认取环境变量 MATERIALS_DIR，未设置时使用仓库外的占位路径
const SRC_ROOT = process.env.MATERIALS_DIR || './materials-not-included';
const OUTPUT_DIR = 'public/images/products';
const DATA_FILE = 'data/products.json';
const BACKUP_FILE = 'data/products.json.pre-christmas2026.bak';

const SIZES = ['Free Size', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];
const COLORS = [
  { name: 'As Shown in Collage', hex: '#c2410c' },
  { name: 'Wine Red', hex: '#7b1e3b' },
  { name: 'Emerald Green', hex: '#0f766e' },
  { name: 'Royal Blue', hex: '#1e3a8a' },
  { name: 'Classic Black', hex: '#111111' },
  { name: 'Champagne Gold', hex: '#d4a017' }
];

const FEATURES = [
  'True plus size grading up to 5XL',
  'Rich festive holiday color palette as shown in collage',
  'Double-stitched seams and durable wholesale export finish',
  'Guangzhou ready stock and custom orders for African boutiques'
];

const FOLDER_CONFIGS = [
  {
    folder: '01_TikTok_Reels_节日强钩子_12张',
    prefix: 'xmas-01-hook',
    slugPrefix: 'christmas-festive-party-dress',
    namePrefix: 'Christmas Festive Party Dress',
    themeTag: 'Festive Glamour',
    description: (num) => `2026 Christmas festive party dress #${num}. Eye-catching holiday silhouette designed for Christmas banquets, festive events, and celebratory gatherings. Cut for comfortable plus-size elegance up to 5XL with vibrant festive colors shown in the photo. Direct factory wholesale pricing from Guangzhou for African boutique importers.`,
    isPopularIndexes: [0, 5],
  },
  {
    folder: '02_TikTok_Reels_教会家庭端庄_12张',
    prefix: 'xmas-02-church',
    slugPrefix: 'modest-church-family-gown',
    namePrefix: 'Modest Christmas Church & Family Gown',
    themeTag: 'Church & Modest',
    description: (num) => `Modest Christmas church and family celebration gown #${num}. Elegant, dignified coverage ideal for Sunday holiday service, family feasts, and year-end celebrations. Premium tailored drape for curves up to 5XL. Factory direct supply with ready stock and custom color ratios.`,
    isPopularIndexes: [0, 4],
  },
  {
    folder: '03_TikTok_Reels_晚宴高光_10张',
    prefix: 'xmas-03-evening',
    slugPrefix: 'holiday-evening-gala-dress',
    namePrefix: 'Holiday Evening Gala Dress',
    themeTag: 'Evening Gala',
    description: (num) => `High-glamour holiday evening gala gown #${num}. Striking statement piece tailored for Christmas night galas, New Year parties, and celebratory dinners. Lustrous drape and vibrant color blocking that catches every light. Available for wholesale bulk purchase.`,
    isPopularIndexes: [0, 3],
  },
  {
    folder: '04_TikTok_Reels_通勤到节日_10张',
    prefix: 'xmas-04-versatile',
    slugPrefix: 'day-to-night-holiday-dress',
    namePrefix: 'Day-to-Night Holiday Versatile Dress',
    themeTag: 'Versatile Wear',
    description: (num) => `Versatile day-to-night holiday dress #${num}. Seamlessly transitions from daytime business or office meetings to festive evening social celebrations. Easy, flattering lines in rich holiday shades. Tailored for plus-size comfort up to 5XL.`,
    isPopularIndexes: [0, 2],
  },
  {
    folder: '05_FB_Instagram_精品店补货_10张',
    prefix: 'xmas-05-boutique',
    slugPrefix: 'boutique-restock-holiday-dress',
    namePrefix: 'Boutique Restock Favorite Holiday Dress',
    themeTag: 'Boutique Bestseller',
    description: (num) => `Top trending wholesale boutique restock style #${num} for the Christmas shopping rush. High turnover rate with strong customer appeal in African retail markets. Multiple colors available for bulk mix-and-match orders.`,
    isPopularIndexes: [0, 1],
  },
  {
    folder: '06_FB_Instagram_大码舒适_8张',
    prefix: 'xmas-06-comfort',
    slugPrefix: 'plus-size-comfort-holiday-dress',
    namePrefix: 'Plus Size Comfort Curve Holiday Dress',
    themeTag: 'Curve Comfort',
    description: (num) => `Curve-flattering plus size holiday dress #${num} focused on supreme comfort and freedom of movement. Generous stretch, breathable textured fabric, and graceful silhouette from XL to 5XL. Top choice for boutiques catering to curvy women.`,
    isPopularIndexes: [0],
  },
  {
    folder: '07_FB_Instagram_印花多色_8张',
    prefix: 'xmas-07-print',
    slugPrefix: 'vibrant-print-festive-dress',
    namePrefix: 'Vibrant Print Multi-Color Festive Dress',
    themeTag: 'African Print',
    description: (num) => `Vibrant African-inspired multi-color festive dress #${num}. Rich saturated prints and contrast palettes that celebrate the festive season in bold style. Ready stock available for fast export packaging from Guangzhou.`,
    isPopularIndexes: [0],
  },
  {
    folder: '08_CTA反馈图_10张',
    prefix: 'xmas-08-spotlight',
    slugPrefix: 'customer-spotlight-holiday-dress',
    namePrefix: 'Customer Spotlight Holiday Dress',
    themeTag: 'Customer Spotlight',
    description: (num) => `Customer spotlight and proven best-seller holiday edition dress #${num}. High repeat order rate among African boutique buyers. Reliable sizing, excellent fabric weight, and ready stock for swift holiday shipping.`,
    isPopularIndexes: [0, 2],
  }
];

mkdirSync(OUTPUT_DIR, { recursive: true });

// Read existing products
const existingRaw = readFileSync(DATA_FILE, 'utf8');
const products = JSON.parse(existingRaw);
const existingSlugs = new Set(products.map((p) => p.slug));

let nextId = products.reduce((max, p) => {
  const n = parseInt(p.id, 10);
  return !isNaN(n) && n > max ? n : max;
}, 0) + 1;

console.log(`Starting with ${products.length} existing products. Next ID: ${nextId}`);

// Backup products.json
copyFileSync(DATA_FILE, BACKUP_FILE);
console.log(`Backup saved to ${BACKUP_FILE}`);

const additions = [];
let convertedCount = 0;
let skippedImageCount = 0;

for (const cfg of FOLDER_CONFIGS) {
  const folderPath = join(SRC_ROOT, cfg.folder);
  if (!existsSync(folderPath)) {
    throw new Error(`Directory not found: ${folderPath}`);
  }

  const files = readdirSync(folderPath)
    .filter((f) => f.toLowerCase().endsWith('.png'))
    .sort();

  console.log(`Processing ${cfg.folder} (${files.length} images)...`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const num = String(i + 1).padStart(2, '0');
    const outName = `${cfg.prefix}-${num}.jpg`;
    const outPath = join(OUTPUT_DIR, outName);
    const srcFilePath = join(folderPath, file);

    // Convert with sharp
    if (!existsSync(outPath)) {
      await sharp(srcFilePath)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(outPath);
      convertedCount++;
    } else {
      skippedImageCount++;
    }

    const slug = `${cfg.slugPrefix}-${num}`;
    if (existingSlugs.has(slug)) {
      console.log(`  Slug ${slug} already exists, skipping product entry`);
      continue;
    }

    const name = `${cfg.namePrefix} ${num}`;
    const imagePath = `/images/products/${outName}`;
    const desc = cfg.description(num);
    const isPopular = cfg.isPopularIndexes.includes(i);

    additions.push({
      id: String(nextId++),
      slug,
      name,
      category: 'Plus Size Dresses',
      image: imagePath,
      images: [imagePath],
      moq: 500,
      moqOptions: [500, 1000, 3000],
      stockType: 'Ready Stock & Custom',
      tags: [
        'Christmas 2026',
        'Holiday Collection',
        'New Arrival',
        'Plus Size',
        'Wholesale',
        cfg.themeTag
      ],
      sizes: SIZES,
      colors: COLORS,
      description: desc,
      features: FEATURES,
      whatsappMessage: `Hello Jack, I'm interested in the ${name} (Christmas 2026 Collection). Please share the wholesale quotation, available colors, and current ready-stock quantity.`,
      isNew: true,
      isPopular,
      detailPage: {
        detailSections: [
          {
            enabled: true,
            title: 'Christmas 2026 Style Highlights',
            body: desc,
            image: imagePath,
            layout: 'full-width'
          }
        ]
      }
    });

    existingSlugs.add(slug);
  }
}

console.log(`\nConversion summary:`);
console.log(`  Converted new images: ${convertedCount}`);
console.log(`  Skipped existing images: ${skippedImageCount}`);
console.log(`  New products to add: ${additions.length}`);

// Write updated products.json
const updatedProducts = [...products, ...additions];
writeFileSync(DATA_FILE, `${JSON.stringify(updatedProducts, null, 2)}\n`, 'utf8');

console.log(`Successfully updated ${DATA_FILE}! Total products now: ${updatedProducts.length}`);
