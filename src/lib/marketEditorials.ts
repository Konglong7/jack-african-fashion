// Generated collection inspiration; not a record of available products or premises.
export interface MarketEditorial {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const MARKET_EDITORIALS: Record<string, MarketEditorial> = {
  africa: {
    src: '/images/market-editorials/collection-africa-a6346bf91b00.webp',
    alt: 'Collection inspiration: floral maxi dress and coordinated skirt set',
    width: 1536,
    height: 1024
  },
  'middle-east': {
    src: '/images/market-editorials/collection-middle-east-c9588105e361.webp',
    alt: 'Collection inspiration: long-sleeved teal and plum occasion dresses',
    width: 1536,
    height: 1024
  },
  'europe-north-america': {
    src: '/images/market-editorials/collection-europe-north-america-39a86b4e26e4.webp',
    alt: 'Collection inspiration: plus-size floral dress and wide-leg jumpsuit',
    width: 1536,
    height: 1024
  },
  'latin-america': {
    src: '/images/market-editorials/collection-latin-america-3a0efafd12f0.webp',
    alt: 'Collection inspiration: floral wrap dress and coordinated trouser set',
    width: 1536,
    height: 1024
  },
  'southeast-asia': {
    src: '/images/market-editorials/collection-southeast-asia-ea2e4ccc296f.webp',
    alt: 'Collection inspiration: covered floral skirt set and lilac maxi dress',
    width: 1536,
    height: 1024
  }
};

export function getMarketEditorial(slug: string): MarketEditorial | undefined {
  return MARKET_EDITORIALS[slug];
}
