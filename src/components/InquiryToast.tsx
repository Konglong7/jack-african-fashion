'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CheckIcon, XIcon } from '@/components/Icons';
import { getInquiryItemCount, INQUIRY_UPDATED_EVENT } from '@/lib/inquiry';

export function InquiryToast({ variant = 'default' }: { variant?: 'default' | 'home' }) {
  const isHome = variant === 'home';
  const pathname = usePathname();
  const [toast, setToast] = useState<{ visible: boolean; count: number }>({
    visible: false,
    count: 0
  });
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function handleInquiryUpdate() {
      const currentCount = getInquiryItemCount(localStorage);
      if (currentCount > 0 && pathname !== '/inquiry') {
        setToast({ visible: true, count: currentCount });

        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          setToast((prev) => ({ ...prev, visible: false }));
        }, 3600);
      }
    }

    window.addEventListener(INQUIRY_UPDATED_EVENT, handleInquiryUpdate);
    return () => {
      window.removeEventListener(INQUIRY_UPDATED_EVENT, handleInquiryUpdate);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname]);

  if (pathname === '/inquiry') {
    return null;
  }

  return (
    <aside
      aria-label='Inquiry notifications'
      aria-live='polite'
      className={
        isHome
          ? 'pointer-events-none fixed inset-x-0 bottom-[calc(88px+env(safe-area-inset-bottom,0px))] z-50 flex justify-center px-[16px]'
          : 'pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4 sm:top-20'
      }
    >
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ y: -30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            className={
              isHome
                ? 'pointer-events-auto flex w-full max-w-xl flex-wrap items-center gap-[8px] rounded-xl border border-stone-300 bg-white px-[12px] py-[12px] shadow-2xl'
                : 'border-brand-sand/80 pointer-events-auto flex items-center gap-3 rounded-full border bg-white/98 py-2 pr-2 pl-3.5 shadow-2xl shadow-black/10 backdrop-blur-md'
            }
            role='status'
          >
            <div
              className={
                isHome
                  ? 'flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-[#165C45] text-white'
                  : 'bg-brand-emerald flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-sm'
              }
            >
              <CheckIcon className={isHome ? 'h-[16px] w-[16px]' : 'h-4 w-4'} />
            </div>

            <div
              className={
                isHome
                  ? 'flex min-w-[120px] flex-1 flex-wrap items-center gap-[6px] text-xs text-[#453D36] sm:text-sm'
                  : 'flex items-center gap-2 text-xs sm:text-sm'
              }
            >
              <span className='text-brand-black font-bold'>
                {isHome ? 'Added to Inquiry' : 'Added to Inquiry List'}
              </span>
              <span className={isHome ? 'text-[#453D36]' : 'text-brand-brown/60'}>·</span>
              <span className={isHome ? 'font-medium' : 'text-brand-brown/80 font-medium'}>
                {toast.count} {toast.count === 1 ? 'style' : 'styles'}
              </span>
            </div>

            <Link
              href='/inquiry'
              onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
              className={
                isHome
                  ? 'inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#0B7A3C] px-[12px] py-[8px] text-xs font-bold text-white hover:bg-[#165C45]'
                  : 'bg-brand-orange hover:bg-brand-gold ml-1 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-white transition-colors'
              }
            >
              View List →
            </Link>

            <button
              type='button'
              onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
              className={
                isHome
                  ? 'flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-[#453D36] hover:bg-stone-100'
                  : 'text-brand-brown/40 hover:text-brand-brown hover:bg-brand-sand/30 rounded-full p-1 transition-colors'
              }
              aria-label='Dismiss notification'
            >
              <XIcon className={isHome ? 'h-[20px] w-[20px]' : 'h-3.5 w-3.5'} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
