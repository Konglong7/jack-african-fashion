import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import nextConfig from '../next.config';

describe('public security headers', () => {
  test('ownership proof stays fetchable but is excluded from search results', async () => {
    const groups = (await nextConfig.headers?.()) || [];
    const headers = groups.find((group) => group.source === '/indexnow-key.txt')?.headers || [];
    expect(headers).toContainEqual({ key: 'X-Robots-Tag', value: 'noindex' });
  });
  test('Next responses include HSTS and a restrictive content security policy', async () => {
    const groups = (await nextConfig.headers?.()) || [];
    const publicHeaders = groups.find((group) => group.source === '/(.*)')?.headers || [];
    const values = Object.fromEntries(publicHeaders.map((header) => [header.key, header.value]));

    expect(values['Strict-Transport-Security']).toContain('max-age=');
    expect(values['Content-Security-Policy']).toContain("object-src 'none'");
    expect(values['Content-Security-Policy']).toContain("frame-ancestors 'self'");
    expect(values['Content-Security-Policy']).toContain('https://static.cloudflareinsights.com');
    expect(values['Content-Security-Policy']).toContain('https://cloudflareinsights.com');
  });

  test('Nginx replaces upstream security headers instead of duplicating them', () => {
    const nginx = readFileSync(join(process.cwd(), 'deploy', 'nginx-zamique.conf'), 'utf8');

    for (const header of [
      'Content-Security-Policy',
      'Strict-Transport-Security',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Referrer-Policy'
    ]) {
      expect(nginx).toContain(`proxy_hide_header ${header};`);
    }
    expect(nginx).toContain('add_header Content-Security-Policy');
    expect(nginx).toContain('add_header Strict-Transport-Security');
    expect(nginx).toContain('https://static.cloudflareinsights.com');
    expect(nginx).toContain('https://cloudflareinsights.com');
  });
});
