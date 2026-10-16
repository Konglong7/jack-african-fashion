import type { Product } from './db';
import type { PublicFaqItem } from './faqJsonLd';

export function getPublicProductFaq(
  product: Pick<Product, 'name' | 'detailPage'>,
  allowDetailedContent: boolean
): PublicFaqItem[] {
  if (allowDetailedContent && product.detailPage?.faq?.length) {
    return product.detailPage.faq;
  }
  return [
    {
      question: 'How do I get the MOQ and bulk price for this style?',
      answer: `Send the product link for ${product.name}, quantity per style, size-color requirements and destination on WhatsApp. MOQ and bulk price are confirmed for the selected batch or production arrangement before ordering.`
    },
    {
      question: 'Is this style available in my sizes and colors?',
      answer:
        'Availability is confirmed by size and color for the current batch. Send the style link and your required mix on WhatsApp, and request actual garment photos or video before you decide.'
    },
    {
      question: 'Can you support repeat orders and stable new arrivals?',
      answer:
        'Share the style and quantity you need on WhatsApp. Repeat-order feasibility and suitable new arrivals are confirmed against the current supply situation.'
    },
    {
      question: 'Can we discuss packing, delivery, and market fit?',
      answer:
        'Yes. Send your country, target quantity, size ratio, and customer type. We can discuss the buying details before quotation.'
    }
  ];
}
