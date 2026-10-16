'use client';
import Link from 'next/link';
import { SocialLinks, WhatsAppContacts } from '@/components/ContactLinks';
import { WhatsAppIcon } from '@/components/Icons';
import { buildFooterLinks } from '@/lib/siteNavigation';
import type { SiteContent } from '@/lib/siteContentTypes';
import {
  getSiteLocations,
  siteWhatsAppLink
} from '@/lib/siteContentTypes';
import styles from '@/components/home/homepage.module.css';

export function Footer({
  siteContent
}: {
  siteContent: SiteContent;
  variant?: 'default' | 'home';
}) {
  const whatsappLink = siteWhatsAppLink(siteContent);
  const links = buildFooterLinks(siteContent.categories, whatsappLink);
  return (
    <footer className={styles.homeFooter} role='contentinfo'>
      <div className={styles.container}>
        <div className={styles.footerBrand}>
          <h2 className='font-display'>{siteContent.name}</h2>
          <p>
            Factory-direct women’s clothing from Guangzhou. Own factory, ready-stock styles and
            custom production for boutiques, wholesalers and importers worldwide.
          </p>
          <a href={whatsappLink} target='_blank' rel='noopener noreferrer'
            className={`${styles.button} ${styles.primary} mt-5`}>
            <WhatsAppIcon className='h-5 w-5' />Chat on WhatsApp
          </a>
          <WhatsAppContacts siteContent={siteContent} className='mt-2 text-white' />
          <address>
            {getSiteLocations(siteContent).map((location) => (
              <div key={location.address}>
                <a href={location.mapUrl} target='_blank' rel='noopener noreferrer'>
                  {location.address}
                </a>
              </div>
            ))}
          </address>
        </div>
        <div className={styles.footerGrid}>
          {[
            { title: 'Jack Fashion', links: links.company },
            { title: 'Wholesale', links: links.products },
            { title: 'Buying markets', links: links.markets },
            { title: 'Buyer support', links: links.help }
          ].map((column) => (
            <div key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={link.href === whatsappLink ? false : undefined}
                      target={link.href === whatsappLink ? '_blank' : undefined}
                      rel={link.href === whatsappLink ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <SocialLinks siteContent={siteContent} dark className='mt-5' />
        <div className={styles.footerBottom}>
          <p>
            © {new Date().getFullYear()} {siteContent.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
