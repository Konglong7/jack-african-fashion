import { describe, expect, test } from 'vitest';
import { getPublishableClaims, type ClaimRecord } from './contentClaims';

const claims: ClaimRecord[] = [
  {
    id: 'brand-name',
    subjectType: 'brand',
    subjectId: 'jack-fashion',
    field: 'name',
    publicValue: 'Jack Fashion',
    status: 'verified',
    evidenceId: 'owner-confirmed-2026-10-05',
    verifiedAt: '2026-10-05',
    expiresAt: '2027-10-05'
  },
  {
    id: 'expired-location',
    subjectType: 'brand',
    subjectId: 'jack-fashion',
    field: 'location',
    publicValue: 'Old location',
    status: 'verified',
    evidenceId: 'old-card-2024',
    verifiedAt: '2024-01-01',
    expiresAt: '2025-01-01'
  },
  {
    id: 'product-stock',
    subjectType: 'product',
    subjectId: 'p-1',
    field: 'stock',
    publicValue: 'Ask for current stock',
    status: 'confirm_on_inquiry',
    evidenceId: 'live-stock-required',
    verifiedAt: '2026-10-05'
  },
  {
    id: 'blocked-review',
    subjectType: 'customer_case',
    subjectId: 'review-1',
    field: 'repeat_order',
    publicValue: 'High repeat order rate',
    status: 'blocked',
    evidenceId: 'no-permission',
    verifiedAt: '2026-10-05'
  }
];

describe('content claim publication rules', () => {
  test('publishes only current verified claims for the requested subject', () => {
    expect(
      getPublishableClaims(
        { subjectType: 'brand', subjectId: 'jack-fashion' },
        new Date('2026-10-05T12:00:00Z'),
        claims
      )
    ).toEqual([claims[0]]);
  });

  test('never publishes confirmation-only or blocked claims as facts', () => {
    expect(
      getPublishableClaims(
        { subjectType: 'product', subjectId: 'p-1' },
        new Date('2026-10-05T12:00:00Z'),
        claims
      )
    ).toEqual([]);
    expect(
      getPublishableClaims(
        { subjectType: 'customer_case', subjectId: 'review-1' },
        new Date('2026-10-05T12:00:00Z'),
        claims
      )
    ).toEqual([]);
  });

  test('treats the expiry date as inclusive through that UTC day', () => {
    expect(
      getPublishableClaims(
        { subjectType: 'brand', subjectId: 'jack-fashion' },
        new Date('2027-10-05T23:59:59Z'),
        claims
      )
    ).toHaveLength(1);
    expect(
      getPublishableClaims(
        { subjectType: 'brand', subjectId: 'jack-fashion' },
        new Date('2027-10-06T00:00:00Z'),
        claims
      )
    ).toEqual([]);
  });
});
