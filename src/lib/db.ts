import { promises as fs } from 'fs';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';

export type Category = string;

export type StockType = 'Ready Stock' | 'Custom Available' | 'Ready Stock & Custom';

export interface ProductDetailSpec {
  label: string;
  value: string;
}

export interface ProductSizeChartRow {
  size: string;
  bust?: string;
  waist?: string;
  hip?: string;
  length?: string;
}

export interface ProductSizeChart {
  enabled?: boolean;
  note?: string;
  rows: ProductSizeChartRow[];
}

export interface ProductMaterialCare {
  enabled?: boolean;
  fabric?: string;
  composition?: string;
  fit?: string;
  stretch?: string;
  care?: string[];
}

export interface ProductProduction {
  enabled?: boolean;
  leadTime?: string;
  samplePolicy?: string;
  customization?: string[];
  qualityControl?: string[];
}

export interface ProductPackagingShipping {
  enabled?: boolean;
  packing?: string;
  shipping?: string;
  deliveryTime?: string;
  exportMarkets?: string[];
}

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface ProductDetailSection {
  enabled?: boolean;
  title: string;
  body: string;
  image?: string;
  layout?: 'image-left' | 'image-right' | 'full-width';
}

export interface ProductDetailPage {
  specs?: ProductDetailSpec[];
  sizeChart?: ProductSizeChart;
  materialCare?: ProductMaterialCare;
  production?: ProductProduction;
  packagingShipping?: ProductPackagingShipping;
  faq?: ProductFaqItem[];
  detailSections?: ProductDetailSection[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  image: string;
  images?: string[];
  priceMin?: number;
  priceMax?: number;
  moq: number;
  moqOptions: number[];
  stockType: StockType;
  tags: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
  features: string[];
  whatsappMessage: string;
  isNew?: boolean;
  isPopular?: boolean;
  detailPage?: ProductDetailPage;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');
const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'images', 'products');

let cache: Product[] | null = null;
let writeLock = false;

async function readAll(): Promise<Product[]> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[DB] products.json must contain an array. Falling back to empty list.');
      }
      cache = [];
      return cache;
    }

    cache = parsed as Product[];
    return cache;
  } catch {
    // Log error for debugging but gracefully return empty array
    cache = [];
    return cache;
  }
}

async function writeAllAtomic(products: Product[]): Promise<void> {
  while (writeLock) {
    await new Promise((r) => setTimeout(r, 50));
  }
  writeLock = true;
  try {
    await mkdir(path.dirname(DATA_FILE), { recursive: true });
    const tempFile = DATA_FILE + '.tmp';
    await writeFile(tempFile, JSON.stringify(products, null, 2), 'utf-8');
    await fs.rename(tempFile, DATA_FILE);
    cache = products;
  } catch (error) {
    console.error('[DB] Failed to write products.json:', error);
    throw new Error(
      `Failed to save products: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  } finally {
    writeLock = false;
  }
}

export async function getProducts(): Promise<Product[]> {
  return readAll();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await readAll();
  return all.find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await readAll();
  return all.find((p) => p.id === id);
}

export async function getPopularProducts(): Promise<Product[]> {
  const all = await readAll();
  return all.filter((p) => p.isPopular);
}

export async function getAllCategories(): Promise<string[]> {
  const all = await readAll();
  return Array.from(new Set(all.map((p) => p.category)));
}

export async function slugExists(slug: string): Promise<boolean> {
  const all = await readAll();
  return all.some((p) => p.slug === slug);
}

export async function createProduct(input: Omit<Product, 'id'>): Promise<Product> {
  // 拷贝一份再改：readAll() 返回的是缓存数组本体，直接 push 会在写盘失败时污染缓存
  const all = [...(await readAll())];

  if (await slugExists(input.slug)) {
    throw new Error(`Slug "${input.slug}" already exists. Choose a different slug.`);
  }

  // Fix: Use parseInt instead of Number to handle non-numeric IDs safely
  const maxId = all.reduce((max, p) => {
    const num = parseInt(p.id, 10);
    return !isNaN(num) && num > max ? num : max;
  }, 0);
  const id = String(maxId + 1);

  const product: Product = { ...input, id };
  all.push(product);
  await writeAllAtomic(all);
  return product;
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product | null> {
  // 同上：先拷贝，避免写盘失败后缓存里已经是被改过的值
  const all = [...(await readAll())];
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  if (patch.slug && patch.slug !== all[idx].slug) {
    const conflict = all.find((p) => p.slug === patch.slug && p.id !== id);
    if (conflict) {
      throw new Error(`Slug "${patch.slug}" already exists. Choose a different slug.`);
    }
  }

  all[idx] = { ...all[idx], ...patch, id };
  await writeAllAtomic(all);
  return all[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const all = await readAll();
  const product = all.find((p) => p.id === id);
  if (!product) return false;

  const next = all.filter((p) => p.id !== id);
  await writeAllAtomic(next);

  // Clean up orphaned images (optional, safe)
  const imagesToCheck = [product.image, ...(product.images || [])];
  for (const imgPath of imagesToCheck) {
    const filename = imgPath.split('/').pop();
    if (!filename) continue;
    const fullPath = path.join(PRODUCTS_DIR, filename);
    try {
      // Check if any other product still uses this image
      const stillUsed = next.some(
        (p) => p.image === imgPath || (p.images && p.images.includes(imgPath))
      );
      if (!stillUsed) {
        await fs.unlink(fullPath).catch((err) => {
          // Log deletion failure but don't throw - it's non-critical
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`[DB] Failed to delete orphaned image ${fullPath}:`, err.message);
          }
        });
      }
    } catch (error) {
      // Unexpected error during image check - log but continue
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[DB] Error checking image usage for ${imgPath}:`, error);
      }
    }
  }

  return true;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
