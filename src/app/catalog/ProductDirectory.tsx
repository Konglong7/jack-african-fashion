import Link from 'next/link';
import type { PublicProduct } from '@/lib/productPublicFacts';
import styles from './productDirectory.module.css';

export function ProductDirectory({ products }: { products: PublicProduct[] }) {
  const groups = new Map<string, PublicProduct[]>();
  for (const product of products) {
    const group = groups.get(product.category) || [];
    group.push(product);
    groups.set(product.category, group);
  }

  return (
    <section className={styles.section} aria-labelledby='all-style-index'>
      <div className={styles.container}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>All {products.length} wholesale styles</p>
          <h2 id='all-style-index' className='font-display'>
            Browse every style by category
          </h2>
          <p>
            Open any style page to review its catalog images and ordering notes. Send the style code
            on WhatsApp to confirm current stock, measurements, colors and wholesale price.
          </p>
        </div>
        <div className={styles.groups}>
          {[...groups].map(([category, items]) => (
            <div className={styles.group} key={category}>
              <h3>
                {category} <span>({items.length})</span>
              </h3>
              <ul>
                {items.map((product) => (
                  <li key={product.id}>
                    <Link href={`/products/${product.slug}`}>{product.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
