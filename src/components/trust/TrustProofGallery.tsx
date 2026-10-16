import { WhatsAppIcon } from '@/components/Icons';
import { BUYING_CHECKS } from '@/components/home/SupplierSupport';
import styles from '@/components/home/homepage.module.css';

// Generated showroom, measurement and freight pictures cannot serve as evidence.
export type ProofCategory = 'all' | 'showroom' | 'measurement' | 'quality' | 'logistics';
export function TrustProofGallery({ whatsappUrl }: { whatsappUrl?: string }) {
  return (
    <section className={`${styles.section} ${styles.whiteSection}`} id='buying-verification'>
      <div className={styles.container}>
        <h2 className={`font-display ${styles.sectionHeading}`}>Verify the goods for your order</h2>
        <p className={styles.sectionDescription}>
          Catalog styling helps you choose a design. Current garment photos, measured specifications
          and written order terms help you confirm what you are buying.
        </p>
        <div className={`${styles.specList} mt-6`}>
          {BUYING_CHECKS.map((item) => (
            <div key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={`${styles.button} ${styles.primary} mt-6`}
          >
            <WhatsAppIcon className='h-5 w-5' />
            Request current stock details
          </a>
        )}
      </div>
    </section>
  );
}
