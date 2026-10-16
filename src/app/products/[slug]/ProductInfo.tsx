'use client';

import { motion } from 'framer-motion';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { CheckIcon, WhatsAppIcon } from '@/components/Icons';
import { absoluteSiteUrl } from '@/lib/siteUrl';
import { getPublicProductFacts, type PublicProduct } from '@/lib/productPublicFacts';

interface Props {
  product: PublicProduct;
  siteContent: SiteContent;
}

export function ProductInfo({ product, siteContent }: Props) {
  const facts = getPublicProductFacts(product);
  const productUrl = absoluteSiteUrl(`/products/${product.slug}`);
  const whatsappMessage = `Hello Jack, I like this style: ${product.name} (${productUrl}). Please add me on WhatsApp. I want to confirm today's stock, MOQ, available colors and sizes, real photos/video, wholesale price, packing, and delivery.`;
  const whatsappLink = siteWhatsAppLink(siteContent, whatsappMessage);
  const similarStyleLink = siteWhatsAppLink(
    siteContent,
    `Hello Jack, I like ${product.name} (${productUrl}). I want to send you a similar style picture for quotation.`
  );

  return (
    <motion.aside
      className='lg:sticky lg:top-24 lg:self-start'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <div className='space-y-6'>
        <div>
          <div className='mb-4 flex flex-wrap gap-2'>
            {[product.category].map((tag) => (
              <span
                key={tag}
                className='bg-brand-cream text-brand-brown rounded-full px-3 py-1 text-xs font-semibold'
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className='font-display text-brand-black text-3xl leading-tight font-bold sm:text-4xl'>
            {product.name} Wholesale
          </h1>
          <p className='text-brand-brown/75 mt-3 max-w-xl text-base leading-7'>
            {facts.description}
          </p>
        </div>

        <div className='border-brand-gold/30 to-brand-cream/40 grid grid-cols-3 overflow-hidden rounded-xl border bg-gradient-to-b from-white text-center shadow-sm'>
          <InfoCell label='MOQ' value={facts.moq} />
          <InfoCell label='Stock' value={facts.stock} />
          <InfoCell label='Wholesale' value='WhatsApp Quote' />
        </div>

        {/* Trade Trust Badges */}
        <div className='grid grid-cols-2 gap-2 text-xs font-semibold'>
          <div className='border-brand-gold/25 bg-brand-gold/10 text-brand-brown flex items-center gap-2 rounded-lg border px-3 py-2'>
            <span className='flex h-2 w-2 animate-pulse rounded-full bg-emerald-500' />
            <span className='truncate'>Stock Photos / Video</span>
          </div>
          <div className='border-brand-sand text-brand-brown flex items-center gap-2 rounded-lg border bg-white px-3 py-2'>
            <span className='bg-brand-orange h-2 w-2 rounded-full' />
            <span className='truncate'>Discuss Cargo Handover</span>
          </div>
        </div>

        <div className='space-y-3'>
          <a
            href={whatsappLink}
            data-product-id={product.id}
            data-cta-location='product-main'
            target='_blank'
            rel='noopener noreferrer'
            className='flex w-full items-center justify-center gap-2 rounded-full bg-[#0B7A3E] px-6 py-4 text-base font-bold text-white shadow-lg shadow-green-900/15 transition-transform hover:-translate-y-0.5 hover:bg-[#086532]'
          >
            <WhatsAppIcon className='h-5 w-5' />
            Chat on WhatsApp
          </a>

          <div className='grid gap-3'>
            <a
              href={similarStyleLink}
              data-product-id={product.id}
              data-cta-location='product-custom'
              target='_blank'
              rel='noopener noreferrer'
              className='border-brand-black text-brand-black hover:bg-brand-black rounded-full border-2 bg-white px-5 py-3 text-center text-sm font-bold transition-colors hover:text-white'
            >
              Send Style Pictures on WhatsApp
            </a>
          </div>
        </div>

        <section className='border-brand-sand/70 bg-brand-cream/70 border p-5'>
          <p className='text-brand-orange text-xs font-bold uppercase'>Ask on WhatsApp for</p>
          <ul className='text-brand-brown/75 mt-4 space-y-3 text-sm'>
            {[
              'Current MOQ and quantity options for this style',
              'Real stock photos/video, colors, and size mix before quote',
              'New-arrival and repeat-order requirements on WhatsApp'
            ].map((item) => (
              <li key={item} className='flex gap-3'>
                <CheckIcon className='text-brand-emerald mt-0.5 h-4 w-4 shrink-0' />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className='grid gap-3 sm:grid-cols-2'>
          <StockNote
            title='Listed size references'
            value={facts.sizes}
            note='Size labels are references. Confirm actual bust, waist, hip and length measurements and the available size run for this style.'
          />
          <StockNote
            title='Available colors'
            value={facts.colors}
            note='Confirm the available colors for your selected style and current batch on WhatsApp.'
          />
        </section>

        {facts.features.length > 0 && (
          <section className='border-brand-sand/70 border-t pt-5'>
            <p className='text-brand-orange text-xs font-bold uppercase'>
              Style details to confirm
            </p>
            <ul className='text-brand-brown/75 mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1'>
              {facts.features.slice(0, 6).map((feature) => (
                <li key={feature} className='flex gap-3'>
                  <CheckIcon className='text-brand-emerald mt-0.5 h-4 w-4 shrink-0' />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className='border-brand-sand fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] shadow-2xl backdrop-blur md:hidden'>
        <div className='mx-auto flex max-w-md items-center gap-2'>
          <a
            href={whatsappLink}
            data-product-id={product.id}
            data-cta-location='product-mobile'
            target='_blank'
            rel='noopener noreferrer'
            className='flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0B7A3E] px-4 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:bg-[#086532] active:scale-95'
          >
            <WhatsAppIcon className='h-5 w-5' />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </motion.aside>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className='border-brand-sand/70 border-r p-3 last:border-r-0'>
      <p className='text-brand-brown/50 text-xs font-semibold uppercase'>{label}</p>
      <p className='text-brand-black mt-1 text-sm font-bold'>{value}</p>
    </div>
  );
}

function StockNote({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className='border-brand-sand border bg-white p-4'>
      <p className='text-brand-orange text-xs font-bold uppercase'>{title}</p>
      <p className='text-brand-black mt-2 text-base font-bold'>{value}</p>
      <p className='text-brand-brown/65 mt-2 text-sm leading-6'>{note}</p>
    </div>
  );
}
