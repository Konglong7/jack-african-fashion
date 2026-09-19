import { describe, expect, it } from 'vitest';
import { LoginRateLimiter } from './rateLimit';

describe('LoginRateLimiter', () => {
  it('blocks an identifier after too many failures inside the window', () => {
    const limiter = new LoginRateLimiter({ maxFailures: 2, windowMs: 60_000 });

    expect(limiter.isBlocked('127.0.0.1', 1_000)).toBe(false);
    limiter.recordFailure('127.0.0.1', 1_000);
    limiter.recordFailure('127.0.0.1', 2_000);

    expect(limiter.isBlocked('127.0.0.1', 3_000)).toBe(true);
  });

  it('clears failures after a successful login', () => {
    const limiter = new LoginRateLimiter({ maxFailures: 1, windowMs: 60_000 });
    limiter.recordFailure('127.0.0.1', 1_000);

    limiter.recordSuccess('127.0.0.1');

    expect(limiter.isBlocked('127.0.0.1', 2_000)).toBe(false);
  });
});
