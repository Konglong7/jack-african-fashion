import type { Product } from './db';
import { absoluteSiteUrl, getSiteOrigin, toAbsoluteImageUrl } from './siteUrl';

export function generateProductJsonLd(product: Product, configuredUrl?: string) {
  const baseUrl = getSiteOrigin(configuredUrl);
  const productUrl = absoluteSiteUrl(`/products/${product.slug}`, baseUrl);
  const sourceImages = product.images?.length ? product.images : [product.image];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        url: productUrl,
        sku: product.id,
        name: product.name,
        description: product.description,
        image: sourceImages.map((image) => toAbsoluteImageUrl(image, baseUrl)),
        brand: { '@id': `${baseUrl}/#organization` },
        category: product.category,
        audience: {
          '@type': 'BusinessAudience',
          audienceType: 'African boutiques, clothing wholesalers, importers and fashion retailers'
        },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'MOQ', value: `${product.moq} pcs` },
          { '@type': 'PropertyValue', name: 'Stock type', value: product.stockType },
          { '@type': 'PropertyValue', name: 'Sizes', value: product.sizes.join(', ') },
          {
            '@type': 'PropertyValue',
            name: 'Colors',
            value: product.colors.map((color) => color.name).join(', ')
          },
          {
            '@type': 'PropertyValue',
            name: 'Custom production',
            value: product.stockType.includes('Custom')
              ? 'Available by confirmed quantity'
              : 'Ask for feasibility'
          },
          { '@type': 'PropertyValue', name: 'Supplier location', value: 'Guangzhou, China' }
        ]
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
      }
    ]
  };
}
