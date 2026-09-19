import type {
  Product,
  ProductDetailSection,
  ProductDetailSpec,
  ProductFaqItem,
  StockType
} from './db';
import { slugify } from './db';
import { DEFAULT_PRODUCT_COLORS, DEFAULT_PRODUCT_SIZES } from './productDefaults';

const STOCK_TYPES: StockType[] = ['Ready Stock', 'Custom Available', 'Ready Stock & Custom'];

type ProductInput = Record<string, unknown>;

type ProductValidationResult =
  { ok: true; product: Omit<Product, 'id'> } | { ok: false; error: string };

export function normalizeProductInput(input: ProductInput): ProductValidationResult {
  const name = asTrimmedString(input.name);
  if (!name) return { ok: false, error: 'name is required' };

  const category = asTrimmedString(input.category);
  if (!category) return { ok: false, error: 'category is required' };

  const slug = asTrimmedString(input.slug) || slugify(name);
  if (!slug) return { ok: false, error: 'slug could not be generated' };

  const moq = asPositiveNumber(input.moq, 30);
  const moqOptions = asPositiveNumberArray(input.moqOptions, [30, 100, 300]);
  const stockType = isStockType(input.stockType) ? input.stockType : 'Ready Stock & Custom';

  return {
    ok: true,
    product: {
      slug,
      name,
      category,
      image: asImagePath(input.image) || `/images/products/${slug}.jpg`,
      images: asImagePathArray(input.images),
      priceMin: asOptionalPrice(input.priceMin),
      priceMax: asOptionalPrice(input.priceMax),
      moq,
      moqOptions,
      stockType,
      tags: asStringArray(input.tags),
      sizes: asStringArray(input.sizes, DEFAULT_PRODUCT_SIZES),
      colors: asColors(input.colors, DEFAULT_PRODUCT_COLORS),
      description: asTrimmedString(input.description),
      features: asStringArray(input.features),
      whatsappMessage:
        asTrimmedString(input.whatsappMessage) || `Hello Jack, I'm interested in ${name}.`,
      isNew: Boolean(input.isNew),
      isPopular: Boolean(input.isPopular),
      detailPage: asDetailPage(input.detailPage)
    }
  };
}

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

// ponytail: next/image rejects anything that isn't root-relative or absolute — and that
// 500s the whole page. Drop bad paths at the trust boundary instead of letting them
// reach <Image>. Empty string is allowed (callers fall back to a generated path).
function asImagePath(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (trimmed === '' || /^(\/|https?:\/\/)/.test(trimmed)) return trimmed;
  return '';
}

function asImagePathArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asImagePath(item)).filter(Boolean);
}

function isStockType(value: unknown): value is StockType {
  return typeof value === 'string' && STOCK_TYPES.includes(value as StockType);
}

function asPositiveNumber(value: unknown, fallback: number): number {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : fallback;
}

function asOptionalPrice(value: unknown): number | undefined {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.round(num * 100) / 100 : undefined;
}

function asPositiveNumberArray(value: unknown, fallback: number[]): number[] {
  const source = Array.isArray(value) ? value : fallback;
  const numbers = source
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0);
  return numbers.length > 0 ? numbers : fallback;
}

function asStringArray(value: unknown, fallback: string[] = []): string[] {
  const source = Array.isArray(value) ? value : fallback;
  return source.map((item) => asTrimmedString(item)).filter(Boolean);
}

function asColors(
  value: unknown,
  fallback: Product['colors'] = []
): Product['colors'] {
  if (!Array.isArray(value)) return fallback;

  const normalized = value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = asTrimmedString(record.name);
      const hex = asTrimmedString(record.hex);
      if (!name) return null;
      return { name, hex: /^#[0-9a-f]{6}$/i.test(hex) ? hex : '#000000' };
    })
    .filter((item): item is Product['colors'][number] => Boolean(item));

  return normalized.length > 0 ? normalized : fallback;
}

function asDetailPage(value: unknown): Product['detailPage'] {
  if (!value || typeof value !== 'object') return undefined;

  const record = value as Record<string, unknown>;
  const detailPage: NonNullable<Product['detailPage']> = {};

  const specs = asSpecList(record.specs);
  if (specs.length > 0) detailPage.specs = specs;

  const sizeChart = asSizeChart(record.sizeChart);
  if (sizeChart) detailPage.sizeChart = sizeChart;

  const materialCare = asMaterialCare(record.materialCare);
  if (materialCare) detailPage.materialCare = materialCare;

  const production = asProduction(record.production);
  if (production) detailPage.production = production;

  const packagingShipping = asPackagingShipping(record.packagingShipping);
  if (packagingShipping) detailPage.packagingShipping = packagingShipping;

  const faq = asFaq(record.faq);
  if (faq.length > 0) detailPage.faq = faq;

  const detailSections = asDetailSections(record.detailSections);
  if (detailSections.length > 0) detailPage.detailSections = detailSections;

  return Object.keys(detailPage).length > 0 ? detailPage : undefined;
}

function asSpecList(value: unknown): ProductDetailSpec[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const label = asTrimmedString(record.label);
      const specValue = asTrimmedString(record.value);
      if (!label || !specValue) return null;
      return { label, value: specValue };
    })
    .filter((item): item is { label: string; value: string } => Boolean(item));
}

function asSizeChart(value: unknown): NonNullable<Product['detailPage']>['sizeChart'] {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const rows = Array.isArray(record.rows) ? record.rows : [];
  const normalizedRows = rows
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      const size = asTrimmedString(row.size);
      if (!size) return null;
      return {
        size,
        bust: asTrimmedString(row.bust),
        waist: asTrimmedString(row.waist),
        hip: asTrimmedString(row.hip),
        length: asTrimmedString(row.length)
      };
    })
    .filter(
      (item): item is { size: string; bust: string; waist: string; hip: string; length: string } =>
        Boolean(item)
    );

  if (normalizedRows.length === 0) return undefined;
  return {
    enabled: record.enabled !== false,
    note: asTrimmedString(record.note),
    rows: normalizedRows
  };
}

function asMaterialCare(value: unknown): NonNullable<Product['detailPage']>['materialCare'] {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const materialCare = {
    enabled: record.enabled !== false,
    fabric: asTrimmedString(record.fabric),
    composition: asTrimmedString(record.composition),
    fit: asTrimmedString(record.fit),
    stretch: asTrimmedString(record.stretch),
    care: asStringArray(record.care)
  };

  return hasTextValue(materialCare) ? materialCare : undefined;
}

function asProduction(value: unknown): NonNullable<Product['detailPage']>['production'] {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const production = {
    enabled: record.enabled !== false,
    leadTime: asTrimmedString(record.leadTime),
    samplePolicy: asTrimmedString(record.samplePolicy),
    customization: asStringArray(record.customization),
    qualityControl: asStringArray(record.qualityControl)
  };

  return hasTextValue(production) ? production : undefined;
}

function asPackagingShipping(
  value: unknown
): NonNullable<Product['detailPage']>['packagingShipping'] {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const packagingShipping = {
    enabled: record.enabled !== false,
    packing: asTrimmedString(record.packing),
    shipping: asTrimmedString(record.shipping),
    deliveryTime: asTrimmedString(record.deliveryTime),
    exportMarkets: asStringArray(record.exportMarkets)
  };

  return hasTextValue(packagingShipping) ? packagingShipping : undefined;
}

function asFaq(value: unknown): ProductFaqItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const question = asTrimmedString(record.question);
      const answer = asTrimmedString(record.answer);
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((item): item is { question: string; answer: string } => Boolean(item));
}

function asDetailSections(value: unknown): ProductDetailSection[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const title = asTrimmedString(record.title);
      const body = asTrimmedString(record.body);
      const image = asTrimmedString(record.image);
      const layout = asDetailSectionLayout(record.layout);
      if (!title && !body && !image) return null;
      return {
        enabled: record.enabled !== false,
        title,
        body,
        image,
        layout
      };
    })
    .filter(
      (
        item
      ): item is {
        enabled: boolean;
        title: string;
        body: string;
        image: string;
        layout: 'image-left' | 'image-right' | 'full-width';
      } => Boolean(item)
    );
}

function asDetailSectionLayout(value: unknown): 'image-left' | 'image-right' | 'full-width' {
  return value === 'image-right' || value === 'full-width' ? value : 'image-left';
}

function hasTextValue(value: Record<string, unknown>): boolean {
  return Object.entries(value).some(([key, item]) => {
    if (key === 'enabled') return false;
    if (typeof item === 'string') return item.length > 0;
    if (Array.isArray(item)) return item.length > 0;
    return Boolean(item);
  });
}
