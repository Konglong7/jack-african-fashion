import { getProductBySlug, type Product } from '@/lib/db';
import { SITE } from '@/lib/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function generateProductJsonLd(_product: Product, _baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: _product.name,
    description: _product.description,
    image: _product.images || [_product.image],
    brand: {
      '@type': 'Brand',
      name: SITE.name
    },
    category: _product.category,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: _product.stockType.includes('Ready')
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: SITE.name
      },
      eligibleRegion: {
        '@type': 'Place',
        name: 'Africa'
      }
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'MOQ',
        value: _product.moq
      }
    ]
  };
}

export default async function ProductJsonLd({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const jsonLd = generateProductJsonLd(product, baseUrl);

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
