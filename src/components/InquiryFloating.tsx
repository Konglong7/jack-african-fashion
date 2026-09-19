'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getInquiryItemCount, INQUIRY_UPDATED_EVENT } from '@/lib/inquiry';

export function InquiryFloating() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    function updateCount() {
      setCount(getInquiryItemCount(localStorage));
    }

    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener(INQUIRY_UPDATED_EVENT, updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener(INQUIRY_UPDATED_EVENT, updateCount);
    };
  }, []);

  if (count === 0) {
    return null;
  }

  if (pathname === '/inquiry') {
    return null;
  }

  const label =
    count > 0
      ? `Open inquiry cart, ${count} selected style${count > 1 ? 's' : ''}`
      : 'Open inquiry cart';

  return (
    <Link
      href='/inquiry'
      className='group bg-brand-black fixed left-4 bottom-4 z-50 rounded-full p-3.5 text-white shadow-2xl transition-all hover:scale-110 hover:bg-brand-orange active:scale-95 md:right-6 md:bottom-24 md:left-auto md:p-4'
      aria-label={label}
      title='Open inquiry cart'
    >
      <svg
        className='h-7 w-7 sm:h-8 sm:w-8'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        viewBox='0 0 24 24'
        aria-hidden='true'
      >
        <path d='M6 6h15l-1.5 9h-12L6 6Z' />
        <path d='M6 6 5.25 3H3' />
        <circle cx='9' cy='20' r='1' />
        <circle cx='18' cy='20' r='1' />
      </svg>
      {count > 0 && (
        <span className='bg-brand-orange absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white shadow-md ring-2 ring-white animate-pulse'>
          {count}
        </span>
      )}
      <span className='text-brand-black pointer-events-none absolute top-1/2 right-full mr-3 hidden -translate-y-1/2 rounded-lg bg-white px-4 py-2 text-sm font-semibold whitespace-nowrap opacity-0 shadow-lg ring-1 ring-black/5 transition-opacity group-hover:opacity-100 md:inline-block'>
        Open inquiry cart ({count})
      </span>
    </Link>
  );
}
