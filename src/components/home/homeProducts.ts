import type { Product } from '@/lib/db';

export function pickHomepageProducts(products: Product[]) {
  const newestFirst = [...products].reverse();
  const picked = new Map<string, Product>();

  for (const product of [
    ...newestFirst.filter((item) => item.isNew),
    ...newestFirst.filter((item) => item.isPopular),
    ...newestFirst
  ]) {
    if (picked.size >= 12) break;
    picked.set(product.id, product);
  }

  return [...picked.values()];
}
