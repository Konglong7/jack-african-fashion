'use client';

/**
 * Skeleton loader for product cards.
 * Shows a placeholder animation while the actual product data is loading.
 * Improves perceived performance and reduces layout shift.
 */

export function ProductCardSkeleton() {
  return (
    <div className='overflow-hidden bg-white'>
      {/* Image skeleton */}
      <div className='bg-stone-100 relative aspect-[3/4] animate-pulse rounded-xl'>
        <div className='from-stone-200/50 to-stone-100 absolute inset-0 bg-gradient-to-br rounded-xl' />
      </div>

      {/* Content skeleton */}
      <div className='pt-3 pb-1'>
        {/* Category */}
        <div className='bg-stone-200/70 mb-2 h-3 w-1/4 animate-pulse rounded' />

        {/* Title */}
        <div className='bg-stone-200/90 mb-1.5 h-4 w-5/6 animate-pulse rounded' />
        <div className='bg-stone-200/70 mb-2 h-4 w-1/2 animate-pulse rounded' />

        {/* MOQ & status row */}
        <div className='mb-3 flex items-center gap-2'>
          <div className='bg-stone-200/80 h-3 w-16 animate-pulse rounded' />
          <div className='bg-stone-200/60 h-3 w-20 animate-pulse rounded' />
        </div>

        {/* CTA side-by-side buttons */}
        <div className='grid grid-cols-2 gap-2 pt-1'>
          <div className='bg-emerald-100/60 h-10 w-full animate-pulse rounded-lg' />
          <div className='bg-stone-200/60 h-10 w-full animate-pulse rounded-lg' />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of skeleton cards for catalog page loading state.
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6 lg:gap-8'>
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
      <div className='from-brand-brown via-brand-black to-brand-wine absolute inset-0 animate-pulse bg-gradient-to-br' />
      <div className='relative z-10 mx-auto max-w-7xl px-4 py-20 sm:py-24'>
        <div className='max-w-3xl'>
          <div className='bg-brand-sand/20 mb-6 h-4 w-48 animate-pulse rounded' />
          <div className='bg-brand-sand/30 mb-6 h-12 w-full animate-pulse rounded sm:h-14 lg:h-16' />
          <div className='bg-brand-sand/20 mb-8 h-6 w-3/4 animate-pulse rounded sm:h-7' />
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='bg-brand-sand/30 h-12 w-40 animate-pulse rounded-full' />
            <div className='bg-brand-sand/20 h-12 w-48 animate-pulse rounded-full' />
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
        <div className='from-brand-sand/50 to-brand-sand/20 absolute inset-0 bg-gradient-to-br' />
      </div>
      <div className='p-5'>
        <div className='bg-brand-sand/40 mb-1.5 h-6 w-3/4 animate-pulse rounded' />
        <div className='bg-brand-sand/30 mb-4 h-4 w-full animate-pulse rounded' />
        <div className='bg-brand-sand/20 h-4 w-20 animate-pulse rounded' />
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
          <div className='bg-brand-sand/30 mb-3 h-4 w-32 animate-pulse rounded' />
          <div className='bg-brand-sand/40 mb-3 h-8 w-64 animate-pulse rounded' />
        </div>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='rounded-xl bg-white p-6 text-center shadow-sm'>
              <div className='bg-brand-sand/30 mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full' />
              <div className='bg-brand-sand/40 mb-2 h-5 w-3/4 animate-pulse rounded' />
              <div className='bg-brand-sand/30 h-4 w-full animate-pulse rounded' />
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
          <div className='bg-brand-sand/20 mb-3 h-4 w-32 animate-pulse rounded' />
          <div className='bg-brand-sand/30 mb-3 h-8 w-64 animate-pulse rounded' />
          <div className='bg-brand-sand/20 h-4 w-96 animate-pulse rounded' />
        </div>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='h-full rounded-xl border border-white/10 bg-white/5 p-6'>
              <div className='bg-brand-sand/20 mb-3 h-10 w-10 animate-pulse rounded' />
              <div className='bg-brand-sand/30 mb-2 h-5 w-3/4 animate-pulse rounded' />
              <div className='bg-brand-sand/20 h-4 w-full animate-pulse rounded' />
            </div>
          ))}
        </div>
        <div className='mt-12 text-center'>
          <div className='bg-brand-sand/20 mb-6 inline-block h-12 w-64 animate-pulse rounded-xl' />
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <div className='bg-brand-sand/30 h-12 w-40 animate-pulse rounded-full' />
            <div className='bg-brand-sand/20 h-12 w-48 animate-pulse rounded-full' />
          </div>
        </div>
      </div>
    </section>
  );
}
