import Image from '@/components/ResponsiveImage';
import {
  DEFAULT_SITE_CONTENT,
  getSiteLocations,
  siteWhatsAppLink,
  type SiteContent
} from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';
import { WhatsAppIcon } from '@/components/Icons';
import { SocialLinks, WhatsAppContacts } from '@/components/ContactLinks';

const CONTACT_TOPICS = [
  {
    title: 'Stock & wholesale prices',
    description: 'Ask for current styles, real stock photos and a wholesale quotation.'
  },
  {
    title: 'Custom production',
    description: 'Send your style pictures and discuss fabric, measurements and quantity.'
  },
  {
    title: 'Shipping & packing',
    description: 'Discuss your destination, cargo agent and packing requirements.'
  },
  {
    title: 'Sizes & colors',
    description: 'Check the available size mix, colors and measurements for a style.'
  },
  {
    title: 'Visit appointments',
    description:
      'Arrange a visit to Yulong Fashion Plaza (Building 2, Shop 3063) or LIUHUA Market (Shop 0081).'
  },
  {
    title: 'Any other question',
    description: 'Tell us what you need. You can start the conversation with a simple hello.'
  }
];

export function ContactClient({
  initialSiteContent = DEFAULT_SITE_CONTENT
}: {
  initialSiteContent?: SiteContent;
}) {
  const siteContent = initialSiteContent;
  const whatsappLink = siteWhatsAppLink(siteContent);

  return (
    <>
      <section className='bg-brand-black py-12 text-white sm:py-16'>
        <div className='mx-auto max-w-5xl px-4 text-center'>
          <h1 className='font-display text-3xl font-bold sm:text-4xl lg:text-5xl'>
            Contact Jack Fashion for Women&apos;s Clothing Wholesale
          </h1>
          <p className='text-brand-cream/80 mx-auto mt-5 max-w-2xl leading-relaxed'>
            For prices, ready stock, custom styles, shipping or any other question, message our
            Guangzhou team directly. No form to fill in.
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
          <WhatsAppContacts siteContent={siteContent} className='mt-3 justify-center text-white' />
        </div>
      </section>

      <section className='bg-brand-cream py-10 sm:py-14'>
        <div className='mx-auto max-w-6xl px-4'>
          <h2 className='font-display text-brand-black text-2xl font-bold sm:text-3xl'>
            What Can We Help You With?
          </h2>
          <p className='text-brand-brown/80 mt-3 max-w-2xl leading-relaxed'>
            Contact our team on WhatsApp for stock, MOQ, bulk-price quotations, custom requirements or
            cargo handover. Send a style code or reference photo, quantity and destination; every
            option below opens the same direct conversation.
          </p>
          <div className='mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {CONTACT_TOPICS.map((topic) => (
              <a
                key={topic.title}
                href={whatsappLink}
                target='_blank'
                rel='noopener noreferrer'
                className='border-brand-sand hover:border-brand-orange flex flex-col rounded-xl border bg-white p-6 transition-colors'
              >
                <h3 className='text-brand-black font-semibold'>{topic.title}</h3>
                <p className='text-brand-brown/80 mt-3 flex-1 text-sm leading-relaxed'>
                  {topic.description}
                </p>
                <span className='mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0B7A3C]'>
                  <WhatsAppIcon className='h-5 w-5 shrink-0' />
                  Chat on WhatsApp
                </span>
              </a>
            ))}
          </div>

          <div className='mt-10 grid gap-6 lg:grid-cols-2'>
            <div className='rounded-2xl bg-white p-6 sm:p-8'>
              <h2 className='font-display text-brand-black text-2xl font-bold'>
                Our Guangzhou Team
              </h2>
              <p className='text-brand-brown/80 mt-3 text-sm leading-relaxed'>
                Contact Founder &amp; Head of Wholesale Jack directly on WhatsApp (+86 189 2625 7367) for factory-direct quotations, 50,000+ ready-stock video verification, and cargo coordination. Visit our flagship wholesale showroom at Yulong Fashion Plaza (Building 2, Shop 3063) or our LIUHUA Market boutique showroom (Shop 0081) in Guangzhou. Confirm your appointment time and selected styles before visiting.
              </p>
              <dl className='mt-6 space-y-5 text-sm'>
                <div>
                  <dt className='text-brand-black font-semibold'>WhatsApp</dt>
                  <dd className='mt-2'>
                    <WhatsAppContacts siteContent={siteContent} className='text-[#0B7A3E]' />
                  </dd>
                </div>
                <div>
                  <dt className='text-brand-black font-semibold'>Wholesale showrooms</dt>
                  {getSiteLocations(siteContent).map((location) => (
                    <dd key={location.address} className='mt-2'>
                      <a
                        href={location.mapUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-brand-brown/80 leading-relaxed underline underline-offset-4'
                      >
                        {location.address}
                      </a>
                    </dd>
                  ))}
                </div>
                <div>
                  <dt className='text-brand-black font-semibold'>Showroom appointments</dt>
                  <dd className='text-brand-brown/80 mt-2 leading-relaxed'>
                    Confirm your showroom and visit time on WhatsApp before travelling. Guangzhou
                    uses China Standard Time (UTC+8).
                  </dd>
                </div>
              </dl>
              <SocialLinks siteContent={siteContent} className='mt-6' />
            </div>
            <div className='bg-brand-black overflow-hidden rounded-2xl text-white'>
              <div className='relative aspect-[16/9]'>
                <Image
                  src={SITE_IMAGES.trust.showroomExterior}
                  alt='Yulong Fashion Plaza, Jack Fashion wholesale base in Guangzhou'
                  fill
                  sizes='(max-width: 1023px) 100vw, 50vw'
                  className='object-cover'
                />
              </div>
              <div className='p-6'>
                <h2 className='text-xl font-semibold'>Plan a Guangzhou Visit</h2>
                <p className='mt-3 text-sm leading-relaxed text-white/80'>
                  Message us on WhatsApp with your preferred date and the styles you would like to
                  see. We will confirm the visit details with you.
                </p>
                <a
                  href={whatsappLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0B7A3E] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#086532]'
                >
                  <WhatsAppIcon className='h-5 w-5 shrink-0' />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
