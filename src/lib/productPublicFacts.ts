import type { ClaimRecord } from './contentClaims';
import { CONTENT_CLAIMS, getPublishableClaims } from './contentClaims';
import type { Product } from './db';

export interface PublicProductFacts {
  description: string;
  moq: string;
  stock: string;
  sizes: string;
  colors: string;
  features: string[];
  allowDetailedContent: boolean;
}

export type PublicProduct = Pick<
  Product,
  'id' | 'slug' | 'name' | 'category' | 'image' | 'images' | 'isNew' | 'isPopular'
> & {
  description: string;
  features: string[];
  whatsappMessage: string;
  detailPage?: Product['detailPage'];
};

const SAFE_FEATURES = [
  'Ask for current stock photos or video before ordering',
  'Confirm fabric, measurements, colors and MOQ for this style',
  'Confirm packing, cargo handover and wholesale quotation on WhatsApp'
];

export function getPublicProductFacts(
  product: Pick<Product, 'id' | 'name'>,
  asOf = new Date(),
  claims: readonly ClaimRecord[] = CONTENT_CLAIMS
): PublicProductFacts {
  const verified = new Map(
    getPublishableClaims({ subjectType: 'product', subjectId: product.id }, asOf, claims).map(
      (item) => [item.field, item.publicValue]
    )
  );

  return {
    description:
      verified.get('description') ||
      `Catalog reference for ${product.name}. Ask Jack Fashion on WhatsApp to confirm current stock, fabric, measurements, colors, MOQ and the wholesale quotation for this style.`,
    moq: verified.get('moq') || 'Confirm on WhatsApp',
    stock: verified.get('stock') || 'Confirm current batch',
    sizes: verified.get('sizes') || 'Confirm measurements and size run',
    colors: verified.get('colors') || 'Confirm current batch colors',
    features: parseFeatures(verified.get('features')),
    allowDetailedContent: verified.has('detailContent')
  };
}

export function toPublicProduct(
  product: Product,
  asOf = new Date(),
  claims: readonly ClaimRecord[] = CONTENT_CLAIMS
): PublicProduct {
  const facts = getPublicProductFacts(product, asOf, claims);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    image: product.image,
    images: product.images,
    isNew: product.isNew,
    isPopular: product.isPopular,
    description: facts.description,
    features: facts.features,
    whatsappMessage: `Hello Jack, I am interested in ${product.name}. Please confirm stock, MOQ, sizes, colors, material and the wholesale quotation.`,
    detailPage: facts.allowDetailedContent ? product.detailPage : undefined
  };
}

export function buildPublicProductKeywords(product: Pick<Product, 'name' | 'category'>): string {
  return [
    product.name,
    product.category,
    'womenswear wholesale',
    'wholesale clothing supplier',
    'Guangzhou'
  ].join(', ');
}

export function buildProductMetaDescription(description: string): string {
  const text = description.trim().replace(/\s+/g, ' ');
  const firstSentence = text.match(/^.+?[.!?](?=\s|$)/)?.[0];
  const summary = firstSentence && /\bwholesale\b/i.test(firstSentence) ? firstSentence : text;
  if (summary.length <= 160) return summary;
  const shortened = summary.slice(0, 159);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${(lastSpace > 0 ? shortened.slice(0, lastSpace) : shortened).trimEnd()}…`;
}

function parseFeatures(value?: string): string[] {
  if (!value) return SAFE_FEATURES;
  const features = value
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
  return features.length > 0 ? features : SAFE_FEATURES;
}
