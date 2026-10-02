import Link from 'next/link';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { WhatsAppIcon } from '@/components/Icons';
import styles from './homepage.module.css';

const STEPS = [
  {
    title: 'Send Us Your Style Pictures',
    description:
      'Share reference photos, size details and quantity via WhatsApp or our inquiry form.'
  },
  {
    title: 'Own Factory Quote & Production Plan',
    description:
      'Our factory team reviews fabric, measurements, quantity and production requirements before providing a wholesale quotation.'
  },
  {
    title: 'Confirm Details and Payment',
    description:
      'Once you approve the sample, price and timeline, we confirm the order and payment terms.'
  },
  {
    title: 'Factory Production, Check & Handover',
    description:
      'Our factory produces the confirmed order, then goods are checked, packed and transferred to the agreed shipping partner.'
  }
];

export function CustomOrderProcess({ siteContent }: { siteContent: SiteContent }) {
  return (
    <section
      className={`${styles.section} ${styles.customSection}`}
      aria-labelledby='home-custom-title'
    >
      <div className={styles.container}>
        <h2 id='home-custom-title' className={`font-display ${styles.sectionHeading}`}>
          How Custom Orders Work
        </h2>
        <p className={styles.sectionDescription}>
          Build a range around your reference styles, sizes and quantity.
        </p>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.stepNumber} aria-hidden='true'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.customFooter}>
          <p>
            Custom-production MOQ depends on the style, fabric and factory requirements. Quantity,
            price and lead time are confirmed before production.
          </p>
          <div className={styles.heroActions}>
            <Link href='/custom-orders' className={`${styles.button} ${styles.secondary}`}>
              Start Custom Order
            </Link>
            <a
              href={siteWhatsAppLink(
                siteContent,
                'Hello Jack, I want to make a custom order. I will send reference pictures.'
              )}
              target='_blank'
              rel='noopener noreferrer'
              className={`${styles.button} ${styles.primary}`}
            >
              <WhatsAppIcon className='h-5 w-5 shrink-0' />
              Send Pictures on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
