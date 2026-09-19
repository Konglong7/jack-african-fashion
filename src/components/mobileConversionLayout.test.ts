import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const componentsDir = join(process.cwd(), 'src', 'components');
const appDir = join(process.cwd(), 'src', 'app');

function readComponent(file: string) {
  return readFileSync(join(componentsDir, file), 'utf8');
}

function readAppFile(file: string) {
  return readFileSync(join(appDir, file), 'utf8');
}

describe('mobile conversion layout', () => {
  test('suppresses global floaters on mobile product pages', () => {
    const rootChrome = readComponent('RootChrome.tsx');

    expect(rootChrome).toContain("pathname.startsWith('/products/')");
    expect(rootChrome).toContain("className='hidden md:block'");
  });

  test('does not show an empty inquiry cart as a second mobile action', () => {
    const inquiryFloating = readComponent('InquiryFloating.tsx');

    expect(inquiryFloating).toContain('if (count === 0)');
    expect(inquiryFloating).toContain('left-4 bottom-4');
  });

  test('keeps catalog filters in a horizontal rail on phones', () => {
    const catalog = readAppFile('catalog/CatalogClient.tsx');

    expect(catalog).toContain('overflow-x-auto');
    expect(catalog).toContain('flex-nowrap');
    expect(catalog).toContain('shrink-0 whitespace-nowrap');
  });

  test('uses a concise tablet and desktop navigation set', () => {
    const header = readComponent('Header.tsx');

    expect(header).toContain("{ label: 'Catalog', href: '/catalog' }");
    expect(header).toContain('hidden items-center gap-4 md:flex');
    expect(header).toContain('md:hidden');
  });

  test('equips product gallery and cards with image download and lookbook WhatsApp actions', () => {
    const gallery = readComponent('ProductGalleryClient.tsx');
    const card = readComponent('ProductCard.tsx');

    expect(gallery).toContain('handleDownloadCurrent');
    expect(gallery).toContain('handleDownloadAll');
    expect(gallery).toContain('High-Res Boutique Photos');
    expect(gallery).toContain('Ask on WhatsApp');
    expect(card).toContain('handleQuickDownload');
    expect(card).toContain('Save photo for WhatsApp status or reselling');
  });
});
