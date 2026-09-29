import { getProductBySlug } from '@/lib/db';
import { generateProductJsonLd } from '@/lib/productJsonLd';
import { getSiteOrigin } from '@/lib/siteUrl';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductJsonLd({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return null;

  const jsonLd = generateProductJsonLd(product, getSiteOrigin());

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
