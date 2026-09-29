import Link from 'next/link';
import { DeferredMapEmbed } from '@/components/DeferredMapEmbed';
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
import { BRAND_ENTITY, MARKET_PAGES, WHOLESALE_PAGES } from '@/lib/aioContent';

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
      <section className='bg-brand-black px-4 py-6 sm:py-8'>
        <div className='mx-auto flex max-w-7xl flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-white sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-brand-gold text-xs font-bold tracking-[0.18em] uppercase'>
              Guangzhou own-factory wholesale supply
            </p>
            <h2 className='font-display mt-2 text-2xl font-bold'>
              Confirm ready stock or own-factory custom production with our Guangzhou team.
            </h2>
          </div>
          <a
            href={siteWhatsAppLink(
              siteContent,
              'Hello Jack, please send your current wholesale product list, MOQ and quotation details.'
            )}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-brand-orange hover:bg-brand-gold inline-flex min-h-12 shrink-0 items-center justify-center rounded-full px-7 font-bold text-white'
          >
            Ask for Current Wholesale List
          </a>
        </div>
      </section>
      <AfricaTrustStrip />
      <section className='bg-white py-12 sm:py-16' aria-labelledby='supplier-identity-title'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start'>
            <div>
              <p className='text-brand-orange text-sm font-bold tracking-[0.2em] uppercase'>
                Supplier identity
              </p>
              <h2
                id='supplier-identity-title'
                className='font-display text-brand-black mt-3 text-3xl font-bold sm:text-4xl'
              >
                Jack African Fashion: Guangzhou African Women&apos;s Clothing Supplier
              </h2>
              <p className='text-brand-brown/80 mt-5 max-w-3xl text-lg leading-8'>
                {BRAND_ENTITY.identityStatement} Our wholesale range includes African women&apos;s
                dresses, two piece sets, suits, pleated and knit dresses, plus-size clothing and
                ready-stock fashion.
              </p>
              <dl className='mt-7 grid gap-3 sm:grid-cols-2'>
                {[
                  ['Company', BRAND_ENTITY.name],
                  ['Official B2B website', 'zamique.com'],
                  ['Office & showroom', BRAND_ENTITY.marketBase],
                  ['Business type', BRAND_ENTITY.businessType],
                  ['Primary market', BRAND_ENTITY.market]
                ].map(([term, detail]) => (
                  <div
                    key={term}
                    className='border-brand-sand bg-brand-cream rounded-xl border p-4'
                  >
                    <dt className='text-brand-orange text-xs font-bold tracking-[0.16em] uppercase'>
                      {term}
                    </dt>
                    <dd className='text-brand-black mt-2 font-semibold'>{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className='bg-brand-black space-y-5 rounded-xl p-6 text-white sm:p-8'>
              <div>
                <h3 className='font-display text-2xl font-bold'>Wholesale categories</h3>
                <div className='mt-4 flex flex-wrap gap-2'>
                  {WHOLESALE_PAGES.map((page) => (
                    <Link
                      key={page.slug}
                      href={`/wholesale/${page.slug}`}
                      className='hover:text-brand-black rounded-full border border-white/25 px-4 py-2 text-sm font-semibold hover:bg-white'
                    >
                      {page.title.split('|')[0]}
                    </Link>
                  ))}
                </div>
              </div>
              <div className='border-t border-white/15 pt-5'>
                <h3 className='font-display text-2xl font-bold'>African markets served</h3>
                <div className='mt-4 flex flex-wrap gap-2'>
                  {MARKET_PAGES.map((market) => (
                    <Link
                      key={market.slug}
                      href={`/markets/${market.slug}`}
                      className='hover:bg-brand-gold rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:text-white'
                    >
                      {market.country}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href='/faq' className='text-brand-gold inline-flex font-bold hover:text-white'>
                Read 30 wholesale buyer questions →
              </Link>
            </div>
          </div>
        </div>
      </section>
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
            <p className='text-brand-orange text-sm font-bold tracking-[0.22em] uppercase'>
              Guangzhou market location
            </p>
            <h2 className='font-display text-brand-black mt-3 text-3xl leading-tight font-bold sm:text-4xl'>
              Based at {siteContent.location}, a known wholesale fashion market.
            </h2>
            <p className='text-brand-brown/80 mt-5 leading-7'>
              Yulong Fashion Plaza is publicly listed at No.229 Guangyuan Xi Road, Yuexiu District,
              Guangzhou. For overseas buyers, this location matters: it places us close to active
              garment suppliers, market showrooms, packing resources and export logistics support.
            </p>
            <p className='text-brand-brown/70 mt-4 leading-7'>
              When customers ask where we are, we can show the exact market location and keep the
              conversation grounded in a real Guangzhou wholesale base.
            </p>
            <div className='mt-7 flex flex-col gap-3 sm:flex-row'>
              <a
                href={siteContent.locationUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-brand-black hover:bg-brand-brown inline-flex min-h-12 items-center justify-center rounded-full px-7 font-bold text-white transition-colors'
              >
                Open in Google Maps
              </a>
              <a
                href={siteWhatsAppLink(siteContent)}
                target='_blank'
                rel='noopener noreferrer'
                className='border-brand-black text-brand-black hover:bg-brand-black inline-flex min-h-12 items-center justify-center rounded-full border-2 px-7 font-bold transition-colors hover:text-white'
              >
                Ask ready stock
              </a>
            </div>
          </div>

          <div className='relative overflow-hidden rounded-lg border border-white bg-white shadow-sm'>
            <DeferredMapEmbed title='Yulong Fashion Plaza location map' src={mapEmbedUrl} />
            <div className='absolute right-4 bottom-4 left-4 max-w-sm rounded-lg bg-white/95 p-4 shadow-sm'>
              <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
                Market address
              </p>
              <p className='text-brand-black mt-1 font-bold'>Yulong Fashion Plaza</p>
              <p className='text-brand-brown/70 mt-1 text-sm'>
                No.229 Guangyuan Xi Road, Yuexiu District, Guangzhou
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
