import { DeferredMapEmbed } from '@/components/DeferredMapEmbed';
import { WhatsAppIcon } from '@/components/Icons';
import type { SiteContent } from '@/lib/siteContentTypes';
import { isConfiguredSocialLink, siteWhatsAppLink } from '@/lib/siteContentTypes';
import styles from './homepage.module.css';

export function WholesaleContact({ siteContent }: { siteContent: SiteContent }) {
  const socialLinks = [
    { name: 'Facebook', href: siteContent.socialLinks.facebook },
    { name: 'Instagram', href: siteContent.socialLinks.instagram },
    { name: 'TikTok', href: siteContent.socialLinks.tiktok }
  ].filter((link) => isConfiguredSocialLink(link.href));
  return (
    <section className={styles.section} aria-labelledby='home-contact-title'>
      <div className={`${styles.container} ${styles.contactLayout}`}>
        <div>
          <h2 id='home-contact-title' className={`font-display ${styles.sectionHeading}`}>
            Find the right styles for your next order
          </h2>
          <p className={styles.sectionDescription}>
            Ask for current stock, available sizes and colors, wholesale prices and shipping
            options.
          </p>
          <div className={styles.contactAddress}>
            <strong>Visit our Guangzhou showroom</strong>
            <p>{siteContent.location}</p>
          </div>
          <div className={styles.contactActions}>
            <a
              href={siteWhatsAppLink(siteContent)}
              target='_blank'
              rel='noopener noreferrer'
              className={`${styles.button} ${styles.primary}`}
            >
              <WhatsAppIcon className='h-5 w-5 shrink-0' />
              Talk Stock on WhatsApp
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
          <p className='mt-4 text-sm text-[#453D36]'>WhatsApp: {siteContent.whatsappDisplay}</p>
          {socialLinks.length > 0 && (
            <div className={styles.linkList}>
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.textLink}
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className={styles.map}>
          <DeferredMapEmbed
            title='Yulong Fashion Plaza location map'
            src='https://www.google.com/maps?q=Yulong%20Fashion%20Plaza%2C%20Guangzhou&output=embed'
          />
        </div>
      </div>
    </section>
  );
}
