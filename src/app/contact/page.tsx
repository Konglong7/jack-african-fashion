import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/siteContent';
import { ContactClient } from './ContactClient';
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata: Metadata = pageMetadata(
  '/contact',
  'Contact Our Guangzhou Wholesale Team',
  'Contact Jack Fashion in Guangzhou on WhatsApp for current stock, wholesale quotations, visit appointments and shipping route confirmation.'
);

export default async function ContactPage() {
  const siteContent = await getSiteContent();
  return <ContactClient initialSiteContent={siteContent} />;
}
