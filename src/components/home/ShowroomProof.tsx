import Image from '@/components/ResponsiveImage';
import { SITE_IMAGES } from '@/lib/siteImages';
import { siteWhatsAppLink, type SiteContent } from '@/lib/siteContentTypes';
import { WhatsAppIcon, ExternalLinkIcon } from '@/components/Icons';

export function ShowroomProof({ siteContent }: { siteContent: SiteContent }) {
  const yulongGoogleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Yulong+Fashion+Plaza+Guangzhou';
  const liuhuaGoogleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=LIUHUA+Fashion+Wholesale+Market+Guangzhou';

  return (
    <section
      id='showroom-visit'
      className='border-t border-[#171615]/10 bg-[#F7F2EB] py-14 text-[#171615] sm:py-20'
      aria-labelledby='home-showroom-title'
    >
      <div className='mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-9'>
        {/* Section Header */}
        <div className='mb-10 max-w-2xl'>
          <span className='mb-3 inline-block text-xs font-bold uppercase tracking-[0.16em] text-[#B17C0E]'>
            Visit Our Guangzhou Wholesale Showrooms
          </span>
          <h2
            id='home-showroom-title'
            className='font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl'
          >
            Two Showrooms Across Guangzhou&apos;s Wholesale Hubs
          </h2>
          <p className='mt-4 text-base leading-relaxed text-[#6F6A64]'>
            Examine our newest seasonal collections, feel fabric textures in person, and inspect
            ready-stock pieces directly inside Guangzhou’s premier apparel wholesale hubs at Yulong
            Fashion Plaza and LIUHUA Market.
          </p>
        </div>

        {/* 2-Column Showroom Layout */}
        <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-12'>
          {/* Left Column: Two Official Showroom Cards (7 cols) */}
          <div className='flex flex-col gap-6 lg:col-span-7'>
            {/* Showroom 1: Yulong Fashion Plaza */}
            <div className='rounded-[22px] border border-[#171615]/10 bg-[#EEE5DA] p-6 shadow-[0_10px_30px_rgba(23,22,21,0.06)] sm:p-8'>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <div className='flex items-center gap-2'>
                  <span className='h-2.5 w-2.5 animate-pulse rounded-full bg-[#E2AB2F]' />
                  <span className='text-xs font-bold uppercase tracking-widest text-[#B17C0E]'>
                    Showroom 01 · Yuexiu District
                  </span>
                </div>
                <span className='rounded-full bg-[#171615]/5 px-3 py-1 text-[11px] font-semibold text-[#171615]'>
                  Sanyuanli Cluster
                </span>
              </div>

              <h3 className='font-display mb-2 text-xl font-bold text-[#171615] sm:text-2xl'>
                Yulong Fashion Plaza Wholesale Showroom
              </h3>
              <p className='mb-1 text-sm leading-relaxed font-medium text-[#171615] sm:text-base'>
                Yulong Fashion Plaza, No. 229 Guangyuan Xi Road, Yuexiu District, Guangzhou, China
              </p>
              <p className='mb-5 text-xs text-[#6F6A64]'>
                (广州市越秀区广园西路229号玉龙服装城)
              </p>

              <div className='flex flex-wrap items-center gap-3'>
                <a
                  href={yulongGoogleMapsUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 rounded-full border border-[#171615]/20 bg-white px-4 py-2.5 text-xs font-semibold text-[#171615] shadow-sm transition-all hover:border-[#171615] hover:bg-[#F7F2EB] hover:shadow-md'
                >
                  <span>Open in Google Maps</span>
                  <ExternalLinkIcon className='h-3.5 w-3.5 shrink-0' />
                </a>
                <a
                  href={siteWhatsAppLink(
                    siteContent,
                    'Hello Jack Fashion, I would like to schedule a visit to your Yulong Fashion Plaza showroom.'
                  )}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1.5 rounded-full bg-[#E2AB2F] px-4 py-2.5 text-xs font-bold text-[#171615] shadow-sm transition-all hover:bg-[#B17C0E] hover:text-white'
                >
                  <WhatsAppIcon className='h-3.5 w-3.5 shrink-0' />
                  <span>Book Yulong Visit</span>
                </a>
              </div>
            </div>

            {/* Showroom 2: LIUHUA Market */}
            <div className='rounded-[22px] border border-[#171615]/10 bg-[#EEE5DA] p-6 shadow-[0_10px_30px_rgba(23,22,21,0.06)] sm:p-8'>
              <div className='mb-4 flex items-center justify-between gap-3'>
                <div className='flex items-center gap-2'>
                  <span className='h-2.5 w-2.5 animate-pulse rounded-full bg-[#E2AB2F]' />
                  <span className='text-xs font-bold uppercase tracking-widest text-[#B17C0E]'>
                    Showroom 02 · Export Apparel Hub
                  </span>
                </div>
                <span className='rounded-full bg-[#171615]/5 px-3 py-1 text-[11px] font-semibold text-[#171615]'>
                  Liuhua Cluster
                </span>
              </div>

              <h3 className='font-display mb-2 text-xl font-bold text-[#171615] sm:text-2xl'>
                LIUHUA Market Boutique Showroom (Shop 0081)
              </h3>
              <p className='mb-1 text-sm leading-relaxed font-medium text-[#171615] sm:text-base'>
                Shop 0081, LIUHUA Market, Guangzhou, China
              </p>
              <p className='mb-5 text-xs text-[#6F6A64]'>
                (广州市流花服装批发市场 0081档)
              </p>

              <div className='flex flex-wrap items-center gap-3'>
                <a
                  href={liuhuaGoogleMapsUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 rounded-full border border-[#171615]/20 bg-white px-4 py-2.5 text-xs font-semibold text-[#171615] shadow-sm transition-all hover:border-[#171615] hover:bg-[#F7F2EB] hover:shadow-md'
                >
                  <span>Open in Google Maps</span>
                  <ExternalLinkIcon className='h-3.5 w-3.5 shrink-0' />
                </a>
                <a
                  href={siteWhatsAppLink(
                    siteContent,
                    'Hello Jack Fashion, I would like to schedule a visit to your LIUHUA Market showroom (Shop 0081).'
                  )}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1.5 rounded-full bg-[#E2AB2F] px-4 py-2.5 text-xs font-bold text-[#171615] shadow-sm transition-all hover:bg-[#B17C0E] hover:text-white'
                >
                  <WhatsAppIcon className='h-3.5 w-3.5 shrink-0' />
                  <span>Book LIUHUA Visit</span>
                </a>
              </div>
            </div>

            {/* Visiting Guidelines Bar */}
            <div className='flex flex-col items-start justify-between gap-4 rounded-xl border border-[#171615]/10 bg-white/70 p-4 backdrop-blur-sm sm:flex-row sm:items-center'>
              <div>
                <p className='text-xs font-bold uppercase tracking-wider text-[#6F6A64]'>
                  Visiting Guidelines
                </p>
                <p className='mt-0.5 text-xs text-[#171615]'>
                  Hours: Mon–Sat 09:30–18:30 (UTC+8). Appointments & walk-in buyers welcome.
                </p>
              </div>
              <a
                href={siteWhatsAppLink(
                  siteContent,
                  'Hello Jack Fashion, I would like to arrange a Guangzhou showroom visit.'
                )}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex shrink-0 items-center gap-2 rounded-full bg-[#171615] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#2A2928]'
              >
                <WhatsAppIcon className='h-3.5 w-3.5 shrink-0' />
                <span>Contact Jack on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Authentic Photographic Evidence (5 cols) */}
          <div className='grid grid-cols-2 gap-4 lg:col-span-5'>
            <div className='relative col-span-2 aspect-[16/10] overflow-hidden rounded-[18px] border border-[#171615]/10 shadow-[0_4px_20px_rgba(23,22,21,0.06)]'>
              <Image
                src={SITE_IMAGES.trust.showroomExterior}
                alt='Jack Fashion wholesale showroom exterior facade in Guangzhou'
                fill
                sizes='(max-width: 1023px) 100vw, 40vw'
                className='object-cover transition-transform duration-500 hover:scale-105'
              />
              <span className='absolute bottom-3 left-3 rounded-full bg-[#171615]/85 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm'>
                Yulong Fashion Plaza Facade
              </span>
            </div>
            <div className='relative aspect-square overflow-hidden rounded-[18px] border border-[#171615]/10 shadow-[0_4px_20px_rgba(23,22,21,0.06)]'>
              <Image
                src={SITE_IMAGES.trust.showroomInterior}
                alt='Jack Fashion showroom interior rack collection and fitting display'
                fill
                sizes='(max-width: 1023px) 50vw, 20vw'
                className='object-cover transition-transform duration-500 hover:scale-105'
              />
              <span className='absolute bottom-2 left-2 rounded-full bg-[#171615]/85 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm'>
                Showroom Interior Display
              </span>
            </div>
            <div className='relative aspect-square overflow-hidden rounded-[18px] border border-[#171615]/10 shadow-[0_4px_20px_rgba(23,22,21,0.06)]'>
              <Image
                src={SITE_IMAGES.trust.showroomPillarJack}
                alt='Jack Fashion Guangzhou wholesale showroom branding pillar'
                fill
                sizes='(max-width: 1023px) 50vw, 20vw'
                className='object-cover transition-transform duration-500 hover:scale-105'
              />
              <span className='absolute bottom-2 left-2 rounded-full bg-[#171615]/85 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm'>
                Jack Fashion Entrance Pillar
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
