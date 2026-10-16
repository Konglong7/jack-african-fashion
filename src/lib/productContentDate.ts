import { CONTENT_CLAIMS, getPublishableClaims, type ClaimRecord } from './contentClaims';

/** These visual-review records were added when the buyer-facing copy was edited.
 * General business verification dates are not page modification dates. */
export function getReviewedProductContentDate(
  productId: string,
  asOf = new Date(),
  claims: readonly ClaimRecord[] = CONTENT_CLAIMS
): Date | undefined {
  const dates = getPublishableClaims({ subjectType: 'product', subjectId: productId }, asOf, claims)
    .filter(
      (claim) =>
        ['description', 'features'].includes(claim.field) &&
        claim.evidenceId.startsWith('catalog-visual-review:')
    )
    .map((claim) => claim.verifiedAt)
    .filter((date) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
      const parsed = new Date(date);
      return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
    })
    .sort();
  return dates.length ? new Date(dates[dates.length - 1]) : undefined;
}
