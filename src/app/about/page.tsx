import Link from 'next/link';
import { getSiteContent } from '@/lib/siteContent';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { BRAND_ENTITY } from '@/lib/aioContent';
import { pageMetadata } from '@/lib/pageMetadata';
import { WholesaleContact } from '@/components/home/WholesaleContact';
import { WhatsAppIcon } from '@/components/Icons';
import { getLegacyBrandName } from '@/lib/organizationJsonLd';
import { FactoryGallery } from '@/components/FactoryGallery';
import { AFRICAN_FASHION_SALES_ACCOUNTS, buildWhatsAppLink } from '@/lib/whatsappRouter';

export const metadata = pageMetadata(
  '/about',
  'Guangzhou Womenswear Manufacturer & Wholesaler | Jack Fashion Profile',
  'Two decades of specialized African womenswear manufacturing. Guangzhou wholesale showrooms at Yulong Plaza Building 2 (Shop 3063) & LIUHUA Market, 50,000+ ready-stock warehouse and custom OEM production.'
);

const MILESTONES = [
  {
    year: '2004',
    title: 'Foundations in Guangzhou Wholesale Hub',
    desc: 'Began operations in the heart of Guangzhou apparel trading clusters, focusing on authentic African wax prints, volume maxi skirts, and occasionwear.'
  },
  {
    year: '2012',
    title: 'Integrated Workshop & Dedicated Pattern Room',
    desc: 'Established our proprietary sample drafting and multi-ply cutting lines, pioneering true-to-size plus-size grading specifically for African female curves.'
  },
  {
    year: '2019',
    title: 'Dual Showrooms at Yulong & LIUHUA Market',
    desc: 'Opened flagship wholesale showrooms at Yulong Fashion Plaza (Building 2, Shop 3063) and LIUHUA Market (Shop 0081) to welcome international trade delegations.'
  },
  {
    year: '2026',
    title: 'Global Fast-Fulfillment & 600K+ Annual Capacity',
    desc: 'Expanded direct export lines to over 30 countries across Nigeria, Ghana, Kenya, South Africa, UK, and the Americas with 48-hour ready-stock dispatch.'
  }
];

const CORE_VALUES = [
  {
    title: 'Guaranteed Physical Showrooms',
    desc: 'Real, physical wholesale showrooms at Yulong Fashion Plaza (Building 2, Shop 3063) and LIUHUA Market Shop 0081 where buyers inspect fabric drape, seams, and fit live in Guangzhou.'
  },
  {
    title: 'Honest Inventory & Fast Dispatch',
    desc: 'Over 50,000 units of physical ready stock ready for same-week shipping alongside 600K+ annual manufacturing capacity. No fictitious mockups or phantom lead times.'
  },
  {
    title: 'Strict Needle & Seam Safety QC',
    desc: '100% in-line manual workmanship inspection paired with magnetic needle detector screening before export carton banding.'
  },
  {
    title: 'Dedicated Regional Account Management',
    desc: 'Personalized trade desks for West Africa, East/Southern Africa, custom OEM sampling, and cargo clearing coordination.'
  }
];

export default async function AboutPage() {
  const siteContent = await getSiteContent();
  const legacyBrandName = getLegacyBrandName();

  return (
    <div className='bg-[#F7F2EB] text-[#171615]'>
      {/* Hero Section */}
      <section className='border-b border-[#171615]/10 bg-gradient-to-b from-[#EEE5DA]/50 to-[#F7F2EB] py-14 sm:py-20 lg:py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <nav aria-label='Breadcrumb' className='mb-6 flex items-center gap-2 text-xs font-semibold text-[#6F6A64]'>
            <Link href='/' className='hover:text-[#171615]'>Home</Link>
            <span aria-hidden='true'>/</span>
            <span className='text-[#B17C0E]'>About Jack Fashion</span>
          </nav>

          <div className='max-w-3xl'>
            <span className='inline-block rounded-full bg-[#EEE5DA] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#B17C0E]'>
              Company Profile &amp; Manufacturing Ecosystem
            </span>
            <h1 className='font-display mt-4 text-3xl font-bold tracking-tight text-[#171615] sm:text-5xl lg:text-6xl'>
              Two Decades of Crafting African Fashion &amp; Supplying Global Boutiques
            </h1>
            <p className='mt-6 text-base leading-relaxed text-[#6F6A64] sm:text-lg'>
              {BRAND_ENTITY.identityStatement}
            </p>
            <p className='mt-3 text-sm leading-relaxed text-[#6F6A64]'>
              From our flagship wholesale showrooms at Yulong Fashion Plaza and LIUHUA Market to our Guangzhou production floor, Jack Fashion operates a seamless, integrated supply chain connecting design, cutting, sewing, quality inspection, and direct African freight handover.
            </p>

            {legacyBrandName && (
              <p className='mt-4 rounded-xl border border-[#171615]/10 bg-white/70 p-3 text-xs text-[#6F6A64]'>
                <span className='font-semibold text-[#171615]'>Brand transition note:</span> Jack Fashion was previously presented online as {legacyBrandName}.
              </p>
            )}

            <div className='mt-8 flex flex-wrap gap-4'>
              <a
                href={siteWhatsAppLink(siteContent)}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-full bg-[#0B7A3E] px-7 py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#086532]'
              >
                <WhatsAppIcon className='h-4 w-4' />
                <span>Chat with Factory Principal</span>
              </a>
              <Link
                href='/catalog'
                className='inline-flex items-center gap-2 rounded-full border border-[#171615]/20 bg-white px-7 py-3.5 text-xs font-bold text-[#171615] shadow-xs transition-all hover:bg-[#171615] hover:text-[#F7F2EB]'
              >
                <span>Explore Catalog Styles</span>
                <span aria-hidden='true'>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 20-Year Milestones Timeline */}
      <section className='border-b border-[#171615]/10 py-16 sm:py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl'>
            <span className='text-xs font-bold uppercase tracking-wider text-[#B17C0E]'>
              Our Heritage &amp; Evolution
            </span>
            <h2 className='font-display mt-2 text-2xl font-bold tracking-tight text-[#171615] sm:text-4xl'>
              20 Years of Specialized African Womenswear Excellence
            </h2>
          </div>

          <div className='mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {MILESTONES.map((item, idx) => (
              <div
                key={idx}
                className='relative rounded-[22px] border border-[#171615]/10 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md'
              >
                <div className='font-mono text-2xl font-extrabold text-[#B17C0E]'>
                  {item.year}
                </div>
                <h3 className='font-display mt-3 text-base font-bold text-[#171615]'>
                  {item.title}
                </h3>
                <p className='mt-2 text-xs leading-relaxed text-[#6F6A64]'>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Trade Support Desk Directory */}
      <section className='border-b border-[#171615]/10 bg-[#EEE5DA]/40 py-16 sm:py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl'>
            <span className='text-xs font-bold uppercase tracking-wider text-[#B17C0E]'>
              Global Trade Organization
            </span>
            <h2 className='font-display mt-2 text-2xl font-bold tracking-tight text-[#171615] sm:text-4xl'>
              Dedicated Regional Trade Desks
            </h2>
            <p className='mt-3 text-sm text-[#6F6A64]'>
              Our international export team provides specialized assistance for specific African markets, custom OEM sampling, and cargo agent handover.
            </p>
          </div>

          <div className='mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {AFRICAN_FASHION_SALES_ACCOUNTS.map((rep) => (
              <div
                key={rep.id}
                className='flex flex-col justify-between rounded-[22px] border border-[#171615]/10 bg-white p-6 shadow-xs transition-all hover:border-[#E2AB2F]'
              >
                <div>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#171615] font-serif text-sm font-bold text-[#F7F2EB]'>
                      {rep.avatarText}
                    </div>
                    <div>
                      <h3 className='text-sm font-bold text-[#171615] sm:text-base'>
                        {rep.name}
                      </h3>
                      <p className='text-xs font-semibold text-[#B17C0E]'>
                        {rep.title}
                      </p>
                    </div>
                  </div>

                  <p className='mt-3 text-xs text-[#6F6A64]'>
                    {rep.chineseTitle}
                  </p>

                  <div className='mt-3 flex flex-wrap gap-1'>
                    {rep.tags.map((tag) => (
                      <span
                        key={tag}
                        className='rounded-md bg-[#EEE5DA] px-2 py-0.5 text-[10px] font-medium text-stone-700'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='mt-6 pt-4 border-t border-[#171615]/8'>
                  <a
                    href={buildWhatsAppLink(rep)}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#0B7A3E] py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#086532]'
                  >
                    <WhatsAppIcon className='h-3.5 w-3.5' />
                    <span>Connect with {rep.name}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Manufacturing Values & Standards */}
      <section className='border-b border-[#171615]/10 py-16 sm:py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl'>
            <span className='text-xs font-bold uppercase tracking-wider text-[#B17C0E]'>
              B2B Commitments
            </span>
            <h2 className='font-display mt-2 text-2xl font-bold tracking-tight text-[#171615] sm:text-4xl'>
              Why Boutiques &amp; Wholesalers Partner With Us
            </h2>
          </div>

          <div className='mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {CORE_VALUES.map((val, i) => (
              <div
                key={i}
                className='rounded-[22px] border border-[#171615]/10 bg-white p-6 shadow-xs'
              >
                <div className='mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#E2AB2F]/20 text-xs font-bold text-[#8A661B]'>
                  0{i + 1}
                </div>
                <h3 className='font-display text-base font-bold text-[#171615]'>
                  {val.title}
                </h3>
                <p className='mt-2 text-xs leading-relaxed text-[#6F6A64]'>
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guangzhou Factory & Showroom Evidence */}
      <FactoryGallery path='/about' />

      {/* Direct Contact & Showroom Visit Booking */}
      <WholesaleContact siteContent={siteContent} />
    </div>
  );
}
