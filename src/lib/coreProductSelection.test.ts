import { describe, expect, test } from 'vitest';
import type { Product } from './db';
import type { ClaimRecord } from './contentClaims';
import { selectVerifiedCoreProducts } from './coreProductSelection';

function product(id: string, category: string): Product {
  return {
    id,
    slug: `style-${id}`,
    name: `Style ${id}`,
    category,
    image: `/images/${id}.webp`,
    moq: 100,
    moqOptions: [100],
    stockType: 'Ready Stock',
    tags: [],
    sizes: [],
    colors: [],
    description: 'Reference style.',
    features: [],
    whatsappMessage: 'Hello'
  };
}

function evidence(productId: string, field: string): ClaimRecord {
  return {
    id: `${productId}-${field}`,
    subjectType: 'product',
    subjectId: productId,
    field,
    publicValue: `${field} verified`,
    status: 'verified',
    evidenceId: `evidence-${productId}-${field}`,
    verifiedAt: '2026-10-01',
    expiresAt: '2026-10-31'
  };
}

const requiredFields = ['stock', 'media', 'measurements', 'material', 'moq'];

describe('verified core product selection', () => {
  test('excludes products missing any required current evidence', () => {
    const incomplete = requiredFields.slice(0, -1).map((field) => evidence('p1', field));

    expect(
      selectVerifiedCoreProducts(
        [product('p1', 'Plus Size Dresses')],
        incomplete,
        new Date('2026-10-05T12:00:00Z')
      )
    ).toEqual([]);
  });

  test('applies category quotas and ranks eligible products by buyer interest', () => {
    const products = [
      product('p1', 'Plus Size Dresses'),
      product('p2', 'Plus Size Dresses'),
      product('p3', 'Two Piece Sets'),
      product('p4', 'Coordinated Styles')
    ];
    const claims = products.flatMap((item) =>
      requiredFields.map((field) => evidence(item.id, field))
    );

    expect(
      selectVerifiedCoreProducts(products, claims, new Date('2026-10-05T12:00:00Z'), {
        p1: 2,
        p2: 8,
        p3: 3,
        p4: 100
      }).map((item) => item.id)
    ).toEqual(['p2', 'p1', 'p3']);
  });
});
