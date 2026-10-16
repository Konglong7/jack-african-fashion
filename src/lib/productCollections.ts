import type { Product } from './db';

export function relatedProducts(product: Product, all: Product[]) {
  return all
    .filter((item) => item.id !== product.id)
    .map((item) => ({
      product: item,
      score:
        (item.category === product.category ? 4 : 0) +
        item.tags.filter((tag) => product.tags.includes(tag)).length
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.product);
}
