import Link from 'next/link';
import type { SiteCategory } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';
import { SiteImage } from '@/components/SiteImage';
import { categoryImageSizes } from './categoryImageSizes';
import { categoryHref } from '@/lib/siteNavigation';
import styles from './homepage.module.css';

const CATEGORY_POSITIONS: Record<string, string> = {
  'Plus Size Dresses': 'center top',
  'Two Piece Sets': 'center 20%',
  'Pleated Dresses': 'center center',
  'Pleated Styles': 'center center',
  'Maxi Dresses': 'center 25%',
  Jumpsuits: 'center center',
  'Custom Orders': 'center center'
};

export function Categories({ categories }: { categories: SiteCategory[] }) {
  return (
    <section
      id='home-categories'
      className={styles.categories}
      aria-labelledby='home-categories-title'
    >
      <div className={styles.container}>
        <h2 id='home-categories-title' className={`font-display ${styles.sectionHeading}`}>
          Browse wholesale clothing by style
        </h2>
        <p className={`${styles.sectionDescription} mb-6`}>
          Choose dresses, matching sets or plus-size styles by category. Open a product page and
          send its style code on WhatsApp to confirm MOQ and a wholesale quotation.
        </p>
        <div className={styles.categoryGrid}>
          {categories.slice(0, 6).map((category) => {
            const image =
              category.image ||
              SITE_IMAGES.categories[category.name as keyof typeof SITE_IMAGES.categories];
            const custom = category.name === 'Custom Orders';
            return (
              <Link
                key={category.name}
                href={
                  custom
                    ? '/custom-orders'
                    : categoryHref(category.name)
                }
                className={styles.categoryCard}
              >
                <div className={styles.categoryImage}>
                  {image && (
                    <SiteImage
                      src={image}
                      alt={`${category.name} wholesale styles`}
                      sizes={categoryImageSizes(image)}
                      className='absolute inset-0'
                      fit='contain'
                      position={CATEGORY_POSITIONS[category.name] || 'center'}
                    />
                  )}
                </div>
                <div className={styles.categoryLabel}>
                  <h3>{category.name}</h3>
                  <span>{custom ? 'Custom Orders' : 'View Styles'}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
