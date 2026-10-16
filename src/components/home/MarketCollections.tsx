import Link from 'next/link';
import { MARKET_REGIONS } from '@/lib/marketRegions';
import { getMarketEditorial } from '@/lib/marketEditorials';
import Image from '@/components/ResponsiveImage';
import styles from './homepage.module.css';

export function MarketCollections() {
  return (
    <section
      id='home-markets'
      className={`${styles.section} ${styles.whiteSection}`}
      aria-labelledby='home-markets-title'
    >
      <div className={styles.container}>
        <div className={styles.productHeader}>
          <div>
            <h2 id='home-markets-title' className={`font-display ${styles.sectionHeading}`}>
              Wholesale clothing for your market
            </h2>
            <p className={styles.sectionDescription}>
              Select a buying market to review fit, style and receiving requirements. Send your
              selected styles and destination to confirm suitability, MOQ and cargo handover.
            </p>
          </div>
          <Link href='/markets' className={styles.textLink}>
            All buying markets
          </Link>
        </div>
        <div className={styles.marketGrid}>
          {MARKET_REGIONS.map((region) => {
            const editorial = getMarketEditorial(region.slug);
            return (
              <Link
                key={region.slug}
                href={`/markets/${region.slug}`}
                className={styles.marketCard}
                data-market-collection={region.slug}
              >
                {editorial && (
                  <Image
                    src={editorial.src}
                    alt={editorial.alt}
                    width={editorial.width}
                    height={editorial.height}
                    sizes='(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 76px) / 2), (max-width: 1319px) calc((100vw - 128px) / 3), 400px'
                    className={styles.marketCardImage}
                  />
                )}
                <div className={styles.marketCardCopy}>
                  <h3>{region.name}</h3>
                  <p>{region.sourcingFocus}</p>
                  <span>Explore buying options</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
