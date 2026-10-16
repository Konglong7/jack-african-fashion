import Link from 'next/link';
import type { ReactNode } from 'react';
import type { PublicProduct } from '@/lib/productPublicFacts';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { ProductImage } from '@/components/ProductImage';
import { getProductImageAspect } from '@/lib/productImageDimensions';
import { WhatsAppIcon, CheckIcon } from '@/components/Icons';
import styles from './homepage.module.css';

const BUYING_SUPPORT = [
  'Guangzhou wholesale base',
  'MOQ shown per style',
  'Custom orders',
  'Cargo agent coordination'
];

interface FulfillmentBadge {
  badge: string;
  title: string;
  desc: string;
  sub: string;
  icon: ReactNode;
}

const FULFILLMENT_BADGES: FulfillmentBadge[] = [
  {
    badge: '01 · READY STOCK',
    title: 'Ready-to-Ship Wholesale',
    desc: 'Large ready stock inventory in Guangzhou for fast replenishment and low risk.',
    sub: 'High-volume ready inventory in Guangzhou with low starting MOQ (5 pcs).',
    icon: (
      <svg
        className='h-4 w-4 shrink-0 text-[#b17c0e]'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth='2'
        aria-hidden='true'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
        />
      </svg>
    )
  },
  {
    badge: '02 · FAST OEM / ODM',
    title: 'Flexible Customization',
    desc: '3-day rapid pattern sampling and flexible custom production for boutiques.',
    sub: '3-day rapid pattern sampling and flexible custom production.',
    icon: (
      <svg
        className='h-4 w-4 shrink-0 text-[#b17c0e]'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth='2'
        aria-hidden='true'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
        />
      </svg>
    )
  },
  {
    badge: '03 · DIRECT CARGO',
    title: 'Global Fulfillment',
    desc: 'Direct air & sea consolidated freight to African ports and global hubs.',
    sub: 'Direct air & sea consolidated freight to African ports and global hubs.',
    icon: (
      <svg
        className='h-4 w-4 shrink-0 text-[#b17c0e]'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth='2'
        aria-hidden='true'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    )
  }
];

export function Hero({
  siteContent,
  products = []
}: {
  siteContent: SiteContent;
  products?: PublicProduct[];
}) {
  const selected = products.slice(0, 2);
  return (
    <>
      <section id='home-hero' className={styles.hero} aria-labelledby='home-hero-title'>
        <div className={`${styles.container} ${styles.heroLayout}`}>
          <div data-hero-content className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>{siteContent.heroEyebrow}</p>
            <h1 id='home-hero-title' className={`font-display ${styles.heroHeading}`}>
              {siteContent.heroTitle} {siteContent.heroAccent}
            </h1>
            <p className={styles.heroBody}>{siteContent.heroBody}</p>

            {/* 3-Column Core Fulfillment Badges (M3) */}
            <div className={styles.fulfillmentGrid}>
              {FULFILLMENT_BADGES.map((item) => (
                <div key={item.title} className={styles.fulfillmentCard}>
                  <div className={styles.fulfillmentBadgeHeader}>
                    <span className={styles.fulfillmentTag}>{item.badge}</span>
                    {item.icon}
                  </div>
                  <h3 className={styles.fulfillmentTitle}>{item.title}</h3>
                  <p className={styles.fulfillmentDesc}>{item.desc}</p>
                  <span className={styles.fulfillmentSub}>{item.sub}</span>
                </div>
              ))}
            </div>

            <div className={styles.heroActions}>
              {/* Primary WhatsApp CTA upgraded to Senori Gold Pill Button (#E2AB2F) */}
              <a
                href={siteWhatsAppLink(siteContent)}
                data-cta-location='home-hero'
                target='_blank'
                rel='noopener noreferrer'
                className={`${styles.button} ${styles.goldPillButton} btn-senori-gold rounded-full min-h-[52px]`}
              >
                <WhatsAppIcon className='h-5 w-5 shrink-0' />
                Chat on WhatsApp
              </a>
              <Link href='/catalog' className={`${styles.button} ${styles.secondary} rounded-full`}>
                Browse the catalog
              </Link>
            </div>
            <p className={styles.heroNote}>
              Africa is at the heart of our range. Wholesale enquiries from every market are
              welcome.
            </p>
            <Link href='/markets' className={styles.textLink}>
              Find styles for your market
            </Link>
          </div>
          <div data-hero-image className={styles.lookbook}>
            <div className={styles.lookbookHeading}>
              <span>From our catalog</span>
              <Link href='/catalog?sort=newest'>Explore new styles</Link>
            </div>
            <div className={styles.lookbookGrid}>
              {selected.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className={styles.lookbookItem}
                >
                  <div
                    className={styles.lookbookImage}
                    style={{ aspectRatio: getProductImageAspect(product.image) || 0.5625 }}
                  >
                    <ProductImage
                      src={product.image}
                      alt={`${product.name} — complete catalog image`}
                      priority={index === 0}
                      sizes='(max-width: 639px) calc((100vw - 48px) / 2), (max-width: 1023px) 240px, (max-width: 1439px) 22vw, 270px'
                      objectFit='contain'
                    />
                  </div>
                  <div className={styles.lookbookLabel}>
                    <span>Style {product.image.match(/(\d{7})\./)?.[1] || product.id}</span>
                    <p>{product.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className={styles.proofStrip}>
        <ul
          className={`${styles.container} ${styles.proofGrid}`}
          aria-label='Wholesale buying support'
        >
          {BUYING_SUPPORT.map((item) => (
            <li key={item} className={styles.proofItem}>
              <CheckIcon aria-hidden='true' />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
