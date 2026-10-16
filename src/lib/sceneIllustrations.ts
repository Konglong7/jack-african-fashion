/** Fictional AI scenes for buying guidance; never premises or factory evidence. */
export const SCENE_ILLUSTRATIONS = [
  {
    id: 'storefront',
    image: '/images/scene-illustrations/ai-01-storefront-e95d9a286a37.webp',
    width: 1672,
    height: 941,
    alt: 'Illustration of a compact clothing wholesale stall entrance',
    title: 'Plan a visit',
    description: 'Ask Jack for current location details and visit arrangements before travelling.',
    guideHref: '/contact',
    guideLabel: 'Contact and location'
  },
  {
    id: 'showroom',
    image: '/images/scene-illustrations/ai-02-showroom-49aa81a1725c.webp',
    width: 1672,
    height: 941,
    alt: 'Illustration of dresses and matching sets on showroom rails',
    title: 'Choose your styles',
    description: 'Send product codes and request current garment photos to confirm the details.',
    guideHref: '/guides/photos-order-confirmation',
    guideLabel: 'Photo and order checklist'
  },
  {
    id: 'stockroom',
    image: '/images/scene-illustrations/ai-03-stockroom-af88cd1eb853.webp',
    width: 1536,
    height: 1024,
    alt: 'Illustration of packaged garments on stockroom shelves',
    title: 'Check availability',
    description: 'Confirm available quantities, colors and sizes for each shortlisted style.',
    guideHref: '/guides/ready-stock-custom-orders',
    guideLabel: 'Ready stock and custom orders'
  },
  {
    id: 'measurement',
    image: '/images/scene-illustrations/ai-04-measurement-5c15f1fbd1b9.webp',
    width: 1536,
    height: 1024,
    alt: 'Illustration of a floral dress being measured flat across the bodice',
    title: 'Confirm measurements',
    description:
      'Request measured specifications for each style; size labels alone do not confirm fit.',
    guideHref: '/guides/plus-size-measurements',
    guideLabel: 'Measurement checklist'
  },
  {
    id: 'packing',
    image: '/images/scene-illustrations/ai-05-packing-ec3826ca52e6.webp',
    width: 1536,
    height: 1024,
    alt: 'Illustration of a dress being packed in a protective bag beside a carton',
    title: 'Agree packing details',
    description:
      'Confirm the size and color breakdown, labels, cartons and your nominated cargo receiver.',
    guideHref: '/guides/packing-cargo-handover',
    guideLabel: 'Packing and cargo checklist'
  },
  {
    id: 'workshop',
    image: '/images/scene-illustrations/ai-06-workshop-ef16943222d7.webp',
    width: 1672,
    height: 941,
    alt: 'Illustration of sewing workstations in a hypothetical garment workshop',
    title: 'Discuss customization',
    description: 'Review references, sample approval, feasibility and terms before a custom order.',
    guideHref: '/custom-orders',
    guideLabel: 'Custom order enquiries'
  }
] as const;
