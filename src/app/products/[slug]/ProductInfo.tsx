'use client';

import { motion } from 'framer-motion';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { CheckIcon, WhatsAppIcon } from '@/components/Icons';
import { InquiryAddButton } from '@/components/InquiryAddButton';
import type { Product } from '@/lib/db';
import { getProductSizes } from '@/lib/productDefaults';

interface Props {
  product: Product;
  siteContent: SiteContent;
}

export function ProductInfo({ product, siteContent }: Props) {
  const sizes = getProductSizes(product.sizes);
  const sizeRange = sizes.length > 1 ? `${sizes[0]} - ${sizes[sizes.length - 1]}` : sizes[0];
  const whatsappMessage = `Hello Jack, I like this style: ${product.name}. Please add me on WhatsApp. I want to discuss today's ready stock, available colors and sizes, real photos/video, wholesale price, packing, and delivery. MOQ: ${product.moq} pcs.`;
  const whatsappLink = siteWhatsAppLink(siteContent, whatsappMessage);
  const similarStyleLink = siteWhatsAppLink(
    siteContent,
    `Hello Jack, I like ${product.name}. I want to send you a similar style picture for quotation.`
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
                className='rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-brown'
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className='font-display text-3xl font-bold leading-tight text-brand-black sm:text-4xl'>
            {product.name}
          </h1>
          <p className='mt-3 max-w-xl text-base leading-7 text-brand-brown/75'>
            {product.description}
          </p>
        </div>

        <div className='grid grid-cols-3 overflow-hidden border border-brand-sand/70 bg-white text-center'>
          <InfoCell label='MOQ' value={`${product.moq} pcs`} />
          <InfoCell label='Stock' value={product.stockType} />
          <InfoCell label='Price' value='WhatsApp quote' />
        </div>

        <div className='flex items-center gap-2 rounded-lg bg-brand-cream/80 px-3.5 py-2 text-xs font-medium text-brand-brown/85'>
          <svg className='h-4 w-4 shrink-0 text-brand-orange' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
          <span>Free delivery to your Guangzhou cargo agent (Lagos / Accra / Nairobi routes)</span>
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
              className='rounded-full border-2 border-brand-black bg-white px-5 py-3 text-center text-sm font-bold text-brand-black transition-colors hover:bg-brand-black hover:text-white'
            >
              Send similar style picture
            </a>
            <InquiryAddButton
              product={product}
              item={{ quantity: product.moq }}
              className='rounded-full border-2 border-brand-sand bg-white px-5 py-3 text-sm font-bold text-brand-brown transition-colors hover:border-brand-black hover:text-brand-black'
            >
              Save to inquiry list
            </InquiryAddButton>
          </div>
        </div>

        <section className='border border-brand-sand/70 bg-brand-cream/70 p-5'>
          <p className='text-xs font-bold uppercase text-brand-orange'>Ask on WhatsApp for</p>
          <ul className='mt-4 space-y-3 text-sm text-brand-brown/75'>
            {[
              `Professional reply for MOQ ${product.moq}+ wholesale orders`,
              'Real stock photos/video, colors, and size mix before quote',
              'Stable new arrivals and repeat-buyer updates on WhatsApp'
            ].map((item) => (
              <li key={item} className='flex gap-3'>
                <CheckIcon className='mt-0.5 h-4 w-4 shrink-0 text-brand-emerald' />
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
            value='Ready batch updates'
            note="Ask for today's colors and prints on WhatsApp, with real photos or video when available."
          />
        </section>

        {product.features.length > 0 && (
          <section className='border-t border-brand-sand/70 pt-5'>
            <p className='text-xs font-bold uppercase text-brand-orange'>Selling points</p>
            <ul className='mt-4 grid gap-3 text-sm text-brand-brown/75 sm:grid-cols-2 lg:grid-cols-1'>
              {product.features.slice(0, 6).map((feature) => (
                <li key={feature} className='flex gap-3'>
                  <CheckIcon className='mt-0.5 h-4 w-4 shrink-0 text-brand-emerald' />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className='fixed inset-x-0 bottom-0 z-40 border-t border-brand-sand bg-white/95 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] shadow-2xl backdrop-blur md:hidden'>
        <div className='mx-auto flex max-w-md items-center gap-2'>
          <InquiryAddButton
            product={product}
            item={{ quantity: product.moq }}
            className='flex items-center justify-center gap-1.5 rounded-full border border-brand-black bg-white px-3.5 py-3 text-xs font-bold text-brand-black shrink-0 shadow-sm transition-transform active:scale-95'
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
            Talk ready stock on WhatsApp
          </a>
        </div>
      </div>
    </motion.aside>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className='border-r border-brand-sand/70 p-3 last:border-r-0'>
      <p className='text-xs font-semibold uppercase text-brand-brown/50'>{label}</p>
      <p className='mt-1 text-sm font-bold text-brand-black'>{value}</p>
    </div>
  );
}

function StockNote({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className='border border-brand-sand bg-white p-4'>
      <p className='text-xs font-bold uppercase text-brand-orange'>{title}</p>
      <p className='mt-2 text-base font-bold text-brand-black'>{value}</p>
      <p className='mt-2 text-sm leading-6 text-brand-brown/65'>{note}</p>
    </div>
  );
}
