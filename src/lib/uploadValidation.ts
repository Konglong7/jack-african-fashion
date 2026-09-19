import path from 'path';

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

interface FileLike {
  name: string;
  type: string;
  size: number;
}

export function isAllowedImageFile(file: FileLike): boolean {
  const ext = path.extname(file.name).toLowerCase();
  const expectedType = ALLOWED_MIME_BY_EXT[ext];
  return Boolean(expectedType && file.type === expectedType && file.size > 0 && file.size <= MAX_BYTES);
}

export function isAllowedImageBuffer(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === 'image/jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === 'image/png') {
    return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (mimeType === 'image/webp') {
    return buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  }
  return false;
}

export function buildUploadFilename({
  originalName,
  slug,
  index,
  nonce
}: {
  originalName: string;
  slug: string;
  index: number;
  nonce: string;
}): string {
  const ext = normalizeExtension(path.extname(originalName));
  const base = slug ? slugifySlug(slug) : sanitizeFilename(originalName);
  const suffix = index === 0 ? '' : `-${index + 1}`;
  return `${base}${suffix}-${nonce}${ext}`;
}

export function uploadErrorFor(file: FileLike): string | null {
  if (file.size <= 0) return `${file.name}: empty file`;
  if (file.size > MAX_BYTES) return `${file.name}: too large (max 8MB)`;
  if (!isAllowedImageFile(file)) return `${file.name}: unsupported format (use jpg/png/webp)`;
  return null;
}

function normalizeExtension(ext: string): string {
  return ext.toLowerCase() === '.jpeg' ? '.jpg' : ext.toLowerCase();
}

function sanitizeFilename(name: string): string {
  return slugifySlug(name.replace(/\.[^.]+$/, ''));
}

function slugifySlug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'image'
  );
}
