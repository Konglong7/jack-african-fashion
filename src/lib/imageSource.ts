/** Keep product sources aligned with next.config.ts remotePatterns. */
export function isSupportedImageSource(src: string): boolean {
  if (typeof src !== 'string' || !src || src.includes('\\')) return false;
  if (src.startsWith('/') && !src.startsWith('//')) return true;
  try {
    const url = new URL(src);
    return url.protocol === 'https:' && url.hostname === 'images.unsplash.com' &&
      !url.port && !url.username && !url.password;
  } catch {
    return false;
  }
}
