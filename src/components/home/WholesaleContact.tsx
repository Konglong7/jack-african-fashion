import { DeferredMapEmbed } from '@/components/DeferredMapEmbed';
import { WhatsAppIcon } from '@/components/Icons';
import { SocialLinks, WhatsAppContacts } from '@/components/ContactLinks';
import type { SiteContent } from '@/lib/siteContentTypes';
import {
  getSiteLocations,
  siteWhatsAppLink
} from '@/lib/siteContentTypes';
import styles from './homepage.module.css';

export function WholesaleContact({ siteContent }: { siteContent: SiteContent }) {
  return (
    <section className={styles.section} aria-labelledby='home-contact-title'>
      <div className={`${styles.container} ${styles.contactLayout}`}>
        <div>
          <h2 id='home-contact-title' className={`font-display ${styles.sectionHeading}`}>
            Confirm MOQ and request a bulk-price quote
          </h2>
          <p className={styles.sectionDescription}>
            Send the style codes, quantity per style and destination on WhatsApp for a quotation.
            MOQ, current stock, size-color mix and shipping charges are confirmed for your order.
          </p>
          <div className={styles.contactAddress}>
            <strong>Visit our Guangzhou wholesale showrooms</strong>
            {getSiteLocations(siteContent).map((location) => (
              <p key={location.address}>
                <a href={location.mapUrl} target='_blank' rel='noopener noreferrer'>
                  {location.address}
                </a>
              </p>
            ))}
          </div>
          <div className={styles.contactActions}>
            <a
              href={siteWhatsAppLink(siteContent)}
              target='_blank'
              rel='noopener noreferrer'
              className={`${styles.button} ${styles.primary}`}
            >
              <WhatsAppIcon className='h-5 w-5 shrink-0' />
              Chat on WhatsApp
            </a>
            <a
              href={siteContent.locationUrl}
              target='_blank'
              rel='noopener noreferrer'
              className={`${styles.button} ${styles.darkButton}`}
            >
              Open in Google Maps
            </a>
          </div>
          <WhatsAppContacts siteContent={siteContent} className='mt-3 text-[#0B7A3E]' />
          <SocialLinks siteContent={siteContent} className='mt-3' />
        </div>
        <div className='space-y-6'>
          {getSiteLocations(siteContent).map((location) => (
            <div key={location.address} className={styles.map}>
              <h3 className='p-4 font-semibold'>{location.name}</h3>
              <DeferredMapEmbed
                title={`${location.name} location map`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(location.address)}&output=embed`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
