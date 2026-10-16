import type { Product } from './db';

// The market pages changed their rendered shortlists and sourcing links on this date.
export const MARKET_PAGE_UPDATED_DATE = '2026-10-13';

export function selectMarketProducts(
  products: readonly Product[],
  categories: readonly string[],
  limit = 6
): Product[] {
  if (!Number.isInteger(limit) || limit <= 0) return [];
  const groups = [...new Set(categories)].map((category) =>
    products.filter((product) => product.category === category).reverse()
  );
  const selected: Product[] = [];
  const seen = new Set<string>();
  const maxDepth = Math.max(0, ...groups.map((group) => group.length));

  for (let depth = 0; depth < maxDepth && selected.length < limit; depth += 1) {
    for (const group of groups) {
      const product = group[depth];
      if (product && !seen.has(product.id)) {
        selected.push(product);
        seen.add(product.id);
      }
      if (selected.length === limit) break;
    }
  }
  return selected;
}
