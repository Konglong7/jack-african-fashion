import { describe, expect, it } from 'vitest';
import type { ClaimRecord } from './contentClaims';
import { getReviewedProductContentDate } from './productContentDate';

const asOf = new Date('2026-10-13T12:00:00Z');
const description: ClaimRecord = {
  id: 'reviewed-copy',
  subjectType: 'product',
  subjectId: 'style',
  field: 'description',
  publicValue: 'Reviewed buyer-facing description.',
  status: 'verified',
  evidenceId: 'catalog-visual-review:public/images/style.webp:sha256:example',
  verifiedAt: '2026-10-10'
};

describe('reviewed product content dates', () => {
  it('uses the latest published copy edit rather than the current clock', () => {
    const features = {
      ...description,
      id: 'features',
      field: 'features',
      verifiedAt: '2026-10-12'
    };
    expect(getReviewedProductContentDate('style', asOf, [description, features])).toEqual(
      new Date('2026-10-12')
    );
    expect(
      getReviewedProductContentDate('style', new Date('2026-11-01'), [description, features])
    ).toEqual(new Date('2026-10-12'));
  });

  it('ignores unrelated verification, unpublished copy and future edits', () => {
    const ignored: ClaimRecord[] = [
      { ...description, subjectId: 'other' },
      { ...description, field: 'stock', verifiedAt: '2026-10-13' },
      { ...description, evidenceId: 'owner-contact-confirmation' },
      { ...description, status: 'confirm_on_inquiry' },
      { ...description, verifiedAt: '2026-10-14' },
      { ...description, expiresAt: '2026-10-09' }
    ];
    expect(getReviewedProductContentDate('style', asOf, ignored)).toBeUndefined();
  });

  it('does not fabricate dates for unknown products or invalid date strings', () => {
    expect(getReviewedProductContentDate('missing', asOf, [description])).toBeUndefined();
    expect(
      getReviewedProductContentDate('style', asOf, [{ ...description, verifiedAt: '2026-02-30' }])
    ).toBeUndefined();
  });
});
