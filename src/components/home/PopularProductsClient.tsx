import Link from 'next/link';
import styles from './homepage.module.css';

export function PopularProductsClient({
  children,
  title,
  description
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <section className={styles.section} aria-labelledby='home-products-title'>
      <div className={styles.container}>
        <div className={styles.productHeader}>
          <div>
            <h2 id='home-products-title' className={`font-display ${styles.sectionHeading}`}>
              {title}
            </h2>
            <p className={styles.sectionDescription}>{description}</p>
          </div>
          <Link href='/catalog' className={styles.textLink}>
            View All Products
          </Link>
        </div>
        {children}
        <div className={styles.productBottom}>
          <Link href='/catalog' className={`${styles.button} ${styles.darkButton}`}>
            View Full Product Catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
