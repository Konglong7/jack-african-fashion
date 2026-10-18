'use client';

import Image from '@/components/ResponsiveImage';
import { useState } from 'react';
import { siteWhatsAppLink, type SiteContent } from '@/lib/siteContentTypes';

const PRODUCTION_STAGES = [
  {
    step: '01',
    title: 'African Silhouette & Trend Research',
    chinese: '原创版型与非洲流行元素研判',
    desc: 'Analyzing vibrant prints, maxi lengths, flare cuffs and festive curves popular across Lagos, Accra, Nairobi and Johannesburg.',
    category: 'Design & Sourcing'
  },
  {
    step: '02',
    title: '3D CAD Grading & Tech Pack',
    chinese: '3D CAD放码与规格书精细化',
    desc: 'Digital grading tailored specifically for voluptuous African plus-size proportions (L to 7XL) ensuring true-to-size fit.',
    category: 'Design & Sourcing'
  },
  {
    step: '03',
    title: 'High-Density Fabric Sourcing',
    chinese: '高密棉麻、真丝皱与印花直采',
    desc: 'Direct mill sourcing of skin-friendly, high-breathability cottons, silks, and color-rich polyester crepe fabrics.',
    category: 'Design & Sourcing'
  },
  {
    step: '04',
    title: 'Fabric Shrinkage & Colorfastness Test',
    chinese: '面料防缩水与耐磨色牢度预检',
    desc: 'Pre-washing and heat-setting treatments to guarantee zero bleed, high wash durability, and minimal post-wash shrinkage.',
    category: 'Material Prep'
  },
  {
    step: '05',
    title: 'Precision CNC & Laser Cutting',
    chinese: '激光与数控裁床高精度开料',
    desc: 'Computerized multi-ply cutting tables ensure exact alignment of intricate African geometric and floral repeat patterns.',
    category: 'Cutting & Sewing'
  },
  {
    step: '06',
    title: 'Reinforced Double-Stitch Sewing',
    chinese: '专线精细车缝，高抗拉双线加固',
    desc: 'Dedicated production lines with reinforced waistline, zip, and hem stitching to withstand rigorous daily wear.',
    category: 'Cutting & Sewing'
  },
  {
    step: '07',
    title: 'Dimensional Steam Ironing & Shaping',
    chinese: '立体蒸汽整烫与轮廓定型',
    desc: 'High-pressure industrial form finishing giving every gown and two-piece set pristine boutique-ready presentation.',
    category: 'Finishing'
  },
  {
    step: '08',
    title: '100% In-Line Workmanship Inspection',
    chinese: '车间全检与线头清理',
    desc: 'Every garment is physically inspected on mannequin forms for thread trimming, symmetric seams, and zipper glide.',
    category: 'Quality Control'
  },
  {
    step: '09',
    title: 'Needle & Metal Detection Gate',
    chinese: '落针与断针高敏金属探测',
    desc: 'Passage through calibrated dual-probe magnetic needle detectors ensuring 100% safety before export clearance.',
    category: 'Quality Control'
  },
  {
    step: '10',
    title: 'Individual Dustproof Barcode Packing',
    chinese: '独立防尘条码精装与干燥剂',
    desc: 'Clear OPP garment protection with silica gel desiccants and custom client SKU barcode labeling.',
    category: 'Packaging'
  },
  {
    step: '11',
    title: 'Export Bale & Reinforced Carton Packing',
    chinese: '加厚防潮压缩打带与出口箱包装',
    desc: 'High-density polypropylene woven bales with waterproof lining and strap binding, engineered for cross-ocean transit.',
    category: 'Packaging'
  },
  {
    step: '12',
    title: 'Guangzhou Port & Air Freight Handover',
    chinese: '广州各大港口与专线货代交仓拼柜',
    desc: 'Direct handover to nominated Guangzhou shipping agents for air express (DDP 5–7 days) or sea container consolidation.',
    category: 'Fulfillment'
  }
];

const FACTORY_SHOWCASE = [
  {
    src: '/images/factory/jack-fashion-pattern-making.webp',
    alt: 'Jack Fashion master pattern maker drafting African silhouette tech pack',
    caption: 'CAD Pattern & Master Sample Room'
  },
  {
    src: '/images/factory/jack-fashion-fabric-cutting.webp',
    alt: 'Multi-ply automated precision fabric cutting line in Guangzhou workshop',
    caption: 'Multi-Ply Fabric Cutting Lines'
  },
  {
    src: '/images/factory/jack-fashion-sewing-workshop.webp',
    alt: 'Skilled tailors assembling womenswear pieces on dedicated sewing line',
    caption: 'Dedicated Sewing Assembly Workshop'
  },
  {
    src: '/images/trust/qc-inspection-zipper-check.webp',
    alt: 'Quality control inspector checking zipper pull strength and seam alignment',
    caption: 'Strict Zipper & Seam Stress Inspection'
  }
];

export function ProductionProcess({ siteContent }: { siteContent: SiteContent }) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', 'Design & Sourcing', 'Cutting & Sewing', 'Quality Control', 'Packaging', 'Fulfillment'];

  const filteredStages = activeCategory === 'All'
    ? PRODUCTION_STAGES
    : PRODUCTION_STAGES.filter((s) => s.category.includes(activeCategory) || activeCategory.includes(s.category));

  return (
    <section
      id='production-process'
      className='border-t border-[#171615]/10 bg-[#F7F2EB] py-16 sm:py-20 lg:py-24'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='flex flex-col justify-between gap-6 md:flex-row md:items-end'>
          <div className='max-w-2xl'>
            <span className='inline-block text-xs font-bold uppercase tracking-[0.16em] text-[#B17C0E]'>
              Industrial-Grade Quality Assurance
            </span>
            <h2 className='font-display mt-2 text-3xl font-bold tracking-tight text-[#171615] sm:text-4xl lg:text-5xl'>
              12-Stage Manufacturing &amp; Quality Control Workflow
            </h2>
            <p className='mt-3 text-base text-[#6F6A64]'>
              From digital CAD sizing to high-grade sewing, dual needle detection and export bale binding, every order follows a transparent, traceable industrial path.
            </p>
          </div>

          <a
            href={siteWhatsAppLink(siteContent, 'Hello Jack, I would like to consult on OEM/ODM garment production feasibility.')}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex shrink-0 items-center gap-2 rounded-full bg-[#171615] px-6 py-3.5 text-xs font-bold text-[#F7F2EB] shadow-md transition-all hover:bg-[#B17C0E] hover:text-white'
          >
            <span>Consult OEM / Custom Sampling</span>
            <span aria-hidden='true'>&rarr;</span>
          </a>
        </div>

        {/* Real Factory Workshop Photo Grid */}
        <div className='mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4'>
          {FACTORY_SHOWCASE.map((photo, i) => (
            <div
              key={i}
              className='group relative aspect-4/3 overflow-hidden rounded-[20px] border border-[#171615]/10 bg-[#EEE5DA] shadow-xs'
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes='(max-width: 768px) 50vw, 25vw'
                className='object-cover transition-transform duration-500 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-[#171615]/80 via-[#171615]/20 to-transparent' />
              <div className='absolute right-3 bottom-3 left-3'>
                <span className='inline-block rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold text-[#171615] shadow-xs backdrop-blur-xs'>
                  {photo.caption}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Category Filters */}
        <div className='mt-10 flex flex-wrap gap-2'>
          {categories.map((cat) => (
            <button
              key={cat}
              type='button'
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#171615] text-[#F7F2EB] shadow-xs'
                  : 'border border-[#171615]/15 bg-white/60 text-[#6F6A64] hover:bg-white hover:text-[#171615]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 12 Stages Cards Grid */}
        <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6'>
          {filteredStages.map((stage) => (
            <div
              key={stage.step}
              className='flex flex-col justify-between rounded-[22px] border border-[#171615]/10 bg-white p-5 shadow-xs transition-all hover:border-[#E2AB2F] hover:shadow-md sm:p-6'
            >
              <div>
                <div className='flex items-center justify-between'>
                  <span className='font-mono text-sm font-bold text-[#B17C0E]'>
                    STAGE {stage.step}
                  </span>
                  <span className='rounded-full bg-[#EEE5DA] px-2.5 py-0.5 text-[10px] font-semibold text-stone-700'>
                    {stage.category}
                  </span>
                </div>
                <h3 className='font-display mt-3 text-base font-bold text-[#171615] sm:text-lg'>
                  {stage.title}
                </h3>
                <p className='mt-0.5 text-xs font-medium text-[#B17C0E]'>
                  {stage.chinese}
                </p>
                <p className='mt-2.5 text-xs leading-relaxed text-[#6F6A64]'>
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
