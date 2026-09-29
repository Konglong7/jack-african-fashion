import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { DeferredMapEmbed } from '@/components/DeferredMapEmbed';
import { TrustProofGallery } from '@/components/trust/TrustProofGallery';
import { getSiteContent } from '@/lib/siteContent';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { SITE_IMAGES } from '@/lib/siteImages';

export const metadata: Metadata = {
  title: "About Jack African Fashion | Guangzhou Own-Factory Women's Clothing Supplier",
  description:
    'Jack African Fashion operates zamique.com as its official B2B website, with an own factory and office/showroom at Yulong Fashion Plaza in Guangzhou, serving African wholesale buyers.'
};

export default async function AboutPage() {
  const siteContent = await getSiteContent();
  const mapEmbedUrl =
    'https://www.google.com/maps?q=Yulong%20Fashion%20Plaza%2C%20Guangzhou&output=embed';
  const whatsappLink = siteWhatsAppLink(
    siteContent,
    'Hello Jack, I want to know more about your wholesale services and Guangzhou supply capability.'
  );

  const heroProof = ['Own Factory', 'Yulong Showroom', 'Ready Stock', 'Export Packing'];
  const capabilities = [
    {
      title: 'Own factory production',
      body: 'Custom styles are developed and produced through our own factory after fabric, size, quantity and production details are confirmed.'
    },
    {
      title: 'Guangzhou showroom',
      body: 'Our office and showroom at Yulong Fashion Plaza support product selection, stock communication and buyer visits by appointment.'
    },
    {
      title: 'Quality inspection',
      body: 'Fabric, stitching, colour, size mix and finishing are checked against the confirmed order before packing.'
    },
    {
      title: 'Export packing',
      body: 'Orders are counted, packed and prepared in Guangzhou for the buyer’s nominated forwarder or an agreed shipping route.'
    },
    {
      title: 'African B2B service',
      body: 'We have confirmed service experience with boutiques, wholesalers and importers in Nigeria, Ghana, Kenya and other African markets.'
    }
  ];
  const process = [
    {
      step: '01',
      title: 'Source and select',
      body: 'We confirm suitable Guangzhou styles and product details for African boutiques, importers and distributors.'
    },
    {
      step: '02',
      title: 'Produce or restock',
      body: 'Ready-stock orders are confirmed by batch, while custom references are developed and produced through our own factory.'
    },
    {
      step: '03',
      title: 'Inspect and pack',
      body: 'Orders are checked, counted and packed with export shipping in mind before dispatch.'
    },
    {
      step: '04',
      title: 'Ship and update',
      body: 'We provide direct WhatsApp communication from product confirmation through packing and cargo handover.'
    }
  ];
  const trustStats = [
    { value: 'Own', label: 'Factory production' },
    { value: 'No.229', label: 'Guangyuan Xi Road' },
    { value: 'B2B', label: 'African market service' },
    { value: 'By style', label: 'MOQ confirmed per item' }
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
              Guangzhou Women&apos;s Clothing Supplier with Own Factory
            </h1>
            <p className='text-brand-cream/80 mt-5 max-w-2xl text-base leading-relaxed sm:text-lg'>
              Jack African Fashion operates zamique.com as its official B2B website. From our own
              factory, Guangzhou office and Yulong Fashion Plaza showroom, we serve African
              boutiques, wholesalers, importers and fashion retailers with ready stock and custom
              production.
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
                  src={SITE_IMAGES.trust.showroomPillarJack}
                  alt='Jack Fashion Guangzhou wholesale showroom at Yulong Fashion Plaza'
                  fill
                  sizes='(max-width: 640px) 100vw, 320px'
                  className='object-cover'
                />
              </div>
              <div className='grid gap-4'>
                <div className='relative aspect-[4/3] overflow-hidden rounded-xl bg-white shadow-sm'>
                  <Image
                    src={SITE_IMAGES.trust.sizeBust4xl}
                    alt='True 4XL 120cm bust flat tape measurement and QC notebook'
                    fill
                    sizes='(max-width: 640px) 100vw, 320px'
                    className='object-cover'
                  />
                </div>
                <div className='relative aspect-[4/3] overflow-hidden rounded-xl bg-white shadow-sm'>
                  <Image
                    src={SITE_IMAGES.trust.waybillHandoverLagos}
                    alt='Guangzhou to Lagos Nigeria cargo receipt waybill handover'
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
                  Jack African Fashion is a Guangzhou women&apos;s clothing wholesale supplier and
                  factory-direct manufacturer. zamique.com is our official B2B website, and our
                  office and showroom are located at Yulong Fashion Plaza, No.229 Guangyuan Xi Road,
                  Yuexiu District, Guangzhou.
                </p>
                <p>
                  Our own factory supports custom production, while our Guangzhou showroom supports
                  ready-stock selection. We supply African women&apos;s dresses, plus-size styles,
                  two piece sets, women&apos;s suits, blazer pants sets, pleated dresses, knit
                  dresses and jumpsuits. Availability, sizes, colors and MOQ are confirmed per
                  style.
                </p>
                <p>
                  We have confirmed B2B service experience with buyers in Nigeria, Ghana, Kenya and
                  other African markets. Our team supports style confirmation, production, quality
                  checking, export packing and cargo coordination with direct WhatsApp
                  communication.
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
                Official office and showroom address: Yulong Fashion Plaza, No.229 Guangyuan Xi
                Road, Yuexiu District, Guangzhou, China.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustProofGallery whatsappUrl={whatsappLink} />

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
              <DeferredMapEmbed title='Yulong Fashion Plaza location map' src={mapEmbedUrl} />
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
