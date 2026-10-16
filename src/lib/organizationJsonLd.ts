import { BRAND_ENTITY } from './aioContent';
import { CONTENT_CLAIMS, getPublishableClaims, type ClaimRecord } from './contentClaims';
import {
  getSiteLocations,
  getWhatsAppContacts,
  isConfiguredSocialLink,
  type SiteContent
} from './siteContentTypes';

const BRAND_SUBJECT = { subjectType: 'brand' as const, subjectId: 'jack-fashion' };

export function getLegacyBrandName(asOf = new Date()): string | undefined {
  return getPublishableClaims(BRAND_SUBJECT, asOf).find((claim) => claim.field === 'legacyName')
    ?.publicValue;
}

export function buildOrganizationJsonLd(
  siteContent: SiteContent,
  baseUrl: string,
  asOf = new Date(),
  records: readonly ClaimRecord[] = CONTENT_CLAIMS
) {
  const claims = getPublishableClaims(BRAND_SUBJECT, asOf, records);
  const claimValue = (field: string) => claims.find((claim) => claim.field === field)?.publicValue;
  const legacyName = claimValue('legacyName');
  const verifiedLocations = new Set(
    claims
      .filter((claim) => claim.field === 'location' || claim.field === 'showroomLocation')
      .map((claim) => claim.publicValue)
  );
  const verifiedWhatsApps = new Set(
    claims.filter((claim) => claim.field === 'whatsapp').map((claim) => claim.publicValue)
  );
  const verifiedProfiles = new Set(
    claims.filter((claim) => claim.field === 'socialProfile').map((claim) => claim.publicValue)
  );
  const socialProfiles = Object.values(siteContent.socialLinks).filter(
    (url) => isConfiguredSocialLink(url) && verifiedProfiles.has(url)
  );
  const address: Record<string, unknown> = {};
  const addresses = getSiteLocations(siteContent)
    .filter((location) => verifiedLocations.has(location.address))
    .map((location) => ({
      '@type': 'PostalAddress',
      streetAddress: location.address,
      addressLocality: 'Guangzhou',
      addressRegion: 'Guangdong',
      addressCountry: 'CN'
    }));
  if (addresses.length) {
    address.address = addresses.length === 1 ? addresses[0] : addresses;
  }
  const contact: Record<string, unknown> = {};
  const contactPoints = getWhatsAppContacts(siteContent)
    .filter((item) => verifiedWhatsApps.has(item.display))
    .map((item) => ({
      '@type': 'ContactPoint',
      telephone: item.display,
      url: item.link,
      contactType: 'sales',
      areaServed: 'Worldwide',
      availableLanguage: ['en']
    }));
  if (contactPoints.length) {
    contact.contactPoint = contactPoints.length === 1 ? contactPoints[0] : contactPoints;
  }

  const organization: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: claimValue('name') || BRAND_ENTITY.name,
    logo: `${baseUrl}/images/site/jack-fashion-logo-512.png`,
    url: claimValue('officialWebsite') || baseUrl,
    description: BRAND_ENTITY.identityStatement,
    ...address,
    ...contact,
    ...(legacyName ? { alternateName: [legacyName] } : {}),
    ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
    knowsAbout: BRAND_ENTITY.products
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: BRAND_ENTITY.name,
        description: BRAND_ENTITY.identityStatement,
        publisher: { '@id': `${baseUrl}/#organization` },
        inLanguage: 'en'
      }
    ]
  };
}
