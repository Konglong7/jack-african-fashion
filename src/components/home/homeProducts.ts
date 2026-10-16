import type { Product } from '@/lib/db';

const FEATURED_STYLE_CODES = ['0921026', '0921016', '0921023'] as const;
// The selected homepage styles changed on this UTC date.
export const HOMEPAGE_SELECTION_UPDATED_DATE = '2026-10-14';

export function pickHomepageProducts(products: Product[]) {
  const newestFirst = [...products].reverse();
  const featured = FEATURED_STYLE_CODES.map((code) =>
    products.find((product) => product.image?.match(/(\d{7})\./)?.[1] === code)
  ).filter((product): product is Product => product !== undefined);
  const picked = new Map<string, Product>();

  for (const product of [
    ...featured,
    ...newestFirst.filter((item) => item.isNew),
    ...newestFirst.filter((item) => item.isPopular),
    ...newestFirst
  ]) {
    if (picked.size >= 6) break;
    picked.set(product.id, product);
  }

  return [...picked.values()];
}
