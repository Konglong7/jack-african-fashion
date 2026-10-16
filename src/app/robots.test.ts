import { describe, expect, it } from 'vitest';
import robots from './robots';

describe('public crawler policy', () => {
  it.each([
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'Google-Extended',
    'PerplexityBot', 'ClaudeBot', 'anthropic-ai', 'GrokBot'
  ])('explicitly permits %s while excluding private routes', (agent) => {
    const policy = robots();
    const rules = Array.isArray(policy.rules) ? policy.rules : [policy.rules];
    const rule = rules.find((entry) =>
      [entry.userAgent].flat().includes(agent)
    );

    expect(rule).toBeDefined();
    expect(rule?.allow).toBe('/');
    expect(rule?.disallow).toEqual(expect.arrayContaining(['/admin', '/api/', '/inquiry']));
    expect(policy.sitemap).toBe('https://zamique.com/sitemap.xml');
  });
});
