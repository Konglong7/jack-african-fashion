'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { SITE_IMAGES } from '@/lib/siteImages';
import { SiteImage } from '@/components/SiteImage';

const BLOG_POSTS = [
  {
    title: "How to Choose Women's Dresses for the African Market",
    excerpt:
      'Practical tips on styles, colours, sizes and fabrics that sell well across Nigeria, Ghana and East Africa.',
    tag: 'Buying Guide',
    image: SITE_IMAGES.blog[0],
    alt: "Women's dresses buying guide for African market boutiques"
  },
  {
    title: 'Ready Stock vs Custom Orders: What Buyers Should Know',
    excerpt:
      'Understand the difference in MOQ, lead time, price and risk — and which option fits your boutique best.',
    tag: 'Business',
    image: SITE_IMAGES.blog[1],
    alt: 'Ready stock versus custom orders wholesale fashion guide'
  },
  {
    title: 'How to Get Better Factory Prices from Guangzhou',
    excerpt:
      'What drives wholesale pricing and how ordering larger quantities unlocks better per-piece rates.',
    tag: 'Wholesale Tips',
    image: SITE_IMAGES.blog[2],
    alt: 'Guangzhou factory price negotiation for wholesale fashion buyers'
  }
];

export function BlogTips() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className='relative overflow-hidden bg-white py-16 sm:py-20' ref={ref}>
      {/* Decorative gradient line */}
      <motion.div
        className='via-brand-gold absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent to-transparent'
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ originX: 0 }}
      />

      <div className='mx-auto max-w-7xl px-4'>
        {/* Header */}
        <motion.div
          className='mb-12 text-center'
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className='text-brand-orange text-sm font-semibold tracking-[0.2em] uppercase'>
            Market Insights
          </span>
          <h2 className='font-display text-brand-black mt-3 text-3xl font-bold sm:text-4xl'>
            Wholesale Fashion Tips
          </h2>
          <p className='text-brand-brown/70 mx-auto mt-3 max-w-2xl'>
            Helpful knowledge for boutique owners and importers sourcing from Guangzhou.
          </p>
        </motion.div>

        {/* Blog Cards */}
        <motion.div
          className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
          initial='hidden'
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
        >
          {BLOG_POSTS.map((post, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: 'easeOut' }
                }
              }}
            >
              <Link
                href='/about'
                className='group bg-brand-cream block h-full overflow-hidden rounded-xl shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl'
              >
                <motion.div
                  className='relative aspect-[16/10] overflow-hidden'
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <SiteImage
                    src={post.image}
                    alt={post.alt}
                    className='absolute inset-0'
                    fit='cover'
                    position='center'
                    sizes='(max-width: 1024px) 100vw, 33vw'
                  />
                </motion.div>

                {/* Content */}
                <div className='p-6'>
                  <motion.span
                    className='text-brand-orange bg-brand-orange/10 mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold'
                    whileHover={{ scale: 1.05 }}
                  >
                    {post.tag}
                  </motion.span>
                  <h3 className='text-brand-black group-hover:text-brand-orange mb-2 text-lg leading-snug font-semibold transition-colors'>
                    {post.title}
                  </h3>
                  <p className='text-brand-brown/70 mb-4 text-sm leading-relaxed'>{post.excerpt}</p>

                  <motion.span
                    className='text-brand-orange inline-flex items-center gap-1.5 text-sm font-semibold'
                    whileHover={{ x: 5 }}
                  >
                    Read More
                    <svg
                      className='h-4 w-4'
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
          ))}
        </motion.div>
      </div>
    </section>
  );
}
