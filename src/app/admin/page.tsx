import { getProducts } from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { getAnalyticsSummary } from '@/lib/analyticsStore';
import { AnalyticsDashboard } from './AnalyticsDashboard';

export const dynamic = 'force-dynamic';

// Dashboard: product stats + missing-image detection panel.
export default async function AdminDashboard() {
  const [products, analytics] = await Promise.all([getProducts(), getAnalyticsSummary()]);

  // Detect which products are missing their main image file on disk
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'products');
  let existingFiles: string[] = [];
  try {
    existingFiles = await fs.readdir(uploadDir);
    existingFiles = existingFiles.filter((f) => !f.startsWith('.'));
  } catch {
    existingFiles = [];
  }

  const missingImages = products.filter((p) => {
    const filename = p.image.split('/').pop() || '';
    return !existingFiles.includes(filename);
  });

  // Quick stats
  const stats = {
    total: products.length,
    ready: products.filter((p) => p.stockType.includes('Ready')).length,
    custom: products.filter((p) => p.stockType.includes('Custom')).length,
    new: products.filter((p) => p.isNew).length,
    popular: products.filter((p) => p.isPopular).length,
    missing: missingImages.length
  };
  return (
    <div className='mx-auto max-w-6xl'>
      {/* Page title */}
      <div className='mb-6 sm:mb-8'>
        <h1 className='text-brand-black text-2xl font-bold sm:text-3xl'>Dashboard</h1>
        <p className='text-brand-brown/60 mt-1 text-sm'>
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      <AnalyticsDashboard
        analytics={analytics}
        products={products}
        siteUrl={process.env.NEXT_PUBLIC_SITE_URL || ''}
      />

      <section className='mb-8'>
        <h2 className='text-brand-black mb-3 text-lg font-bold'>Product overview</h2>
        <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
          <StatCard label='Total Products' value={stats.total} color='text-brand-orange' icon='box' />
          <StatCard label='Ready Stock' value={stats.ready} color='text-brand-emerald' icon='check' />
          <StatCard label='Custom Available' value={stats.custom} color='text-brand-gold' icon='star' />
          <StatCard
            label='Missing Images'
            value={stats.missing}
            color={stats.missing > 0 ? 'text-red-600' : 'text-brand-emerald'}
            icon='image'
          />
        </div>
      </section>

      {/* Missing images panel */}
      {missingImages.length > 0 ? (
        <div className='rounded-xl border border-red-100 bg-white p-5 shadow-sm sm:p-6'>
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
              <svg
                className='h-5 w-5 text-red-600'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
              >
                <path d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z' />
              </svg>
            </div>
            <div>
              <h2 className='text-brand-black text-base font-semibold sm:text-lg'>
                Missing Product Images
              </h2>
              <p className='text-brand-brown/60 text-xs sm:text-sm'>
                {missingImages.length} product(s) need images. Upload to make them live.
              </p>
            </div>
          </div>

          <div className='mb-4 space-y-2'>
            {missingImages.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className='bg-brand-cream flex items-center justify-between rounded-lg p-3'
              >
                <div className='min-w-0'>
                  <p className='text-brand-black truncate text-sm font-medium'>{p.name}</p>
                  <p className='text-brand-brown/60 truncate font-mono text-xs'>
                    {p.image.split('/').pop()}
                  </p>
                </div>
                <span className='ml-2 shrink-0 text-xs font-medium text-red-600'>No image</span>
              </div>
            ))}
          </div>

          <Link
            href='/admin/upload'
            className='bg-brand-orange hover:bg-brand-gold inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors'
          >
            <svg
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <path d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v12' />
            </svg>
            Upload Now
          </Link>
        </div>
      ) : (
        <div className='rounded-xl bg-white p-6 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='bg-brand-emerald/10 flex h-10 w-10 items-center justify-center rounded-full'>
              <svg className='text-brand-emerald h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' />
              </svg>
            </div>
            <div>
              <h2 className='text-brand-black text-base font-semibold sm:text-lg'>
                All products have images! 🎉
              </h2>
              <p className='text-brand-brown/60 text-xs sm:text-sm'>
                Every product in your catalog has its main image uploaded.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Link
          href='/admin/products'
          className='border-brand-sand/50 rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='bg-brand-orange/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
              <svg
                className='text-brand-orange h-6 w-6'
                fill='none'
                stroke='currentColor'
                strokeWidth={1.5}
                viewBox='0 0 24 24'
              >
                <path d='M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' />
              </svg>
            </div>
            <div>
              <h3 className='text-brand-black font-semibold'>Manage Products</h3>
              <p className='text-brand-brown/60 text-sm'>Add, edit, or remove styles</p>
            </div>
          </div>
        </Link>

        <Link
          href='/admin/upload'
          className='border-brand-sand/50 rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md'
        >
          <div className='flex items-center gap-4'>
            <div className='bg-brand-emerald/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg'>
              <svg
                className='text-brand-emerald h-6 w-6'
                fill='none'
                stroke='currentColor'
                strokeWidth={1.5}
                viewBox='0 0 24 24'
              >
                <path d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v12' />
              </svg>
            </div>
            <div>
              <h3 className='text-brand-black font-semibold'>Upload Images</h3>
              <p className='text-brand-brown/60 text-sm'>Drag & drop product photos</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  icon
}: {
  label: string;
  value: number;
  color: string;
  icon: 'box' | 'check' | 'star' | 'image';
}) {
  const icons = {
    box: (
      <svg
        className='h-6 w-6'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path d='M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' />
      </svg>
    ),
    check: (
      <svg
        className='h-6 w-6'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
      </svg>
    ),
    star: (
      <svg
        className='h-6 w-6'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' />
      </svg>
    ),
    image: (
      <svg
        className='h-6 w-6'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z' />
      </svg>
    )
  };
  return (
    <div className='rounded-xl bg-white p-4 shadow-sm sm:p-5'>
      <div className={`${color} mb-3`}>{icons[icon]}</div>
      <p className='text-brand-black text-2xl font-bold sm:text-3xl'>{value}</p>
      <p className='text-brand-brown/60 mt-1 text-xs sm:text-sm'>{label}</p>
    </div>
  );
}
