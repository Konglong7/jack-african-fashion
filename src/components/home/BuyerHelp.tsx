import Link from 'next/link';
import { siteWhatsAppLink, type SiteContent } from '@/lib/siteContentTypes';
import styles from './homepage.module.css';

const HELP_LINKS = [
  {
    title: 'Wholesale FAQ',
    href: '/faq',
    body: 'Answers about stock, MOQ, sizes, payment and shipping.'
  },
  {
    title: 'Custom Orders',
    href: '/custom-orders',
    body: 'See what to prepare for a custom-order quotation and production discussion.'
  }
];

export function BuyerHelp({ siteContent }: { siteContent: SiteContent }) {
  return (
    <section
      className={`${styles.section} ${styles.whiteSection}`}
      aria-labelledby='home-help-title'
    >
      <div className={styles.container}>
        <h2 id='home-help-title' className={`font-display ${styles.sectionHeading}`}>
          Help with your wholesale order
        </h2>
        <p className={`${styles.sectionDescription} mb-6`}>
          Check the FAQ for MOQ, stock and payment questions, or prepare a custom-production
          enquiry. For a quotation on a selected style, contact our team directly on WhatsApp.
        </p>
        <div className={styles.helpGrid}>
          {HELP_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.helpLink}>
              <h3>{link.title}</h3>
              <p>{link.body}</p>
            </Link>
          ))}
          <a
            href={siteWhatsAppLink(siteContent)}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.helpLink}
          >
            <h3>Chat on WhatsApp</h3>
            <p>
              Message our Guangzhou team directly about any question, order or visit appointment.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
