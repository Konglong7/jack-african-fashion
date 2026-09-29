'use client';

import { motion } from 'framer-motion';

const TRUST_PILLARS = [
  {
    title: 'Cargo Agent Coordination',
    subtitle:
      'Orders can be packed for transfer to a buyer-nominated Guangzhou cargo agent. Fees, route and handover timing are confirmed per order.',
    icon: (
      <svg
        className='h-6 w-6'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12'
        />
      </svg>
    )
  },
  {
    title: 'MOQ Confirmed by Style',
    subtitle:
      'MOQ, available size mix and colors are verified against the selected product and current batch before quotation.',
    icon: (
      <svg
        className='h-6 w-6'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3'
        />
      </svg>
    )
  },
  {
    title: 'Showroom Video Check',
    subtitle:
      'Current photos or video can be requested to review visible fabric, sizes and finishing when available before packing.',
    icon: (
      <svg
        className='h-6 w-6'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z'
        />
      </svg>
    )
  },
  {
    title: 'Dispatch After Confirmation',
    subtitle:
      'Packing and cargo handover are scheduled after stock, payment and shipping details are confirmed for the order.',
    icon: (
      <svg
        className='h-6 w-6'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z'
        />
      </svg>
    )
  }
];

export function AfricaTrustStrip() {
  return (
    <section
      className='border-brand-gold/25 via-brand-black border-y bg-gradient-to-b from-[#14100c] to-[#14100c] py-10 sm:py-12'
      aria-label='Wholesale procurement support'
    >
      <div className='mx-auto max-w-7xl px-4'>
        <div className='grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-4'>
          {TRUST_PILLARS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className='group border-brand-gold/20 hover:border-brand-gold/60 relative rounded-2xl border bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] sm:p-6'
            >
              <div className='from-brand-gold/25 to-brand-gold/10 text-brand-gold ring-brand-gold/30 group-hover:ring-brand-gold/60 mb-3.5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-all duration-300 group-hover:scale-105 sm:mb-4 sm:h-13 sm:w-13'>
                {item.icon}
              </div>
              <h3 className='font-display text-sm font-bold tracking-wide text-white sm:text-base'>
                {item.title}
              </h3>
              <p className='text-brand-cream/75 mt-1.5 text-xs leading-relaxed sm:text-[0.84rem]'>
                {item.subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
