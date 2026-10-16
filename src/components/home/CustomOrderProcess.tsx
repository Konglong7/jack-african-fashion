import Image from '@/components/ResponsiveImage';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';
import { WhatsAppIcon, CheckIcon } from '@/components/Icons';
import styles from './homepage.module.css';

interface WorkflowStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
}

const ORDER_STEPS: WorkflowStep[] = [
  {
    step: '01',
    title: 'WhatsApp Consultation',
    subtitle: 'Direct Trade Desk Inquiry',
    description:
      'Connect directly with our regional trade desk on WhatsApp. Discuss target styles, review digital wholesale lookbooks, and confirm MOQ requirements.'
  },
  {
    step: '02',
    title: 'Style & Spec Selection',
    subtitle: 'Ready-Stock or Custom Sketch',
    description:
      'Select proven ready-stock designs or send your custom sketches and reference photos. We confirm fabric composition, colorways, and African sizing proportions.'
  },
  {
    step: '03',
    title: 'Sample Prototyping & Size Fit',
    subtitle: 'Rapid 3-Day Tech Pack Sampling',
    description:
      'Rapid 3-day tech pack sampling for custom OEM/ODM orders. We verify bust drape, waist tension, and flare fit via physical samples or high-definition video inspection.'
  },
  {
    step: '04',
    title: 'Proforma Invoice & Deposit',
    subtitle: 'Itemized PI & Payment Terms',
    description:
      'Receive an itemized written Proforma Invoice (PI) detailing unit wholesale prices, fabric specs, packing details, export clearance terms, and secure payment terms.'
  },
  {
    step: '05',
    title: 'Fabric Sourcing & Bulk Tailoring',
    subtitle: 'Guangzhou Workshop Production',
    description:
      'Direct-from-mill fabric sourcing and scheduled bulk tailoring in our Guangzhou workshops. Precision computer cutting and reinforced seam stitching.'
  },
  {
    step: '06',
    title: '3-Stage QC Inspection',
    subtitle: 'Cutting, Seams & Measurements',
    description:
      'Rigorous 3-stage quality control inspection: (1) Raw fabric flaw & cutting table check, (2) In-line zipper tension and seam stress verification, and (3) Final tape measurement of bust, waist, and length.'
  },
  {
    step: '07',
    title: 'Export Bale Compression & Marking',
    subtitle: 'Waterproof Hydraulic Bales',
    description:
      'Heavy-duty hydraulic bale compression wrapped in tear-resistant waterproof canvas, color-coded and marked for your destination port (Lagos, Accra, Nairobi, Kinshasa).'
  },
  {
    step: '08',
    title: 'Air/Sea Cargo Handover & Waybill',
    subtitle: 'Customs Clearance & Dispatch',
    description:
      'Direct handover to your nominated Guangzhou freight agent with signed official cargo receipts, export customs clearance, and real-time waybill tracking until port arrival.'
  }
];

export function CustomOrderProcess({ siteContent }: { siteContent: SiteContent }) {
  return (
    <section
      id='order-process'
      className={`${styles.section} ${styles.customSection} bg-[#112B47] text-white`}
      aria-labelledby='home-custom-title'
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div className='max-w-3xl'>
          <span className='mb-3 inline-block text-xs font-bold uppercase tracking-[0.16em] text-[#E2AB2F]'>
            Transparent Wholesale Production · 8-Step Workflow
          </span>
          <h2
            id='home-custom-title'
            className={`font-display ${styles.sectionHeading} text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl`}
          >
            8-Step Transparent Wholesale Order Flow & 3-Stage QC
          </h2>
          <p className={`${styles.sectionDescription} mt-4 text-base leading-relaxed text-[#DCE3E8]`}>
            From initial WhatsApp consultation to factory tailoring, rigorous 3-stage QC, export bale
            compression, and Guangzhou cargo handover — follow our complete transparent fulfillment
            pipeline.
          </p>
        </div>

        {/* 8-Step Grid Layout */}
        <ol className='mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {ORDER_STEPS.map((step) => (
            <li
              key={step.step}
              className='relative flex flex-col justify-between rounded-[20px] border border-white/10 bg-[#163558] p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#E2AB2F]/40'
            >
              <div>
                <div className='mb-4 flex items-center justify-between'>
                  <span className='font-mono text-2xl font-bold tracking-tight text-[#E2AB2F]'>
                    {step.step}
                  </span>
                  <span className='rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-[#DCE3E8]'>
                    Step {step.step}
                  </span>
                </div>
                <h3 className='font-display text-lg font-bold text-white'>{step.title}</h3>
                <p className='mt-1 text-xs font-medium text-[#E2AB2F]/90'>{step.subtitle}</p>
                <p className='mt-3 text-xs leading-relaxed text-[#DCE3E8]/85'>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Photographic Evidence Gallery: 3-Stage QC & Logistics Proof */}
        <div className='mt-14 rounded-[22px] border border-white/15 bg-[#0C1F33] p-6 sm:p-8 lg:p-10'>
          <div className='mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <span className='text-xs font-bold uppercase tracking-wider text-[#E2AB2F]'>
                Verifiable Factory Proof
              </span>
              <h3 className='font-display mt-1 text-2xl font-bold text-white sm:text-3xl'>
                Stage 6 & 7 Photographic Evidence
              </h3>
            </div>
            <p className='max-w-md text-xs text-[#DCE3E8]/80'>
              Every bale leaving our Guangzhou warehouse undergoes strict cutting, tension, and
              dimensional verification before waterproof export packing.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {/* QC Card 1: Cutting Table & Trimming */}
            <div className='group overflow-hidden rounded-[18px] border border-white/10 bg-[#163558] shadow-md'>
              <div className='relative aspect-[4/3] overflow-hidden'>
                <Image
                  src={SITE_IMAGES.trust.qcTrimming}
                  alt='QC Stage 1: Thread trimming and seam cutting table inspection'
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <span className='absolute top-3 left-3 rounded-full bg-[#112B47]/90 px-2.5 py-1 text-[11px] font-bold text-[#E2AB2F] backdrop-blur-sm'>
                  QC Stage 1 · Cutting & Trimming
                </span>
              </div>
              <div className='p-4'>
                <h4 className='text-sm font-bold text-white'>Precision Trimming Table</h4>
                <p className='mt-1 text-xs text-[#DCE3E8]/80'>
                  Initial fabric flaw check, thread trimming, and edge serging inspection before
                  assembly.
                </p>
              </div>
            </div>

            {/* QC Card 2: Zipper Stress & Tension Check */}
            <div className='group overflow-hidden rounded-[18px] border border-white/10 bg-[#163558] shadow-md'>
              <div className='relative aspect-[4/3] overflow-hidden'>
                <Image
                  src={SITE_IMAGES.trust.qcZipperCheck}
                  alt='QC Stage 2: In-line zipper tension and hardware stress test'
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <span className='absolute top-3 left-3 rounded-full bg-[#112B47]/90 px-2.5 py-1 text-[11px] font-bold text-[#E2AB2F] backdrop-blur-sm'>
                  QC Stage 2 · Zipper Tension
                </span>
              </div>
              <div className='p-4'>
                <h4 className='text-sm font-bold text-white'>Hardware & Seam Stress Test</h4>
                <p className='mt-1 text-xs text-[#DCE3E8]/80'>
                  Repeated zipper pull cycle tests, slider alignment, and reinforced waist seam
                  durability.
                </p>
              </div>
            </div>

            {/* QC Card 3: 4XL Bust Tape Measurement */}
            <div className='group overflow-hidden rounded-[18px] border border-white/10 bg-[#163558] shadow-md'>
              <div className='relative aspect-[4/3] overflow-hidden'>
                <Image
                  src={SITE_IMAGES.trust.sizeBust4xl}
                  alt='QC Stage 3: Tape measurement verification for plus size 4XL bust'
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <span className='absolute top-3 left-3 rounded-full bg-[#112B47]/90 px-2.5 py-1 text-[11px] font-bold text-[#E2AB2F] backdrop-blur-sm'>
                  QC Stage 3 · 4XL Size Calibration
                </span>
              </div>
              <div className='p-4'>
                <h4 className='text-sm font-bold text-white'>Tape Measurement Verification</h4>
                <p className='mt-1 text-xs text-[#DCE3E8]/80'>
                  Physical tape measurement of bust, waist, hips, and garment length against tech
                  pack specs.
                </p>
              </div>
            </div>

            {/* Logistics Card 4: Nigeria Waterproof Bale */}
            <div className='group overflow-hidden rounded-[18px] border border-white/10 bg-[#163558] shadow-md'>
              <div className='relative aspect-[4/3] overflow-hidden'>
                <Image
                  src={SITE_IMAGES.trust.packingNigeriaLagos}
                  alt='Logistics Stage 7: Waterproof export bale compressed for Lagos, Nigeria'
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <span className='absolute top-3 left-3 rounded-full bg-[#112B47]/90 px-2.5 py-1 text-[11px] font-bold text-[#E2AB2F] backdrop-blur-sm'>
                  Packing Stage 7 · Nigeria Export Bale
                </span>
              </div>
              <div className='p-4'>
                <h4 className='text-sm font-bold text-white'>Hydraulic Bale Compression</h4>
                <p className='mt-1 text-xs text-[#DCE3E8]/80'>
                  Heavy-duty moisture-proof canvas wrap and steel strapping for containerized shipping
                  to Lagos.
                </p>
              </div>
            </div>

            {/* Logistics Card 5: Ghana Destination Marking */}
            <div className='group overflow-hidden rounded-[18px] border border-white/10 bg-[#163558] shadow-md'>
              <div className='relative aspect-[4/3] overflow-hidden'>
                <Image
                  src={SITE_IMAGES.trust.markingGhanaBale}
                  alt='Logistics Stage 7: Clear destination marking on heavy-duty export bale for Ghana'
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <span className='absolute top-3 left-3 rounded-full bg-[#112B47]/90 px-2.5 py-1 text-[11px] font-bold text-[#E2AB2F] backdrop-blur-sm'>
                  Packing Stage 7 · Ghana Destination Marking
                </span>
              </div>
              <div className='p-4'>
                <h4 className='text-sm font-bold text-white'>Color-Coded Destination Stencil</h4>
                <p className='mt-1 text-xs text-[#DCE3E8]/80'>
                  High-contrast bilingual stenciling ensuring zero transit mix-up through African sea
                  ports.
                </p>
              </div>
            </div>

            {/* Logistics Card 6: Signed Waybill Handover Receipt */}
            <div className='group overflow-hidden rounded-[18px] border border-white/10 bg-[#163558] shadow-md'>
              <div className='relative aspect-[4/3] overflow-hidden'>
                <Image
                  src={SITE_IMAGES.trust.waybillHandoverLagos}
                  alt='Logistics Stage 8: Cargo agent signed handover receipt and air waybill dispatch'
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <span className='absolute top-3 left-3 rounded-full bg-[#112B47]/90 px-2.5 py-1 text-[11px] font-bold text-[#E2AB2F] backdrop-blur-sm'>
                  Dispatch Stage 8 · Cargo Handover & Waybill
                </span>
              </div>
              <div className='p-4'>
                <h4 className='text-sm font-bold text-white'>Signed Cargo Waybill</h4>
                <p className='mt-1 text-xs text-[#DCE3E8]/80'>
                  Official forwarder handover document with airway bill / bill of lading tracking
                  numbers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions & Callout */}
        <div className='mt-12 flex flex-col items-start justify-between gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-center'>
          <div className='max-w-xl'>
            <div className='flex items-center gap-2 text-xs font-semibold text-[#E2AB2F]'>
              <CheckIcon className='h-4 w-4 shrink-0' />
              <span>Low Starting MOQ & Flexible Production</span>
            </div>
            <p className='mt-2 text-xs leading-relaxed text-[#DCE3E8]'>
              Ready-to-ship wholesale starts from 5 pcs/style for instant dispatch. Custom OEM/ODM
              production starts from 100 pcs/style with tailored African size runs and rapid 3-day
              tech pack sampling.
            </p>
          </div>
          <div className='shrink-0'>
            <a
              href={siteWhatsAppLink(
                siteContent,
                'Hello Jack Fashion, I want to start a wholesale order. I would like to review the 8-step process.'
              )}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2.5 rounded-full bg-[#E2AB2F] px-7 py-3.5 text-sm font-bold text-[#171615] shadow-[0_4px_16px_rgba(226,171,47,0.35)] transition-all hover:bg-[#B17C0E] hover:text-white'
            >
              <WhatsAppIcon className='h-5 w-5 shrink-0' />
              <span>Start Wholesale Order</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
