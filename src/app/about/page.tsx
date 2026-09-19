import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getSiteContent } from '@/lib/siteContent';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';

export const metadata: Metadata = {
  title: "About Us | Guangzhou Women's Fashion Wholesale Base",
  description:
    'Jack African Fashion operates from Yulong Fashion Plaza in Guangzhou, providing African boutiques, wholesalers and importers with ready stock, factory production, quality inspection, and export packing.'
};

export default async function AboutPage() {
  const siteContent = await getSiteContent();
  const mapEmbedUrl =
    'https://www.google.com/maps?q=Yulong%20Fashion%20Plaza%2C%20Guangzhou&output=embed';
  const whatsappLink = siteWhatsAppLink(
    siteContent,
    'Hello Jack, I want to know more about your wholesale services and Guangzhou supply capability.'
  );

  const heroProof = ['Yulong Fashion Plaza', 'Ready Stock', 'Factory Network', 'Export Packing'];
  const capabilities = [
    {
      title: 'Factory coordination',
      body: 'We work closely with production partners for repeat styles, custom references, size requests and bulk replenishment.'
    },
    {
      title: 'Warehouse packing',
      body: 'Ready-stock orders are sorted, counted, packed and prepared for export routes from Guangzhou.'
    },
    {
      title: 'Quality inspection',
      body: 'Fabric, stitching, colour, size mix and finishing are checked before orders leave our packing flow.'
    },
    {
      title: 'Custom production',
      body: 'Send reference pictures, fabric direction and quantity. We coordinate sampling, quotation and production details.'
    },
    {
      title: 'Africa route support',
      body: 'We prepare clear order information for shipping partners familiar with African wholesale buyers.'
    }
  ];
  const process = [
    {
      step: '01',
      title: 'Source and select',
      body: 'We track Guangzhou market supply and choose styles for African boutiques, importers and distributors.'
    },
    {
      step: '02',
      title: 'Produce or restock',
      body: 'Fast sellers move through ready stock, while custom references are handled through factory production partners.'
    },
    {
      step: '03',
      title: 'Inspect and pack',
      body: 'Orders are checked, counted and packed with export shipping in mind before dispatch.'
    },
    {
      step: '04',
      title: 'Ship and update',
      body: 'We keep communication direct on WhatsApp, from product confirmation to shipping updates.'
    }
  ];
  const trustStats = [
    { value: '1300+', label: 'Tenants in Yulong market' },
    { value: 'No.229', label: 'Guangyuan Xi Road' },
    { value: 'B2B', label: 'Wholesale focus' },
    { value: 'MOQ 30', label: 'Ready-stock minimum' }
  ];

  return (
    <>
      <section className='bg-brand-black relative overflow-hidden text-white'>
        <div className='absolute inset-0'>
          <Image
            src={SITE_IMAGES.africanMarketCollage}
            alt='African women fashion styles supplied from Guangzhou wholesale market'
            fill
            priority
            sizes='100vw'
            className='object-cover opacity-35'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40' />
        </div>

        <div className='relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-end'>
          <div>
            <span className='text-brand-gold text-sm font-semibold tracking-[0.22em] uppercase'>
              About Jack African Fashion
            </span>
            <h1 className='font-display mt-4 max-w-3xl text-4xl font-bold sm:text-5xl lg:text-6xl'>
              Guangzhou Wholesale Base for African Women&apos;s Fashion
            </h1>
            <p className='text-brand-cream/80 mt-5 max-w-2xl text-base leading-relaxed sm:text-lg'>
              From Yulong Fashion Plaza in Guangzhou, we connect African boutiques and importers
              with ready stock, factory production, quality checking and export packing support.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Link
                href='/catalog'
                className='bg-brand-orange hover:bg-brand-gold inline-flex items-center justify-center rounded-full px-8 py-3.5 font-semibold text-white transition-colors'
              >
                View Catalog
              </Link>
              <a
                href={whatsappLink}
                target='_blank'
                rel='noopener noreferrer'
                className='border-brand-cream/40 hover:bg-brand-cream hover:text-brand-black inline-flex items-center justify-center rounded-full border px-8 py-3.5 font-semibold text-white transition-colors'
              >
                Talk on WhatsApp
              </a>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2'>
            {heroProof.map((item) => (
              <div
                key={item}
                className='border-brand-cream/15 bg-brand-cream/10 rounded-xl border p-4'
              >
                <p className='text-brand-gold text-xs font-semibold tracking-[0.18em] uppercase'>
                  Proof
                </p>
                <p className='mt-2 text-sm font-semibold sm:text-base'>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-brand-cream py-12 sm:py-16'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='relative aspect-[4/5] overflow-hidden rounded-xl bg-white shadow-sm'>
                <Image
                  src={SITE_IMAGES.aboutShowroom}
                  alt='Guangzhou womenswear wholesale showroom display'
                  fill
                  sizes='(max-width: 640px) 100vw, 320px'
                  className='object-cover'
                />
              </div>
              <div className='grid gap-4'>
                <div className='relative aspect-[4/3] overflow-hidden rounded-xl bg-white shadow-sm'>
                  <Image
                    src={SITE_IMAGES.warehouseShipping}
                    alt='Warehouse packing for African fashion wholesale orders'
                    fill
                    sizes='(max-width: 640px) 100vw, 320px'
                    className='object-cover'
                  />
                </div>
                <div className='relative aspect-[4/3] overflow-hidden rounded-xl bg-white shadow-sm'>
                  <Image
                    src={SITE_IMAGES.customOrders}
                    alt='Custom production support for women fashion wholesale'
                    fill
                    sizes='(max-width: 640px) 100vw, 320px'
                    className='object-cover'
                  />
                </div>
              </div>
            </div>

            <div>
              <span className='text-brand-orange text-sm font-semibold tracking-[0.2em] uppercase'>
                Built Around African Buyers
              </span>
              <h2 className='font-display text-brand-black mt-3 text-3xl font-bold sm:text-4xl'>
                A stronger Guangzhou partner for boutiques, wholesalers and importers.
              </h2>
              <div className='text-brand-brown/80 mt-6 space-y-4 leading-relaxed'>
                <p>
                  Jack African Fashion is positioned inside Guangzhou&apos;s garment trading
                  ecosystem, where showroom supply, factory production and shipping resources are
                  close together. That lets us move quickly from style selection to order packing.
                </p>
                <p>
                  We focus on the African women&apos;s fashion market: bold dresses, plus-size
                  shapes, two-piece sets, pleated styles, jumpsuits and custom references that match
                  what local boutiques can actually sell.
                </p>
                <p>
                  Our job is not only to show products. We help buyers confirm styles, compare
                  fabric direction, coordinate production, check goods and prepare orders for export
                  with clear WhatsApp communication.
                </p>
              </div>

              <div className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4'>
                {trustStats.map((stat) => (
                  <div
                    key={stat.label}
                    className='border-brand-sand rounded-xl border bg-white p-4'
                  >
                    <p className='font-display text-brand-orange text-2xl font-bold'>
                      {stat.value}
                    </p>
                    <p className='text-brand-brown/65 mt-1 text-xs leading-snug'>{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className='text-brand-brown/55 mt-3 text-xs'>
                Market tenant and address details are based on public Yulong Fashion Plaza
                information.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-white py-12 sm:py-16'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-10 max-w-2xl'>
            <span className='text-brand-orange text-sm font-semibold tracking-[0.2em] uppercase'>
              What Gives Buyers Confidence
            </span>
            <h2 className='font-display text-brand-black mt-3 text-3xl font-bold sm:text-4xl'>
              Supply strength you can see in the workflow.
            </h2>
          </div>

          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
            {capabilities.map((item) => (
              <div key={item.title} className='border-brand-sand rounded-xl border p-5'>
                <div className='bg-brand-orange mb-5 h-1.5 w-10 rounded-full' />
                <h3 className='text-brand-black font-semibold'>{item.title}</h3>
                <p className='text-brand-brown/70 mt-3 text-sm leading-relaxed'>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-brand-black py-12 text-white sm:py-16'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
            <div>
              <span className='text-brand-gold text-sm font-semibold tracking-[0.2em] uppercase'>
                Order Flow
              </span>
              <h2 className='font-display mt-3 text-3xl font-bold sm:text-4xl'>
                From Guangzhou selection to packed wholesale order.
              </h2>
              <p className='text-brand-cream/70 mt-4 leading-relaxed'>
                A serious supplier needs a repeatable process. We keep the steps simple, visible and
                practical for buyers who need speed and clarity.
              </p>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              {process.map((item) => (
                <div
                  key={item.step}
                  className='border-brand-cream/15 bg-brand-cream/10 rounded-xl border p-5'
                >
                  <p className='font-display text-brand-gold text-3xl font-bold'>{item.step}</p>
                  <h3 className='mt-4 font-semibold'>{item.title}</h3>
                  <p className='text-brand-cream/70 mt-2 text-sm leading-relaxed'>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='bg-brand-cream py-12 sm:py-16'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
            <div>
              <span className='text-brand-orange text-sm font-semibold tracking-[0.2em] uppercase'>
                Guangzhou Market Location
              </span>
              <h2 className='font-display text-brand-black mt-3 text-3xl font-bold sm:text-4xl'>
                Based at {siteContent.location}, a known wholesale fashion market.
              </h2>
              <p className='text-brand-brown/80 mt-5 leading-relaxed'>
                Yulong Fashion Plaza is publicly listed at No.229 Guangyuan Xi Road, Yuexiu
                District, Guangzhou. For overseas buyers, this location matters: it places us close
                to active garment suppliers, market showrooms, packing resources and export
                logistics support.
              </p>
              <p className='text-brand-brown/70 mt-4 leading-relaxed'>
                When customers ask where we are, we can show the exact market location and keep the
                conversation grounded in a real Guangzhou wholesale base.
              </p>
              <a
                href={siteContent.locationUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-brand-black hover:bg-brand-brown mt-7 inline-flex items-center justify-center rounded-full px-7 py-3 font-semibold text-white transition-colors'
              >
                Open in Google Maps
              </a>
            </div>

            <div className='relative overflow-hidden rounded-xl border border-white bg-white shadow-sm'>
              <iframe
                title='Yulong Fashion Plaza location map'
                src={mapEmbedUrl}
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                className='h-[360px] w-full sm:h-[430px]'
              />
              <div className='absolute right-4 bottom-4 left-4 max-w-sm rounded-xl bg-white/95 p-4 shadow-sm'>
                <p className='text-brand-orange text-xs font-semibold tracking-[0.18em] uppercase'>
                  Market address
                </p>
                <p className='text-brand-black mt-1 font-semibold'>Yulong Fashion Plaza</p>
                <p className='text-brand-brown/70 mt-1 text-sm'>
                  No.229 Guangyuan Xi Road, Yuexiu District, Guangzhou
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-white py-12 sm:py-16'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <span className='text-brand-orange text-sm font-semibold tracking-[0.2em] uppercase'>
            Work With Us
          </span>
          <h2 className='font-display text-brand-black mt-3 text-3xl font-bold sm:text-4xl'>
            Ready to build your next wholesale order from Guangzhou?
          </h2>
          <p className='text-brand-brown/70 mx-auto mt-4 max-w-2xl leading-relaxed'>
            Send your target styles, quantity, sizes and country. We&apos;ll help you confirm what
            is ready, what can be produced, and how to pack the order for your market.
          </p>
          <div className='mt-8 flex flex-col justify-center gap-4 sm:flex-row'>
            <Link
              href='/catalog'
              className='bg-brand-orange hover:bg-brand-gold inline-flex items-center justify-center rounded-full px-8 py-3.5 font-semibold text-white transition-colors'
            >
              View Catalog
            </Link>
            <a
              href={whatsappLink}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-brand-black hover:bg-brand-brown inline-flex items-center justify-center rounded-full px-8 py-3.5 font-semibold text-white transition-colors'
            >
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
