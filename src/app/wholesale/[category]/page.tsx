import type { Metadata } from 'next';
import Image from '@/components/ResponsiveImage';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BRAND_ENTITY, WHOLESALE_PAGES, getWholesalePage } from '@/lib/aioContent';
import { getSiteContent } from '@/lib/siteContent';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';
import { getSiteOrigin } from '@/lib/siteUrl';
import { WhatsAppIcon } from '@/components/Icons';
import { pageMetadata } from '@/lib/pageMetadata';

interface PageProps {
  params: Promise<{ category: string }>;
}

const baseUrl = getSiteOrigin();

export function generateStaticParams() {
  return WHOLESALE_PAGES.map((page) => ({ category: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const content = getWholesalePage(category);
  if (!content) return { title: 'Wholesale Category Not Found' };
  return {
    ...pageMetadata(`/wholesale/${content.slug}`, content.title, content.description),
    title: content.title,
    description: content.description,
    alternates: { canonical: `${baseUrl}/wholesale/${content.slug}` },
    openGraph: {
      title: `${content.title} | Jack African Fashion`,
      description: content.description,
      url: `${baseUrl}/wholesale/${content.slug}`,
      siteName: BRAND_ENTITY.name,
      type: 'website',
      images: [SITE_IMAGES.whatsappCatalogBanner]
    }
  };
}

export default async function WholesaleCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const content = getWholesalePage(category);
  if (!content) notFound();

  const siteContent = await getSiteContent();
  const catalogHref = content.catalogCategory
    ? `/catalog?category=${encodeURIComponent(content.catalogCategory)}`
    : '/catalog';
  const whatsappLink = siteWhatsAppLink(
    siteContent,
    `Hello Jack, I am interested in ${content.heading}. Please send current styles, MOQ, sizes and wholesale prices.`
  );
  const pageUrl = `${baseUrl}/wholesale/${content.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: content.heading,
        description: content.description,
        about: { '@id': `${baseUrl}/#organization` },
        audience: { '@type': 'BusinessAudience', audienceType: 'Wholesale fashion buyers' },
        inLanguage: 'en'
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Wholesale', item: `${baseUrl}/catalog` },
          { '@type': 'ListItem', position: 3, name: content.heading, item: pageUrl }
        ]
      }
    ]
  };

  const categoryProofs =
    category === 'plus-size-womens-clothing'
      ? [
        {
          image: SITE_IMAGES.trust.sizeBust4xl,
          badge: 'Bust 120cm Tape Proof',
          title: 'True African 4XL Bust Measurement',
          desc: 'Flat soft-tape measurement proving 120 cm (47+ inches) bust on 4XL dresses, tailored specifically for African silhouettes.'
        },
        {
          image: SITE_IMAGES.trust.sizeLength4xl,
          badge: 'Length 142cm Full Maxi',
          title: 'Floor-Length Maxi Measurement',
          desc: '142 cm generous body length ensuring the floor-grazing, graceful silhouette demanded by African boutique customers.'
        },
        {
          image: SITE_IMAGES.trust.styleSelectionFlare,
          badge: 'Generous Sweep',
          title: 'Full Sweep Flare Dress Demonstration',
          desc: 'Uncompromised fabric allowance showing expansive sweep and drape on bold African print designs.'
        }
      ]
      : category === 'african-dresses'
        ? [
          {
            image: SITE_IMAGES.trust.fabricPleatStretch,
            badge: '2-Way Elastic Recovery',
            title: 'High-Density Pleat Elasticity Test',
            desc: 'High-resilience micro-pleat fabric that stretches with body curves and instantly rebounds without permanent distortion.'
          },
          {
            image: SITE_IMAGES.trust.craftsmanshipLining,
            badge: 'Non-Sheer Construction',
            title: 'Double-Stitched Seams & Full Interior Lining',
            desc: 'Inside-out view showing smooth, opaque lining and reinforced overlock stitching for long-lasting retail quality.'
          },
          {
            image: SITE_IMAGES.trust.styleSelectionPleats,
            badge: 'Guangzhou Racks',
            title: 'Permanent Pleat Collection at Yulong Showroom',
            desc: 'Extensive showroom racks with diverse jewel-tone solids and vibrant African prints ready for selection.'
          }
        ]
        : category === 'two-piece-sets'
          ? [
            {
              image: SITE_IMAGES.trust.styleSelectionSwatch,
              badge: 'Swatch Verification',
              title: 'Color Card & Fabric Batch Matching',
              desc: 'Confirming print swatches and top-and-bottom color continuity before bulk sewing and packing.'
            },
            {
              image: SITE_IMAGES.trust.qcTrimming,
              badge: '100% Inspection',
              title: 'Pre-Shipment Inspection & Thread Trimming',
              desc: 'Careful manual thread trimming at collars and zippers alongside our official Jack Fashion QC checklist.'
            },
            {
              image: SITE_IMAGES.trust.craftsmanshipLining,
              badge: 'Clean Finish',
              title: 'Professional Waistband & Seam Construction',
              desc: 'Inspecting comfortable elastic waistbands and interior finish for matching two-piece wholesale outfits.'
            }
          ]
          : [
            {
              image: SITE_IMAGES.trust.showroomInterior,
              badge: 'Ready-Stock Showroom',
              title: 'Guangzhou Yulong Plaza Showroom Racks',
              desc: 'Active inventory displayed in our Guangzhou showroom for rapid batch confirmation and prompt handover.'
            },
            {
              image: SITE_IMAGES.trust.warehouseStagingAfrica,
              badge: 'Export Staging',
              title: 'Warehouse Staged Bales for African Delivery',
              desc: 'Sealed export bales labeled for Lagos, Accra, and Nairobi ready for forwarder collection.'
            },
            {
              image: SITE_IMAGES.trust.qcZipperCheck,
              badge: 'QC Final Check',
              title: 'Hardware & Individual Garment Bagging',
              desc: 'Every item individually folded and packed in branded Jack Fashion protective bags before bale consolidation.'
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
            Guangzhou · B2B women&apos;s clothing
          </p>
          <h1 className='font-display mt-3 max-w-4xl text-4xl font-bold sm:text-5xl'>
            {content.heading}
          </h1>
          <p className='text-brand-cream/80 mt-5 max-w-3xl text-lg leading-8'>
            {content.introduction}
          </p>
          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <Link
              href={catalogHref}
              className='bg-brand-orange hover:bg-brand-gold inline-flex min-h-12 items-center justify-center rounded-full px-7 font-bold text-white'
            >
              View Relevant Products
            </Link>
            <a
              href={whatsappLink}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-brand-black inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-7 font-bold hover:bg-white'
            >
              Ask for Current Stock
            </a>
          </div>
        </div>
      </section>

      <section className='bg-white py-12 sm:py-16'>
        <div className='mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2'>
          <article className='border-brand-sand rounded-xl border p-6 sm:p-8'>
            <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
              Suitable buyers
            </p>
            <h2 className='font-display text-brand-black mt-3 text-3xl font-bold'>
              Built for B2B resale
            </h2>
            <ul className='text-brand-brown/80 mt-6 space-y-3'>
              {content.suitableBuyers.map((buyer) => (
                <li key={buyer} className='flex gap-3'>
                  <span className='bg-brand-orange mt-2 h-2 w-2 shrink-0 rounded-full' />
                  {buyer}
                </li>
              ))}
            </ul>
          </article>
          <article className='bg-brand-cream rounded-xl p-6 sm:p-8'>
            <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
              Product information
            </p>
            <h2 className='font-display text-brand-black mt-3 text-3xl font-bold'>
              What buyers can confirm
            </h2>
            <ul className='text-brand-brown/80 mt-6 space-y-3'>
              {content.productDetails.map((detail) => (
                <li key={detail} className='flex gap-3'>
                  <span className='bg-brand-orange mt-2 h-2 w-2 shrink-0 rounded-full' />
                  {detail}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className='bg-brand-cream py-12 sm:py-16'>
        <div className='mx-auto max-w-6xl px-4'>
          <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
            Wholesale details
          </p>
          <h2 className='font-display text-brand-black mt-3 text-3xl font-bold'>
            Fabric, sizes, colors, MOQ and custom options
          </h2>
          <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {[
              [
                'Fabric',
                'Fabric and composition depend on the selected style. Current details or sample requirements are confirmed before ordering.'
              ],
              [
                'Sizes',
                'Available sizes and measurements are shown by product where known and reconfirmed against the current batch.'
              ],
              [
                'Colors',
                'Color choices and mixed ratios depend on live stock or the confirmed custom-production plan.'
              ],
              [
                'MOQ',
                'Minimum quantity varies by product and order type. Jack African Fashion does not promise a universally low MOQ; use the listed product quantity as the starting point and verify any smaller test order.'
              ],
              [
                'Custom options',
                'Reference, fabric, color, size grading, label and packing requests are reviewed by feasibility and quantity.'
              ],
              [
                'Shipping',
                'Orders are checked and packed in Guangzhou for a buyer-nominated forwarder or agreed shipping partner.'
              ]
            ].map(([title, body]) => (
              <article key={title} className='rounded-xl bg-white p-5 shadow-sm'>
                <h3 className='text-brand-black font-bold'>{title}</h3>
                <p className='text-brand-brown/75 mt-3 text-sm leading-6'>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Visual Evidence Section */}
      <section className='border-brand-sand/60 bg-brand-cream/40 border-t py-12 sm:py-16'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='mb-8 text-center sm:text-left'>
            <p className='text-brand-orange text-xs font-bold tracking-[0.2em] uppercase'>
              Verified Guangzhou Evidence
            </p>
            <h2 className='font-display text-brand-black mt-2 text-2xl font-bold sm:text-3xl'>
              Real Measurements, Workmanship & Export Packing
            </h2>
            <p className='text-brand-brown/70 mt-2 max-w-2xl text-sm leading-relaxed'>
              Unedited evidence from our Guangzhou showroom and warehouse proving authentic sizing,
              fabric quality, and cargo preparation for African boutique buyers.
            </p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {categoryProofs.map((item) => (
              <div
                key={item.title}
                className='border-brand-sand group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md'
              >
                <div className='relative aspect-[4/5] w-full overflow-hidden bg-stone-50 p-1 flex items-center justify-center'>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px'
                    className='object-contain transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute top-3 left-3'>
                    <span className='rounded-md bg-black/75 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm'>
                      {item.badge}
                    </span>
                  </div>
                </div>
                <div className='p-5'>
                  <h3 className='text-brand-black font-display text-base font-bold sm:text-lg'>
                    {item.title}
                  </h3>
                  <p className='text-brand-brown/75 mt-2 text-xs leading-relaxed sm:text-sm'>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-white py-12 sm:py-16'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <p className='text-brand-orange text-xs font-bold tracking-[0.18em] uppercase'>
            Supplier identity
          </p>
          <h2 className='font-display text-brand-black mt-3 text-3xl font-bold'>
            Jack African Fashion · Guangzhou, China · African market
          </h2>
          <p className='text-brand-brown/75 mx-auto mt-4 max-w-3xl leading-7'>
            {BRAND_ENTITY.identityStatement} We support ready-stock inquiries, custom production,
            quality checking, export packing and shipping coordination for B2B orders.
          </p>
          <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
            <a
              href={whatsappLink}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 font-bold text-white shadow-lg shadow-green-950/20 transition-all hover:bg-[#20ba59] active:scale-95'
            >
              <WhatsAppIcon className='h-5 w-5' />
              Inquire Stock & Price on WhatsApp
            </a>
            <Link
              href={catalogHref}
              className='border-brand-black text-brand-black hover:bg-brand-black inline-flex min-h-12 items-center justify-center rounded-full border-2 px-8 font-bold transition-all hover:text-white'
            >
              View Relevant Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
