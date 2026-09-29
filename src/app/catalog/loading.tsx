import { ProductGridSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <section className='bg-brand-cream py-10 sm:py-12'>
      <div className='mx-auto max-w-7xl px-4'>
        {/* Search & sort bar skeleton */}
        <div className='mb-8 flex flex-col gap-4 sm:flex-row'>
          <div className='bg-brand-sand/30 h-12 flex-1 animate-pulse rounded-full' />
          <div className='bg-brand-sand/30 h-12 w-40 animate-pulse rounded-full' />
        </div>

        {/* Filters skeleton */}
        <div className='mb-8 space-y-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <div className='bg-brand-sand/30 h-7 w-20 animate-pulse rounded-full' />
            <div className='bg-brand-sand/30 h-7 w-16 animate-pulse rounded-full' />
            <div className='bg-brand-sand/30 h-7 w-24 animate-pulse rounded-full' />
            <div className='bg-brand-sand/30 h-7 w-20 animate-pulse rounded-full' />
          </div>
        </div>

        {/* Count skeleton */}
        <div className='bg-brand-sand/30 mb-6 h-4 w-24 animate-pulse rounded' />

        <ProductGridSkeleton count={8} />
      </div>
    </section>
  );
}
