import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/siteContent';
import { InquiryClient } from './InquiryClient';

export const metadata: Metadata = {
  title: 'Inquiry List',
  description: 'Review selected wholesale women fashion styles and send one WhatsApp inquiry.'
};

export default async function InquiryPage() {
  const siteContent = await getSiteContent();
  return <InquiryClient siteContent={siteContent} />;
}
