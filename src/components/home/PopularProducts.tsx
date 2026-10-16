import { getProducts } from '@/lib/db';
import { getSiteContent } from '@/lib/siteContent';
import { ProductCard } from '@/components/ProductCard';
import { pickHomepageProducts } from './homeProducts';
import { PopularProductsClient } from './PopularProductsClient';
import styles from './homepage.module.css';
import { toPublicProduct } from '@/lib/productPublicFacts';

export async function PopularProducts() {
  const [all, siteContent] = await Promise.all([getProducts(), getSiteContent()]);
  const featured = pickHomepageProducts(all).map((product) => toPublicProduct(product));
  return (
    <PopularProductsClient
      title='Wholesale styles for your shortlist'
      description='Open a style to see the complete catalog image, then request current stock photos, garment measurements and a bulk-price quotation. MOQ and the available size-color mix are confirmed for each style.'
    >
      <div data-home-products className={styles.productGrid}>
        {featured.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            siteContent={siteContent}
            variant='home'
            sizes='(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 68px) / 2), (max-width: 1319px) calc((100vw - 128px) / 3), 397px'
          />
        ))}
      </div>
    </PopularProductsClient>
  );
}
