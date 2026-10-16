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
import { getSiteOrigin, absoluteSiteUrl, toAbsoluteImageUrl } from '@/lib/siteUrl';
import { pageMetadata } from '@/lib/pageMetadata';
import { relatedProducts } from '@/lib/productCollections';
import {
  buildPublicProductKeywords,
  buildProductMetaDescription,
  getPublicProductFacts,
  toPublicProduct
} from '@/lib/productPublicFacts';

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
  if (!product) notFound();

  const baseUrl = getSiteOrigin();
  const publicFacts = getPublicProductFacts(product);
  const description = buildProductMetaDescription(publicFacts.description);

  return {
    ...pageMetadata(`/products/${product.slug}`, `${product.name} Wholesale`, description),
    keywords: buildPublicProductKeywords(product),
    openGraph: {
      title: `${product.name} Wholesale | Jack Fashion Guangzhou`,
      description,
      images: (product.images && product.images.length > 0 ? product.images : [product.image]).map(
        (image) => toAbsoluteImageUrl(image)
      ),
      url: `${baseUrl}/products/${product.slug}`,
      siteName: 'Jack Fashion'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: [toAbsoluteImageUrl(product.image)]
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
  const publicProduct = toPublicProduct(product);
  const related = relatedProducts(product, all).map((item) => toPublicProduct(item));

  const productUrl = absoluteSiteUrl(`/products/${product.slug}`);
  const galleryWhatsAppMessage = `${publicProduct.whatsappMessage} (${productUrl})`;
  const whatsappLink = siteWhatsAppLink(siteContent, galleryWhatsAppMessage);

  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <ProductJsonLd params={params} />

      {/* Breadcrumb */}
      <div className='bg-brand-cream border-brand-sand/60 border-b'>
        <div className='mx-auto max-w-7xl px-4 py-3'>
          <nav
            aria-label='Breadcrumb'
            className='text-brand-brown/60 flex min-w-0 items-center gap-2 text-xs sm:text-sm'
          >
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
                  publicProduct.images && publicProduct.images.length > 0
                    ? publicProduct.images
                    : [publicProduct.image]
                }
                productName={publicProduct.name}
                productId={publicProduct.id}
                whatsappLink={whatsappLink}
              />
            </div>

            {/* Right: Info */}
            <ProductInfo product={publicProduct} siteContent={siteContent} />
          </div>
        </div>
      </section>

      <ProductDetailNav />
      <ProductDetailSections product={publicProduct} />

      {/* Related products */}
      {related.length > 0 && (
        <section id='similar-styles' className='bg-brand-cream scroll-mt-32 py-12 sm:py-16'>
          <div className='mx-auto max-w-7xl px-3 sm:px-6 lg:px-8'>
            <div className='mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <p className='text-brand-orange text-xs font-bold uppercase'>Similar Styles</p>
                <h2 className='font-display text-brand-black text-2xl font-bold sm:text-3xl'>
                  More styles for this buyer profile
                </h2>
                <p className='text-brand-brown/70 mt-3 max-w-2xl text-sm leading-6'>
                  Compare related styles by finished measurements, fabric and the size-color mix
                  your customers need. Ask for MOQ and a separate wholesale quotation for each
                  product you select.
                </p>
              </div>
              <Link
                href={`/catalog?category=${encodeURIComponent(product.category)}`}
                className='text-brand-orange hover:text-brand-gold text-sm font-semibold'
              >
                View category
              </Link>
            </div>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4'>
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
