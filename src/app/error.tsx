'use client';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='bg-brand-cream flex min-h-screen items-center justify-center px-4'>
      <div className='max-w-md text-center'>
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
          <svg
            className='h-8 w-8 text-red-600'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            viewBox='0 0 24 24'
          >
            <path d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' />
          </svg>
        </div>
        <h2 className='font-display text-brand-black mb-3 text-2xl font-bold'>
          Something went wrong
        </h2>
        <p className='text-brand-brown/70 mb-6'>
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={reset}
          className='bg-brand-orange hover:bg-brand-gold inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-colors'
        >
          Try again
        </button>
      </div>
    </div>
  );
}
