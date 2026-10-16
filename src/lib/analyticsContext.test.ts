import { expect, test } from 'vitest';
import {
  buildAnalyticsEvent,
  normalizeAnalyticsSummary,
  retainRecentEvents
} from './analyticsStore';
const now = new Date('2026-10-03T12:00:00Z');
test('retains optional CTA context and counts clicks on different styles separately', () => {
  const first = buildAnalyticsEvent(
    {
      event: 'whatsapp_click',
      path: '/catalog',
      productId: '13',
      ctaLocation: 'catalog-card',
      marketSlug: 'africa',
      guideSlug: 'minimum-order-quantity'
    },
    { now }
  )!;
  const second = buildAnalyticsEvent(
    { event: 'whatsapp_click', path: '/catalog', productId: '14', ctaLocation: 'catalog-card' },
    { now }
  )!;
  expect(first.productId).toBe('13');
  expect(first.ctaLocation).toBe('catalog-card');
  expect(
    normalizeAnalyticsSummary(
      { totals: { page_view: 765, whatsapp_click: 84 }, recent: [first, second] },
      now
    ).recent
  ).toHaveLength(2);
  expect(retainRecentEvents([first, { ...first }, second], now)).toHaveLength(2);
  expect(
    normalizeAnalyticsSummary(
      { recent: [{ event: 'page_view', path: '/', at: now.toISOString() }] },
      now
    ).recent[0].productId
  ).toBe('');
});
