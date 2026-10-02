import Link from 'next/link';
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
    body: 'See what to prepare for a factory quotation and production plan.'
  },
  {
    title: 'Contact',
    href: '/contact',
    body: 'Get in touch with our Guangzhou team or plan a showroom visit.'
  }
];

export function BuyerHelp() {
  return (
    <section
      className={`${styles.section} ${styles.whiteSection}`}
      aria-labelledby='home-help-title'
    >
      <div className={styles.container}>
        <h2 id='home-help-title' className={`font-display ${styles.sectionHeading}`}>
          Help with your wholesale order
        </h2>
        <div className={styles.helpGrid}>
          {HELP_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.helpLink}>
              <h3>{link.title}</h3>
              <p>{link.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
