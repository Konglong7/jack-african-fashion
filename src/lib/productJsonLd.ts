import type { Product } from './db';
import { absoluteSiteUrl, getSiteOrigin, toAbsoluteImageUrl } from './siteUrl';
import {
  CONTENT_CLAIMS,
  getConfirmationClaims,
  getPublishableClaims,
  type ClaimRecord
} from './contentClaims';
import { getPublicProductFacts } from './productPublicFacts';
import { getPublicProductFaq } from './productFaq';
import { buildFaqJsonLd } from './faqJsonLd';

const CLAIM_LABELS: Record<string, string> = {
  moq: 'MOQ',
  stock: 'Availability',
  material: 'Material',
  sizes: 'Verified sizes',
  colors: 'Verified colors',
  production: 'Production method'
};

export function generateProductJsonLd(
  product: Product,
  configuredUrl?: string,
  asOf = new Date(),
  claims: readonly ClaimRecord[] = CONTENT_CLAIMS
) {
  const baseUrl = getSiteOrigin(configuredUrl);
  const productUrl = absoluteSiteUrl(`/products/${product.slug}`, baseUrl);
  const sourceImages = product.images?.length ? product.images : [product.image];
  const subject = { subjectType: 'product' as const, subjectId: product.id };
  const publishableClaims = getPublishableClaims(subject, asOf, claims);
  const confirmationClaims = getConfirmationClaims(subject, claims);
  const publicFacts = getPublicProductFacts(product, asOf, claims);
  const additionalProperty = [...publishableClaims, ...confirmationClaims].map((claim) => ({
    '@type': 'PropertyValue',
    name: CLAIM_LABELS[claim.field] || claim.field,
    value: claim.publicValue
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        url: productUrl,
        sku: product.image.match(/(\d{7})\./)?.[1] || product.id,
        name: product.name,
        description: publicFacts.description,
        image: sourceImages.map((image) => toAbsoluteImageUrl(image, baseUrl)),
        brand: { '@id': `${baseUrl}/#organization` },
        category: product.category,
        audience: {
          '@type': 'BusinessAudience',
          audienceType: 'Boutiques, clothing wholesalers, importers and fashion retailers worldwide'
        },
        ...(additionalProperty.length ? { additionalProperty } : {})
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Catalog',
            item: absoluteSiteUrl('/catalog', baseUrl)
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.category,
            item: absoluteSiteUrl(
              `/catalog?category=${encodeURIComponent(product.category)}`,
              baseUrl
            )
          },
          { '@type': 'ListItem', position: 4, name: product.name, item: productUrl }
        ]
      },
      buildFaqJsonLd(productUrl, getPublicProductFaq(product, publicFacts.allowDetailedContent))
    ]
  };
}
