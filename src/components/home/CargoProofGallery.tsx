'use client';

import Image from 'next/image';
import { buildWhatsAppLink } from '@/lib/whatsappRouter';

const CARGO_EVIDENCES = [
  {
    src: '/images/trust/logistics-packing-bale-nigeria.webp',
    title: 'Reinforced Bale Packaging · Nigeria',
    destination: 'Lagos & Abuja, Nigeria',
    desc: 'Heavy-duty poly-woven wrapping with steel tension straps, moisture barriers and shock protection for ocean or air transit.'
  },
  {
    src: '/images/trust/logistics-marking-ghana-bale.webp',
    title: 'Marked Wholesaler Bales · Ghana',
    destination: 'Accra & Kumasi, Ghana',
    desc: 'Clear buyer identification stencils, SKU itemization and tamper-evident seals prepared for customs clearing.'
  },
  {
    src: '/images/trust/logistics-waybill-handover-lagos.webp',
    title: 'Lagos Cargo Waybill Handover',
    destination: 'Sanyuanli Cargo Terminal, Guangzhou',
    desc: 'Official logistics handover receipts and tracking records signed with trusted Guangzhou African cargo forwarders.'
  },
  {
    src: '/images/trust/logistics-warehouse-staging-africa.webp',
    title: 'African Cargo Staging Bay',
    destination: 'Guangzhou Main Warehouse',
    desc: 'Order consolidation zone where cartons and compressed bales are pre-sorted before same-week port transfer.'
  }
];

const LOGISTICS_BADGES = [
  {
    title: 'Nominated Forwarder Handover',
    desc: 'Free delivery to your chosen cargo agent office in Sanyuanli, Yuexiu or Baiyun districts.'
  },
  {
    title: 'Air Cargo DDP (5–7 Days)',
    desc: 'Customs cleared door-to-door or terminal pickup to Lagos, Accra, Nairobi, Kinshasa & Abidjan.'
  },
  {
    title: 'Sea Freight LCL / FCL',
    desc: 'Economical consolidated container space or dedicated 20ft/40ft ocean containers from Nansha or Huangpu ports.'
  },
  {
    title: 'Zero Missing Item Guarantee',
    desc: 'Dual itemization check with photo confirmation sent via WhatsApp before sealed handover.'
  }
];

export function CargoProofGallery() {
  return (
    <section
      id='cargo-proof'
      className='border-t border-[#171615]/10 bg-[#EEE5DA]/40 py-16 sm:py-20 lg:py-24'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='flex flex-col justify-between gap-6 md:flex-row md:items-end'>
          <div className='max-w-2xl'>
            <span className='inline-block text-xs font-bold uppercase tracking-[0.16em] text-[#B17C0E]'>
              Verifiable Global Delivery
            </span>
            <h2 className='font-display mt-2 text-3xl font-bold tracking-tight text-[#171615] sm:text-4xl lg:text-5xl'>
              Real Cargo Handover &amp; African Shipping Proof
            </h2>
            <p className='mt-3 text-base text-[#6F6A64]'>
              We ship weekly to fashion boutiques and market wholesalers across Nigeria, Ghana, Kenya, South Africa, and international diaspora hubs. See our actual packed bales, waybills, and Guangzhou warehouse staging.
            </p>
          </div>

          <a
            href={buildWhatsAppLink('lucas', 'Hello Lucas, I would like to check air and sea shipping rates to my destination.')}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0B7A3E] px-6 py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#086532]'
          >
            <span>Inquire Cargo Rates &amp; Handover</span>
            <span aria-hidden='true'>&rarr;</span>
          </a>
        </div>

        {/* Real Photo Grid */}
        <div className='mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {CARGO_EVIDENCES.map((item, index) => (
            <div
              key={index}
              className='group flex flex-col overflow-hidden rounded-[22px] border border-[#171615]/10 bg-white shadow-xs transition-transform duration-300 hover:-translate-y-1 hover:shadow-md'
            >
              <div className='relative aspect-4/3 w-full overflow-hidden bg-[#EEE5DA]'>
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div className='absolute top-3 left-3'>
                  <span className='inline-flex items-center rounded-full bg-[#171615]/85 px-2.5 py-1 text-[10px] font-bold text-[#F7F2EB] backdrop-blur-xs'>
                    {item.destination}
                  </span>
                </div>
              </div>

              <div className='flex flex-1 flex-col justify-between p-5'>
                <div>
                  <h3 className='font-display text-base font-bold text-[#171615]'>
                    {item.title}
                  </h3>
                  <p className='mt-2 text-xs leading-relaxed text-[#6F6A64]'>
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Logistics Guarantee Badges */}
        <div className='mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6'>
          {LOGISTICS_BADGES.map((b, i) => (
            <div
              key={i}
              className='rounded-[20px] border border-[#171615]/8 bg-[#F7F2EB] p-5 shadow-xs'
            >
              <div className='mb-2 flex items-center gap-2'>
                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-[#0B7A3E]/10 text-xs font-bold text-[#0B7A3E]'>
                  ✓
                </span>
                <h4 className='text-xs font-bold text-[#171615] sm:text-sm'>
                  {b.title}
                </h4>
              </div>
              <p className='text-xs leading-relaxed text-[#6F6A64]'>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
