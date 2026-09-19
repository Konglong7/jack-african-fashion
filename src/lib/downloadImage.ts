/**
 * Utility functions for downloading product photos with friendly names and reliable fallback.
 */

export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getFileExtension(url?: string): string {
  if (!url) return 'jpg';
  try {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const match = cleanUrl.match(/\.(jpg|jpeg|png|webp)$/i);
    if (match) {
      const ext = match[1].toLowerCase();
      return ext === 'jpeg' ? 'jpg' : ext;
    }
  } catch {
    // fallback
  }
  return 'jpg';
}

export function getProductImageFilename(
  productName: string,
  index?: number,
  url?: string
): string {
  const base = sanitizeFilename(productName) || 'style';
  const suffix = typeof index === 'number' ? `-photo-${index + 1}` : '';
  const ext = getFileExtension(url);
  return `african-fashion-${base}${suffix}.${ext}`;
}

/**
 * Downloads an image given its URL and a target filename.
 * Uses fetch + blob when possible for genuine direct downloads with custom filename,
 * falling back to HTML5 anchor download for CORS-restricted assets.
 */
export async function downloadImageFile(
  url: string,
  filename: string
): Promise<boolean> {
  if (!url || typeof window === 'undefined') return false;

  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1500);
    return true;
  } catch {
    // Fallback: direct anchor with download attribute
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Downloads multiple images in sequence with a gentle delay so the browser won't throttle downloads.
 */
export async function downloadMultipleImages(
  items: Array<{ url: string; filename: string }>,
  onProgress?: (current: number, total: number) => void
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (let i = 0; i < items.length; i++) {
    onProgress?.(i + 1, items.length);
    const ok = await downloadImageFile(items[i].url, items[i].filename);
    if (ok) {
      success++;
    } else {
      failed++;
    }
    if (i < items.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }

  return { success, failed };
}
