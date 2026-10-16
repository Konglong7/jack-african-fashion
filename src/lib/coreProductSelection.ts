import type { ClaimRecord } from './contentClaims';
import { getPublishableClaims } from './contentClaims';
import type { Product } from './db';

const REQUIRED_CORE_FIELDS = ['stock', 'media', 'measurements', 'material', 'moq'] as const;
const CATEGORY_QUOTAS: Array<[string, number]> = [
  ['Plus Size Dresses', 8],
  ['Two Piece Sets', 6],
  ['Maxi Dresses', 6],
  ['Jumpsuits', 4]
];

export function selectVerifiedCoreProducts(
  products: readonly Product[],
  claims: readonly ClaimRecord[],
  asOf = new Date(),
  buyerInterest: Readonly<Record<string, number>> = {}
): Product[] {
  const eligible = products.filter((product) => {
    const fields = new Set(
      getPublishableClaims(
        { subjectType: 'product', subjectId: product.id },
        asOf,
        claims
      ).map((claim) => claim.field)
    );
    return REQUIRED_CORE_FIELDS.every((field) => fields.has(field));
  });

  return CATEGORY_QUOTAS.flatMap(([category, quota]) =>
    eligible
      .filter((product) => product.category === category)
      .sort(
        (a, b) =>
          (buyerInterest[b.id] || 0) - (buyerInterest[a.id] || 0) ||
          a.id.localeCompare(b.id, undefined, { numeric: true })
      )
      .slice(0, quota)
  );
}
