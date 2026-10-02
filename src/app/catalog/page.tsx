import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts } from '@/lib/db';
import { getSiteContent } from '@/lib/siteContent';
import { ProductGridSkeleton } from '@/components/Skeleton';
import { CatalogClient } from './CatalogClient';
import { pageMetadata } from '@/lib/pageMetadata';

// Catalog uses ISR: cached and revalidated every 60 seconds so new products
// appear quickly without sacrificing performance.
export const revalidate = 60;

export const metadata: Metadata = pageMetadata('/catalog',
  "Women's Clothing Wholesale Catalog",
  "Browse women's dresses, plus sizes, two piece sets and jumpsuits for African boutiques. Confirm current MOQ, sizes, stock and custom production with our Guangzhou team."
);

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
      <section className='bg-stone-950 py-12 text-white sm:py-16 border-b border-amber-500/20'>
        <div className='mx-auto max-w-7xl px-4 text-center'>
          <span className='inline-block rounded-full bg-amber-500/15 border border-amber-500/30 px-3.5 py-1 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-amber-400'>
            Wholesale Catalog · MOQ by Style
          </span>
          <h1 className='font-display mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl text-white'>
            Guangzhou Women&apos;s Clothing Wholesale Catalog
          </h1>
          <p className='text-stone-300 mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed'>
            Jack African Fashion supplies factory-direct women&apos;s clothing for African
            boutiques, wholesalers and importers. Check each style for its current MOQ, sizes and colors, then confirm stock and cargo dispatch on WhatsApp.
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
        <CatalogClient products={products} siteContent={siteContent} categories={categories} />
      </Suspense>
    </>
  );
}
