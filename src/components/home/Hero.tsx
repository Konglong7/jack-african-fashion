import Link from 'next/link';
import type { PublicProduct } from '@/lib/productPublicFacts';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { ProductImage } from '@/components/ProductImage';
import { getProductImageAspect } from '@/lib/productImageDimensions';
import { WhatsAppIcon, CheckIcon } from '@/components/Icons';
import styles from './homepage.module.css';

const BUYING_SUPPORT = [
  'Yulong Bldg 2 Shop 3063',
  '50,000+ Ready Stock',
  'Factory-Direct Wholesale',
  'Guangzhou Cargo Handover'
];

export function Hero({
  siteContent,
  products = []
}: {
  siteContent: SiteContent;
  products?: PublicProduct[];
}) {
  const selected = products.slice(0, 2);
  return (
    <>
      <section id='home-hero' className={styles.hero} aria-labelledby='home-hero-title'>
        <div className={`${styles.container} ${styles.heroLayout}`}>
          <div data-hero-content className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>{siteContent.heroEyebrow}</p>
            <h1 id='home-hero-title' className={`font-display ${styles.heroHeading}`}>
              {siteContent.heroTitle} {siteContent.heroAccent}
            </h1>
            <p className={styles.heroBody}>{siteContent.heroBody}</p>

            <div className={styles.heroActions}>
              {/* Primary WhatsApp CTA upgraded to Senori Gold Pill Button (#E2AB2F) */}
              <a
                href={siteWhatsAppLink(siteContent)}
                data-cta-location='home-hero'
                target='_blank'
                rel='noopener noreferrer'
                className={`${styles.button} ${styles.goldPillButton} btn-senori-gold rounded-full min-h-[52px]`}
              >
                <WhatsAppIcon className='h-5 w-5 shrink-0' />
                Chat on WhatsApp
              </a>
              <Link href='/catalog' className={`${styles.button} ${styles.secondary} rounded-full`}>
                Browse the catalog
              </Link>
            </div>
            <p className={styles.heroNote}>
              Africa is at the heart of our range. Wholesale enquiries from every market are
              welcome.
            </p>
            <Link href='/markets' className={styles.textLink}>
              Find styles for your market
            </Link>
          </div>
          <div data-hero-image className={styles.lookbook}>
            <div className={styles.lookbookHeading}>
              <span>From our catalog</span>
              <Link href='/catalog?sort=newest'>Explore new styles</Link>
            </div>
            <div className={styles.lookbookGrid}>
              {selected.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className={styles.lookbookItem}
                >
                  <div
                    className={styles.lookbookImage}
                    style={{ aspectRatio: getProductImageAspect(product.image) || 0.5625 }}
                  >
                    <ProductImage
                      src={product.image}
                      alt={`${product.name} — complete catalog image`}
                      priority={index === 0}
                      sizes='(max-width: 639px) calc((100vw - 48px) / 2), (max-width: 1023px) 240px, (max-width: 1439px) 22vw, 270px'
                      objectFit='contain'
                    />
                  </div>
                  <div className={styles.lookbookLabel}>
                    <span>Style {product.image.match(/(\d{7})\./)?.[1] || product.id}</span>
                    <p>{product.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className={styles.proofStrip}>
        <ul
          className={`${styles.container} ${styles.proofGrid}`}
          aria-label='Wholesale buying support'
        >
          {BUYING_SUPPORT.map((item) => (
            <li key={item} className={styles.proofItem}>
              <CheckIcon aria-hidden='true' />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
