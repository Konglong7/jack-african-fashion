import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MARKET_PAGES, getMarketPage } from '@/lib/aioContent';
import { MARKET_REGIONS, getMarketRegion } from '@/lib/marketRegions';
import { getMarketEditorial } from '@/lib/marketEditorials';
import { getSiteContent } from '@/lib/siteContent';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { getProducts } from '@/lib/db';
import { buildCollectionJsonLd } from '@/lib/collectionJsonLd';
import { pageMetadata } from '@/lib/pageMetadata';
import { BUYER_GUIDES } from '@/lib/buyerGuides';
import { ProductCard } from '@/components/ProductCard';
import { WhatsAppIcon } from '@/components/Icons';
import Image from '@/components/ResponsiveImage';
import styles from '@/components/home/homepage.module.css';
import { toPublicProduct } from '@/lib/productPublicFacts';
import { selectMarketProducts } from '@/lib/marketProductSelection';

interface PageProps {
  params: Promise<{ country: string }>;
}
export const revalidate = 60;
// Reject unknown editorial slugs before the route streams a soft-404 response.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...MARKET_PAGES, ...MARKET_REGIONS].map((page) => ({ country: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const page = getMarketRegion(country) || getMarketPage(country);
  if (!page) notFound();
  return pageMetadata(`/markets/${page.slug}`, page.title, page.description);
}

export default async function MarketPage({ params }: PageProps) {
  const { country } = await params;
  const region = getMarketRegion(country);
  const editorial = region ? getMarketEditorial(region.slug) : undefined;
  const market = getMarketPage(country);
  if (!region && !market) notFound();
  const [siteContent, products] = await Promise.all([getSiteContent(), getProducts()]);
  const name = region?.name || market!.country;
  const title = region?.title || market!.title;
  const intro = region?.introduction || market!.description;
  const categories = region?.categories || market!.availableCategories;
  const checks =
    region?.buyingChecks ||
    market!.buyerNeeds.map((body, index) => ({
      title: ['Choose your styles', 'Confirm the fit', 'Agree your order', 'Plan the handover'][
        index
      ],
      body
    }));
  const message =
    region?.whatsappMessage ||
    `Hello Jack, I am a wholesale buyer in ${name}. Please help confirm styles, measurements, MOQ and cargo handover for my order.`;
  const orderGuides = BUYER_GUIDES.filter((guide) =>
    ['wholesale-moq', 'photos-order-confirmation', 'packing-cargo-handover'].includes(guide.slug)
  );
  const selected = selectMarketProducts(products, categories).map((product) =>
    toPublicProduct(product)
  );
  const jsonLd = buildCollectionJsonLd({
    path: `/markets/${country}`,
    name: title,
    description: region?.description || market!.description,
    products: selected,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Buying markets', path: '/markets' },
      { name, path: `/markets/${country}` }
    ]
  });
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <div className={styles.pageIntro}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label='Breadcrumb'>
            <Link href='/'>Home</Link> / <Link href='/markets'>Buying markets</Link> / {name}
          </nav>
          <div className={editorial ? styles.marketIntroLayout : undefined}>
            <div>
              <h1 className='font-display'>{title}</h1>
              <p>{intro}</p>
              <div className={styles.heroActions}>
                <a
                  href={siteWhatsAppLink(siteContent, message)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`${styles.button} ${styles.primary}`}
                >
                  <WhatsAppIcon className='h-5 w-5' />
                  Chat on WhatsApp
                </a>
                <Link href='/catalog' className={`${styles.button} ${styles.secondary}`}>
                  Browse all styles
                </Link>
              </div>
              <div className={`${styles.linkList} mt-5`}>
                <Link href='/wholesale/ready-stock' className={styles.textLink}>
                  Ready-stock wholesale
                </Link>
                <Link href='/custom-orders' className={styles.textLink}>
                  Custom clothing production
                </Link>
              </div>
              {region && (
                <p className='!text-sm'>
                  Enquiry destinations include {region.countries.join(', ')}. Stock suitability and
                  shipping are confirmed for each order.
                </p>
              )}
            </div>
            {editorial && (
              <figure className={styles.marketEditorial} data-market-editorial={region!.slug}>
                <Image
                  src={editorial.src}
                  alt={editorial.alt}
                  width={editorial.width}
                  height={editorial.height}
                  priority
                  sizes='(max-width: 1023px) calc(100vw - 48px), (max-width: 1319px) calc((100vw - 116px) / 2), 602px'
                />
                <figcaption>
                  Collection inspiration. Discuss style, fit and available options with Jack.
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
      <section className={`${styles.section} ${styles.whiteSection}`}>
        <div className={styles.container}>
          <h2 className={`font-display ${styles.sectionHeading}`}>
            What to confirm for your market
          </h2>
          <p className={`${styles.sectionDescription} mb-6`}>
            Confirm finished measurements, fabric and coverage for your customers in {name}. MOQ,
            available size-color quantities and cargo handover are reviewed for each selected style
            and destination.
          </p>
          <div className={styles.checkGrid}>
            {checks.map((item) => (
              <article key={item.title} className={styles.checkCard}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          {market && <p className={styles.sectionDescription}>{market.shipping}</p>}
          {country === 'africa' && (
            <div className={`${styles.linkList} mt-6`}>
              {MARKET_PAGES.map((page) => (
                <Link key={page.slug} href={`/markets/${page.slug}`} className={styles.textLink}>
                  {page.country} buyer information
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className={`${styles.section} ${styles.whiteSection}`}>
        <div className={styles.container}>
          <h2 className={`font-display ${styles.sectionHeading}`}>Plan your wholesale order</h2>
          <p className={`${styles.sectionDescription} mb-6`}>
            Compare the order quantity, garment details and cargo handover requirements before
            requesting a quotation for {name}. These buying guides help you prepare a style list and
            the questions to confirm with Jack.
          </p>
          <div className={styles.checkGrid}>
            {orderGuides.map((guide) => (
              <article key={guide.slug} className={styles.checkCard}>
                <h3>
                  <Link href={`/guides/${guide.slug}`} className={styles.textLink}>
                    {guide.title}
                  </Link>
                </h3>
                <p>{guide.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={`font-display ${styles.sectionHeading}`}>
            Styles to start your shortlist
          </h2>
          <p className={`${styles.sectionDescription} mb-6`}>
            Use these {selected.length} wholesale styles as a shortlist, then request current
            garment photos, measurements and a bulk-price quotation. Confirm suitability for your
            customers before choosing the order mix.
          </p>
          <div className={`${styles.linkList} mb-6`}>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/catalog?category=${encodeURIComponent(category)}`}
                className={styles.textLink}
              >
                {category}
              </Link>
            ))}
          </div>
          <div className={styles.productGrid}>
            {selected.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                siteContent={siteContent}
                variant='home'
                sizes='(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw'
              />
            ))}
          </div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.whiteSection}`}>
        <div className={styles.container}>
          <h2 className={`font-display ${styles.sectionHeading}`}>Buying for another market?</h2>
          <p className={`${styles.sectionDescription} mb-6`}>
            Choose another buying market below, or send Jack your country, style codes and quantity
            on WhatsApp. Product suitability and receiving arrangements are confirmed for the
            destination in your enquiry.
          </p>
          <div className={styles.linkList}>
            {MARKET_REGIONS.filter((page) => page.slug !== country).map((page) => (
              <Link key={page.slug} href={`/markets/${page.slug}`} className={styles.textLink}>
                {page.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
