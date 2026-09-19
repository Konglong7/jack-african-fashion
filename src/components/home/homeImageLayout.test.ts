import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const homeDir = join(process.cwd(), 'src', 'components', 'home');

function readHomeComponent(file: string) {
  return readFileSync(join(homeDir, file), 'utf8');
}

describe('homepage marketing image layout', () => {
  test('does not render key homepage art as contained blur-background images', () => {
    for (const file of [
      'Hero.tsx',
      'Categories.tsx',
      'PopularProducts.tsx',
      'CustomOrderProcess.tsx',
      'SocialMedia.tsx'
    ]) {
      const source = readHomeComponent(file);

      expect(source).not.toContain("fit='contain'");
      expect(source).not.toContain('useBlurBackground');
      expect(source).not.toContain("imageClassName='p-");
    }
  });

  test('keeps requested full-bleed homepage image heights and focal points', () => {
    expect(readHomeComponent('Hero.tsx')).toContain("position='center top'");
    expect(readHomeComponent('Hero.tsx')).toContain('sm:min-h-[max(720px,56.25vw)]');
    expect(readHomeComponent('Hero.tsx')).toContain('sm:![object-position:center_top]');
    expect(readHomeComponent('Categories.tsx')).toContain('aspect-[4/5]');
    expect(readHomeComponent('PopularProducts.tsx')).toContain('aspect-[16/7]');
    expect(readHomeComponent('CustomOrderProcess.tsx')).toContain('aspect-video');
    expect(readHomeComponent('SocialMedia.tsx')).toContain('aspect-video');
    expect(readHomeComponent('SocialMedia.tsx')).toContain('lg:grid-cols-[0.56fr_0.44fr]');
    expect(readHomeComponent('CustomOrderProcess.tsx')).not.toContain('h-[420px] sm:h-[540px]');
    expect(readHomeComponent('SocialMedia.tsx')).not.toContain('lg:min-h-[460px]');
    expect(readHomeComponent('Categories.tsx')).toContain('center 20%');
    expect(readHomeComponent('Categories.tsx')).toContain('center 25%');
  });

  test('prioritizes mobile hero guidance and real supply proof', () => {
    const hero = readHomeComponent('Hero.tsx');
    const about = readHomeComponent('AboutSnippet.tsx');
    const why = readHomeComponent('WhyChooseUs.tsx');

    expect(hero).toContain("href='#home-categories'");
    expect(hero).toContain('See Styles');
    expect(hero).toContain('View All Products');
    expect(hero).toContain('Yulong Fashion Plaza');
    expect(hero).toContain('Factory Network');
    expect(hero).toContain('hidden sm:block');
    expect(hero).toContain('sm:min-h-[max(720px,56.25vw)]');

    expect(about).not.toContain("value: '100+'");
    expect(about).not.toContain("value: '5+'");
    expect(why).not.toContain("value: '100+'");
    expect(why).not.toContain("value: '24h'");
    expect(why).toContain('Guangzhou Market Base');
    expect(why).toContain('Export Packing');
  });

  test('keeps desktop hero copy readable and category reveal responsive', () => {
    const hero = readHomeComponent('Hero.tsx');
    const categories = readHomeComponent('Categories.tsx');

    expect(hero).toContain('sm:from-black/80');
    expect(hero).toContain('sm:via-black/45');
    expect(hero).toContain('max-w-2xl');
    expect(hero).not.toContain("className='group hidden");

    expect(categories).toContain('<section ref={ref}');
    expect(categories).toContain("href='/catalog'");
    expect(categories).toContain('View All Products');
    expect(categories).not.toContain("ref={ref}\n          className='grid");
  });

  test('optimizes mobile scroll depth with 2-column categories and Africa trust guarantees', () => {
    const categories = readHomeComponent('Categories.tsx');
    const custom = readHomeComponent('CustomOrderProcess.tsx');
    const trustStrip = readHomeComponent('AfricaTrustStrip.tsx');

    expect(categories).toContain('grid-cols-2');
    expect(custom).toContain('grid-cols-2');
    expect(trustStrip).toContain('Free GZ Cargo Delivery');
    expect(trustStrip).toContain('Low MOQ & Mix Batch');
    expect(trustStrip).toContain('Showroom Video Check');
    expect(trustStrip).toContain('24–48h Quick Dispatch');
  });
});
