import Link from 'next/link';
import { SiteImage } from '@/components/SiteImage';
import type { SiteContent } from '@/lib/siteContentTypes';
import { BRAND_ENTITY, MARKET_PAGES, WHOLESALE_PAGES } from '@/lib/aioContent';
import { SITE_IMAGES } from '@/lib/siteImages';
import styles from './homepage.module.css';

const SERVICES = [
  {
    title: 'Ready stock & B2B service',
    body: 'Confirm available styles, size mixes and colors with our Guangzhou team before ordering.'
  },
  {
    title: 'Own-factory custom production',
    body: 'Share reference pictures, fabric requirements, measurements and quantity for a production quotation.'
  },
  {
    title: 'Checking & export packing',
    body: 'Order details are confirmed before goods are checked and packed for handover.'
  },
  {
    title: 'Cargo agent coordination',
    body: 'Coordinate transfer to an agreed cargo agent. Route, fees and timing are confirmed for each order.'
  }
];

export function SupplierSupport({ siteContent }: { siteContent: SiteContent }) {
  return (
    <section
      className={`${styles.section} ${styles.whiteSection}`}
      aria-labelledby='supplier-identity-title'
    >
      <div className={styles.container}>
        <div className={styles.supplyLayout}>
          <figure>
            <div className={styles.supplyImage}>
              <SiteImage
                src={SITE_IMAGES.trust.showroomExterior}
                alt='Jack Fashion showroom at Yulong Fashion Plaza, Guangzhou'
                className='absolute inset-0'
                sizes='(max-width: 1023px) 100vw, 42vw'
                position='center'
              />
            </div>
            <figcaption className={styles.caption}>
              Guangzhou showroom · Yulong Fashion Plaza
            </figcaption>
          </figure>
          <div>
            <h2 id='supplier-identity-title' className={`font-display ${styles.sectionHeading}`}>
              Showroom & wholesale supply support
            </h2>
            <p className={styles.sectionDescription}>{BRAND_ENTITY.identityStatement}</p>
            <dl className={styles.identity}>
              {[
                ['Company', siteContent.name],
                ['Business', siteContent.business],
                ['Office & showroom', siteContent.location],
                ['Markets served', MARKET_PAGES.map((market) => market.country).join(', ')]
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.serviceGrid}>
              {SERVICES.map((service) => (
                <div key={service.title} className={styles.service}>
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                </div>
              ))}
            </div>
            <Link href='/about' className={styles.textLink}>
              About Jack African Fashion
            </Link>
          </div>
        </div>
        <div className={styles.relatedLinks}>
          <h3>African markets served</h3>
          <div className={styles.linkList}>
            {MARKET_PAGES.map((market) => (
              <Link key={market.slug} href={`/markets/${market.slug}`} className={styles.textLink}>
                {market.country}
              </Link>
            ))}
          </div>
          <h3 className='mt-4'>Wholesale categories</h3>
          <div className={styles.linkList}>
            {WHOLESALE_PAGES.map((page) => (
              <Link key={page.slug} href={`/wholesale/${page.slug}`} className={styles.textLink}>
                {page.title.split('|')[0]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
