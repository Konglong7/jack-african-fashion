import Link from 'next/link';
import { getSiteContent } from '@/lib/siteContent';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { pageMetadata } from '@/lib/pageMetadata';
import { WhatsAppIcon } from '@/components/Icons';
import { BUYING_CHECKS } from '@/components/home/SupplierSupport';
import { BUYER_GUIDES } from '@/lib/buyerGuides';
import styles from '@/components/home/homepage.module.css';

export const metadata = pageMetadata(
  '/buying-guide',
  'Wholesale Clothing Buying Guide | Sizes, MOQ & Orders',
  'Ask Jack Fashion for a Guangzhou factory-direct wholesale quote. MOQ is confirmed by style; prepare codes, quantities, measurements and your destination.'
);
export default async function BuyingGuidePage() {
  const siteContent = await getSiteContent();
  const message =
    'Hello Jack, I would like a wholesale quotation. Style codes: __. Quantity per style: __. Sizes and colors: __. Destination country/city: __. Please send real stock photos/video, garment measurements, stock availability and order terms.';
  return (
    <>
      <section className={styles.pageIntro}>
        <div className={styles.container}>
          <nav aria-label='Breadcrumb' className={styles.breadcrumb}>
            <Link href='/'>Home</Link> / Wholesale buying guide
          </nav>
          <h1 className='font-display'>Turn a shortlist into a clear wholesale order.</h1>
          <p>
            Choose the styles first. Then confirm the actual garments, size mix and order
            arrangement. These are the details to prepare when you message Jack.
          </p>
          <p>
            Jack Fashion confirms MOQ for each selected style and order. There is no single fixed
            minimum for all catalog styles or custom designs; send your quantities to request a
            factory-direct quotation.
          </p>
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
              Choose your styles
            </Link>
          </div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.whiteSection}`}>
        <div className={styles.container}>
          <h2 className={`font-display ${styles.sectionHeading}`}>Send these three details</h2>
          <p className={`${styles.sectionDescription} mb-6`}>
            Send style codes with quantities, your size-color requirements and the destination.
            These three details let Jack review MOQ, current stock and a wholesale quotation.
          </p>
          <div className={styles.checkGrid}>
            <article className={styles.checkCard}>
              <h3>Style codes and quantity</h3>
              <p>
                Share product links or the numeric codes printed on catalog images. Give quantity
                per style. Ask Jack to confirm the current MOQ and accepted size-color mix for every
                selected style; custom quantities are reviewed separately.
              </p>
            </article>
            <article className={styles.checkCard}>
              <h3>Your fit and color requirements</h3>
              <p>
                List the sizes and color ratios you need. Ask for actual measurements rather than
                relying on XL, 4XL or a model image. Confirm whether the quote is for one garment or
                a complete set.
              </p>
            </article>
            <article className={styles.checkCard}>
              <h3>Destination and receiving arrangement</h3>
              <p>
                Give your country, city and nominated Guangzhou cargo agent, if you have one.
                Include any packing, labeling or consolidation instructions with your enquiry.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={`font-display ${styles.sectionHeading}`}>
            Check the goods before payment
          </h2>
          <p className={`${styles.sectionDescription} mb-6`}>
            Review current garment photos or video, finished measurements, the written quotation and
            cargo handover terms before paying. A catalog image alone does not confirm the goods
            available for your order.
          </p>
          <div className={styles.specList}>
            {BUYING_CHECKS.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.whiteSection}`}>
        <div className={styles.container}>
          <h2 className={`font-display ${styles.sectionHeading}`}>
            Which measurements should a wholesale size sheet include?
          </h2>
          <p className={`${styles.sectionDescription} mb-6`}>
            Request finished bust, waist, hip and garment length in centimetres for every size. For
            matching sets, record top and bottom measurements separately and confirm the measurement
            method.
          </p>
          <div className={styles.checkGrid}>
            <article className={styles.checkCard}>
              <h3>For dresses and one-piece styles</h3>
              <p>
                Request finished bust, waist, hip and length in centimetres for every size, plus the
                measurement method, sleeve details, stretch and lining where relevant.
              </p>
            </article>
            <article className={styles.checkCard}>
              <h3>For matching sets</h3>
              <p>
                Confirm the pieces included, then request top and bottom measurements separately.
                Check trouser or skirt waist, hip, length and any fastening or elastic adjustment.
              </p>
            </article>
            <article className={styles.checkCard}>
              <h3>For your own retail size guide</h3>
              <p>
                Use the confirmed garment measurements and a reviewed sample when available. US, EU
                and other local size labels cannot be inferred from the catalog’s size names.
              </p>
            </article>
          </div>
          <div className={`${styles.linkList} mt-6`}>
            <Link href='/terms' className={styles.textLink}>
              Wholesale enquiry and order terms
            </Link>
            <Link href='/markets' className={styles.textLink}>
              Buying information for your market
            </Link>
            <Link href='/faq' className={styles.textLink}>
              More buying questions
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={`font-display ${styles.sectionHeading}`}>
            Work through the buying checks
          </h2>
          <p className='mb-6 max-w-3xl leading-relaxed text-slate-600'>
            Use these guides to prepare your quantities, confirm the actual garments and agree the
            packing and cargo handover.
          </p>
          <div className={styles.specList}>
            {BUYER_GUIDES.map((guide) => (
              <div key={guide.slug}>
                <h3>
                  <Link href={'/guides/' + guide.slug} className={styles.textLink}>
                    {guide.title}
                  </Link>
                </h3>
                <p>{guide.summary}</p>
              </div>
            ))}
          </div>
          <div className={styles.linkList}>
            <Link href='/guides' className={styles.textLink}>
              All wholesale buyer guides →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
