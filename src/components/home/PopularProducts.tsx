import { getProducts } from '@/lib/db';
import { getSiteContent } from '@/lib/siteContent';
import { ProductCard } from '@/components/ProductCard';
import { pickHomepageProducts } from './homeProducts';
import { PopularProductsClient } from './PopularProductsClient';
import styles from './homepage.module.css';

export async function PopularProducts() {
  const [all, siteContent] = await Promise.all([getProducts(), getSiteContent()]);
  const featured = pickHomepageProducts(all);
  return (
    <PopularProductsClient
      title='Featured Wholesale Styles'
      description='Explore current styles. Stock, MOQ, colors and custom options are confirmed per style.'
    >
      <div data-home-products className={styles.productGrid}>
        {featured.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            siteContent={siteContent}
            variant='home'
            sizes='(max-width: 359px) calc(100vw - 32px), (max-width: 767px) calc((100vw - 44px) / 2), (max-width: 1023px) calc((100vw - 80px) / 3), (max-width: 1279px) calc((100vw - 136px) / 4), 286px'
          />
        ))}
      </div>
    </PopularProductsClient>
  );
}
