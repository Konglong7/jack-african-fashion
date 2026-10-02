import type { ImageLoaderProps } from 'next/image';
import generated from './generated/imageVariants.json';

const variants: Record<string, Record<string, string>> = generated;

export function hasPreparedImage(src: string): boolean {
  return Object.prototype.hasOwnProperty.call(variants, src);
}

/** Known assets use immutable prepared files; new uploads retain on-demand optimization. */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  const available = variants[src];
  if (available) {
    const widths = Object.keys(available).map(Number).sort((a, b) => a - b);
    const selected = widths.find((value) => value >= width) ?? widths[widths.length - 1];
    return available[selected];
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
}
