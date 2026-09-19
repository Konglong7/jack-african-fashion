'use client';

import { motion } from 'framer-motion';

const TRUST_PILLARS = [
  {
    title: 'Free GZ Cargo Delivery',
    subtitle: 'Free dispatch to your shipping agent warehouse in Guangzhou (Lagos, Accra, Nairobi, Kampala routes).',
    icon: (
      <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth={1.5} viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' />
      </svg>
    )
  },
  {
    title: 'Low MOQ & Mix Batch',
    subtitle: 'Flexible MOQ from 10 pcs/style. Mix sizes and colors supported for African boutique test orders.',
    icon: (
      <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth={1.5} viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3' />
      </svg>
    )
  },
  {
    title: 'Showroom Video Check',
    subtitle: 'WhatsApp video call or high-res photos to verify fabric, sizes, and finishing before packing.',
    icon: (
      <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth={1.5} viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' d='m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z' />
      </svg>
    )
  },
  {
    title: '24–48h Quick Dispatch',
    subtitle: 'Guangzhou Yulong showroom ready-stock orders packed and handed over to cargo within 1–2 days.',
    icon: (
      <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth={1.5} viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' />
      </svg>
    )
  }
];

export function AfricaTrustStrip() {
  return (
    <section className='border-brand-gold/15 bg-brand-black border-y py-8 sm:py-10' aria-label='Wholesale procurement guarantees'>
      <div className='mx-auto max-w-7xl px-4'>
        <div className='grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-4'>
          {TRUST_PILLARS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className='group border-white/10 bg-white/5 hover:border-brand-gold/40 hover:bg-white/10 relative rounded-xl border p-4 transition-all duration-300 sm:p-5'
            >
              <div className='bg-brand-gold/15 text-brand-gold group-hover:bg-brand-gold/25 mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors sm:mb-4 sm:h-12 sm:w-12'>
                {item.icon}
              </div>
              <h3 className='font-display text-sm font-bold text-white sm:text-base'>
                {item.title}
              </h3>
              <p className='text-brand-cream/70 mt-1 text-xs leading-relaxed sm:mt-1.5 sm:text-[0.82rem]'>
                {item.subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
