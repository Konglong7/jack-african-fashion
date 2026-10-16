import Link from 'next/link';
import { WhatsAppIcon } from '@/components/Icons';
import { BUYER_GUIDES } from '@/lib/buyerGuides';
import { MARKET_REGIONS } from '@/lib/marketRegions';
import { pageMetadata } from '@/lib/pageMetadata';
import { getSiteContent } from '@/lib/siteContent';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import styles from './guides.module.css';

export const metadata = pageMetadata(
  '/guides',
  'Wholesale Womenswear Buyer Guides | MOQ, Fit & Order Checks',
  'Practical wholesale clothing guides from Jack Fashion: style-specific MOQ checks, size-color ratios, plus size measurements, garment photos, custom orders and Guangzhou cargo handover.'
);
export default async function GuidesPage() {
  const site = await getSiteContent();
  return (
    <>
      <section className={styles.intro}>
        <div className={styles.container}>
          <nav aria-label='Breadcrumb' className={styles.crumb}>
            <Link href='/'>Home</Link>
            <span>/</span>
            <span>Buyer guides</span>
          </nav>
          <p className={styles.eyebrow}>Jack Fashion · Wholesale buying notes</p>
          <h1 className={'font-display ' + styles.title}>
            Wholesale Womenswear Buying Guides
          </h1>
          <p className={styles.summary}>
            Practical checks for buying dresses and coordinated sets from Guangzhou. Start with your
            selected styles, then agree measurements, quantities and handover terms with Jack. The
            MOQ and accepted size-color mix must be confirmed for each selected style.
          </p>
          <div className={styles.actions}>
            <a
              href={siteWhatsAppLink(site)}
              data-cta-location='guides-hub'
              target='_blank'
              rel='noopener noreferrer'
              className={styles.button}
            >
              <WhatsAppIcon className='h-5 w-5 shrink-0' />
              Chat on WhatsApp
            </a>
            <Link href='/buying-guide'>Start with the buying overview →</Link>
          </div>
        </div>
      </section>
      <div className={styles.container}>
        <div className={styles.guideList}>
          {BUYER_GUIDES.map((guide, index) => (
            <article key={guide.slug} className={styles.guideRow}>
              <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2 className='font-display'>
                  <Link href={'/guides/' + guide.slug}>{guide.title}</Link>
                </h2>
                <p>{guide.summary}</p>
              </div>
              <Link href={'/guides/' + guide.slug} className={styles.read}>
                Read guide →
              </Link>
            </article>
          ))}
          <section className={styles.support}>
            <h2 className='font-display'>Buying for your market</h2>
            <p className={styles.summary}>
              Check the fit, wearing occasion and receiving requirements for your selected
              destination.
            </p>
            <div className={styles.links}>
              {MARKET_REGIONS.map((market) => (
                <Link key={market.slug} href={'/markets/' + market.slug}>
                  {market.name}
                </Link>
              ))}
            </div>
            <div className={styles.links}>
              <Link href='/catalog'>Browse the wholesale catalog</Link>
              <Link href='/faq'>Wholesale buying questions</Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
