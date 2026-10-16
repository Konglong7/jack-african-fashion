import { createElement } from 'react';
import { renderToReadableStream } from 'react-dom/server';
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { SiteContent } from '@/lib/siteContentTypes';
import { RootChrome } from './RootChrome';

const route = vi.hoisted(() => ({ pathname: '/' }));
vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }));
vi.mock('@/components/Header', () => ({ Header: () => createElement('header', null, 'Header') }));
vi.mock('@/components/Footer', () => ({ Footer: () => createElement('footer', null, 'Footer') }));
vi.mock('@/components/WhatsAppFloating', () => ({ WhatsAppFloating: () => null }));

afterEach(() => {
  route.pathname = '/';
});

async function renderDeferredPage(pathname: string) {
  route.pathname = pathname;
  async function DeferredContent() {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return createElement('h1', { id: 'home-hero-title' }, 'Wholesale womenswear');
  }
  const stream = await renderToReadableStream(
    <RootChrome siteContent={{} as SiteContent}>
      <DeferredContent />
    </RootChrome>
  );
  return new Response(stream).text();
}

describe('page content server rendering', () => {
  test('delivers the homepage heading outside a hidden streaming reveal container', async () => {
    const html = await renderDeferredPage('/');
    expect(html).toContain('<h1 id="home-hero-title">Wholesale womenswear</h1>');
    expect(html).not.toMatch(/<div hidden(?:="")? id="S:/);
  });

  test('keeps the existing suspense boundary for deferred content on other routes', async () => {
    const html = await renderDeferredPage('/catalog');
    expect(html).toContain('Wholesale womenswear');
    expect(html).toMatch(/<div hidden(?:="")? id="S:/);
  });
});
