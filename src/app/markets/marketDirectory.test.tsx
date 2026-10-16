import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MARKET_PAGES } from '@/lib/aioContent';
import { MARKET_REGIONS } from '@/lib/marketRegions';
import MarketsPage from './page';

describe('buying market directory', () => {
  it('makes every supported country and region reachable without client interaction', () => {
    const html = renderToStaticMarkup(MarketsPage());
    const links = new Set(
      [...html.matchAll(/href="(\/markets\/[^"?#]+)"/g)].map((match) => match[1])
    );
    for (const market of [...MARKET_PAGES, ...MARKET_REGIONS]) {
      expect(links).toContain(`/markets/${market.slug}`);
    }

    const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    expect(raw).toBeTruthy();
    const items = JSON.parse(raw!).itemListElement as { position: number; url: string }[];
    expect(new Set(items.map((item) => item.url)).size).toBe(links.size);
    expect(items.map((item) => item.position)).toEqual(items.map((_, index) => index + 1));
    for (const link of links) {
      expect(items.some((item) => item.url === `https://zamique.com${link}`)).toBe(true);
    }
  });
});
