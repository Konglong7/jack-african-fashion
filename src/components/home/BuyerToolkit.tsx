'use client';

import { buildWhatsAppLink } from '@/lib/whatsappRouter';

export function BuyerToolkit() {
  const tools = [
    {
      badge: 'B2B Catalog Resource',
      title: '2026 Seasonal Lookbook & Price List',
      desc: 'Access high-resolution product photography, detailed fabric specs, and wholesale tier pricing for over 100+ active catalog styles.',
      actionText: 'Request Lookbook (PDF)',
      href: buildWhatsAppLink('sarah', 'Hello Sarah, please send me the latest 2026 Jack Fashion Lookbook & wholesale catalog PDF.'),
      highlight: false
    },
    {
      badge: 'Fit & Sizing Spec',
      title: 'African Plus-Size Measurement & Grading Guide',
      desc: 'Engineered specifically for African female silhouettes. Review bust, waist, and hip ratios spanning L, XL, 2XL, 3XL, 4XL, up to 7XL.',
      actionText: 'Get Sizing Chart',
      href: buildWhatsAppLink('david', 'Hello David, please send me the African Plus-Size measurements and size grading chart.'),
      highlight: false
    },
    {
      badge: 'Live Virtual Inspection',
      title: '1-on-1 Video Showroom & Factory Tour',
      desc: 'Cannot travel to Guangzhou in person? Schedule a live WhatsApp video walk-through of our Yulong and LIUHUA showrooms and fabric racks.',
      actionText: 'Book Video Audit',
      href: buildWhatsAppLink('jack', 'Hello Jack, I would like to schedule a 1-on-1 live WhatsApp video tour of your Guangzhou showrooms.'),
      highlight: true
    }
  ];

  return (
    <section
      id='buyer-toolkit'
      className='border-t border-[#171615]/10 bg-[#F7F2EB] py-16 sm:py-20 lg:py-24'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='max-w-2xl'>
          <span className='inline-block text-xs font-bold uppercase tracking-[0.16em] text-[#B17C0E]'>
            Empowering Boutique Owners &amp; Wholesalers
          </span>
          <h2 className='font-display mt-2 text-3xl font-bold tracking-tight text-[#171615] sm:text-4xl lg:text-5xl'>
            B2B Buyer Resources &amp; Support Toolkit
          </h2>
          <p className='mt-3 text-base text-[#6F6A64]'>
            Everything you need to evaluate collections, verify quality, and scale replenishment with complete peace of mind.
          </p>
        </div>

        <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-3'>
          {tools.map((t, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between rounded-[24px] border p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${
                t.highlight
                  ? 'border-2 border-[#E2AB2F] bg-gradient-to-b from-white via-[#FAF6F0] to-[#F5EFE6] shadow-lg ring-2 ring-[#E2AB2F]/20'
                  : 'border-[#171615]/10 bg-white shadow-xs hover:border-[#171615]/20 hover:shadow-md'
              }`}
            >
              <div>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
                    t.highlight
                      ? 'bg-[#E2AB2F]/20 text-[#8A661B]'
                      : 'bg-[#EEE5DA] text-stone-700'
                  }`}
                >
                  {t.badge}
                </span>

                <h3 className='font-display mt-4 text-xl font-bold text-[#171615] sm:text-2xl'>
                  {t.title}
                </h3>

                <p className='mt-3 text-xs leading-relaxed text-[#6F6A64] sm:text-sm'>
                  {t.desc}
                </p>
              </div>

              <div className='mt-8 pt-4 border-t border-[#171615]/8'>
                <a
                  href={t.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold shadow-xs transition-all ${
                    t.highlight
                      ? 'bg-[#E2AB2F] text-[#171615] hover:bg-[#B17C0E] hover:text-white'
                      : 'bg-[#171615] text-[#F7F2EB] hover:bg-[#B17C0E] hover:text-white'
                  }`}
                >
                  <span>{t.actionText}</span>
                  <span aria-hidden='true'>&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
