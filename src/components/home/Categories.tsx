import Link from 'next/link';
import type { SiteCategory } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';
import { SiteImage } from '@/components/SiteImage';
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
          Browse by style
        </h2>
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
                    : `/catalog?category=${encodeURIComponent(category.name)}`
                }
                className={styles.categoryCard}
              >
                <div className={styles.categoryImage}>
                  {image && (
                    <SiteImage
                      src={image}
                      alt={`${category.name} wholesale styles`}
                      sizes='(max-width: 767px) 33vw, (max-width: 1279px) 16vw, 190px'
                      className='absolute inset-0'
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
