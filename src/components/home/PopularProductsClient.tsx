'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function PopularProductsClient({
  children,
  badge,
  title,
  description
}: {
  children: React.ReactNode;
  badge: string;
  title: string;
  description: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className='bg-white py-16 sm:py-20 relative overflow-hidden'>
      {/* Decorative top gradient line */}
      <motion.div
        className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent'
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ originX: 0 }}
      />

      <div className='mx-auto max-w-7xl px-4' ref={ref}>
        <motion.div
          className='mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <motion.span
              className='text-brand-orange text-sm font-semibold tracking-[0.2em] uppercase block'
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {badge}
            </motion.span>
            <motion.h2
              className='font-display text-brand-black mt-3 text-3xl font-bold sm:text-4xl'
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {title}
            </motion.h2>
            <motion.p
              className='text-brand-brown/70 mt-3 max-w-xl'
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {description}
            </motion.p>
          </div>
          <motion.a
            href='/catalog'
            className='text-brand-orange hover:text-brand-gold inline-flex items-center gap-2 font-semibold whitespace-nowrap transition-colors'
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ x: 5 }}
          >
            View All Products
            <svg className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
              <path d='M5 12h14M12 5l7 7-7 7' />
            </svg>
          </motion.a>
        </motion.div>

        {children}

        <div className='mt-10 flex justify-center'>
          <a
            href='/catalog'
            className='inline-flex min-h-12 items-center justify-center rounded-full bg-brand-black px-8 text-sm font-bold text-white transition-colors hover:bg-brand-orange'
          >
            View Full Product Catalog
          </a>
        </div>
      </div>
    </section>
  );
}
