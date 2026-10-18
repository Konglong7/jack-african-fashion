import { describe, expect, test } from 'vitest';
import { DEFAULT_SITE_CONTENT } from './siteContentTypes';
import { buildOrganizationJsonLd, getLegacyBrandName } from './organizationJsonLd';
import type { ClaimRecord } from './contentClaims';

describe('organization JSON-LD brand identity', () => {
  test('emits only currently verified showroom addresses, retaining the historical single address', () => {
    const current = buildOrganizationJsonLd(
      DEFAULT_SITE_CONTENT,
      'https://zamique.com',
      new Date('2026-10-12T12:00:00Z')
    )['@graph'][0];
    expect(current.address).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ streetAddress: DEFAULT_SITE_CONTENT.location }),
        expect.objectContaining({ streetAddress: 'Shop 0081, LIUHUA Market, Guangzhou, China' })
      ])
    );
    const historical = buildOrganizationJsonLd(
      DEFAULT_SITE_CONTENT,
      'https://zamique.com',
      new Date('2026-10-11T12:00:00Z')
    )['@graph'][0];
    expect(historical.address).toEqual(
      expect.objectContaining({ streetAddress: DEFAULT_SITE_CONTENT.location })
    );
  });
  test('uses Jack Fashion as the primary name and keeps only the time-bounded legacy alias', () => {
    const jsonLd = buildOrganizationJsonLd(
      DEFAULT_SITE_CONTENT,
      'https://zamique.com',
      new Date('2027-10-05T12:00:00Z')
    );
    const organization = jsonLd['@graph'][0] as Record<string, unknown>;

    expect(organization.name).toBe('Jack Fashion');
    expect(organization.alternateName).toEqual(['Jack African Fashion']);
    expect(organization.alternateName).not.toContain('Zamique');
    expect(getLegacyBrandName(new Date('2027-10-05T23:59:59Z'))).toBe('Jack African Fashion');
  });

  test('removes the legacy alias after the approved transition date', () => {
    const jsonLd = buildOrganizationJsonLd(
      DEFAULT_SITE_CONTENT,
      'https://zamique.com',
      new Date('2027-10-06T00:00:00Z')
    );
    const organization = jsonLd['@graph'][0] as Record<string, unknown>;

    expect(organization).not.toHaveProperty('alternateName');
    expect(getLegacyBrandName(new Date('2027-10-06T00:00:00Z'))).toBeUndefined();
  });

  test('omits unverified profiles and keeps WhatsApp as a contact point', () => {
    const jsonLd = buildOrganizationJsonLd(
      {
        ...DEFAULT_SITE_CONTENT,
        socialLinks: {
          facebook: 'https://www.facebook.com/',
          tiktok: 'https://www.tiktok.com/jackfashion',
          instagram: 'https://www.instagram.com/'
        }
      },
      'https://zamique.com',
      new Date('2026-10-12T12:00:00Z')
    );
    const organization = jsonLd['@graph'][0] as Record<string, unknown>;

    expect(organization).not.toHaveProperty('sameAs');
    expect(organization.contactPoint).toEqual(
      expect.objectContaining({
        telephone: '+86 189 2625 7367',
        url: 'https://wa.me/message/3N5VOJCFAQIGO1'
      })
    );
  });

  test('requires a current verified claim for a configured social profile', () => {
    const profile = 'https://www.tiktok.com/jackfashion';
    const site = {
      ...DEFAULT_SITE_CONTENT,
      socialLinks: { ...DEFAULT_SITE_CONTENT.socialLinks, tiktok: profile }
    };
    const claim = {
      id: 'social-profile',
      subjectType: 'brand' as const,
      subjectId: 'jack-fashion',
      field: 'socialProfile',
      publicValue: profile,
      status: 'verified' as const,
      evidenceId: 'profile-ownership',
      verifiedAt: '2026-10-01',
      expiresAt: '2026-10-10'
    };
    const build = (asOf: string, status: ClaimRecord['status'] = claim.status) =>
      buildOrganizationJsonLd(site, 'https://zamique.com', new Date(asOf), [{ ...claim, status }])[
        '@graph'
      ][0];
    expect(build('2026-10-09')).toHaveProperty('sameAs', [profile]);
    expect(build('2026-10-11')).not.toHaveProperty('sameAs');
    expect(build('2026-09-30')).not.toHaveProperty('sameAs');
    expect(build('2026-10-09', 'blocked')).not.toHaveProperty('sameAs');
    expect(build('2026-10-09', 'confirm_on_inquiry')).not.toHaveProperty('sameAs');
    expect(
      buildOrganizationJsonLd(DEFAULT_SITE_CONTENT, 'https://zamique.com', new Date('2026-10-09'), [
        claim
      ])['@graph'][0]
    ).not.toHaveProperty('sameAs');
  });
});
