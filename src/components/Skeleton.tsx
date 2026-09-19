'use client';

/**
 * Skeleton loader for product cards.
 * Shows a placeholder animation while the actual product data is loading.
 * Improves perceived performance and reduces layout shift.
 */

export function ProductCardSkeleton() {
  return (
    <div className='overflow-hidden rounded-xl bg-white shadow-sm'>
      {/* Image skeleton */}
      <div className='bg-brand-sand/30 relative aspect-[3/4] animate-pulse'>
        <div className='absolute inset-0 bg-gradient-to-br from-brand-sand/50 to-brand-sand/20' />
      </div>

      {/* Content skeleton */}
      <div className='p-4'>
        {/* Title */}
        <div className='bg-brand-sand/40 mb-1.5 h-5 w-3/4 rounded animate-pulse' />

        {/* Category */}
        <div className='bg-brand-sand/30 mb-2 h-3 w-1/2 rounded animate-pulse' />

        {/* MOQ */}
        <div className='mb-3 flex items-center gap-1.5'>
          <div className='bg-brand-sand/30 h-3 w-8 rounded animate-pulse' />
          <div className='bg-brand-sand/40 h-3 w-12 rounded animate-pulse' />
        </div>

        {/* Tags */}
        <div className='mb-3 flex gap-1'>
          <div className='bg-brand-sand/30 h-4 w-14 rounded-full animate-pulse' />
          <div className='bg-brand-sand/30 h-4 w-10 rounded-full animate-pulse' />
        </div>

        {/* CTA button */}
        <div className='bg-brand-sand/40 h-9 w-full rounded-lg animate-pulse' />
      </div>
    </div>
  );
}

/**
 * Grid of skeleton cards for catalog page loading state.
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for the hero section.
 */
export function HeroSkeleton() {
  return (
    <section className='relative flex min-h-[80vh] items-center overflow-hidden sm:min-h-[90vh]'>
      <div className='from-brand-brown via-brand-black to-brand-wine absolute inset-0 bg-gradient-to-br animate-pulse' />
      <div className='relative z-10 mx-auto max-w-7xl px-4 py-20 sm:py-24'>
        <div className='max-w-3xl'>
          <div className='bg-brand-sand/20 mb-6 h-4 w-48 rounded animate-pulse' />
          <div className='bg-brand-sand/30 mb-6 h-12 w-full rounded animate-pulse sm:h-14 lg:h-16' />
          <div className='bg-brand-sand/20 mb-8 h-6 w-3/4 rounded animate-pulse sm:h-7' />
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='bg-brand-sand/30 h-12 w-40 rounded-full animate-pulse' />
            <div className='bg-brand-sand/20 h-12 w-48 rounded-full animate-pulse' />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Skeleton for category cards.
 */
export function CategoryCardSkeleton() {
  return (
    <div className='group relative overflow-hidden rounded-xl bg-white shadow-sm'>
      <div className='bg-brand-sand/30 relative aspect-[4/3] animate-pulse'>
        <div className='absolute inset-0 bg-gradient-to-br from-brand-sand/50 to-brand-sand/20' />
      </div>
      <div className='p-5'>
        <div className='bg-brand-sand/40 mb-1.5 h-6 w-3/4 rounded animate-pulse' />
        <div className='bg-brand-sand/30 mb-4 h-4 w-full rounded animate-pulse' />
        <div className='bg-brand-sand/20 h-4 w-20 rounded animate-pulse' />
      </div>
    </div>
  );
}

/**
 * Grid of category skeleton cards.
 */
export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for WhyChooseUs section.
 */
export function WhyChooseUsSkeleton() {
  return (
    <section className='bg-brand-cream py-16 sm:py-20'>
      <div className='mx-auto max-w-7xl px-4'>
        <div className='mb-12 text-center'>
          <div className='bg-brand-sand/30 mb-3 h-4 w-32 rounded animate-pulse' />
          <div className='bg-brand-sand/40 mb-3 h-8 w-64 rounded animate-pulse' />
        </div>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='rounded-xl bg-white p-6 text-center shadow-sm'>
              <div className='bg-brand-sand/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full animate-pulse' />
              <div className='bg-brand-sand/40 mb-2 h-5 w-3/4 rounded animate-pulse' />
              <div className='bg-brand-sand/30 h-4 w-full rounded animate-pulse' />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Skeleton for CustomOrderProcess section.
 */
export function CustomOrderProcessSkeleton() {
  return (
    <section className='bg-brand-black text-brand-cream py-16 sm:py-20'>
      <div className='mx-auto max-w-7xl px-4'>
        <div className='mb-12 text-center'>
          <div className='bg-brand-sand/20 mb-3 h-4 w-32 rounded animate-pulse' />
          <div className='bg-brand-sand/30 mb-3 h-8 w-64 rounded animate-pulse' />
          <div className='bg-brand-sand/20 h-4 w-96 rounded animate-pulse' />
        </div>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='h-full rounded-xl border border-white/10 bg-white/5 p-6'>
              <div className='bg-brand-sand/20 mb-3 h-10 w-10 rounded animate-pulse' />
              <div className='bg-brand-sand/30 mb-2 h-5 w-3/4 rounded animate-pulse' />
              <div className='bg-brand-sand/20 h-4 w-full rounded animate-pulse' />
            </div>
          ))}
        </div>
        <div className='mt-12 text-center'>
          <div className='bg-brand-sand/20 mb-6 inline-block h-12 w-64 rounded-xl animate-pulse' />
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <div className='bg-brand-sand/30 h-12 w-40 rounded-full animate-pulse' />
            <div className='bg-brand-sand/20 h-12 w-48 rounded-full animate-pulse' />
          </div>
        </div>
      </div>
    </section>
  );
}