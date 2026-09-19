// One-shot: convert 2026-08/09 watermark PNG collages to compressed JPGs.
// Run: node scripts/convert-watermark-20260809.mjs  (from project root)
// Idempotent: skips output files that already exist.
// 素材来源：本地水印图批量目录（不入库，仓库内不包含）。
// 依赖：npm i -D sharp（package.json 未声明，需在运行前手动安装）
//
// 用法：MATERIALS_DIR=/path/to/watermark-batches node scripts/convert-watermark-20260809.mjs
//      PowerShell: $env:MATERIALS_DIR='/path/to/watermark-batches'; node scripts/convert-watermark-20260809.mjs
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

// 素材源目录：默认取环境变量 MATERIALS_DIR，未设置时使用仓库外的占位路径
const SRC_ROOT = process.env.MATERIALS_DIR || './materials-not-included';
const OUTPUT_DIR = 'public/images/products';
const SITE_DIR = 'public/images/site';

// [source folder, filename prefix handled by source name itself]
const BATCHES = [
  '2026年8月16日 水印图',
  '2026年8月17日 水印图',
  '2026年8月24日 水印图',
  '2026年8月26日 水印图',
  '2026年8月27日 水印图',
  '2026年8月31日 水印图',
  '2026年9月6日 水印图'
];

mkdirSync(OUTPUT_DIR, { recursive: true });
mkdirSync(SITE_DIR, { recursive: true });

let done = 0;
let skipped = 0;

for (const batch of BATCHES) {
  const dir = join(SRC_ROOT, batch);
  const files = readdirSync(dir)
    .filter((f) => /\.png$/i.test(f))
    .sort();
  for (const file of files) {
    // 0816001.png -> new-0816001.jpg
    const code = file.replace(/\.png$/i, '');
    const outName = `new-${code}.jpg`;
    const outPath = join(OUTPUT_DIR, outName);
    if (existsSync(outPath)) {
      skipped++;
      continue;
    }
    await sharp(join(dir, file))
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(outPath);
    done++;
    if (done % 25 === 0) console.log(`  ...${done} converted`);
  }
  console.log(`${batch}: done (new ${done}, skipped so far ${skipped})`);
}

// 8月11日广告图 -> 首页 banner 条
const bannerSrc = join(SRC_ROOT, '2026年8月11日 水印图', 'ChatGPT Image 2026年8月11日 18_46_22.png');
const bannerOut = join(SITE_DIR, 'wholesale-banner.jpg');
if (!existsSync(bannerOut)) {
  await sharp(bannerSrc)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(bannerOut);
  console.log('banner converted');
} else {
  console.log('banner exists, skipped');
}

console.log(`CONVERT DONE: converted=${done} skipped=${skipped}`);
