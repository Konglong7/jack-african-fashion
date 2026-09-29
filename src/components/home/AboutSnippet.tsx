'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import type { SiteContent } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';

export function AboutSnippet({ siteContent }: { siteContent: SiteContent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className='bg-brand-cream relative overflow-hidden py-16 sm:py-20' ref={ref}>
      {/* Decorative element — static tint. */}
      <div className='bg-brand-orange/5 pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full' />

      <div className='mx-auto max-w-7xl px-4'>
        <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
          {/* Showroom image */}
          <motion.div
            className='bg-brand-black relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl shadow-lg'
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Image
              src={SITE_IMAGES.trust.showroomExterior}
              alt='Jack Fashion physical showroom at Yulong Fashion Plaza Guangzhou'
              fill
              sizes='(max-width: 1024px) 100vw, 50vw'
              className='object-cover'
            />
            <div className='absolute bottom-3 left-3 rounded-lg bg-black/75 px-3 py-1.5 backdrop-blur-sm'>
              <p className='text-xs font-bold text-white'>
                📍 Guangzhou Showroom · Yulong Fashion Plaza
              </p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              className='text-brand-orange block text-sm font-semibold tracking-[0.2em] uppercase'
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              About Us
            </motion.span>
            <motion.h2
              className='font-display text-brand-black mt-3 mb-6 text-3xl font-bold sm:text-4xl'
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              About Jack African Fashion
            </motion.h2>

            <motion.div
              className='text-brand-brown/80 space-y-4 leading-relaxed'
              initial='hidden'
              animate={inView ? 'visible' : 'hidden'}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {[
                'We are a Guangzhou-based women&apos;s clothing wholesale supplier and factory-direct manufacturer. From our own factory, office and Yulong Fashion Plaza showroom, we support African B2B buyers with ready stock and custom production.',
                'We provide ready stock, own-factory custom production, quality checking and export packing for boutiques, wholesalers and importers. Whether you need a current stock batch or a custom run made to your reference pictures, we confirm fabric, production, quality control and shipping details before the order.',
                'We have confirmed B2B service experience in Nigeria, Ghana, Kenya and other African markets. Our goal is to help buyers build ranges that fit their local market with direct Guangzhou communication.'
              ].map((text, i) => (
                <motion.p
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>

            {/* Supply proof */}
            <motion.div
              className='mt-8 grid gap-3 sm:grid-cols-3'
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              {[
                { title: 'Market Base', label: siteContent.location },
                { title: 'Ready Stock', label: 'Checked before packing' },
                { title: 'Wholesale Focus', label: siteContent.business }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className='border-brand-gold/30 border-l-2 bg-white px-4 py-3 shadow-sm'
                  whileHover={{ y: -3 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <p className='text-brand-orange text-xs font-bold tracking-[0.16em] uppercase'>
                    {stat.title}
                  </p>
                  <p className='text-brand-brown mt-1 text-sm font-semibold'>{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className='mt-8'
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
            >
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  href='/about'
                  className='text-brand-orange hover:text-brand-gold inline-flex items-center gap-2 font-semibold transition-colors'
                >
                  Read Our Full Story
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                  >
                    <path d='M5 12h14M12 5l7 7-7 7' />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
