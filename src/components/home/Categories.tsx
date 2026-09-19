'use client';

import { motion, useInView, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import type { SiteCategory } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';
import { SiteImage } from '@/components/SiteImage';

const CATEGORY_POSITIONS: Record<string, string> = {
  'Plus Size Dresses': 'center top',
  'Two Piece Sets': 'center 20%',
  'Pleated Dresses': 'center center',
  'Pleated Styles': 'center center',
  'Maxi Dresses': 'center 25%',
  Jumpsuits: 'center center',
  'Custom Orders': 'center center'
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export function Categories({ categories }: { categories: SiteCategory[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id='home-categories' className='bg-brand-cream scroll-mt-28 py-10 sm:py-20'>
      <div className='mx-auto max-w-7xl px-4'>
        {/* Header */}
        <motion.div
          className='mb-12 flex flex-col gap-5 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left'
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className='text-brand-orange text-sm font-semibold tracking-[0.2em] uppercase'>
              Shop by Category
            </span>
            <h2 className='font-display text-brand-black mt-3 text-3xl font-bold sm:text-4xl'>
              Wholesale Styles for Every Boutique
            </h2>
            <p className='text-brand-brown/70 mx-auto mt-3 max-w-2xl sm:mx-0'>
              Browse the categories African buyers order most. Each style is available for ready stock
              or custom production.
            </p>
          </div>
          <Link
            href='/catalog'
            className='border-brand-black text-brand-black hover:bg-brand-black inline-flex min-h-12 items-center justify-center rounded-full border-2 px-6 text-sm font-bold whitespace-nowrap transition-colors hover:text-white'
          >
            View All Products
          </Link>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          className='grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-3'
          variants={containerVariants}
          initial='hidden'
          animate={inView ? 'visible' : 'hidden'}
        >
          {categories.slice(0, 6).map((cat) => {
            const image =
              cat.image || SITE_IMAGES.categories[cat.name as keyof typeof SITE_IMAGES.categories];

            return (
              <motion.div key={cat.name} variants={cardVariants}>
                <Link
                  href={
                    cat.name === 'Custom Orders'
                      ? '/custom-orders'
                      : `/catalog?category=${encodeURIComponent(cat.name)}`
                  }
                  className='group relative block overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl'
                >
                  <motion.div
                    className='bg-brand-sand relative aspect-[4/5] overflow-hidden'
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                  >
                    {image && (
                      <SiteImage
                        src={image}
                        alt={`${cat.name} wholesale African fashion category`}
                        sizes='(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw'
                        className='absolute inset-0'
                        position={CATEGORY_POSITIONS[cat.name] || 'center'}
                      />
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/18 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                  </motion.div>

                  {/* Content */}
                  <div className='p-3.5 sm:p-5'>
                    <h3 className='text-brand-black group-hover:text-brand-orange mb-1 text-sm font-semibold transition-colors sm:mb-1.5 sm:text-lg'>
                      {cat.name}
                    </h3>
                    <p className='text-brand-brown/70 mb-3 text-xs leading-snug line-clamp-2 sm:mb-4 sm:text-sm sm:leading-relaxed'>
                      {cat.description}
                    </p>
                    <motion.span
                      className='text-brand-orange inline-flex items-center gap-1 text-xs font-semibold sm:gap-1.5 sm:text-sm'
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      Shop Now
                      <svg
                        className='h-3.5 w-3.5 sm:h-4 sm:w-4'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth={2}
                        viewBox='0 0 24 24'
                      >
                        <path d='M5 12h14M12 5l7 7-7 7' />
                      </svg>
                    </motion.span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
