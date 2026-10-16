export interface PublicFaqItem {
  question: string;
  answer: string;
}

export function buildFaqJsonLd(url: string, items: readonly PublicFaqItem[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    inLanguage: 'en',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  };
}
