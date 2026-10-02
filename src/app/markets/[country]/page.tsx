import type { Metadata } from 'next';
import Image from '@/components/ResponsiveImage';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BRAND_ENTITY, MARKET_PAGES, getMarketPage } from '@/lib/aioContent';
import { getSiteContent } from '@/lib/siteContent';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';
import { getSiteOrigin } from '@/lib/siteUrl';
import { WhatsAppIcon } from '@/components/Icons';
import { pageMetadata } from '@/lib/pageMetadata';

interface PageProps {
  params: Promise<{ country: string }>;
}

const baseUrl = getSiteOrigin();

export function generateStaticParams() {
  return MARKET_PAGES.map((market) => ({ country: market.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const market = getMarketPage(country);
  if (!market) return { title: 'Market Page Not Found' };

  return {
    ...pageMetadata(`/markets/${market.slug}`, market.title, market.description),
    title: market.title,
    description: market.description,
    alternates: { canonical: `${baseUrl}/markets/${market.slug}` },
    openGraph: {
      title: `${market.title} | Jack African Fashion`,
      description: market.description,
      url: `${baseUrl}/markets/${market.slug}`,
      siteName: BRAND_ENTITY.name,
      type: 'website',
      images: [SITE_IMAGES.whatsappCatalogBanner]
    }
  };
}

const orderSteps = [
  ['1. Select', 'Choose styles from the catalog or send reference pictures for custom production.'],
  [
    '2. Confirm',
    'Share quantity, sizes, colors and destination so we can verify MOQ and availability.'
  ],
  [
    '3. Quote',
    'Review the written product, production, packing and shipping details before payment.'
  ],
  [
    '4. Check & pack',
    'Goods are counted, checked and packed in Guangzhou for the agreed dispatch route.'
  ]
];

export default async function MarketPage({ params }: PageProps) {
  const { country } = await params;
  const market = getMarketPage(country);
  if (!market) notFound();

  const siteContent = await getSiteContent();
  const whatsappLink = siteWhatsAppLink(
    siteContent,
    `Hello Jack, I am a wholesale buyer in ${market.country}. Please send current styles, MOQ and shipping information.`
  );
  const pageUrl = `${baseUrl}/markets/${market.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: market.title,
        description: market.description,
        about: { '@id': `${baseUrl}/#organization` },
        areaServed: { '@type': 'Country', name: market.country },
        inLanguage: 'en'
      },
      {
        '@type': 'Service',
        name: `Women's clothing wholesale supply for ${market.country}`,
        provider: { '@id': `${baseUrl}/#organization` },
        areaServed: { '@type': 'Country', name: market.country },
        serviceType: "Women's clothing wholesale from Guangzhou"
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: market.country, item: pageUrl }
        ]
      }
    ]
  };

  const countryEvidence =
    market.slug === 'nigeria'
      ? [
        {
          image: SITE_IMAGES.trust.waybillHandoverLagos,
          badge: 'Lagos Cargo Waybill',
          title: 'Guangzhou ➔ Lagos Freight Waybill & Container Staging',
          desc: 'Official cargo receipt waybill (12 CTNS, 285 KGS, Guangzhou to Lagos) stamped and handed over at Guangzhou Africa Route cargo depot.'
        },
        {
          image: SITE_IMAGES.trust.packingNigeriaLagos,
          badge: 'LOS - NIG Marking',
          title: 'Waterproof Yellow-Tape Bale Packing for Lagos',
          desc: 'High-tensile yellow export tape wrapping around waterproof woven bales, hand-marked "LOS - NIG" for air and sea cargo protection.'
        }
      ]
      : market.slug === 'ghana'
        ? [
          {
            image: SITE_IMAGES.trust.markingGhanaBale,
            badge: 'ACC - GHA Destination',
            title: 'Hand-Marked Cargo Bale for Accra, Ghana',
            desc: 'Marking export destination code ACC - GHA on heavy-duty waterproof bundles before dispatch to Guangzhou airport forwarder.'
          },
          {
            image: SITE_IMAGES.trust.warehouseStagingAfrica,
            badge: 'Guangzhou Staging',
            title: 'Pan-African Cargo Staging (Accra, Lagos, Nairobi)',
            desc: 'Sealed and labeled bales staged at Guangzhou warehouse ready for direct air cargo consolidation.'
          }
        ]
        : market.slug === 'kenya'
          ? [
            {
              image: SITE_IMAGES.trust.warehouseStagingAfrica,
              badge: 'NBO - KEN Staging',
              title: 'Staged Bales Marked for Nairobi, Kenya (NBO - KEN)',
              desc: 'Export bales prepared with client IDs and destination codes for regular consolidation flights to Nairobi.'
            },
            {
              image: SITE_IMAGES.trust.styleSelectionSwatch,
              badge: 'Style Verification',
              title: 'Color Swatch & Batch Verification in Guangzhou',
              desc: 'Confirming print swatches and sizes in our showroom before bulk packing and export documentation.'
            }
          ]
          : [
            {
              image: SITE_IMAGES.trust.warehouseStagingAfrica,
              badge: 'Pan-African Export',
              title: 'Professional Multi-Country Staging in Guangzhou',
              desc: 'Export-ready bales packed with yellow moisture-resistant tape and verified against strict packing lists.'
            },
            {
              image: SITE_IMAGES.trust.sizeBust4xl,
              badge: 'True African Plus Size',
              title: '4XL Flat Tape Measurements (120 cm Bust)',
              desc: 'Authentic measurements verified with soft tape to ensure generous African fit for dresses and two-piece sets.'
            }
          ];

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <section className='bg-brand-black py-14 text-white sm:py-20'>
        <div className='mx-auto max-w-6xl px-4'>
          <p className='text-brand-gold text-sm font-bold tracking-[0.2em] uppercase'>
            Guangzhou supplier · {market.country} market
          </p>
          <h1 className='font-display mt-3 max-w-4xl text-4xl font-bold sm:text-5xl'>
            {market.title}
          </h1>
          <p className='text-brand-cream/80 mt-5 max-w-3xl text-lg leading-8'>
            {market.description}
          </p>
          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <Link
              href='/catalog'
              className='bg-brand-orange hover:bg-brand-gold inline-flex min-h-12 items-center justify-center rounded-full px-7 font-bold text-white'
            >
              Browse Wholesale Styles
            </Link>
            <a
              href={whatsappLink}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-brand-black inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-7 font-bold text-white hover:bg-white'
            >
              Ask About {market.country}
            </a>
          </div>
        </div>
      </section>

      <section className='bg-white py-12 sm:py-16'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='grid gap-8 lg:grid-cols-2'>
            <article className='border-brand-sand rounded-xl border p-6 sm:p-8'>
              <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
                Local buyer needs
              </p>
              <h2 className='font-display text-brand-black mt-3 text-3xl font-bold'>
                Buying support for {market.country}
              </h2>
              <ul className='text-brand-brown/80 mt-6 space-y-3'>
                {market.buyerNeeds.map((need) => (
                  <li key={need} className='flex gap-3'>
                    <span className='bg-brand-orange mt-2 h-2 w-2 shrink-0 rounded-full' />
                    <span>{need}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className='bg-brand-cream rounded-xl p-6 sm:p-8'>
              <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
                Available categories
              </p>
              <h2 className='font-display text-brand-black mt-3 text-3xl font-bold'>
                Product categories available for inquiry
              </h2>
              <div className='mt-6 flex flex-wrap gap-3'>
                {market.availableCategories.map((product) => (
                  <span
                    key={product}
                    className='border-brand-sand text-brand-brown rounded-full border bg-white px-4 py-2 text-sm font-semibold'
                  >
                    {product}
                  </span>
                ))}
              </div>
              <p className='text-brand-brown/75 mt-6 leading-7'>
                Styles shown are product directions, not a promise of live stock. We confirm the
                current batch, size mix, colors and MOQ before quotation.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className='bg-brand-cream py-12 sm:py-16'>
        <div className='mx-auto max-w-6xl px-4'>
          <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
            Ordering process
          </p>
          <h2 className='font-display text-brand-black mt-3 text-3xl font-bold'>
            From Guangzhou selection to export packing
          </h2>
          <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {orderSteps.map(([title, body]) => (
              <article key={title} className='rounded-xl bg-white p-5 shadow-sm'>
                <h3 className='text-brand-black font-bold'>{title}</h3>
                <p className='text-brand-brown/75 mt-3 text-sm leading-6'>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-white py-12 sm:py-16'>
        <div className='mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2'>
          <article>
            <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>MOQ</p>
            <h2 className='font-display text-brand-black mt-3 text-3xl font-bold'>
              Confirmed by style and order type
            </h2>
            <p className='text-brand-brown/75 mt-4 leading-7'>
              MOQ is not one fixed number for every item. Jack African Fashion does not promise a
              universally low MOQ. The quantity depends on the product, ready-stock batch, color and
              size mix, or custom-production requirements; product pages show the starting MOQ.
            </p>
          </article>
          <article>
            <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
              Shipping
            </p>
            <h2 className='font-display text-brand-black mt-3 text-3xl font-bold'>
              Packed in Guangzhou for the agreed route
            </h2>
            <p className='text-brand-brown/75 mt-4 leading-7'>{market.shipping}</p>
          </article>
        </div>
      </section>

      {/* Verified Export Proof Section */}
      <section className='border-brand-sand/60 bg-brand-cream/40 border-t py-12 sm:py-16'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
            <div>
              <p className='text-brand-orange text-xs font-bold tracking-[0.2em] uppercase'>
                Export Evidence · {market.country}
              </p>
              <h2 className='font-display text-brand-black mt-2 text-2xl font-bold sm:text-3xl'>
                Real Warehouse Packing & Logistics for {market.country}
              </h2>
            </div>
            <p className='text-brand-brown/70 max-w-md text-sm leading-relaxed'>
              Unedited evidence from our Guangzhou warehouse showing actual destination-marked
              bales, freight waybills, and export preparation for African cargo forwarders.
            </p>
          </div>

          <div className='mt-8 grid gap-6 sm:grid-cols-2'>
            {countryEvidence.map((item) => (
              <div
                key={item.title}
                className='border-brand-sand group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md'
              >
                <div className='relative aspect-[4/3] w-full overflow-hidden bg-stone-50 p-1 flex items-center justify-center'>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes='(max-width: 640px) 100vw, 560px'
                    className='object-contain transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute top-3 left-3'>
                    <span className='rounded-md bg-black/75 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm'>
                      {item.badge}
                    </span>
                  </div>
                </div>
                <div className='p-6'>
                  <h3 className='text-brand-black font-display text-lg font-bold'>{item.title}</h3>
                  <p className='text-brand-brown/75 mt-2 text-sm leading-relaxed'>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className='bg-brand-black py-12 text-white sm:py-16'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <h2 className='font-display text-3xl font-bold'>
            Confirmed B2B service for {market.country} buyers
          </h2>
          <p className='text-brand-cream/75 mx-auto mt-4 max-w-2xl leading-7'>
            Jack African Fashion has confirmed service experience with {market.country} boutiques,
            wholesalers and importers. Share your target styles, quantity and destination so our
            Guangzhou team can confirm the current product, factory and cargo details for your
            order.
          </p>
          <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
            <a
              href={whatsappLink}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 font-bold text-white shadow-lg shadow-green-950/20 transition-all hover:bg-[#20ba59] active:scale-95'
            >
              <WhatsAppIcon className='h-5 w-5' />
              Chat on WhatsApp for {market.country} Orders
            </a>
            <Link
              href='/catalog'
              className='hover:text-brand-black inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-8 font-bold text-white transition-all hover:bg-white'
            >
              Browse Wholesale Styles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
