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

const HERO_PROOF = ['Yulong Fashion Plaza', 'Ready Stock', 'Factory Network', 'Export Packing'];

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
      className='bg-brand-black relative flex flex-col overflow-hidden sm:min-h-[max(720px,56.25vw)] sm:flex-row sm:items-center'
    >
      {/* Banner image */}
      <motion.div
        className='relative h-[208px] shrink-0 sm:absolute sm:inset-0 sm:h-auto'
        style={{ y: bgY }}
      >
        <SiteImage
          src={SITE_IMAGES.hero}
          alt='African women fashion wholesale hero banner'
          priority
          sizes='100vw'
          className='absolute inset-0'
          imageClassName='sm:![object-position:center_top]'
          position='center top'
        />
        <div className='from-brand-black/35 absolute inset-0 bg-gradient-to-t via-transparent to-transparent sm:bg-gradient-to-r sm:from-black/80 sm:via-black/45 sm:to-black/5' />
      </motion.div>

      {/* Static warm glow overlay — animating a gradient string repaints the whole
          hero every frame, so this is a fixed layered radial gradient instead. */}
      <div
        className='pointer-events-none absolute inset-0 hidden opacity-25 sm:block'
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(212,160,23,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(217,119,6,0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(123,30,59,0.2) 0%, transparent 50%)'
        }}
      />

      {/* Ambient sparkle dots — opacity-only (cheap, no layout/repaint).
          On prefers-reduced-motion these freeze via MotionConfig in RootChrome. */}
      <div
        className='pointer-events-none absolute inset-0 hidden overflow-hidden sm:block'
        aria-hidden='true'
      >
        {[
          { left: '12%', top: '18%' },
          { left: '23%', top: '62%' },
          { left: '34%', top: '8%' },
          { left: '45%', top: '44%' },
          { left: '56%', top: '78%' },
          { left: '67%', top: '12%' },
          { left: '78%', top: '50%' },
          { left: '88%', top: '25%' }
        ].map((p, i) => (
          <span
            key={i}
            className='bg-brand-gold/40 absolute h-1 w-1 rounded-full'
            style={{
              left: p.left,
              top: p.top,
              animation: `hero-twinkle ${4 + (i % 5)}s ease-in-out ${(i % 7) * 0.4}s infinite`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className='bg-brand-black relative z-10 mx-auto w-full max-w-7xl overflow-hidden px-4 pt-5 pb-5 sm:overflow-visible sm:bg-transparent sm:py-24'
        style={{ y: textY }}
      >
        <div className='max-w-2xl'>
          <span className='text-brand-gold border-brand-gold/40 mb-3 inline-block border-b pb-2 text-xs font-semibold tracking-[0.12em] uppercase sm:mb-6 sm:text-sm sm:tracking-[0.3em]'>
            {siteContent.heroEyebrow}
          </span>

          <h1 className='font-display mb-3 max-w-[21rem] text-3xl leading-[1.05] font-bold break-words text-white sm:mb-6 sm:max-w-none sm:text-5xl lg:text-6xl xl:text-7xl'>
            {siteContent.heroTitle}{' '}
            <span className='text-brand-gold inline-block drop-shadow-[0_0_24px_rgba(212,160,23,0.35)]'>
              {siteContent.heroAccent}
            </span>
          </h1>

          <p className='text-brand-cream/90 mb-5 max-w-2xl text-[0.95rem] leading-6 sm:mb-8 sm:text-lg sm:leading-relaxed lg:text-xl'>
            <span className='sm:hidden'>
              Ready-stock womenswear support for African boutiques and importers.
            </span>
            <span className='hidden sm:inline'>{siteContent.heroBody}</span>
          </p>

          <div className='flex flex-col gap-3 sm:flex-row sm:gap-4'>
            <Link
              href='/catalog'
              className='group bg-brand-orange hover:bg-brand-gold relative inline-flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-base font-semibold text-white transition-colors sm:min-h-0 sm:self-auto'
            >
              <motion.span
                className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0'
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
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

            <motion.a
              href={siteWhatsAppLink(siteContent)}
              target='_blank'
              rel='noopener noreferrer'
              className='group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-3 text-base font-semibold text-white backdrop-blur transition-all hover:border-white/50 hover:bg-white/20 sm:min-h-0 sm:px-8 sm:py-4 sm:self-auto'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <WhatsAppIcon className='h-5 w-5' />
              Talk Stock on WhatsApp
            </motion.a>
          </div>

          {/* Trust indicators */}
          <div className='border-brand-gold/20 mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-l pl-4 sm:mt-12 sm:flex sm:w-fit sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3 sm:rounded-full sm:border-0 sm:bg-black/20 sm:px-5 sm:py-3 sm:backdrop-blur-sm'>
            {HERO_PROOF.map((item) => (
              <div key={item} className='text-brand-cream/80 flex items-center gap-2'>
                <svg
                  className='text-brand-gold h-5 w-5 shrink-0'
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
            className='text-brand-gold border-brand-gold/30 mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-bold tracking-[0.12em] uppercase sm:hidden'
          >
            See Styles
            <svg
              className='h-5 w-5 animate-bounce'
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
