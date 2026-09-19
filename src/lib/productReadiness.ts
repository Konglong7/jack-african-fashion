import type { Product } from './db';

export type ReadinessStatus = 'ready' | 'needs-info';

export interface ReadinessItem {
  key: 'cover' | 'gallery' | 'whatsapp';
  label: string;
  group: 'media' | 'content';
  message: string;
}

const CHECKS: ReadinessItem[] = [
  {
    key: 'cover',
    label: 'Cover image',
    group: 'media',
    message: 'Add a main product photo for catalog cards and buyer first impression.'
  },
  {
    key: 'gallery',
    label: 'Gallery images',
    group: 'media',
    message: 'Add gallery or story images so buyers can inspect fabric, fit, and finish.'
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp copy',
    group: 'content',
    message: 'Add inquiry copy for the customer WhatsApp button.'
  }
];

export function getProductReadiness(product: Product): ReadinessItem[] {
  return CHECKS.filter((check) => {
    if (check.key === 'cover') return !product.image.trim();
    if (check.key === 'gallery') return !hasGalleryImages(product);
    return !product.whatsappMessage.trim();
  });
}

export function getReadinessStatus(product: Product): ReadinessStatus {
  const missing = getProductReadiness(product);
  return missing.length === 0 ? 'ready' : 'needs-info';
}

export function getReadinessSummary(product: Product): {
  status: ReadinessStatus;
  label: string;
  missing: ReadinessItem[];
} {
  const missing = getProductReadiness(product);
  const status = getReadinessStatus(product);
  return {
    status,
    label: status === 'ready' ? 'Ready' : 'Needs info',
    missing
  };
}

function hasGalleryImages(product: Product): boolean {
  return (
    Boolean(product.images && product.images.length > 1) ||
    Boolean(product.detailPage?.detailSections?.some((section) => section.enabled !== false && section.image))
  );
}
