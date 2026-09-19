import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import {
  sanitizeFilename,
  getFileExtension,
  getProductImageFilename,
  downloadImageFile,
  downloadMultipleImages
} from './downloadImage';

type MockLink = {
  href: string;
  download: string;
  click: () => void;
};

describe('downloadImage utilities', () => {
  test('sanitizeFilename removes illegal characters and trims correctly', () => {
    expect(sanitizeFilename('Elegant Pleated Maxi Dress (2026)')).toBe(
      'elegant-pleated-maxi-dress-2026'
    );
    expect(sanitizeFilename('   --Special / Dress #1--  ')).toBe('special-dress-1');
    expect(sanitizeFilename('!!!')).toBe('');
  });

  test('getFileExtension correctly extracts file extensions from URLs', () => {
    expect(getFileExtension('/images/products/dress.png')).toBe('png');
    expect(getFileExtension('/images/products/sample.webp?v=123')).toBe('webp');
    expect(getFileExtension('/images/products/photo.jpeg')).toBe('jpg');
    expect(getFileExtension('/images/products/photo.jpg')).toBe('jpg');
    expect(getFileExtension('')).toBe('jpg');
  });

  test('getProductImageFilename formats standard B2B wholesale filenames and preserves extension', () => {
    expect(getProductImageFilename('Elegant Pleated Maxi Dress')).toBe(
      'african-fashion-elegant-pleated-maxi-dress.jpg'
    );
    expect(getProductImageFilename('Two-Piece Set', 0, '/images/test.png')).toBe(
      'african-fashion-two-piece-set-photo-1.png'
    );
    expect(getProductImageFilename('Two-Piece Set', 2, '/images/test.webp?w=800')).toBe(
      'african-fashion-two-piece-set-photo-3.webp'
    );
    expect(getProductImageFilename('', 1)).toBe('african-fashion-style-photo-2.jpg');
  });

  describe('browser download simulation', () => {
    const originalFetch = globalThis.fetch;
    const originalURL = globalThis.URL;
    const globalObj = globalThis as Record<string, unknown>;
    const originalWindow = globalObj.window;
    const originalDocument = globalObj.document;

    let mockLink: MockLink;
    let appendedChildren: unknown[] = [];

    beforeEach(() => {
      vi.restoreAllMocks();
      appendedChildren = [];
      mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      };

      globalObj.window = {
        URL: {
          createObjectURL: vi.fn().mockReturnValue('blob:http://localhost/mock-blob'),
          revokeObjectURL: vi.fn()
        },
        setTimeout: (fn: () => void) => setTimeout(fn, 10)
      };

      globalObj.document = {
        createElement: vi.fn().mockImplementation((tag: string) => {
          if (tag === 'a') return mockLink;
          return {};
        }),
        body: {
          appendChild: vi.fn().mockImplementation((el: unknown) => {
            appendedChildren.push(el);
          }),
          removeChild: vi.fn().mockImplementation((el: unknown) => {
            const idx = appendedChildren.indexOf(el);
            if (idx >= 0) appendedChildren.splice(idx, 1);
          })
        }
      };
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
      globalThis.URL = originalURL;
      globalObj.window = originalWindow;
      globalObj.document = originalDocument;
    });

    test('downloadImageFile handles fetch-blob download flow', async () => {
      const mockBlob = new Blob(['fake image content'], { type: 'image/jpeg' });
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        blob: vi.fn().mockResolvedValue(mockBlob)
      } as unknown as Response);

      const success = await downloadImageFile('/images/products/test.jpg', 'test.jpg');
      expect(success).toBe(true);
      expect(globalThis.fetch).toHaveBeenCalledWith('/images/products/test.jpg', { mode: 'cors' });
      expect(mockLink.download).toBe('test.jpg');
      expect(mockLink.href).toBe('blob:http://localhost/mock-blob');
    });

    test('downloadMultipleImages calls onProgress and reports count', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        blob: vi.fn().mockResolvedValue(new Blob(['img']))
      } as unknown as Response);

      globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
      globalThis.URL.revokeObjectURL = vi.fn();

      const progressHistory: Array<{ current: number; total: number }> = [];
      const result = await downloadMultipleImages(
        [
          { url: '/img1.jpg', filename: 'img1.jpg' },
          { url: '/img2.jpg', filename: 'img2.jpg' }
        ],
        (current, total) => progressHistory.push({ current, total })
      );

      expect(result.success).toBe(2);
      expect(result.failed).toBe(0);
      expect(progressHistory).toEqual([
        { current: 1, total: 2 },
        { current: 2, total: 2 }
      ]);
    });
  });
});
