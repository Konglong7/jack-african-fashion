interface LoginRateLimiterOptions {
  maxFailures: number;
  windowMs: number;
}

export class LoginRateLimiter {
  private attempts = new Map<string, number[]>();

  constructor(private options: LoginRateLimiterOptions) {}

  isBlocked(identifier: string, now = Date.now()): boolean {
    return this.activeFailures(identifier, now).length >= this.options.maxFailures;
  }

  recordFailure(identifier: string, now = Date.now()): void {
    const failures = this.activeFailures(identifier, now);
    failures.push(now);
    this.attempts.set(identifier, failures);
  }

  recordSuccess(identifier: string): void {
    this.attempts.delete(identifier);
  }

  private activeFailures(identifier: string, now: number): number[] {
    const cutoff = now - this.options.windowMs;
    const failures = (this.attempts.get(identifier) || []).filter((time) => time > cutoff);
    this.attempts.set(identifier, failures);
    return failures;
  }
}

export const loginRateLimiter = new LoginRateLimiter({
  maxFailures: 5,
  windowMs: 15 * 60 * 1000
});
