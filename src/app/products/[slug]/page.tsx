import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProducts, getProductBySlug } from '@/lib/db';
import { getSiteContent } from '@/lib/siteContent';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { ProductCard } from '@/components/ProductCard';
import { ProductGalleryClient } from '@/components/ProductGalleryClient';
import ProductJsonLd from './jsonLd';
import { ProductInfo } from './ProductInfo';
import { ProductDetailNav, ProductDetailSections } from './ProductDetailSections';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Product pages use ISR: rendered on first request, then cached and revalidated
// every 60 seconds so admin-added products appear quickly.
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: `${product.name} | Jack African Fashion Wholesale`,
    description: product.description.slice(0, 160),
    keywords: [
      product.name,
      product.category,
      ...product.tags,
      'wholesale',
      'African fashion',
      'Guangzhou'
    ].join(', '),
    openGraph: {
      title: `${product.name} | Jack African Fashion Wholesale`,
      description: product.description.slice(0, 160),
      images: product.images && product.images.length > 0 ? product.images : [product.image],
      url: `${baseUrl}/products/${product.slug}`,
      siteName: 'Jack African Fashion'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.image]
    },
    alternates: {
      canonical: `${baseUrl}/products/${product.slug}`
    }
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [all, siteContent] = await Promise.all([getProducts(), getSiteContent()]);
  const related = all
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      product: p,
      score:
        (p.category === product.category ? 4 : 0) +
        p.tags.filter((tag) => product.tags.includes(tag)).length
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product)
    .slice(0, 4);

  const whatsappLink = siteWhatsAppLink(siteContent, product.whatsappMessage);

  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <ProductJsonLd params={params} />

      {/* Breadcrumb */}
      <div className='bg-brand-cream border-brand-sand/60 border-b'>
        <div className='mx-auto max-w-7xl px-4 py-3'>
          <nav className='text-brand-brown/60 flex items-center gap-2 text-sm'>
            <Link href='/' className='hover:text-brand-orange transition-colors'>
              Home
            </Link>
            <span>/</span>
            <Link href='/catalog' className='hover:text-brand-orange transition-colors'>
              Catalog
            </Link>
            <span>/</span>
            <Link
              href={`/catalog?category=${encodeURIComponent(product.category)}`}
              className='hover:text-brand-orange transition-colors'
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className='text-brand-black truncate font-medium'>{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product detail */}
      <section className='bg-white pt-5 pb-24 sm:py-10'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.14fr)_minmax(360px,0.86fr)] lg:gap-10'>
            {/* Left: Images */}
            <div className='lg:sticky lg:top-24 lg:self-start'>
              <ProductGalleryClient
                images={
                  product.images && product.images.length > 0 ? product.images : [product.image]
                }
                productName={product.name}
                whatsappLink={whatsappLink}
              />
            </div>

            {/* Right: Info */}
            <ProductInfo product={product} siteContent={siteContent} />
          </div>
        </div>
      </section>

      <ProductDetailNav />
      <ProductDetailSections product={product} />

      {/* Related products */}
      {related.length > 0 && (
        <section id='similar-styles' className='bg-brand-cream scroll-mt-32 py-12 sm:py-16'>
          <div className='mx-auto max-w-7xl px-4'>
            <div className='mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <p className='text-brand-orange text-xs font-bold uppercase'>Similar Styles</p>
                <h2 className='font-display text-brand-black text-2xl font-bold sm:text-3xl'>
                  More styles for this buyer profile
                </h2>
              </div>
              <Link
                href={`/catalog?category=${encodeURIComponent(product.category)}`}
                className='text-brand-orange hover:text-brand-gold text-sm font-semibold'
              >
                View category
              </Link>
            </div>
            <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4'>
              {related.map((p) => (
                <ProductCard key={p.id} product={p} siteContent={siteContent} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
