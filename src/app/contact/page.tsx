import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/siteContent';
import { ContactClient } from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | Direct WhatsApp Wholesale Inquiries',
  description:
    'Contact Jack African Fashion in Guangzhou. Chat with our sales team directly on WhatsApp for real-time stock availability, wholesale price lists, and shipping options.'
};

export default async function ContactPage() {
  const siteContent = await getSiteContent();
  return <ContactClient initialSiteContent={siteContent} />;
}
