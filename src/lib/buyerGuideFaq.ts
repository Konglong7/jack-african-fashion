import type { BuyerGuide } from './buyerGuides';
import type { PublicFaqItem } from './faqJsonLd';

const QUESTIONS: Record<string, readonly [string, string]> = {
  'wholesale-moq': [
    'What does a style MOQ mean?',
    'How should I shortlist styles for a wholesale enquiry?'
  ],
  'size-color-ratios': [
    'How should I choose a size and color ratio?',
    'How should I record a size-color allocation?'
  ],
  'plus-size-measurements': [
    'Can I convert supplier size labels directly into local sizes?',
    'Which garment measurement method should I confirm?'
  ],
  'photos-order-confirmation': [
    'How do I identify the garment I want to order?',
    'Which product photos should I request?'
  ],
  'ready-stock-custom-orders': [
    'Does a ready-stock label reserve a quantity?',
    'What should I prepare for a custom clothing enquiry?'
  ],
  'packing-cargo-handover': [
    'When should I confirm packing requirements?',
    'What should a packing list include?'
  ]
};

export function getBuyerGuideFaq(guide: BuyerGuide): PublicFaqItem[] {
  return (QUESTIONS[guide.slug] || []).flatMap((question, index) => {
    const answer = guide.sections[index]?.paragraphs[0];
    return answer ? [{ question, answer }] : [];
  });
}
