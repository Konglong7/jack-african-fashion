'use client';

import { MotionConfig } from 'framer-motion';
import { Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { InquiryFloating } from '@/components/InquiryFloating';
import { InquiryToast } from '@/components/InquiryToast';
import { WhatsAppFloating } from '@/components/WhatsAppFloating';
import type { SiteContent } from '@/lib/siteContentTypes';

export function RootChrome({
  children,
  siteContent
}: {
  children: React.ReactNode;
  siteContent: SiteContent;
}) {
  const pathname = usePathname();
  const chromeVariant = pathname === '/' ? 'home' : 'default';
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  // Rewritten 404s have different server and browser paths. Keep the initial
  // floating controls identical, then choose their layout after hydration.
  const [isProductPage, setIsProductPage] = useState(true);
  useEffect(() => setIsProductPage(pathname.startsWith('/products/')), [pathname]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    // Honor the OS reduced-motion preference globally: framer-motion freezes
    // animations/transitions for users who ask for less motion.
    <MotionConfig reducedMotion='user'>
      <a
        href='#main-content'
        className='focus:bg-brand-orange sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:px-4 focus:py-2 focus:text-white'
      >
        Skip to main content
      </a>
      <Header siteContent={siteContent} variant={chromeVariant} />
      <InquiryToast variant={chromeVariant} />
      <main id='main-content' className='flex-1'>
        {/* Page modules can suspend during hydration. Keep their retry inside
            main so the surrounding shell is never hydrated a second time. */}
        <Suspense fallback={null}>{children}</Suspense>
      </main>
      <Footer siteContent={siteContent} variant={chromeVariant} />
      {isProductPage ? (
        <div className='hidden md:block'>
          <InquiryFloating variant={chromeVariant} />
          <WhatsAppFloating siteContent={siteContent} variant={chromeVariant} />
        </div>
      ) : (
        <>
          <InquiryFloating variant={chromeVariant} />
          <WhatsAppFloating siteContent={siteContent} variant={chromeVariant} />
        </>
      )}
    </MotionConfig>
  );
}
