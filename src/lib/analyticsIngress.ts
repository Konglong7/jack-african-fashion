interface AnalyticsRateLimiterOptions {
  maxEvents: number;
  windowMs: number;
  maxIdentifiers: number;
}

export class AnalyticsRateLimiter {
  private events = new Map<string, number[]>();

  constructor(private options: AnalyticsRateLimiterOptions) {}

  get size() {
    return this.events.size;
  }

  allow(identifier: string, now = Date.now()): boolean {
    const key = identifier || 'unknown';
    const cutoff = now - this.options.windowMs;
    const active = (this.events.get(key) || []).filter((timestamp) => timestamp > cutoff);
    if (active.length >= this.options.maxEvents) {
      this.events.set(key, active);
      return false;
    }

    if (!this.events.has(key) && this.events.size >= this.options.maxIdentifiers) {
      const oldest = this.events.keys().next().value;
      if (oldest) this.events.delete(oldest);
    }
    active.push(now);
    this.events.delete(key);
    this.events.set(key, active);
    return true;
  }
}

export const analyticsRateLimiter = new AnalyticsRateLimiter({
  maxEvents: 120,
  windowMs: 60_000,
  maxIdentifiers: 10_000
});

export function isTrustedAnalyticsRequest(request: Request): boolean {
  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json' && !contentType?.endsWith('+json')) return false;

  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const submittedOrigin = new URL(origin).origin;
    return (
      submittedOrigin === new URL(request.url).origin || submittedOrigin === getSiteOrigin()
    );
  } catch {
    return false;
  }
}
import { getSiteOrigin } from './siteUrl';

