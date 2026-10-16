import imageDimensions from '@/lib/generated/imageDimensions.json';

const dimensions: Record<string, { width: number; height: number }> = imageDimensions;

/** Match the visible contain image inside the category grid's 4:5 slot. */
export function categoryImageSizes(src: string): string {
  const image = dimensions[src];
  const aspect = image && image.width > 0 && image.height > 0 ? image.width / image.height : 0.8;
  const visibleFraction = Number.isFinite(aspect) ? Math.min(1, aspect / 0.8) : 1;
  const slot = (columns: number, gutters: number) =>
    `calc(${(100 * visibleFraction / columns).toFixed(4)}vw - ${(gutters * visibleFraction / columns).toFixed(4)}px)`;

  // Grid gaps and container padding match homepage.module.css at each breakpoint.
  return [
    `(max-width: 767px) ${slot(3, 64)}`,
    `(max-width: 1023px) ${slot(6, 120)}`,
    `(max-width: 1319px) ${slot(6, 152)}`,
    `${((1320 - 152) * visibleFraction / 6).toFixed(4)}px`
  ].join(', ');
}
