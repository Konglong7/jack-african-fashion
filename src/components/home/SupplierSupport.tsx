import Link from 'next/link';
import type { SiteContent } from '@/lib/siteContentTypes';
import { getSiteLocations, siteWhatsAppLink } from '@/lib/siteContentTypes';
import { WhatsAppContacts } from '@/components/ContactLinks';
import { CheckIcon, WhatsAppIcon } from '@/components/Icons';
import styles from './homepage.module.css';

export const BUYING_CHECKS = [
  {
    title: 'See the actual garment',
    body: 'Request current stock photos or a video of the style, including the back, seams, lining and fabric close-ups.'
  },
  {
    title: 'Check the measurements',
    body: 'Confirm bust, waist, hip and garment length in centimetres. Size labels vary between styles and markets.'
  },
  {
    title: 'Agree the order in writing',
    body: 'Confirm style codes, quantity, size and color ratios, price, payment terms and the agreed delivery arrangement.'
  },
  {
    title: 'Plan the cargo handover',
    body: 'Share your delivery city and cargo agent. Packing, freight charges, timing and import responsibilities are confirmed per order.'
  }
];

export function SupplierSupport({ siteContent }: { siteContent: SiteContent }) {
  return (
    <section
      className={`${styles.section} ${styles.whiteSection}`}
      aria-labelledby='supplier-identity-title'
    >
      <div className={`${styles.container} ${styles.supplyLayout}`}>
        <div>
          <p className={styles.heroEyebrow}>Own factory · Talk directly with our Guangzhou team</p>
          <h2 id='supplier-identity-title' className={`font-display ${styles.sectionHeading}`}>
            Factory-direct wholesale, ready stock and custom production
          </h2>
          <p className={styles.sectionDescription}>
            Jack Fashion has its own factory and offers ready-stock womenswear and custom
            production. Request a factory-direct quote, then confirm the actual garments, finished
            measurements, quantities and cargo handover for your order.
          </p>
          <dl className={styles.identity}>
            {getSiteLocations(siteContent).map((location) => (
              <div key={location.address}>
                <dt>{location.name}</dt>
                <dd>
                  <a href={location.mapUrl} target='_blank' rel='noopener noreferrer'>
                    {location.address}
                  </a>
                </dd>
              </div>
            ))}
            <div>
              <dt>Direct contact</dt>
              <dd>
                <WhatsAppContacts siteContent={siteContent} className='text-[#0B7A3E]' />
              </dd>
            </div>
          </dl>
          <a
            className={`${styles.button} ${styles.primary}`}
            href={siteWhatsAppLink(
              siteContent,
              'Hello Jack, please send current stock photos/video, garment measurements and a written quotation for my selected styles.'
            )}
            target='_blank'
            rel='noopener noreferrer'
          >
            <WhatsAppIcon className='h-5 w-5' />
            Chat on WhatsApp
          </a>
          <Link href='/about' className={styles.textLink}>
            Meet Jack Fashion
          </Link>
        </div>
        <div className={styles.buyingPanel}>
          <h3>Before you place an order</h3>
          <ul>
            {BUYING_CHECKS.map((item) => (
              <li key={item.title}>
                <CheckIcon className='h-5 w-5 shrink-0' />
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
