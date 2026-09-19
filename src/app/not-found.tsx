import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='bg-brand-cream flex min-h-screen items-center justify-center px-4'>
      <div className='max-w-md text-center'>
        <h1 className='font-display text-brand-black mb-4 text-6xl font-bold'>404</h1>
        <h2 className='font-display text-brand-brown mb-3 text-2xl font-bold'>Page Not Found</h2>
        <p className='text-brand-brown/70 mb-6'>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className='flex flex-col justify-center gap-3 sm:flex-row'>
          <Link
            href='/catalog'
            className='bg-brand-orange hover:bg-brand-gold inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-colors'
          >
            Browse Catalog
          </Link>
          <Link
            href='/'
            className='border-brand-sand hover:bg-brand-cream text-brand-brown inline-flex items-center justify-center gap-2 rounded-full border bg-white px-6 py-3 font-semibold transition-colors'
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
