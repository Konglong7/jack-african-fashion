import Link from 'next/link';
import { getSiteContent } from '@/lib/siteContent';
import { getSiteLocations } from '@/lib/siteContentTypes';
import { WhatsAppContacts } from '@/components/ContactLinks';
import { pageMetadata } from '@/lib/pageMetadata';
import styles from '@/components/home/homepage.module.css';

export const metadata = pageMetadata(
  '/privacy',
  'Privacy Notice',
  'How Jack Fashion uses website visit information and handles wholesale enquiries through WhatsApp. Contact Jack about your information or privacy questions.'
);
export default async function PrivacyPage() {
  const site = await getSiteContent();
  return (
    <>
      <section className={styles.pageIntro}>
        <div className={styles.container}>
          <nav aria-label='Breadcrumb' className={styles.breadcrumb}>
            <Link href='/'>Home</Link> / Privacy notice
          </nav>
          <h1 className='font-display'>Privacy notice</h1>
          <p>
            Last updated: 3 October 2026. This notice covers the Jack Fashion wholesale catalog at
            zamique.com.
          </p>
        </div>
      </section>
      <section className={`${styles.section} ${styles.whiteSection}`}>
        <div className={`${styles.container} ${styles.policyText}`}>
          <h2>Website visits</h2>
          <p>
            We record basic website usage to understand which pages and products help buyers. This
            includes page views, clicks on WhatsApp links, page paths, referral and campaign
            information, language, time zone, browser/device details and network information such as
            IP addresses. Visit attribution uses storage for the current browser session. Server and
            website security logs may also contain request information.
          </p>
          <h2>Wholesale enquiries</h2>
          <p>
            The catalog has no public enquiry upload form or online checkout. When you contact us
            through WhatsApp, you choose the contact details, product requests, shipping information
            and messages you share. We use them to respond to enquiries and discuss or fulfil the
            agreed order. Please avoid sending unnecessary personal or sensitive information.
          </p>
          <h2>Service providers and external links</h2>
          <p>
            Website hosting and delivery providers process requests to serve and protect the site.
            WhatsApp and Google Maps links open services with their own privacy practices. Website
            analytics services may also process usage information. Order details needed for packing
            or shipping may be shared with the parties involved in your agreed order.
          </p>
          <h2>Retention</h2>
          <p>
            Recent website analytics event records are limited to a rolling 30-day period and a
            maximum of 5,000 events. Aggregate website statistics may be retained longer. Enquiry
            and order records are retained as needed for communication, fulfilment, accounting and
            applicable requirements.
          </p>
          <h2>Your questions and requests</h2>
          <p>
            Contact Jack to ask about information you have shared, request a correction or discuss
            deletion, subject to records that must be retained for an order or applicable
            requirements.
          </p>
          <WhatsAppContacts siteContent={site} className='mt-4 text-[#0B7A3E]' />
          {getSiteLocations(site).map((location) => (
            <p key={location.address}>{location.address}</p>
          ))}
        </div>
      </section>
    </>
  );
}
