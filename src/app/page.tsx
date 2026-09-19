import Image from 'next/image';
import { Hero } from '@/components/home/Hero';
import { AfricaTrustStrip } from '@/components/home/AfricaTrustStrip';
import { Categories } from '@/components/home/Categories';
import { PopularProducts } from '@/components/home/PopularProducts';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { CustomOrderProcess } from '@/components/home/CustomOrderProcess';
import { SocialMedia } from '@/components/home/SocialMedia';
import { AboutSnippet } from '@/components/home/AboutSnippet';
import { BlogTips } from '@/components/home/BlogTips';
import { getSiteContent } from '@/lib/siteContent';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';

const mapEmbedUrl =
  'https://www.google.com/maps?q=Yulong%20Fashion%20Plaza%2C%20Guangzhou&output=embed';

// Marketing pages are statically generated and revalidated periodically so
// admin-added products appear within a minute without sacrificing speed.
export const revalidate = 60;

export default async function HomePage() {
  const siteContent = await getSiteContent();

  return (
    <>
      <Hero siteContent={siteContent} />
      {/* Wholesale factory-direct banner (2026-08-11 ad) -> WhatsApp */}
      <section className='bg-brand-black px-4 pt-6 sm:pt-8'>
        <a
          href={siteWhatsAppLink(
            siteContent,
            'Hello Jack, I saw the factory direct sale banner. Please send me the wholesale price list.'
          )}
          target='_blank'
          rel='noopener noreferrer'
          className='mx-auto block max-w-7xl overflow-hidden rounded-2xl'
        >
          <Image
            src='/images/site/wholesale-banner.jpg'
            alt='African fashion wholesale - factory direct sale, add WhatsApp for price list'
            width={1600}
            height={480}
            sizes='(max-width: 1280px) 100vw, 1280px'
            className='h-auto w-full object-cover'
            loading='lazy'
          />
        </a>
      </section>
      <AfricaTrustStrip />
      <Categories categories={siteContent.categories} />
      <PopularProducts />
      <WhyChooseUs />
      <CustomOrderProcess siteContent={siteContent} />
      <SocialMedia siteContent={siteContent} />
      <AboutSnippet siteContent={siteContent} />
      <BlogTips />
      <section className='bg-brand-cream py-12 sm:py-16'>
        <div className='mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
          <div>
            <p className='text-sm font-bold uppercase tracking-[0.22em] text-brand-orange'>
              Guangzhou market location
            </p>
            <h2 className='font-display mt-3 text-3xl font-bold leading-tight text-brand-black sm:text-4xl'>
              Based at {siteContent.location}, a known wholesale fashion market.
            </h2>
            <p className='mt-5 leading-7 text-brand-brown/80'>
              Yulong Fashion Plaza is publicly listed at No.229 Guangyuan Xi Road, Yuexiu District,
              Guangzhou. For overseas buyers, this location matters: it places us close to active
              garment suppliers, market showrooms, packing resources and export logistics support.
            </p>
            <p className='mt-4 leading-7 text-brand-brown/70'>
              When customers ask where we are, we can show the exact market location and keep the
              conversation grounded in a real Guangzhou wholesale base.
            </p>
            <div className='mt-7 flex flex-col gap-3 sm:flex-row'>
              <a
                href={siteContent.locationUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex min-h-12 items-center justify-center rounded-full bg-brand-black px-7 font-bold text-white transition-colors hover:bg-brand-brown'
              >
                Open in Google Maps
              </a>
              <a
                href={siteWhatsAppLink(siteContent)}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex min-h-12 items-center justify-center rounded-full border-2 border-brand-black px-7 font-bold text-brand-black transition-colors hover:bg-brand-black hover:text-white'
              >
                Ask ready stock
              </a>
            </div>
          </div>

          <div className='relative overflow-hidden rounded-lg border border-white bg-white shadow-sm'>
            <iframe
              title='Yulong Fashion Plaza location map'
              src={mapEmbedUrl}
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              className='h-[340px] w-full sm:h-[430px]'
            />
            <div className='absolute right-4 bottom-4 left-4 max-w-sm rounded-lg bg-white/95 p-4 shadow-sm'>
              <p className='text-xs font-bold uppercase tracking-[0.18em] text-brand-orange'>
                Market address
              </p>
              <p className='mt-1 font-bold text-brand-black'>Yulong Fashion Plaza</p>
              <p className='mt-1 text-sm text-brand-brown/70'>
                No.229 Guangyuan Xi Road, Yuexiu District, Guangzhou
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
