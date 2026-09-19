import { describe, expect, it } from 'vitest';
import { buildUploadFilename, isAllowedImageFile } from './uploadValidation';

describe('upload validation', () => {
  it('rejects files that only fake an image extension', () => {
    expect(isAllowedImageFile({ name: 'payload.jpg', type: 'text/html', size: 1024 })).toBe(false);
  });

  it('accepts supported image mime types and extensions', () => {
    expect(isAllowedImageFile({ name: 'dress.webp', type: 'image/webp', size: 1024 })).toBe(true);
  });

  it('generates unique filenames without changing the public extension', () => {
    const filename = buildUploadFilename({
      originalName: 'My Dress.JPG',
      slug: 'Summer Dress',
      index: 0,
      nonce: 'abc123'
    });

    expect(filename).toBe('summer-dress-abc123.jpg');
  });
});
