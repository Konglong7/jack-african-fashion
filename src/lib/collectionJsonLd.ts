import { absoluteSiteUrl, getSiteOrigin } from './siteUrl';

interface CollectionInput {
  path: string;
  name: string;
  description: string;
  products: readonly { slug: string; name: string }[];
  breadcrumbs: readonly { name: string; path: string }[];
}

export function buildCollectionJsonLd(input: CollectionInput, configuredUrl?: string) {
  const origin = getSiteOrigin(configuredUrl);
  const url = absoluteSiteUrl(input.path, origin);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: input.name,
        description: input.description,
        about: { '@id': `${origin}/#organization` },
        isPartOf: { '@id': `${origin}/#website` },
        inLanguage: 'en',
        mainEntity: { '@id': `${url}#products` },
        breadcrumb: { '@id': `${url}#breadcrumb` }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: input.breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: absoluteSiteUrl(crumb.path, origin)
        }))
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#products`,
        numberOfItems: input.products.length,
        itemListElement: input.products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: product.name,
          url: absoluteSiteUrl(`/products/${product.slug}`, origin)
        }))
      }
    ]
  };
}
