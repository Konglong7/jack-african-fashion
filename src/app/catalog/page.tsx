import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts } from '@/lib/db';
import { getSiteContent } from '@/lib/siteContent';
import { ProductGridSkeleton } from '@/components/Skeleton';
import { CatalogClient } from './CatalogClient';

// Catalog uses ISR: cached and revalidated every 60 seconds so new products
// appear quickly without sacrificing performance.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Wholesale Catalog | Ready Stock & Custom African Fashion',
  description:
    'Browse Guangzhou wholesale women clothing catalog: plus size dresses, pleated sets, maxi gowns, and jumpsuits. Ready stock and custom factory production.'
};

// Catalog data is rendered server-side; URL filters stay in the client so this
// page remains eligible for ISR and edge caching.
export default async function CatalogPage() {
  const [products, siteContent] = await Promise.all([getProducts(), getSiteContent()]);
  const categories = Array.from(
    new Set([
      ...siteContent.categories.map((category) => category.name),
      ...products.map((p) => p.category)
    ])
  );
  return (
    <>
      <section className='bg-brand-black py-12 text-white sm:py-16'>
        <div className='mx-auto max-w-7xl px-4 text-center'>
          <span className='text-brand-gold text-sm font-semibold tracking-[0.2em] uppercase'>
            Wholesale Catalog
          </span>
          <h1 className='font-display mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl'>
            Browse Our Wholesale Collection
          </h1>
          <p className='text-brand-cream/70 mx-auto mt-4 max-w-2xl'>
            Ready stock and custom styles for African boutiques and importers. Click &ldquo;Ask for
            Price&quot; on any product to get a quote on WhatsApp.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <section className='bg-brand-cream py-10 sm:py-12'>
            <div className='mx-auto max-w-7xl px-4'>
              <ProductGridSkeleton count={8} />
            </div>
          </section>
        }
      >
        <CatalogClient
          products={products}
          siteContent={siteContent}
          categories={categories}
        />
      </Suspense>
    </>
  );
}
