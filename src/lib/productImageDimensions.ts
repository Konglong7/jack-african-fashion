import rawDimensions from './productImageDimensions.json';

interface ImageDimension {
  width: number;
  height: number;
  aspectRatio: number;
}

export const PRODUCT_IMAGE_DIMENSIONS: Record<string, ImageDimension> = rawDimensions;

export function getProductImageAspect(src?: string): number | null {
  if (!src) return null;
  const found = PRODUCT_IMAGE_DIMENSIONS[src];
  return found ? found.aspectRatio : null;
}
