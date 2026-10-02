'use client';

import { useState } from 'react';
import Image from '@/components/ResponsiveImage';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_IMAGES } from '@/lib/siteImages';
import { WhatsAppIcon } from '@/components/Icons';

export type ProofCategory = 'all' | 'showroom' | 'measurement' | 'quality' | 'logistics';

interface ProofItem {
  id: string;
  category: 'showroom' | 'measurement' | 'quality' | 'logistics';
  title: string;
  badge: string;
  description: string;
  image: string;
  metrics?: string;
}

const PROOF_ITEMS: ProofItem[] = [
  {
    id: 'showroom-exterior',
    category: 'showroom',
    title: 'Guangzhou Yulong Fashion Plaza Showroom Entrance',
    badge: 'Physical Base',
    description:
      'Our physical showroom and office at Yulong Fashion Plaza (No. 229 Guangyuan Xi Road, Yuexiu District, Guangzhou) welcoming visiting African wholesale buyers.',
    image: SITE_IMAGES.trust.showroomExterior,
    metrics: 'Yulong Plaza · Room 19 Corridor'
  },
  {
    id: 'waybill-handover-lagos',
    category: 'logistics',
    title: 'Guangzhou ➔ Lagos Freight Waybill & Container Loading',
    badge: 'Nigeria Delivery',
    description:
      'Handing over the official Cargo Receipt / Waybill (12 CTNS, 285 KGS, Guangzhou to Lagos, Nigeria) at Guangzhou Africa Route cargo warehouse with container loading in the background.',
    image: SITE_IMAGES.trust.waybillHandoverLagos,
    metrics: '12 CTNS · 285 KGS · Lagos'
  },
  {
    id: 'size-bust-4xl',
    category: 'measurement',
    title: 'True 4XL Flat Bust Measurement (120 cm)',
    badge: 'True Plus Size',
    description:
      'Flat soft-tape measurement proving authentic African plus-size cut (120 cm / 47.2" bust) on size 4XL dress, verified against our physical Jack Fashion QC inspection notebook.',
    image: SITE_IMAGES.trust.sizeBust4xl,
    metrics: 'Bust 120cm · 4XL Cut'
  },
  {
    id: 'packing-nigeria-lagos',
    category: 'logistics',
    title: 'Waterproof Yellow-Tape Bale Packing for Lagos (LOS - NIG)',
    badge: 'African Packing Standard',
    description:
      'Our warehouse team packing high-volume wholesale goods into sealed waterproof woven bales with high-tensile yellow tape, hand-marked for Lagos, Nigeria (LOS - NIG).',
    image: SITE_IMAGES.trust.packingNigeriaLagos,
    metrics: 'Waterproof · LOS - NIG'
  },
  {
    id: 'size-length-4xl',
    category: 'measurement',
    title: 'Full Maxi Dress Length Measurement (142 cm)',
    badge: 'Floor-Length Cut',
    description:
      'Verifying the 142 cm full body length from shoulder to hem, ensuring the floor-grazing modest silhouette preferred by boutiques across Nigeria, Ghana and Kenya.',
    image: SITE_IMAGES.trust.sizeLength4xl,
    metrics: 'Length 142cm · Full Maxi'
  },
  {
    id: 'qc-trimming',
    category: 'quality',
    title: '100% Pre-Shipment Inspection & Thread Trimming',
    badge: 'Quality Control',
    description:
      'Inspector trimming loose threads at the zipper and neckline alongside our Jack Fashion 8-point QC checklist before packing into transparent branded garment bags.',
    image: SITE_IMAGES.trust.qcTrimming,
    metrics: '8-Point QC Checklist'
  },
  {
    id: 'fabric-pleat-stretch',
    category: 'quality',
    title: 'High-Density Pleat Elasticity & Recovery Test',
    badge: 'Fabric Resilience',
    description:
      'Two-hand horizontal stretch test on high-density micro-pleated fabric, demonstrating shape recovery, breathability, and non-sheer thickness under tension.',
    image: SITE_IMAGES.trust.fabricPleatStretch,
    metrics: 'High-Resilience Pleats'
  },
  {
    id: 'warehouse-staging-africa',
    category: 'logistics',
    title: 'Multi-Country Export Staging (LOS, ACC, NBO)',
    badge: 'Pan-African Logistics',
    description:
      'Packed export bales staged in Guangzhou warehouse, individually tagged with destinations: Lagos (LOS - NIG), Accra (ACC - GHA), and Nairobi (NBO - KEN).',
    image: SITE_IMAGES.trust.warehouseStagingAfrica,
    metrics: 'Nigeria · Ghana · Kenya'
  },
  {
    id: 'showroom-pillar-jack',
    category: 'showroom',
    title: 'Jack at Showroom Display & Sample Setup',
    badge: 'Founder & Team',
    description:
      'Jack reviewing new season plus-size African geometric print maxi dresses at the showroom entrance marble pillar.',
    image: SITE_IMAGES.trust.showroomPillarJack,
    metrics: 'Showroom Daily Review'
  },
  {
    id: 'craftsmanship-lining',
    category: 'quality',
    title: 'Double-Stitched Seams & Premium Interior Lining',
    badge: 'Workmanship Proof',
    description:
      'Inside-out inspection revealing smooth, non-see-through interior skirt lining, reinforced flatlock seams, and clean hem construction.',
    image: SITE_IMAGES.trust.craftsmanshipLining,
    metrics: 'Non-Sheer Lining'
  },
  {
    id: 'style-selection-swatch',
    category: 'showroom',
    title: 'Physical Fabric Swatch & Color Verification',
    badge: 'B2B Selection',
    description:
      'Confirming production batches and print swatches against style JX8237 color card in our Guangzhou showroom prior to order confirmation.',
    image: SITE_IMAGES.trust.styleSelectionSwatch,
    metrics: 'Color Swatch Confirmation'
  },
  {
    id: 'marking-ghana-bale',
    category: 'logistics',
    title: 'Hand-Marked Destination Bale for Accra (ACC - GHA)',
    badge: 'Ghana Forwarding',
    description:
      'Marking destination code ACC - GHA and Jack Fashion B2B order identifier onto heavy-duty yellow waterproof cargo bundle for Accra-bound air transit.',
    image: SITE_IMAGES.trust.markingGhanaBale,
    metrics: 'ACC - GHA Route'
  }
];

const CATEGORY_TABS: { key: ProofCategory; label: string; count: number }[] = [
  { key: 'all', label: 'All Evidence', count: PROOF_ITEMS.length },
  {
    key: 'showroom',
    label: 'Guangzhou Showroom',
    count: PROOF_ITEMS.filter((i) => i.category === 'showroom').length
  },
  {
    key: 'measurement',
    label: '4XL Measurements',
    count: PROOF_ITEMS.filter((i) => i.category === 'measurement').length
  },
  {
    key: 'quality',
    label: 'Fabric & QC',
    count: PROOF_ITEMS.filter((i) => i.category === 'quality').length
  },
  {
    key: 'logistics',
    label: 'African Packing & Cargo',
    count: PROOF_ITEMS.filter((i) => i.category === 'logistics').length
  }
];

export function TrustProofGallery({ whatsappUrl }: { whatsappUrl?: string }) {
  const [activeTab, setActiveTab] = useState<ProofCategory>('all');
  const [selectedImage, setSelectedImage] = useState<ProofItem | null>(null);

  const filteredItems =
    activeTab === 'all' ? PROOF_ITEMS : PROOF_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section className='bg-brand-cream/60 py-16 sm:py-24' id='verified-evidence'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center'>
          <span className='text-brand-orange text-xs font-bold tracking-[0.25em] uppercase sm:text-sm'>
            Verified Guangzhou Supplier · Real Evidence
          </span>
          <h2 className='font-display text-brand-black mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl'>
            See Our Showroom, Measurements & Export Packing
          </h2>
          <p className='text-brand-brown/75 mx-auto mt-4 max-w-3xl text-base leading-relaxed sm:text-lg'>
            African boutique buyers and wholesalers need verifiable facts before wiring deposits.
            Browse our unedited Guangzhou showroom presence, real 4XL flat measurements, 100% thread
            trimming, and yellow-tape cargo bales dispatched to Lagos, Accra and Nairobi.
          </p>
        </div>

        {/* Category Pills */}
        <div className='mt-8 flex flex-wrap justify-center gap-2 sm:gap-3'>
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type='button'
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-orange text-white shadow-md shadow-amber-900/20'
                    : 'border-brand-sand text-brand-brown/80 hover:border-brand-orange/40 border bg-white hover:bg-white/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-brand-cream text-brand-brown/60'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.article
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className='border-brand-sand group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl'
              >
                {/* Image Container */}
                <div
                  className='relative aspect-[4/5] w-full cursor-pointer overflow-hidden bg-stone-50 p-1 flex items-center justify-center'
                  onClick={() => setSelectedImage(item)}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px'
                    className='object-contain transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100' />

                  {/* Badge */}
                  <div className='absolute top-3 left-3'>
                    <span className='rounded-md bg-black/70 px-2.5 py-1 text-xs font-bold tracking-wide text-white backdrop-blur-sm'>
                      {item.badge}
                    </span>
                  </div>

                  {item.metrics && (
                    <div className='absolute right-3 bottom-3'>
                      <span className='bg-brand-gold text-brand-black rounded-md px-2.5 py-1 text-xs font-extrabold shadow-sm'>
                        {item.metrics}
                      </span>
                    </div>
                  )}

                  <div className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100'>
                    <span className='rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-black shadow-lg backdrop-blur-sm'>
                      Click to Enlarge
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className='flex flex-1 flex-col p-5'>
                  <h3 className='text-brand-black font-display line-clamp-2 text-base font-bold sm:text-lg'>
                    {item.title}
                  </h3>
                  <p className='text-brand-brown/75 mt-2 line-clamp-3 text-xs leading-relaxed sm:text-sm'>
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* WhatsApp Verification Banner */}
        <div className='border-brand-sand mt-14 overflow-hidden rounded-2xl border bg-white p-6 shadow-sm sm:p-8'>
          <div className='flex flex-col items-center justify-between gap-6 lg:flex-row'>
            <div>
              <div className='flex items-center gap-2'>
                <span className='h-2.5 w-2.5 animate-pulse rounded-full bg-green-500' />
                <span className='text-brand-orange text-xs font-bold tracking-wider uppercase'>
                  Live Showroom Video Calls Available
                </span>
              </div>
              <h3 className='font-display text-brand-black mt-2 text-2xl font-bold sm:text-3xl'>
                Want live video verification before sending your deposit?
              </h3>
              <p className='text-brand-brown/75 mt-2 max-w-2xl text-sm leading-relaxed sm:text-base'>
                We welcome video calls during Guangzhou business hours (09:00 - 18:00 GMT+8) to show
                you the current showroom racks, stock fabrics, or inspect your packed cargo before
                it leaves for the airport or port.
              </p>
            </div>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 font-bold text-white shadow-lg shadow-green-900/20 transition-all hover:bg-[#20ba59] active:scale-95'
              >
                <WhatsAppIcon className='h-5 w-5' />
                <span>Request WhatsApp Video Inspection</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8'
            onClick={() => setSelectedImage(null)}
          >
            <div
              className='relative max-h-[92vh] max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl'
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type='button'
                onClick={() => setSelectedImage(null)}
                className='absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black'
                aria-label='Close preview'
              >
                ✕
              </button>

              <div className='relative aspect-[4/5] max-h-[70vh] w-full bg-stone-900 sm:aspect-[16/10]'>
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  fill
                  priority
                  sizes='(max-width: 1024px) 100vw, 896px'
                  className='object-contain'
                />
              </div>

              <div className='p-6'>
                <div className='flex items-center gap-2.5'>
                  <span className='bg-brand-orange/10 text-brand-orange rounded-md px-2.5 py-1 text-xs font-bold uppercase'>
                    {selectedImage.badge}
                  </span>
                  {selectedImage.metrics && (
                    <span className='border-brand-sand text-brand-brown rounded-md border px-2.5 py-1 text-xs font-semibold'>
                      {selectedImage.metrics}
                    </span>
                  )}
                </div>
                <h4 className='font-display text-brand-black mt-2 text-xl font-bold sm:text-2xl'>
                  {selectedImage.title}
                </h4>
                <p className='text-brand-brown/80 mt-2 text-sm leading-relaxed sm:text-base'>
                  {selectedImage.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
