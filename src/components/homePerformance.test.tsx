import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { DeferredMapEmbed } from './DeferredMapEmbed';

const componentsDir = join(process.cwd(), 'src', 'components');
const projectRoot = process.cwd();

describe('homepage performance safeguards', () => {
  test('renders an accessible map loader without a third-party iframe initially', () => {
    const html = renderToStaticMarkup(
      createElement(DeferredMapEmbed, {
        src: 'https://www.google.com/maps?q=Yulong%20Fashion%20Plaza&output=embed',
        title: 'Yulong Fashion Plaza location map'
      })
    );

    expect(html).toContain('<button');
    expect(html).toContain('aria-label="Load interactive map: Yulong Fashion Plaza location map"');
    expect(html).not.toContain('<iframe');
    expect(html).not.toContain('google.com/maps');
  });

  test('does not force-disable prefetching on internal navigation links', () => {
    for (const file of [
      'Header.tsx',
      'Footer.tsx',
      'home/Hero.tsx',
      'home/Categories.tsx',
      'home/CustomOrderProcess.tsx',
      'home/AboutSnippet.tsx',
      'home/BlogTips.tsx'
    ]) {
      const source = readFileSync(join(componentsDir, file), 'utf8');
      expect(source, file).not.toContain('prefetch={false}');
    }
  });

  test('keeps the current unpublished product image batch out of deployment archives', () => {
    const packScript = readFileSync(join(projectRoot, 'deploy', 'pack.ps1'), 'utf8');

    expect(packScript).toContain("--exclude='public/images/products/0921*.png'");
    expect(packScript).not.toContain('$VPS_HOST:/root/');
  });
});
