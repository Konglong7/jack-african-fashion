'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';
import { WhatsAppIcon } from '@/components/Icons';
import { SiteImage } from '@/components/SiteImage';

const SOCIAL_CARDS = [
  {
    name: 'WhatsApp Catalog',
    description: 'Get our latest catalog and price list directly on WhatsApp.',
    color: '#25D366',
    gradient: 'from-[#25D366] to-[#128C7E]',
    icon: <WhatsAppIcon className='h-8 w-8' />
  },
  {
    name: 'Facebook Page',
    description: 'Follow new arrivals and restocks on our Facebook page.',
    color: '#1877F2',
    gradient: 'from-[#1877F2] to-[#0D65D9]',
    icon: (
      <svg className='h-8 w-8' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
      </svg>
    )
  },
  {
    name: 'TikTok Videos',
    description: 'Watch style videos and behind-the-scenes on TikTok.',
    color: '#000000',
    gradient: 'from-brand-black to-[#EE1D52]',
    icon: (
      <svg className='h-8 w-8' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' />
      </svg>
    )
  },
  {
    name: 'Instagram Styles',
    description: 'See styled looks and customer photos on Instagram.',
    color: '#E4405F',
    gradient: 'from-[#833AB4] via-[#FD1D1D] to-[#FCB045]',
    icon: (
      <svg className='h-8 w-8' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.14 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
      </svg>
    )
  }
];

export function SocialMedia({ siteContent }: { siteContent: SiteContent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const hrefs = [
    siteWhatsAppLink(siteContent),
    siteContent.socialLinks.facebook,
    siteContent.socialLinks.tiktok,
    siteContent.socialLinks.instagram
  ];

  return (
    <section className='bg-brand-cream relative overflow-hidden py-16 sm:py-20'>
      {/* Decorative background — static tint (was infinite scale/opacity). */}
      <div className='bg-brand-orange/5 pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full' />

      <div className='relative mx-auto max-w-7xl px-4' ref={ref}>
        {/* Header */}
        <motion.div
          className='mb-12 text-center'
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className='text-brand-orange text-sm font-semibold tracking-[0.2em] uppercase'>
            Stay Connected
          </span>
          <h2 className='font-display text-brand-black mt-3 text-3xl font-bold sm:text-4xl'>
            Follow Our Latest Styles
          </h2>
          <p className='text-brand-brown/70 mx-auto mt-3 max-w-2xl'>
            New styles are updated regularly on Facebook, TikTok, Instagram and WhatsApp.
          </p>
        </motion.div>

        <motion.div
          className='mb-8 grid overflow-hidden rounded-xl bg-white shadow-sm lg:grid-cols-[0.56fr_0.44fr]'
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className='relative aspect-video bg-[#128C7E]'>
            <SiteImage
              src={SITE_IMAGES.whatsappCatalogBanner}
              alt='WhatsApp contact guide for wholesale fashion catalog requests'
              sizes='(max-width: 1024px) 100vw, 46vw'
              className='absolute inset-0'
              position='left center'
            />
          </div>
          <div className='from-brand-sand/80 to-brand-cream flex flex-col justify-center bg-gradient-to-br p-6 sm:p-8 lg:p-10'>
            <span className='text-brand-orange text-sm font-semibold tracking-[0.2em] uppercase'>
              WhatsApp Catalog
            </span>
            <h3 className='font-display text-brand-black mt-3 text-2xl font-bold'>
              Ask for current stock, wholesale prices and shipping options.
            </h3>
            <a
              href={siteWhatsAppLink(siteContent)}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-5 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#20BA5A]'
            >
              <WhatsAppIcon className='h-5 w-5' />
              Contact on WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Social cards */}
        <motion.div
          className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
          initial='hidden'
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } }
          }}
        >
          {SOCIAL_CARDS.map((card, index) => (
            <motion.a
              key={card.name}
              href={hrefs[index]}
              target='_blank'
              rel='noopener noreferrer'
              className='group relative overflow-hidden rounded-xl bg-white p-6 text-center shadow-sm'
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                }
              }}
              whileHover={{
                y: -8,
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)'
              }}
            >
              {/* Hover gradient border */}
              <motion.div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
              />

              {/* Animated icon container */}
              <motion.div
                className={`mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br ${card.gradient} relative flex items-center justify-center text-white`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <motion.div className='relative z-10'>{card.icon}</motion.div>
              </motion.div>

              <h3 className='text-brand-black group-hover:text-brand-orange mb-2 text-lg font-semibold transition-colors'>
                {card.name}
              </h3>
              <p className='text-brand-brown/70 mb-4 text-sm leading-relaxed'>{card.description}</p>

              <motion.span
                className='text-brand-orange inline-flex items-center gap-1.5 text-sm font-semibold'
                whileHover={{ x: 5 }}
              >
                Follow Now
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
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
