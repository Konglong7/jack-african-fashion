import { HeroSkeleton } from '@/components/Skeleton';
import { ProductGridSkeleton } from '@/components/Skeleton';
import { CategoryGridSkeleton } from '@/components/Skeleton';
import { WhyChooseUsSkeleton } from '@/components/Skeleton';
import { CustomOrderProcessSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className='bg-brand-cream flex min-h-screen flex-col'>
      {/* Hero skeleton */}
      <HeroSkeleton />

      {/* Categories skeleton */}
      <section className='bg-brand-cream py-16 sm:py-20'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-12 text-center'>
            <div className='bg-brand-sand/30 mb-3 h-4 w-32 rounded animate-pulse' />
            <div className='bg-brand-sand/40 mb-3 h-8 w-64 rounded animate-pulse' />
            <div className='bg-brand-sand/30 h-4 w-96 rounded animate-pulse' />
          </div>
          <CategoryGridSkeleton />
        </div>
      </section>

      {/* Popular Products skeleton */}
      <section className='bg-white py-16 sm:py-20'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-10'>
            <div className='bg-brand-sand/30 mb-3 h-4 w-32 rounded animate-pulse' />
            <div className='bg-brand-sand/40 mb-3 h-8 w-64 rounded animate-pulse' />
            <div className='bg-brand-sand/30 h-4 w-96 rounded animate-pulse' />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </section>

      {/* Why Choose Us skeleton */}
      <WhyChooseUsSkeleton />

      {/* Custom Order Process skeleton */}
      <CustomOrderProcessSkeleton />

      {/* Footer skeleton */}
      <footer className='bg-brand-black text-brand-cream mt-20'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:py-16'>
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5'>{Array.from({ length: 5 }).map((_, i) => <div key={i} className='bg-brand-sand/30 h-40 rounded-lg animate-pulse' />)}</div>
          <div className='border-brand-sand/20 mt-12 border-t pt-8'>
            <div className='bg-brand-sand/30 h-5 w-32 rounded animate-pulse' />
          </div>
        </div>
      </footer>
    </div>
  );
}
