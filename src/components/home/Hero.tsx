import Link from 'next/link';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';
import { SiteImage } from '@/components/SiteImage';
import { WhatsAppIcon, CheckIcon } from '@/components/Icons';
import styles from './homepage.module.css';

const HERO_PROOF = ['Guangzhou Showroom', 'Own Factory', 'Ready Stock', 'Custom Production'];

export function Hero({ siteContent }: { siteContent: SiteContent }) {
  return (
    <>
      <section id='home-hero' className={styles.hero} aria-labelledby='home-hero-title'>
        <div data-hero-image className={styles.heroImage}>
          <SiteImage
            src={SITE_IMAGES.hero}
            alt='African women modeling dresses and a two piece set for Jack African Fashion'
            priority
            sizes='(max-width: 1023px) 1400px, 100vw'
            className='absolute inset-0 z-0'
            position='center top'
          />
        </div>
        <div data-hero-overlay className={styles.heroOverlay} />
        <div data-hero-content className={styles.heroContent}>
          <div className={styles.heroContainer}>
            <div className={styles.heroCopy}>
              <p className={styles.heroEyebrow}>{siteContent.heroEyebrow}</p>
              <h1 id='home-hero-title' className={`font-display ${styles.heroHeading}`}>
                {siteContent.heroTitle} {siteContent.heroAccent}
              </h1>
              <p className={styles.heroBody}>{siteContent.heroBody}</p>
              <div className={styles.heroActions}>
                <a
                  href={siteWhatsAppLink(siteContent)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`${styles.button} ${styles.primary}`}
                >
                  <WhatsAppIcon className='h-5 w-5 shrink-0' />
                  Talk Stock on WhatsApp
                </a>
                <Link href='/catalog' className={`${styles.button} ${styles.secondary}`}>
                  View All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.proofStrip} aria-label='Guangzhou wholesale supply'>
        <ul className={`${styles.container} ${styles.proofGrid}`}>
          {HERO_PROOF.map((item) => (
            <li key={item} className={styles.proofItem}>
              <CheckIcon aria-hidden='true' />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
