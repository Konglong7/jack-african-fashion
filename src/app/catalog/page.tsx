import type { Metadata } from 'next';
import { getProducts } from '@/lib/db';
import { getSiteContent } from '@/lib/siteContent';
import { CatalogClient } from './CatalogClient';
import { pageMetadata } from '@/lib/pageMetadata';
import Link from 'next/link';
import styles from '@/components/home/homepage.module.css';
import { ProductDirectory } from './ProductDirectory';
import { toPublicProduct } from '@/lib/productPublicFacts';
import { buildCollectionJsonLd } from '@/lib/collectionJsonLd';

export const revalidate = 60;
export const metadata: Metadata = pageMetadata(
  '/catalog',
  "Women's Clothing Wholesale Catalog",
  'Browse wholesale dresses, matching sets, jumpsuits and plus-size styles from Jack Fashion. Send style codes and quantities to confirm MOQ, stock and a bulk-price quote.'
);
export default async function CatalogPage() {
  const [products, siteContent] = await Promise.all([getProducts(), getSiteContent()]);
  const publicProducts = products.map((product) => toPublicProduct(product));
  const categories = Array.from(new Set(products.map((product) => product.category)));
  const schema = buildCollectionJsonLd({
    path: '/catalog',
    name: 'Women’s Clothing Wholesale Catalog',
    description:
      'Browse dresses, matching sets, jumpsuits and plus-size styles from Jack Fashion in Guangzhou. Confirm current stock, measurements and wholesale prices.',
    products: publicProducts,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Wholesale catalog', path: '/catalog' }
    ]
  });
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
      <section className={styles.pageIntro}>
        <div className={styles.container}>
          <nav aria-label='Breadcrumb' className={styles.breadcrumb}>
            <Link href='/'>Home</Link> / Wholesale catalog
          </nav>
          <h1 className='font-display'>Women’s Clothing Wholesale Catalog</h1>
          <p>
            Dresses, matching sets and plus-size womenswear from Guangzhou. Browse the complete
            images and search by name or style code. Confirm current MOQ for each selected style.
          </p>
          <div className={styles.linkList}>
            <Link href='/buying-guide' className={styles.textLink}>
              How to prepare your order
            </Link>
            <Link href='/markets' className={styles.textLink}>
              Browse buying markets
            </Link>
          </div>
        </div>
      </section>
      <CatalogClient products={publicProducts} siteContent={siteContent} categories={categories} />
      <ProductDirectory products={publicProducts} />
    </>
  );
}
