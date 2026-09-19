'use client';

import { MotionConfig } from 'framer-motion';
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
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  const isProductPage = pathname.startsWith('/products/');

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
      <Header siteContent={siteContent} />
      <InquiryToast />
      <main id='main-content' className='flex-1'>
        {children}
      </main>
      <Footer siteContent={siteContent} />
      {isProductPage ? (
        <div className='hidden md:block'>
          <InquiryFloating />
          <WhatsAppFloating siteContent={siteContent} />
        </div>
      ) : (
        <>
          <InquiryFloating />
          <WhatsAppFloating siteContent={siteContent} />
        </>
      )}
    </MotionConfig>
  );
}
