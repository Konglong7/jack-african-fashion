'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import type { SiteContent } from '@/lib/siteContentTypes';
import {
  AFRICAN_FASHION_SALES_ACCOUNTS,
  buildWhatsAppLink,
  resolveSalesAccount,
  type SalesAccount
} from '@/lib/whatsappRouter';

function WhatsAppIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='currentColor'
      aria-hidden='true'
    >
      <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
    </svg>
  );
}

function CloseIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2.5}
      aria-hidden='true'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
    </svg>
  );
}

/**
 * Isolated leaf component listening to Next.js searchParams without SSR bailout
 */
function SalesUrlSync({
  onSalesChange
}: {
  onSalesChange: (sales: string | null) => void;
}) {
  const searchParams = useSearchParams();
  const sales = searchParams.get('sales');

  useEffect(() => {
    onSalesChange(sales);
  }, [sales, onSalesChange]);

  return null;
}

export interface WhatsAppFloatingProps {
  siteContent?: SiteContent;
  variant?: 'default' | 'home';
}

export function WhatsAppFloating({
  variant = 'default'
}: WhatsAppFloatingProps) {
  const isHome = variant === 'home';

  const [isOpen, setIsOpen] = useState(false);
  const [activeSalesKey, setActiveSalesKey] = useState<string | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSalesChange = useCallback((sales: string | null) => {
    if (sales) {
      setActiveSalesKey(sales);
    }
  }, []);

  // Inspect browser hash and search query on mount as safety fallback
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      const query = url.searchParams.get('sales');
      const hash = url.hash.replace(/^#/, '');
      const hashSales = hash.startsWith('sales=') ? hash.slice(6) : hash;
      const detected = query || (hashSales ? hashSales : null);
      if (detected) {
        setActiveSalesKey(detected);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Keyboard accessibility: ESC key to close drawer
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Click-outside listener for desktop popover
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const resolved = resolveSalesAccount(activeSalesKey);
  const isMatched = resolved.matched;

  // If a specific consultant is matched via ?sales=xxx, pin them at the top
  const remainingAccounts = AFRICAN_FASHION_SALES_ACCOUNTS.filter(
    (acc) => acc.id !== resolved.id
  );
  const displayAccounts = isMatched
    ? [resolved, ...remainingAccounts]
    : AFRICAN_FASHION_SALES_ACCOUNTS;

  return (
    <>
      {/* Zero SSR-bailout URL sync wrapped in Suspense */}
      <Suspense fallback={null}>
        <SalesUrlSync onSalesChange={handleSalesChange} />
      </Suspense>

      {/* Floating Beacon Trigger Button */}
      <button
        ref={triggerRef}
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        data-cta-location='floating-whatsapp'
        className={`group fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-50 rounded-full bg-[#0B7A3E] text-white shadow-xl shadow-green-950/20 transition-all hover:scale-105 hover:bg-[#086532] active:scale-95 md:right-6 md:bottom-6 ${
          isHome ? 'p-[14px] md:p-[16px]' : 'p-3.5 md:p-4'
        }`}
        aria-expanded={isOpen}
        aria-haspopup='dialog'
        aria-label={
          isOpen
            ? 'Close International Trade Support Desk'
            : isMatched
              ? `Chat with Dedicated Advisor ${resolved.name}`
              : 'Open International Trade Support Desk'
        }
      >
        {/* Pulsing online green beacon & active specialists badge count */}
        {!isOpen && (
          <span className='absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white shadow-md ring-2 ring-white'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
            <span className='relative'>5</span>
          </span>
        )}

        {isOpen ? (
          <CloseIcon
            className={
              isHome
                ? 'h-[28px] w-[28px] sm:h-[32px] sm:w-[32px]'
                : 'h-7 w-7 sm:h-8 sm:w-8'
            }
          />
        ) : (
          <WhatsAppIcon
            className={
              isHome
                ? 'h-[28px] w-[28px] sm:h-[32px] sm:w-[32px]'
                : 'h-7 w-7 sm:h-8 sm:w-8'
            }
          />
        )}

        {/* Desktop Hover Tooltip */}
        {!isOpen && (
          <span className='pointer-events-none absolute top-1/2 right-full mr-3 hidden -translate-y-1/2 items-center gap-2 rounded-xl bg-[#171615] px-3.5 py-2 text-xs font-semibold whitespace-nowrap text-[#F7F2EB] opacity-0 shadow-xl ring-1 ring-white/10 transition-opacity group-hover:opacity-100 sm:flex'>
            <span className='h-2 w-2 animate-pulse rounded-full bg-emerald-400' />
            {isMatched
              ? `Chat with Advisor: ${resolved.name}`
              : 'Trade Support Desk · 5 Online'}
          </span>
        )}
      </button>

      {/* Trade Support Desk Drawer (Mobile Bottom Sheet & Desktop Popover) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className='fixed inset-0 z-40 bg-stone-950/45 backdrop-blur-xs md:hidden'
              aria-hidden='true'
            />

            {/* Support Desk Card */}
            <motion.div
              ref={drawerRef}
              role='dialog'
              aria-modal='true'
              aria-label='International Trade Support Desk'
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className='fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-50 flex max-h-[82vh] flex-col overflow-hidden rounded-[24px] border border-[#EEE5DA] bg-[#F7F2EB] shadow-2xl md:right-6 md:bottom-24 md:left-auto md:w-[420px] md:max-h-[min(620px,calc(100vh-120px))] md:rounded-[22px] md:shadow-stone-950/25'
            >
              {/* Header */}
              <div className='flex items-start justify-between border-b border-[#EEE5DA] bg-[#F7F2EB] px-4.5 py-3.5'>
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='flex h-2.5 w-2.5 items-center justify-center'>
                      <span className='absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-75' />
                      <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
                    </span>
                    <h2 className='text-sm font-bold tracking-tight text-[#171615] sm:text-base'>
                      Trade Support Desk
                    </h2>
                    <span className='rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800'>
                      5 Online
                    </span>
                  </div>
                  <p className='mt-0.5 text-[11px] text-[#6F6A64] sm:text-xs'>
                    Guangzhou Factory Direct · Verified Export Specialists
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  aria-label='Close Trade Support Desk'
                  className='-mr-1 rounded-full p-1 text-stone-500 transition-colors hover:bg-stone-200/60 hover:text-[#171615]'
                >
                  <CloseIcon className='h-5 w-5' />
                </button>
              </div>

              {/* Representatives Card Stack */}
              <div className='flex-1 space-y-2.5 overflow-y-auto p-3.5'>
                {displayAccounts.map((rep: SalesAccount) => {
                  const isAccountMatched = isMatched && rep.id === resolved.id;

                  return (
                    <div
                      key={rep.id}
                      data-rep-id={rep.id}
                      data-dedicated-advisor={isAccountMatched ? 'true' : 'false'}
                      className={`relative rounded-[18px] transition-all ${
                        isAccountMatched
                          ? 'border-2 border-[#E2AB2F] bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F5EFE6] p-3 shadow-md ring-2 ring-[#E2AB2F]/25'
                          : 'border border-[#EEE5DA] bg-white/95 p-3 shadow-xs hover:border-stone-300 hover:bg-white'
                      }`}
                    >
                      {/* Priority Match Banner */}
                      {isAccountMatched && (
                        <div className='-mx-3 -mt-3 mb-2 flex items-center justify-between rounded-t-[16px] border-b border-[#E2AB2F]/30 bg-[#E2AB2F]/15 px-3 py-1 text-[11px] font-bold text-[#8A661B]'>
                          <span className='flex items-center gap-1'>
                            <span>⭐</span>
                            <span>Your Dedicated Trade Advisor</span>
                          </span>
                          <span className='text-[10px] tracking-wider uppercase text-[#B17C0E]'>
                            Priority Desk
                          </span>
                        </div>
                      )}

                      <div className='flex items-center gap-3'>
                        {/* Luxury Initials Monogram Avatar */}
                        <div className='relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#EEE5DA] bg-[#171615] font-serif text-sm font-bold text-[#F7F2EB] shadow-xs'>
                          {rep.avatarText}
                          {/* Online status indicator on avatar */}
                          <span
                            className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white ${
                              rep.status === 'online'
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                            }`}
                          />
                        </div>

                        {/* Representative Information */}
                        <div className='min-w-0 flex-1'>
                          <div className='flex items-center gap-2'>
                            <h3 className='shrink-0 text-xs font-bold text-[#171615] sm:text-sm'>
                              {rep.name}
                            </h3>
                            {rep.status === 'online' ? (
                              <span className='inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700'>
                                <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500' />
                                Online
                              </span>
                            ) : (
                              <span className='inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700'>
                                <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />
                                Fast Reply (&lt;5m)
                              </span>
                            )}
                          </div>

                          <p className='truncate text-[11px] font-medium text-[#171615]'>
                            {rep.title}
                          </p>
                          <p className='truncate text-[10px] text-[#6F6A64]'>
                            {rep.chineseTitle}
                          </p>

                          {/* Capability & Region Badges */}
                          <div className='mt-1.5 flex flex-wrap gap-1'>
                            {rep.tags.map((tag) => (
                              <span
                                key={tag}
                                className='rounded-md bg-[#EEE5DA]/60 px-1.5 py-0.5 text-[9px] font-medium text-stone-600'
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* WhatsApp Action Button with Magic Text */}
                        <a
                          href={buildWhatsAppLink(rep)}
                          target='_blank'
                          rel='noopener noreferrer'
                          data-cta-location={`support-desk-${rep.id}`}
                          data-rep-id={rep.id}
                          className='inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0B7A3E] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-transform hover:scale-105 hover:bg-[#086532] active:scale-95'
                          aria-label={`Chat with ${rep.name} on WhatsApp`}
                        >
                          <WhatsAppIcon className='h-3.5 w-3.5' />
                          <span>Chat</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Showroom & Executive Line Footer */}
              <div className='flex items-center justify-between border-t border-[#EEE5DA] bg-[#FAF6F0] px-4 py-2.5 text-[11px] text-[#6F6A64]'>
                <div className='truncate'>
                  <span className='font-medium text-[#171615]'>Guangzhou Showroom:</span>{' '}
                  <span>Yulong Plaza #229</span>
                </div>
                <a
                  href={buildWhatsAppLink('jack')}
                  target='_blank'
                  rel='noopener noreferrer'
                  data-cta-location='support-desk-jack'
                  className='shrink-0 font-semibold text-[#171615] underline decoration-stone-300 transition-colors hover:text-[#B17C0E]'
                >
                  Direct Factory Line
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
