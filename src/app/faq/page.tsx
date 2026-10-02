import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND_ENTITY, FAQ_ITEMS } from '@/lib/aioContent';
import { getSiteOrigin } from '@/lib/siteUrl';
import { pageMetadata } from '@/lib/pageMetadata';

const baseUrl = getSiteOrigin();

export const metadata: Metadata = pageMetadata('/faq',
  "Women's Clothing Wholesale FAQ",
  'Answers about Guangzhou clothing wholesale, MOQ, ready stock, custom production, African markets, packing and shipping with Jack African Fashion.'
);

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/faq#faq`,
        url: `${baseUrl}/faq`,
        name: "Wholesale Women's Clothing FAQ",
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${baseUrl}/faq` }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <section className='bg-brand-black py-14 text-white sm:py-20'>
        <div className='mx-auto max-w-5xl px-4'>
          <p className='text-brand-gold text-sm font-bold tracking-[0.2em] uppercase'>
            Buyer answers
          </p>
          <h1 className='font-display mt-3 text-4xl font-bold sm:text-5xl'>
            Guangzhou Women&apos;s Clothing Wholesale FAQ
          </h1>
          <p className='text-brand-cream/80 mt-5 max-w-3xl text-lg leading-8'>
            Clear answers about Jack African Fashion, our Guangzhou supply base, products, MOQ,
            ready stock, custom production and service for African B2B buyers.
          </p>
        </div>
      </section>

      <section className='bg-brand-cream py-12 sm:py-16'>
        <div className='mx-auto max-w-5xl px-4'>
          <div className='border-brand-sand mb-10 rounded-xl border bg-white p-6 sm:p-8'>
            <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
              Supplier identity
            </p>
            <p className='text-brand-black mt-3 text-lg leading-8 font-semibold'>
              {BRAND_ENTITY.identityStatement}
            </p>
            <p className='text-brand-brown/75 mt-3 leading-7'>
              MOQ, available sizes, colors, production lead time and shipping details vary by style
              and order. Jack African Fashion does not claim a universally low MOQ: use each product
              page as the starting point and confirm whether a smaller test order is available for
              that specific batch.
            </p>
          </div>
          <div className='space-y-3'>
            {FAQ_ITEMS.map((item, index) => (
              <details
                key={item.question}
                open={index < 3}
                className='group border-brand-sand open:border-brand-orange/50 rounded-xl border bg-white p-5 open:shadow-sm'
              >
                <summary className='text-brand-black flex cursor-pointer list-none items-start justify-between gap-4 font-semibold'>
                  <span>{item.question}</span>
                  <span className='text-brand-orange shrink-0 text-xl font-bold transition-transform group-open:rotate-45'>
                    +
                  </span>
                </summary>
                <p className='border-brand-sand/60 text-brand-brown/75 mt-4 border-t pt-4 leading-7'>
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <div className='bg-brand-black mt-12 rounded-xl p-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-8'>
            <div>
              <h2 className='font-display text-2xl font-bold'>Need a style-specific answer?</h2>
              <p className='text-brand-cream/70 mt-2'>
                Browse the live catalog, then send the product link with your country and quantity.
              </p>
            </div>
            <Link
              href='/catalog'
              className='bg-brand-orange hover:bg-brand-gold mt-5 inline-flex min-h-12 items-center justify-center rounded-full px-7 font-bold text-white sm:mt-0'
            >
              View Wholesale Catalog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
