'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';
import { SiteImage } from '@/components/SiteImage';
import { WhatsAppIcon } from '@/components/Icons';
import { Marquee } from '@/components/motion/Marquee';

const HERO_PROOF = [
  'Yulong Fashion Plaza Showroom',
  'Own Factory',
  'African B2B Service',
  'Ready Stock',
  'Custom Production',
  'Export Packing'
];

export function Hero({ siteContent }: { siteContent: SiteContent }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  // Parallax effects — background and text move at different rates on scroll.
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '80px']);

  return (
    <section
      ref={ref}
      className='bg-brand-black relative flex min-h-[600px] flex-col justify-end overflow-hidden sm:min-h-[max(720px,56.25vw)] sm:justify-center'
    >
      {/* Banner image with parallax */}
      <motion.div className='absolute inset-0' style={{ y: bgY }}>
        <SiteImage
          src={SITE_IMAGES.hero}
          alt="Jack African Fashion Guangzhou African women's clothing wholesale supplier"
          priority
          sizes='100vw'
          className='absolute inset-0'
          imageClassName='![object-position:center_top] sm:![object-position:center_top]'
          position='center top'
        />
        {/* Editorial contrast gradient: vertical on mobile, lateral on desktop */}
        <div className='from-brand-black via-brand-black/75 to-brand-black/25 absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r sm:from-black/80 sm:via-black/45 sm:to-black/5' />
      </motion.div>

      {/* Atmospheric gold luxury glow */}
      <div
        className='pointer-events-none absolute inset-0 opacity-40'
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(212,175,55,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(217,107,11,0.2) 0%, transparent 50%)'
        }}
      />

      {/* Content */}
      <motion.div
        className='relative z-10 mx-auto w-full max-w-7xl px-4 pt-20 pb-16 sm:py-24'
        style={{ y: textY }}
      >
        <div className='max-w-2xl'>
          <span className='text-brand-gold border-brand-gold/40 mb-3 inline-block border-b pb-1.5 text-xs font-semibold tracking-[0.2em] uppercase sm:mb-6 sm:text-sm sm:tracking-[0.25em]'>
            {siteContent.heroEyebrow}
          </span>

          <h1 className='font-display mb-3 max-w-[22rem] text-3xl leading-[1.08] font-bold break-words text-white sm:mb-6 sm:max-w-none sm:text-5xl lg:text-6xl xl:text-7xl'>
            {siteContent.heroTitle}{' '}
            <span className='text-brand-gold inline-block drop-shadow-[0_0_24px_rgba(212,175,55,0.4)]'>
              {siteContent.heroAccent}
            </span>
          </h1>

          <p className='text-brand-cream/90 mb-6 max-w-2xl text-[0.95rem] leading-6 sm:mb-8 sm:text-lg sm:leading-relaxed lg:text-xl'>
            <span className='sm:hidden'>
              Jack African Fashion supplies ready-stock and custom women&apos;s clothing from
              Guangzhou to African boutiques, wholesalers and importers.
            </span>
            <span className='hidden sm:inline'>{siteContent.heroBody}</span>
          </p>

          <div className='flex flex-col gap-3.5 sm:flex-row sm:gap-4'>
            <motion.a
              href={siteWhatsAppLink(siteContent)}
              target='_blank'
              rel='noopener noreferrer'
              className='group inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-base font-bold text-white shadow-xl shadow-green-950/25 transition-all hover:bg-[#20ba5a] active:scale-[0.98]'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <WhatsAppIcon className='h-5 w-5' />
              <span>Talk Stock on WhatsApp</span>
            </motion.a>

            <Link
              href='/catalog'
              className='group hover:border-brand-gold/60 relative inline-flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20 active:scale-[0.98]'
            >
              <span className='relative z-10'>View All Products</span>
              <svg
                className='relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
              >
                <path d='M5 12h14M12 5l7 7-7 7' />
              </svg>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className='border-brand-gold/30 mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 border-l pl-4 sm:mt-12 sm:flex sm:w-fit sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3 sm:rounded-full sm:border sm:border-white/10 sm:bg-black/35 sm:px-5 sm:py-3 sm:backdrop-blur-md'>
            {HERO_PROOF.map((item) => (
              <div key={item} className='text-brand-cream/85 flex items-center gap-2'>
                <svg
                  className='text-brand-gold h-4 w-4 shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' />
                </svg>
                <span className='text-xs font-semibold sm:text-sm'>{item}</span>
              </div>
            ))}
          </div>

          <a
            href='#home-categories'
            className='text-brand-gold border-brand-gold/40 mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-xs font-bold tracking-[0.16em] uppercase sm:hidden'
          >
            See Styles
            <svg
              className='h-4 w-4 animate-bounce'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <path d='M12 5v14m0 0 6-6m-6 6-6-6' />
            </svg>
          </a>
        </div>
      </motion.div>

      {/* Scrolling marquee banner */}
      <div className='absolute right-0 bottom-0 left-0 z-10 hidden sm:block'>
        <Marquee
          speed={25}
          className='bg-brand-gold/10 border-brand-gold/20 border-t py-4'
          pauseOnHover
        >
          <span className='text-brand-gold font-display text-lg font-bold tracking-wider whitespace-nowrap'>
            READY STOCK · PLUS SIZE DRESSES · TWO PIECE SETS · PLEATED DRESSES · MAXI DRESSES ·
            JUMPSUITS · CUSTOM ORDERS · NIGERIA · GHANA · KENYA · TANZANIA · ZIMBABWE · FACTORY
            PRICES · WHOLESALE ONLY
          </span>
        </Marquee>
      </div>

      {/* Scroll indicator */}
      <a
        href='#home-categories'
        className='absolute bottom-16 left-1/2 z-10 hidden -translate-x-1/2 sm:block'
      >
        <div className='flex flex-col items-center gap-2'>
          <span className='text-brand-cream/65 text-xs tracking-widest uppercase'>See Styles</span>
          <svg
            className='text-brand-cream/65 h-7 w-7 animate-bounce'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            viewBox='0 0 24 24'
          >
            <path d='M19 14l-7 7m0 0l-7-7m7 7V3' />
          </svg>
        </div>
      </a>
    </section>
  );
}
