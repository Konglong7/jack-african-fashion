import Link from 'next/link';
import { getSiteContent } from '@/lib/siteContent';
import { getSiteLocations } from '@/lib/siteContentTypes';
import { WhatsAppContacts } from '@/components/ContactLinks';
import { pageMetadata } from '@/lib/pageMetadata';
import styles from '@/components/home/homepage.module.css';

export const metadata = pageMetadata(
  '/terms',
  'Wholesale Enquiry & Order Terms',
  'Understand the Jack Fashion enquiry catalog and the details to agree before a wholesale clothing order: stock, specifications, price, payment, packing and delivery.'
);
export default async function TermsPage() {
  const site = await getSiteContent();
  return (
    <>
      <section className={styles.pageIntro}>
        <div className={styles.container}>
          <nav aria-label='Breadcrumb' className={styles.breadcrumb}>
            <Link href='/'>Home</Link> / Wholesale terms
          </nav>
          <h1 className='font-display'>Wholesale enquiry and order terms</h1>
          <p>
            Last updated: 3 October 2026. Use the catalog to choose styles and discuss a wholesale
            order directly with Jack.
          </p>
        </div>
      </section>
      <section className={`${styles.section} ${styles.whiteSection}`}>
        <div className={`${styles.container} ${styles.policyText}`}>
          <h2>A wholesale enquiry catalog</h2>
          <p>
            This website serves boutiques, wholesalers, importers and other business buyers. It does
            not provide an online checkout. A listing or WhatsApp click does not place an order,
            reserve stock or confirm a price.
          </p>
          <h2>Images, colors and sizes</h2>
          <p>
            Confirm the available colors, fabric and finished garment measurements for each style
            before ordering. Size labels alone do not establish fit, and screen colors can vary.
          </p>
          <h2>Quotation and order confirmation</h2>
          <p>
            Before payment, agree the contracting supplier, payment beneficiary, style codes, pieces
            included, quantity, fabric and garment specifications, size-color breakdown, price,
            currency, payment method and any sampling or production timeline in writing. MOQ,
            ready-stock availability and custom-production arrangements must be confirmed for each
            selected style in the quotation.
          </p>
          <h2>Packing and delivery</h2>
          <p>
            Confirm the packing list, order marks, receiving agent, handover point and delivery
            arrangement. Freight charges, delivery estimates, insurance and import-clearance
            responsibilities depend on the destination and the agreed order. Website market pages do
            not guarantee a shipping service or transit time.
          </p>
          <h2>Checking goods and resolving discrepancies</h2>
          <p>
            Agree inspection requirements, reporting deadlines and any return, replacement or refund
            terms before payment. Keep the order confirmation, packing list and delivery evidence.
            If there is a problem, contact Jack with the product code, quantity and clear supporting
            photos or video so the discrepancy can be reviewed.
          </p>
          <h2>Contact and agreed terms</h2>
          <p>
            The written terms agreed for your specific order should identify the supplier and the
            obligations of each party. These website notes explain the enquiry process and do not
            replace that agreement or applicable rights.
          </p>
          <WhatsAppContacts siteContent={site} className='mt-4 text-[#0B7A3E]' />
          {getSiteLocations(site).map((location) => (
            <p key={location.address}>{location.address}</p>
          ))}
          <Link href='/buying-guide' className={styles.textLink}>
            Prepare your wholesale enquiry
          </Link>
        </div>
      </section>
    </>
  );
}
