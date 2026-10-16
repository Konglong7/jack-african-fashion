import { DEFAULT_SITE_CONTENT, siteWhatsAppLink, type SiteContent } from '@/lib/siteContentTypes';
import { WhatsAppIcon } from '@/components/Icons';
import { FactoryGallery } from '@/components/FactoryGallery';

export function CustomOrdersClient({
  initialSiteContent = DEFAULT_SITE_CONTENT
}: {
  initialSiteContent?: SiteContent;
}) {
  const whatsappLink = siteWhatsAppLink(initialSiteContent);
  return (
    <>
      <section className='bg-brand-black py-12 text-white sm:py-16'>
        <div className='mx-auto max-w-5xl px-4 text-center'>
          <h1 className='font-display text-3xl font-bold sm:text-4xl lg:text-5xl'>
            Custom Women&apos;s Clothing from Our Own Factory
          </h1>
          <p className='text-brand-cream/80 mx-auto mt-5 max-w-2xl leading-relaxed'>
            Work with Jack Fashion&apos;s own factory for custom womenswear. Send a reference image
            or sample details, fabric requirements, measurements and quantity. Our Guangzhou team
            confirms feasibility, sampling, MOQ and a factory-direct quotation for your design.
          </p>
          <a
            href={whatsappLink}
            target='_blank'
            rel='noopener noreferrer'
            className='mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B7A3E] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#086532] sm:w-auto'
          >
            <WhatsAppIcon className='h-5 w-5 shrink-0' />
            Chat on WhatsApp
          </a>
          <p className='text-brand-cream/80 mt-4 text-sm'>No form or website upload required.</p>
        </div>
      </section>
      <FactoryGallery path='/custom-orders' />
      <section className='bg-brand-cream py-10 sm:py-14'>
        <div className='mx-auto max-w-3xl px-4'>
          <div className='mt-8 rounded-2xl bg-white p-6 sm:p-8'>
            <h2 className='font-display text-brand-black text-2xl font-bold'>
              What do I need for a custom clothing quotation?
            </h2>
            <p className='text-brand-brown/80 mt-4 leading-relaxed'>
              Send three details on WhatsApp: a style reference, your fabric and size requirements,
              and an estimated quantity with destination. If any detail is undecided, share what you
              have so Jack can review the request with you.
            </p>
            <ul className='text-brand-brown/80 mt-5 list-disc space-y-3 pl-5 text-sm leading-relaxed'>
              <li>A reference photo or a link to the style you like.</li>
              <li>Your preferred fabric, colors and size range, if known.</li>
              <li>An estimated quantity and the country where you sell.</li>
            </ul>
            <a
              href={whatsappLink}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B7A3E] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#086532]'
            >
              <WhatsAppIcon className='h-5 w-5 shrink-0' />
              Chat on WhatsApp
            </a>
          </div>
          <p className='text-brand-brown/80 mt-6 text-sm leading-relaxed'>
            Custom-production MOQ, sample cost, price and lead time depend on the style, fabric and
            quantity. We confirm these details with you before sampling or production.
          </p>
        </div>
      </section>
    </>
  );
}
