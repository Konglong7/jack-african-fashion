'use client';

import { motion } from 'framer-motion';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { CheckIcon, WhatsAppIcon } from '@/components/Icons';
import { InquiryAddButton } from '@/components/InquiryAddButton';
import type { Product } from '@/lib/db';
import { getProductSizes } from '@/lib/productDefaults';
import { absoluteSiteUrl } from '@/lib/siteUrl';

interface Props {
  product: Product;
  siteContent: SiteContent;
}

export function ProductInfo({ product, siteContent }: Props) {
  const sizes = getProductSizes(product.sizes);
  const sizeRange = sizes.length > 1 ? `${sizes[0]} - ${sizes[sizes.length - 1]}` : sizes[0];
  const productUrl = absoluteSiteUrl(`/products/${product.slug}`);
  const whatsappMessage = `Hello Jack, I like this style: ${product.name} (${productUrl}). Please add me on WhatsApp. I want to discuss today's ready stock, available colors and sizes, real photos/video, wholesale price, packing, and delivery. MOQ: ${product.moq} pcs.`;
  const whatsappLink = siteWhatsAppLink(siteContent, whatsappMessage);
  const similarStyleLink = siteWhatsAppLink(
    siteContent,
    `Hello Jack, I like ${product.name} (${productUrl}). I want to send you a similar style picture for quotation.`
  );

  return (
    <motion.aside
      className='lg:sticky lg:top-24 lg:self-start'
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className='space-y-6'>
        <div>
          <div className='mb-4 flex flex-wrap gap-2'>
            {[product.category, ...product.tags.slice(0, 3)].map((tag) => (
              <span
                key={tag}
                className='bg-brand-cream text-brand-brown rounded-full px-3 py-1 text-xs font-semibold'
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className='font-display text-brand-black text-3xl leading-tight font-bold sm:text-4xl'>
            {product.name}
          </h1>
          <p className='text-brand-brown/75 mt-3 max-w-xl text-base leading-7'>
            {product.description}
          </p>
        </div>

        <div className='border-brand-gold/30 to-brand-cream/40 grid grid-cols-3 overflow-hidden rounded-xl border bg-gradient-to-b from-white text-center shadow-sm'>
          <InfoCell label='MOQ' value={`${product.moq} pcs`} />
          <InfoCell label='Stock' value={product.stockType} />
          <InfoCell label='Wholesale' value='WhatsApp Quote' />
        </div>

        {/* Trade Trust Badges */}
        <div className='grid grid-cols-2 gap-2 text-xs font-semibold'>
          <div className='border-brand-gold/25 bg-brand-gold/10 text-brand-brown flex items-center gap-2 rounded-lg border px-3 py-2'>
            <span className='flex h-2 w-2 animate-pulse rounded-full bg-emerald-500' />
            <span className='truncate'>Live Video Inspection</span>
          </div>
          <div className='border-brand-sand text-brand-brown flex items-center gap-2 rounded-lg border bg-white px-3 py-2'>
            <span className='bg-brand-orange h-2 w-2 rounded-full' />
            <span className='truncate'>Guangzhou Cargo Handover</span>
          </div>
        </div>

        <div className='space-y-3'>
          <a
            href={whatsappLink}
            target='_blank'
            rel='noopener noreferrer'
            className='flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-lg shadow-green-900/15 transition-transform hover:-translate-y-0.5'
          >
            <WhatsAppIcon className='h-5 w-5' />
            Discuss ready stock on WhatsApp
          </a>

          <div className='grid gap-3 sm:grid-cols-2'>
            <a
              href={similarStyleLink}
              target='_blank'
              rel='noopener noreferrer'
              className='border-brand-black text-brand-black hover:bg-brand-black rounded-full border-2 bg-white px-5 py-3 text-center text-sm font-bold transition-colors hover:text-white'
            >
              Send similar style picture
            </a>
            <InquiryAddButton
              product={product}
              item={{ quantity: product.moq }}
              className='border-brand-sand text-brand-brown hover:border-brand-black hover:text-brand-black rounded-full border-2 bg-white px-5 py-3 text-sm font-bold transition-colors'
            >
              Save to inquiry list
            </InquiryAddButton>
          </div>
        </div>

        <section className='border-brand-sand/70 bg-brand-cream/70 border p-5'>
          <p className='text-brand-orange text-xs font-bold uppercase'>Ask on WhatsApp for</p>
          <ul className='text-brand-brown/75 mt-4 space-y-3 text-sm'>
            {[
              `Professional reply for MOQ ${product.moq}+ wholesale orders`,
              'Real stock photos/video, colors, and size mix before quote',
              'Stable new arrivals and repeat-buyer updates on WhatsApp'
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
            title='Size coverage'
            value={sizeRange || 'Mixed sizes'}
            note='Ready-stock sizes can change by batch. We confirm the available mix clearly before you order.'
          />
          <StockNote
            title='Colors & prints'
            value={
              product.colors.length > 0
                ? product.colors.map((color) => color.name).join(' / ')
                : 'Confirm current batch'
            }
            note='Colors can change by stock batch. Ask for current photos or video before confirming your order.'
          />
        </section>

        {product.features.length > 0 && (
          <section className='border-brand-sand/70 border-t pt-5'>
            <p className='text-brand-orange text-xs font-bold uppercase'>Selling points</p>
            <ul className='text-brand-brown/75 mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1'>
              {product.features.slice(0, 6).map((feature) => (
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
          <InquiryAddButton
            product={product}
            item={{ quantity: product.moq }}
            className='border-brand-black text-brand-black flex shrink-0 items-center justify-center gap-1.5 rounded-full border bg-white px-3.5 py-3 text-xs font-bold shadow-sm transition-transform active:scale-95'
          >
            Save Inquiry
          </InquiryAddButton>
          <a
            href={whatsappLink}
            target='_blank'
            rel='noopener noreferrer'
            className='flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-sm transition-transform active:scale-95'
          >
            <WhatsAppIcon className='h-5 w-5' />
            WhatsApp (Stock & Quote)
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
