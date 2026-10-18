'use client';

import type { SiteContent } from '@/lib/siteContentTypes';
import { JACK_WHATSAPP_LINK } from '@/lib/whatsappRouter';

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

export interface WhatsAppFloatingProps {
  siteContent?: SiteContent;
  variant?: 'default' | 'home';
}

export function WhatsAppFloating({
  variant = 'default'
}: WhatsAppFloatingProps) {
  const isHome = variant === 'home';

  return (
    <>
      {/* Direct Floating WhatsApp Trigger */}
      <a
        href={JACK_WHATSAPP_LINK}
        target='_blank'
        rel='noopener noreferrer'
        data-cta-location='floating-whatsapp'
        className={`group fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-50 flex items-center justify-center rounded-full bg-[#0B7A3E] text-white shadow-xl shadow-green-950/25 transition-all hover:scale-105 hover:bg-[#086532] active:scale-95 md:right-6 md:bottom-6 ${
          isHome ? 'p-[14px] md:p-[16px]' : 'p-3.5 md:p-4'
        }`}
        aria-label='Chat directly with Jack on WhatsApp'
      >
        {/* Pulsing online green beacon */}
        <span className='absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 shadow-md ring-2 ring-white'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
          <span className='relative inline-flex h-2 w-2 rounded-full bg-white' />
        </span>

        <WhatsAppIcon
          className={
            isHome
              ? 'h-[28px] w-[28px] sm:h-[32px] sm:w-[32px]'
              : 'h-7 w-7 sm:h-8 sm:w-8'
          }
        />

        {/* Desktop Hover Tooltip */}
        <span className='pointer-events-none absolute top-1/2 right-full mr-3 hidden -translate-y-1/2 items-center gap-2 rounded-xl bg-[#171615] px-3.5 py-2 text-xs font-semibold whitespace-nowrap text-[#F7F2EB] opacity-0 shadow-xl ring-1 ring-white/10 transition-opacity group-hover:opacity-100 sm:flex'>
          <span className='h-2 w-2 animate-pulse rounded-full bg-emerald-400' />
          Chat with Jack on WhatsApp
        </span>
      </a>
    </>
  );
}
