import Link from 'next/link';
import { MARKET_REGIONS } from '@/lib/marketRegions';
import { MARKET_PAGES } from '@/lib/aioContent';
import { getSiteOrigin } from '@/lib/siteUrl';
import { pageMetadata } from '@/lib/pageMetadata';
import { MarketCollections } from '@/components/home/MarketCollections';
import styles from '@/components/home/homepage.module.css';

export const metadata = pageMetadata(
  '/markets',
  'Wholesale Womenswear for International Buyers',
  'Explore Jack Fashion buying options for Africa, the Middle East, Europe and North America, Latin America and Southeast Asia. Confirm style, fit and order details.'
);
export default function MarketsPage() {
  const origin = getSiteOrigin();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      ...MARKET_REGIONS.map((region) => ({ slug: region.slug, name: region.name })),
      ...MARKET_PAGES.map((market) => ({ slug: market.slug, name: market.country }))
    ].map((market, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: market.name,
      url: `${origin}/markets/${market.slug}`
    }))
  };
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
      <section className={styles.pageIntro}>
        <div className={styles.container}>
          <nav aria-label='Breadcrumb' className={styles.breadcrumb}>
            <Link href='/'>Home</Link> / Buying markets
          </nav>
          <h1 className='font-display'>Women’s Clothing Wholesale for International Buyers</h1>
          <p>
            Start with your customers’ occasions, fit and style preferences. Our regional buying
            pages connect the Guangzhou catalog with the garment and order details to confirm for
            your market.
          </p>
        </div>
      </section>
      <MarketCollections />
      <section
        className={`${styles.section} ${styles.whiteSection}`}
        aria-labelledby='africa-country-buyers'
      >
        <div className={styles.container}>
          <h2 id='africa-country-buyers' className={`font-display ${styles.sectionHeading}`}>
            Wholesale buying information for African countries
          </h2>
          <p className={`${styles.sectionDescription} mb-6`}>
            Choose your country to review styles and the garment, quantity and cargo handover
            details to confirm for your wholesale order.
          </p>
          <nav aria-label='African country buying pages' className={styles.linkList}>
            {MARKET_PAGES.map((market) => (
              <Link key={market.slug} href={`/markets/${market.slug}`} className={styles.textLink}>
                {market.country} buyer information
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={`font-display ${styles.sectionHeading}`}>Buying from another country?</h2>
          <p className={styles.sectionDescription}>
            Every destination is reviewed individually. Share your country, selected styles,
            quantity and cargo-agent details so Jack can discuss suitability and the order
            arrangement.
          </p>
          <Link href='/contact' className={styles.textLink}>
            Contact Jack Fashion
          </Link>
        </div>
      </section>
    </>
  );
}
