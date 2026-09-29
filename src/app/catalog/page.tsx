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
  title: "Women's Clothing Wholesale Catalog | Guangzhou Supplier",
  description:
    "Browse Jack African Fashion's Guangzhou women's clothing wholesale catalog for African boutiques: dresses, plus sizes, two piece sets, ready stock and custom production."
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
            Guangzhou Women&apos;s Clothing Wholesale Catalog
          </h1>
          <p className='text-brand-cream/70 mx-auto mt-4 max-w-2xl'>
            Jack African Fashion supplies ready-stock and custom women&apos;s clothing for African
            boutiques, wholesalers and importers. Select a product to check MOQ, sizes, colors and
            current availability.
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
