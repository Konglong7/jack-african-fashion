import rawClaims from '../../data/content-claims.json';

export type VerificationStatus = 'verified' | 'confirm_on_inquiry' | 'blocked';
export type ClaimSubjectType = 'brand' | 'product' | 'market' | 'logistics' | 'customer_case';

export interface ClaimRecord {
  id: string;
  subjectType: ClaimSubjectType;
  subjectId: string;
  field: string;
  publicValue: string;
  status: VerificationStatus;
  evidenceId: string;
  verifiedAt: string;
  expiresAt?: string;
}

export interface ClaimSubject {
  subjectType: ClaimSubjectType;
  subjectId: string;
}

export const CONTENT_CLAIMS = rawClaims as ClaimRecord[];

export function getPublishableClaims(
  subject: ClaimSubject,
  asOf = new Date(),
  claims: readonly ClaimRecord[] = CONTENT_CLAIMS
): ClaimRecord[] {
  const date = isoDate(asOf);
  return claims.filter(
    (claim) =>
      claim.subjectType === subject.subjectType &&
      claim.subjectId === subject.subjectId &&
      claim.status === 'verified' &&
      claim.verifiedAt <= date &&
      (!claim.expiresAt || claim.expiresAt >= date)
  );
}

export function getConfirmationClaims(
  subject: ClaimSubject,
  claims: readonly ClaimRecord[] = CONTENT_CLAIMS
): ClaimRecord[] {
  return claims.filter(
    (claim) =>
      claim.subjectType === subject.subjectType &&
      (claim.subjectId === subject.subjectId || claim.subjectId === '*') &&
      claim.status === 'confirm_on_inquiry'
  );
}

function isoDate(value: Date): string {
  if (Number.isNaN(value.getTime())) throw new Error('Claim evaluation date must be valid');
  return value.toISOString().slice(0, 10);
}
