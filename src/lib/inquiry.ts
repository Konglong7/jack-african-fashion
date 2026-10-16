import type { Product } from './db';
import { absoluteSiteUrl } from './siteUrl';

export interface InquiryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}

export const INQUIRY_STORAGE_KEY = 'jack-african-fashion-inquiry';
export const INQUIRY_UPDATED_EVENT = 'inquiry:updated';

export function productToInquiryItem(product: Product): InquiryItem {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.image,
    quantity: 1
  };
}

export function mergeInquiryItems(items: InquiryItem[], item: InquiryItem): InquiryItem[] {
  const next = items.filter((current) => current.id !== item.id);
  return [{ ...item, quantity: normalizeQuantity(item.quantity) }, ...next];
}

/** Remove legacy catalog MOQ values while preserving the buyer's requested quantity. */
export function normalizeInquiryItems(items: Array<InquiryItem & { moq?: unknown }>): InquiryItem[] {
  return items.map(({ moq: _legacyMoq, ...item }) => ({
    ...item,
    quantity: normalizeQuantity(item.quantity)
  }));
}

export function getInquiryItemCount(storage: Pick<Storage, 'getItem'>): number {
  try {
    const parsed = JSON.parse(storage.getItem(INQUIRY_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export function notifyInquiryUpdated(target: { dispatchEvent(event: Event): boolean }) {
  target.dispatchEvent(new Event(INQUIRY_UPDATED_EVENT));
}

export function buildInquiryMessage(items: InquiryItem[]): string {
  const lines = items.map((item, index) =>
    [
      `${index + 1}. ${item.name}`,
      `Style No: ${item.slug}`,
      `Link: ${absoluteSiteUrl(`/products/${item.slug}`)}`,
      `Color: ${item.color || 'To confirm'}`,
      `Size: ${item.size || 'To confirm'}`,
      `Requested quantity: ${normalizeQuantity(item.quantity)} pcs (subject to MOQ confirmation)`
    ].join('\n')
  );

  return [
    'Hello Jack, I am interested in these wholesale styles:',
    '',
    ...lines.flatMap((line) => [line, '']),
    'Please send me the wholesale price and more details.'
  ].join('\n');
}

function normalizeQuantity(value: number): number {
  return Number.isFinite(value) && value > 0 ? Math.round(value) : 1;
}
