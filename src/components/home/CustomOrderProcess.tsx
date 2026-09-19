'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';
import { WhatsAppIcon } from '@/components/Icons';
import { SiteImage } from '@/components/SiteImage';

const STEPS = [
  {
    step: '01',
    title: 'Send Us Your Style Pictures',
    description:
      'Share reference photos, size details and quantity via WhatsApp or our inquiry form.',
    icon: (
      <svg
        className='h-10 w-10'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path d='M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V16.5a2.25 2.25 0 002.25 2.25h12a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z' />
        <path d='M16.5 12.75a3 3 0 11-6 0 3 3 0 016 0z' />
      </svg>
    )
  },
  {
    step: '02',
    title: 'We Quote Based on Fabric, Size and Quantity',
    description:
      'Our team checks fabric availability, production cost and gives you a competitive wholesale quote.',
    icon: (
      <svg
        className='h-10 w-10'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path d='M9 7.5l-.75 3.75M13.5 7.5l-.75 3.75M3 3v18h18V3M7.5 3v3m9-3v3m-6 15h6' />
      </svg>
    )
  },
  {
    step: '03',
    title: 'Confirm Details and Payment',
    description:
      'Once you approve the sample, price and timeline, we confirm the order and payment terms.',
    icon: (
      <svg
        className='h-10 w-10'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path d='M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z' />
      </svg>
    )
  },
  {
    step: '04',
    title: 'Production and Shipping',
    description:
      'We produce, quality-check and arrange shipping to your country. You receive tracking updates.',
    icon: (
      <svg
        className='h-10 w-10'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path d='M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' />
      </svg>
    )
  }
];

export function CustomOrderProcess({ siteContent }: { siteContent: SiteContent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className='bg-brand-black text-brand-cream relative overflow-hidden py-12 sm:py-20'>
      {/* Animated background elements */}
      <motion.div
        className='absolute top-0 left-0 h-full w-full'
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 80%, rgba(212,160,23,0.1) 0%, transparent 50%)'
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating sparkle dots — opacity-only, frozen under reduced motion. */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden' aria-hidden='true'>
        {[
          { left: '10%', top: '20%' },
          { left: '22%', top: '65%' },
          { left: '33%', top: '12%' },
          { left: '44%', top: '48%' },
          { left: '55%', top: '80%' },
          { left: '66%', top: '15%' }
        ].map((p, i) => (
          <span
            key={i}
            className='bg-brand-gold/20 absolute h-1 w-1 rounded-full'
            style={{
              left: p.left,
              top: p.top,
              animation: `hero-twinkle ${5 + (i % 4)}s ease-in-out ${(i % 6) * 0.5}s infinite`
            }}
          />
        ))}
      </div>

      <div className='relative mx-auto max-w-7xl px-4' ref={ref}>
        {/* Header */}
        <motion.div
          className='mb-12 text-center'
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            className='text-brand-gold block text-sm font-semibold tracking-[0.2em] uppercase'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            Custom Production
          </motion.span>
          <motion.h2
            className='font-display mt-3 text-3xl font-bold text-white sm:text-4xl'
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            How Custom Orders Work
          </motion.h2>
          <motion.p
            className='text-brand-cream/70 mx-auto mt-3 max-w-2xl'
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            Don&apos;t see exactly what you need? We can produce styles to your specifications.
          </motion.p>
        </motion.div>

        <motion.div
          className='mb-10 overflow-hidden rounded-xl border border-white/10 bg-white/5'
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className='relative aspect-video'>
            <SiteImage
              src={SITE_IMAGES.customOrders}
              alt='Custom women fashion orders and reference styles for wholesale production'
              sizes='100vw'
              className='absolute inset-0'
              position='center top'
            />
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div
          className='grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-4'
          initial='hidden'
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
        >
          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              className='group relative'
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                }
              }}
            >
              <motion.div
                className='relative h-full overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur'
                whileHover={{
                  borderColor: 'rgba(212,160,23,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.08)'
                }}
              >
                {/* Hover glow */}
                <motion.div className='from-brand-gold/10 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity group-hover:opacity-100' />

                {/* Animated icon */}
                <motion.div
                  className='text-brand-gold relative mb-2 sm:mb-4 [&>svg]:h-7 [&>svg]:w-7 sm:[&>svg]:h-10 sm:[&>svg]:w-10'
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: i * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
                >
                  {s.icon}
                </motion.div>

                {/* Step number with glow */}
                <motion.span
                  className='font-display text-brand-gold/40 absolute top-3 right-3 sm:top-4 sm:right-4 text-2xl sm:text-4xl font-bold'
                  animate={{ opacity: 0.4 }}
                >
                  {s.step}
                </motion.span>

                <h3 className='relative mt-1 sm:mt-3 mb-1 sm:mb-2 text-sm sm:text-lg font-semibold text-white line-clamp-2'>{s.title}</h3>
                <p className='text-brand-cream/60 relative text-xs sm:text-sm leading-snug sm:leading-relaxed'>
                  {s.description}
                </p>
              </motion.div>

              {/* Connection line */}
              {i < STEPS.length - 1 && (
                <motion.div
                  className='bg-brand-gold/30 absolute top-1/2 -right-3 hidden h-0.5 w-6 lg:block'
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: i * 0.15 + 0.5 }}
                  style={{ originX: 0 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          className='mt-12 text-center'
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className='bg-brand-gold/10 border-brand-gold/30 mb-6 inline-block rounded-xl border px-6 py-4'
            animate={{
              boxShadow: [
                '0 0 0 rgba(212,160,23,0)',
                '0 0 30px rgba(212,160,23,0.2)',
                '0 0 0 rgba(212,160,23,0)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <p className='text-brand-gold text-sm font-semibold sm:text-base'>
              For custom production, MOQ is usually 100 pcs per style.
              <br className='hidden sm:block' />
              Bigger quantity, better factory price.
            </p>
          </motion.div>

          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href='/custom-orders'
                className='bg-brand-orange hover:bg-brand-gold inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-semibold text-white transition-colors'
              >
                Start Custom Order
              </Link>
            </motion.div>

            <motion.a
              href={siteWhatsAppLink(
                siteContent,
                'Hello Jack, I want to make a custom order. I will send reference pictures.'
              )}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-3.5 font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/20'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <WhatsAppIcon className='h-5 w-5' />
              Send Pictures on WhatsApp
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
