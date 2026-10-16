import { describe, expect, test } from 'vitest';
import { AnalyticsRateLimiter, isTrustedAnalyticsRequest } from './analyticsIngress';

function request(headers: Record<string, string> = {}, url = 'https://zamique.com/api/analytics') {
  return new Request(url, {
    method: 'POST',
    headers
  });
}

describe('analytics ingress controls', () => {
  test('accepts same-origin JSON beacons', () => {
    expect(
      isTrustedAnalyticsRequest(
        request({ origin: 'https://zamique.com', 'content-type': 'application/json' })
      )
    ).toBe(true);
  });

  test('accepts the configured public origin when the application sees an internal proxy URL', () => {
    expect(
      isTrustedAnalyticsRequest(
        request(
          { origin: 'https://zamique.com', 'content-type': 'application/json' },
          'http://127.0.0.1:3200/api/analytics'
        )
      )
    ).toBe(true);
  });

  test('rejects missing, lookalike, and cross-origin origins', () => {
    expect(isTrustedAnalyticsRequest(request({ 'content-type': 'application/json' }))).toBe(false);
    expect(
      isTrustedAnalyticsRequest(
        request({ origin: 'https://zamique.com.evil.example', 'content-type': 'application/json' })
      )
    ).toBe(false);
    expect(
      isTrustedAnalyticsRequest(
        request({ origin: 'https://www.zamique.com', 'content-type': 'application/json' })
      )
    ).toBe(false);
    expect(
      isTrustedAnalyticsRequest(
        request(
          { origin: 'https://zamique.com.evil.example', 'content-type': 'application/json' },
          'http://127.0.0.1:3200/api/analytics'
        )
      )
    ).toBe(false);
  });

  test('rejects non-JSON request bodies', () => {
    expect(
      isTrustedAnalyticsRequest(
        request({ origin: 'https://zamique.com', 'content-type': 'text/plain' })
      )
    ).toBe(false);
  });

  test('limits repeated events and recovers after the window', () => {
    const limiter = new AnalyticsRateLimiter({ maxEvents: 2, windowMs: 1_000, maxIdentifiers: 10 });

    expect(limiter.allow('visitor', 1_000)).toBe(true);
    expect(limiter.allow('visitor', 1_100)).toBe(true);
    expect(limiter.allow('visitor', 1_200)).toBe(false);
    expect(limiter.allow('visitor', 2_101)).toBe(true);
  });

  test('caps tracked identifiers', () => {
    const limiter = new AnalyticsRateLimiter({ maxEvents: 2, windowMs: 1_000, maxIdentifiers: 2 });
    limiter.allow('a', 1_000);
    limiter.allow('b', 1_001);
    limiter.allow('c', 1_002);

    expect(limiter.size).toBeLessThanOrEqual(2);
  });
});
