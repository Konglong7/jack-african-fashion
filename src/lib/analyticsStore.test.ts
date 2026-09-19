import { describe, expect, test } from 'vitest';
import {
  buildAnalyticsEvent,
  getClientIp,
  maskIp,
  normalizeAnalyticsSummary,
  rememberVisitor,
  retainRecentEvents
} from './analyticsStore';

const NOW = new Date('2026-07-22T12:00:00.000Z');

describe('analytics visitor details', () => {
  test('reads the proxy IP and masks it before storage', () => {
    const headers = new Headers({ 'x-forwarded-for': '197.210.53.18, 10.0.0.1' });

    expect(getClientIp(headers)).toBe('197.210.53.18');
    expect(maskIp('197.210.53.18')).toBe('197.210.*.*');
    expect(maskIp('::1')).toBe('Local');
  });

  test('builds a server-owned, sanitized analytics event', () => {
    const event = buildAnalyticsEvent(
      {
        event: 'page_view',
        path: '/catalog?utm_campaign=private',
        source: ' whatsapp ',
        campaign: 'Ghana-Amina',
        timezone: 'Africa/Accra',
        language: 'en-GH',
        referrer: 'https://www.facebook.com/groups/example?private=yes'
      },
      {
        ip: '197.210.53.18',
        userAgent: 'Mozilla/5.0 (Linux; Android 14; Mobile)',
        now: NOW,
        secret: 'test-secret'
      }
    );

    expect(event).toMatchObject({
      event: 'page_view',
      path: '/catalog',
      source: 'whatsapp',
      campaign: 'Ghana-Amina',
      timezone: 'Africa/Accra',
      language: 'en-GH',
      referrer: 'facebook.com',
      at: NOW.toISOString(),
      ip: '197.210.*.*',
      device: 'Mobile'
    });
    expect(event?.visitorId).toMatch(/^V-[A-F0-9]{8}$/);
    expect(event?.visitorId).toBe(
      buildAnalyticsEvent(
        { event: 'page_view', path: '/catalog' },
        { ip: '197.210.53.18', userAgent: 'Mozilla/5.0 (Linux; Android 14; Mobile)', now: NOW, secret: 'test-secret' }
      )?.visitorId
    );
  });

  test('rejects invalid events and bounds user-controlled fields', () => {
    expect(buildAnalyticsEvent({ event: 'purchase' }, { now: NOW })).toBeNull();

    const event = buildAnalyticsEvent(
      { event: 'page_view', path: `/${'a'.repeat(300)}`, campaign: 'x'.repeat(200) },
      { now: NOW }
    );

    expect(event?.path.length).toBeLessThanOrEqual(160);
    expect(event?.campaign.length).toBeLessThanOrEqual(80);
  });

  test('keeps 30 days, caps records, and removes rapid duplicates', () => {
    const current = buildAnalyticsEvent(
      { event: 'page_view', path: '/' },
      { ip: '197.210.53.18', userAgent: 'Mobile', now: NOW, secret: 'test-secret' }
    )!;
    const duplicate = { ...current, at: new Date(NOW.getTime() - 5_000).toISOString() };
    const old = { ...current, at: new Date(NOW.getTime() - 31 * 86_400_000).toISOString() };
    const many = Array.from({ length: 5_100 }, (_, index) => ({
      ...current,
      path: `/product/${index}`,
      at: new Date(NOW.getTime() - 20_000 - index).toISOString()
    }));

    const retained = retainRecentEvents([current, duplicate, old, ...many], NOW);

    expect(retained).toHaveLength(5_000);
    expect(retained).not.toContain(old);
    expect(retained.filter((event) => event.path === '/')).toHaveLength(1);
  });

  test('loads legacy summaries without clearing their totals', () => {
    const summary = normalizeAnalyticsSummary({
      totals: { page_view: 9, whatsapp_click: 2 },
      recent: [{ event: 'page_view', path: '/', campaign: '', at: NOW.toISOString() }]
    }, NOW);

    expect(summary.totals).toEqual({ page_view: 9, whatsapp_click: 2 });
    expect(summary.recent[0]).toMatchObject({ visitorId: '', ip: 'Unknown', device: 'Unknown' });
  });

  test('seeds lifetime visitors from identifiable retained events', () => {
    const visitor = buildAnalyticsEvent(
      { event: 'page_view', path: '/' },
      { ip: '197.210.53.18', userAgent: 'Mobile', now: NOW, secret: 'test-secret' }
    )!;

    const summary = normalizeAnalyticsSummary({
      totals: { page_view: 3, whatsapp_click: 0 },
      recent: [visitor, { ...visitor, event: 'whatsapp_click' }]
    }, NOW);

    expect(summary.knownVisitors).toEqual([visitor.visitorId]);
    expect(summary.statsStartedAt).toBe(visitor.at);
  });

  test('remembers a new lifetime visitor only once', () => {
    const visitor = buildAnalyticsEvent(
      { event: 'page_view', path: '/' },
      { ip: '197.210.53.18', userAgent: 'Mobile', now: NOW, secret: 'test-secret' }
    )!;
    const summary = normalizeAnalyticsSummary({}, NOW);

    rememberVisitor(summary, visitor);
    rememberVisitor(summary, visitor);

    expect(summary.knownVisitors).toEqual([visitor.visitorId]);
    expect(summary.statsStartedAt).toBe(visitor.at);
  });
});
