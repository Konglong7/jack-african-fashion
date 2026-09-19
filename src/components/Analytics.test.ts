import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const source = readFileSync(join(process.cwd(), 'src', 'components', 'Analytics.tsx'), 'utf8');
const layout = readFileSync(join(process.cwd(), 'src', 'app', 'layout.tsx'), 'utf8');
const apiRoute = readFileSync(join(process.cwd(), 'src', 'app', 'api', 'analytics', 'route.ts'), 'utf8');
const admin = readFileSync(join(process.cwd(), 'src', 'app', 'admin', 'page.tsx'), 'utf8');
const dashboardPath = join(process.cwd(), 'src', 'app', 'admin', 'AnalyticsDashboard.tsx');
const dashboard = existsSync(dashboardPath) ? readFileSync(dashboardPath, 'utf8') : '';
const adminAnalytics = admin + dashboard;
const deploy = readFileSync(join(process.cwd(), 'deploy', 'auto-update.ps1'), 'utf8');

describe('Analytics integration', () => {
  test('loads GA4 only when the public measurement id is configured', () => {
    expect(source).toContain('NEXT_PUBLIC_GA_MEASUREMENT_ID');
    expect(source).toContain('googletagmanager.com/gtag/js');
    expect(source).toContain('if (!measurementId) return null');
  });

  test('tracks WhatsApp clicks as a GA4 event', () => {
    expect(source).toContain('a[href^="https://wa.me/"]');
    expect(source).toContain('whatsapp_click');
    expect(layout).toContain('<Analytics />');
  });

  test('records simple local stats for the admin dashboard', () => {
    expect(source).toContain("sendLocalEvent('page_view'");
    expect(source).toContain("sendLocalEvent('whatsapp_click'");
    expect(apiRoute).toContain('recordAnalyticsEvent');
    expect(adminAnalytics).toContain('Visitor Snapshot');
  });

  test('sends useful visit context and lets the server own network details', () => {
    expect(source).toContain('resolvedOptions().timeZone');
    expect(source).toContain('navigator.language');
    expect(source).toContain('document.referrer');
    expect(apiRoute).toContain('getClientIp(req.headers)');
    expect(apiRoute).toContain("req.headers.get('user-agent')");
  });

  test('keeps campaign attribution while the customer browses products', () => {
    expect(source).toContain('resolveAttribution');
    expect(source).toContain('sessionStorage.getItem');
    expect(source).toContain('sessionStorage.setItem');
  });

  test('shows customer activity and protects production analytics during deployment', () => {
    expect(adminAnalytics).toContain('Recent Customer Activity');
    expect(adminAnalytics).toContain('Today visitors');
    expect(adminAnalytics).toContain('WhatsApp rate');
    expect(adminAnalytics).toContain('<CustomerLinkGenerator');
    expect(deploy).toContain("--exclude='data/analytics.json'");
    expect(deploy).toContain("--exclude='data/analytics.json.tmp'");
  });

  test('renders the conversion-first visual dashboard', () => {
    expect(admin).toContain('<AnalyticsDashboard');
    expect(dashboard).toContain('Lifetime visitors');
    expect(dashboard).toContain('Customer journey');
    expect(dashboard).toContain('7-day WhatsApp trend');
    expect(dashboard).toContain('Best lead sources');
    expect(dashboard).toContain('Best contact products');
    expect(dashboard).toContain('High-intent activity');
    expect(dashboard).toContain('<details');
  });
});
