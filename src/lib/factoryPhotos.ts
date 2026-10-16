// The owner supplied and confirmed these factory photographs on this date.
export const FACTORY_PHOTOS_UPDATED_DATE = '2026-10-13';

export const FACTORY_PHOTOS = [
  {
    id: 'pattern-making',
    src: '/images/factory/jack-fashion-pattern-making.webp',
    title: 'Pattern making',
    alt: 'Paper patterns and a dress form at a Jack Fashion pattern-making workbench',
    caption: 'Paper patterns and a dress form at the pattern-making workbench.',
    width: 1448,
    height: 1086
  },
  {
    id: 'fabric-cutting',
    src: '/images/factory/jack-fashion-fabric-cutting.webp',
    title: 'Fabric cutting',
    alt: 'Fabric being cut with scissors along paper patterns in the Jack Fashion workshop',
    caption: 'Fabric cutting with paper patterns laid out on the worktable.',
    width: 1448,
    height: 1086
  },
  {
    id: 'sewing-workshop',
    src: '/images/factory/jack-fashion-sewing-workshop.webp',
    title: 'Garment sewing',
    alt: 'Sewing machines and garment sewing stations in the Jack Fashion womenswear workshop',
    caption: 'Garment sewing stations and dresses in the womenswear workshop.',
    width: 1448,
    height: 1086
  },
  {
    id: 'finishing-packing',
    src: '/images/factory/jack-fashion-finishing-packing.webp',
    title: 'Garment finishing and packing',
    alt: 'Garment checking, pressing and packed clothing at Jack Fashion finishing workstations',
    caption: 'Garment checks, pressing and packed pieces at the finishing workstations.',
    width: 1448,
    height: 1086
  }
] as const;

export function getFactoryPhotos(compact = false) {
  return compact
    ? FACTORY_PHOTOS.filter((photo) => ['fabric-cutting', 'sewing-workshop'].includes(photo.id))
    : FACTORY_PHOTOS;
}
