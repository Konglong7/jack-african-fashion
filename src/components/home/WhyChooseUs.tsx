'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { SITE_IMAGES } from '@/lib/siteImages';

const SELLING_POINTS = [
  {
    title: 'Guangzhou Market Base',
    description:
      'Based at Yulong Fashion Plaza, close to active womenswear showrooms, fabric suppliers and production resources.',
    icon: (
      <svg
        className='h-8 w-8'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path d='M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z' />
      </svg>
    )
  },
  {
    title: 'Ready Stock Handling',
    description:
      'Ready-stock orders are selected, counted and checked before packing, so buyers can restock with clearer order control.',
    icon: (
      <svg
        className='h-8 w-8'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path d='M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' />
      </svg>
    )
  },
  {
    title: 'Factory Production',
    description:
      'Reference pictures can be quoted by fabric, size ratio and quantity, then handled through Guangzhou production partners.',
    icon: (
      <svg
        className='h-8 w-8'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path d='M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42' />
      </svg>
    )
  },
  {
    title: 'Export Packing',
    description:
      'Orders are packed with export routes in mind, with clear style details confirmed before dispatch.',
    icon: (
      <svg
        className='h-8 w-8'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418' />
      </svg>
    )
  }
];

export function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className='bg-brand-cream relative overflow-hidden py-16 sm:py-20'>
      {/* Decorative background elements — static tints (was infinite scale/opacity). */}
      <div className='bg-brand-orange/5 pointer-events-none absolute -top-20 -left-20 h-40 w-40 rounded-full' />
      <div className='bg-brand-gold/5 pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full' />

      <div className='relative mx-auto max-w-7xl px-4'>
        {/* Header */}
        <motion.div
          className='mb-12 text-center'
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className='text-brand-orange text-sm font-semibold tracking-[0.2em] uppercase'>
            Why Partner With Us
          </span>
          <h2 className='font-display text-brand-black mt-3 text-3xl leading-tight font-bold sm:text-4xl'>
            Real Guangzhou Supply Support
          </h2>
        </motion.div>

        <motion.div
          className='mb-10 grid items-center gap-6 overflow-hidden rounded-xl bg-white shadow-sm lg:grid-cols-[1.1fr_0.9fr]'
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className='relative aspect-[4/3] w-full lg:aspect-[16/9]'>
            <Image
              src={SITE_IMAGES.warehouseShipping}
              alt='Warehouse packing and shipping for African womenswear wholesale orders'
              fill
              sizes='(max-width: 1024px) 100vw, 58vw'
              className='object-cover'
            />
          </div>
          <div className='p-6 sm:p-8'>
            <span className='text-brand-orange text-sm font-semibold tracking-[0.2em] uppercase'>
              Packing & Shipping
            </span>
            <h3 className='font-display text-brand-black mt-3 text-2xl font-bold'>
              Stock, check, pack and dispatch from Guangzhou.
            </h3>
            <p className='text-brand-brown/70 mt-3 leading-relaxed'>
              Ready-stock orders are prepared for export shipping, with order details confirmed
              clearly before dispatch.
            </p>
          </div>
        </motion.div>

        {/* Proof Grid */}
        <motion.div
          ref={ref}
          className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
          initial='hidden'
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {SELLING_POINTS.map((point, i) => (
            <motion.div
              key={i}
              className='group relative'
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                }
              }}
            >
              <div className='border-brand-gold/30 relative h-full overflow-hidden border-l-2 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
                <div className='relative z-10'>
                  <motion.div
                    className='text-brand-orange bg-brand-cream mb-4 flex h-14 w-14 items-center justify-center rounded-full'
                    whileHover={{
                      scale: 1.06,
                      rotate: 3
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {point.icon}
                    </motion.div>
                  </motion.div>

                  <h3 className='text-brand-black group-hover:text-brand-orange mb-2 text-lg font-semibold transition-colors'>
                    {point.title}
                  </h3>
                  <p className='text-brand-brown/70 text-sm leading-relaxed'>{point.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
