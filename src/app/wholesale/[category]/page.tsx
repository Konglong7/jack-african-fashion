import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WHOLESALE_PAGES, getWholesalePage } from '@/lib/aioContent';
import { getSiteContent } from '@/lib/siteContent';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { getProducts } from '@/lib/db';
import { buildCollectionJsonLd } from '@/lib/collectionJsonLd';
import { pageMetadata } from '@/lib/pageMetadata';
import { ProductCard } from '@/components/ProductCard';
import { WhatsAppIcon } from '@/components/Icons';
import styles from '@/components/home/homepage.module.css';
import { toPublicProduct } from '@/lib/productPublicFacts';

interface PageProps {
  params: Promise<{ category: string }>;
}
export const revalidate = 60;
export const dynamicParams = false;
export function generateStaticParams() {
  return WHOLESALE_PAGES.map((page) => ({ category: page.slug }));
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const page = getWholesalePage(category);
  if (!page) notFound();
  return pageMetadata(`/wholesale/${page.slug}`, page.title, page.description);
}
export default async function WholesalePage({ params }: PageProps) {
  const { category } = await params;
  const page = getWholesalePage(category);
  if (!page) notFound();
  const [siteContent, products] = await Promise.all([getSiteContent(), getProducts()]);
  const selected = products
    .filter((product) =>
      page.catalogCategory
        ? product.category === page.catalogCategory
        : category === 'african-dresses'
          ? /Dress/.test(product.category)
          : true
    )
    .slice(-6)
    .reverse()
    .map((product) => toPublicProduct(product));
  const catalogHref = page.catalogCategory
    ? `/catalog?category=${encodeURIComponent(page.catalogCategory)}`
    : '/catalog';
  const schema = buildCollectionJsonLd({
    path: `/wholesale/${category}`,
    name: page.title,
    description: page.description,
    products: selected,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Wholesale catalog', path: '/catalog' },
      { name: page.title, path: `/wholesale/${category}` }
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
            <Link href='/'>Home</Link> / <Link href='/catalog'>Wholesale catalog</Link> /{' '}
            {page.title}
          </nav>
          <h1 className='font-display'>{page.title}</h1>
          <p>{page.introduction}</p>
          <div className={styles.heroActions}>
            <a
              href={siteWhatsAppLink(
                siteContent,
                `Hello Jack, I am interested in ${page.title}. Please help me confirm styles, actual garment details, available stock and a wholesale quotation.`
              )}
              target='_blank'
              rel='noopener noreferrer'
              className={`${styles.button} ${styles.primary}`}
            >
              <WhatsAppIcon className='h-5 w-5' />
              Chat on WhatsApp
            </a>
            <Link href={catalogHref} className={`${styles.button} ${styles.secondary}`}>
              View the collection
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={`font-display ${styles.sectionHeading}`}>Explore the styles</h2>
          <p className={`${styles.sectionDescription} mb-6`}>
            Compare the {selected.length} wholesale styles below, then send your selected product
            links and quantities on WhatsApp. MOQ, current stock and bulk price are confirmed for
            each style before ordering.
          </p>
          <div className={styles.productGrid}>
            {selected.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                siteContent={siteContent}
                variant='home'
                sizes='(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw'
              />
            ))}
          </div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.whiteSection}`}>
        <div className={styles.container}>
          <h2 className={`font-display ${styles.sectionHeading}`}>
            Build your order with clear specifications
          </h2>
          <p className={`${styles.sectionDescription} mb-6`}>
            Confirm the selected garment, size-color breakdown, quantity and written quotation
            before payment. Include your destination and packing requirements so cargo handover
            terms can be reviewed with the order.
          </p>
          <div className={styles.checkGrid}>
            <div className={styles.checkCard}>
              <h3>Confirm for each style</h3>
              <ul>
                {page.productDetails.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
            <div className={styles.checkCard}>
              <h3>For your business</h3>
              <ul>
                {page.suitableBuyers.map((buyer) => (
                  <li key={buyer}>{buyer}</li>
                ))}
              </ul>
            </div>
            <div className={styles.checkCard}>
              <h3>Prepare your enquiry</h3>
              <p>
                Send product links or style codes, quantity per design, size-color mix and
                destination city. Ask for the actual garment details and written order terms.
              </p>
              <Link href='/buying-guide' className={styles.textLink}>
                Read the buying guide
              </Link>
            </div>
          </div>
          <div className={`${styles.linkList} mt-6`}>
            {WHOLESALE_PAGES.filter((other) => other.slug !== category).map((other) => (
              <Link key={other.slug} href={`/wholesale/${other.slug}`} className={styles.textLink}>
                {other.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
