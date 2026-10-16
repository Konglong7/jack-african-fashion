import Link from 'next/link';
import ResponsiveImage from './ResponsiveImage';
import { GARMENT_EXAMPLES } from '@/lib/garmentExamples';
import styles from '@/app/guides/guides.module.css';

export function GarmentExamples({ all = false }: { all?: boolean }) {
  const photos = all ? GARMENT_EXAMPLES : GARMENT_EXAMPLES.slice(0, 2);
  return (
    <section
      className={styles.photoSection}
      aria-labelledby={all ? 'all-garment-examples' : 'garment-examples'}
    >
      <div className={styles.container}>
        <h2 id={all ? 'all-garment-examples' : 'garment-examples'} className='font-display'>
          A closer look at the garments
        </h2>
        <p className={styles.photoIntro}>
          Garment display photos supplied by Jack Fashion. Use them to discuss the cut, details and
          colors you need. Confirm current stock and the specifications of your selected garment
          before ordering.
        </p>
        <div className={styles.photos}>
          {photos.map((photo) => (
            <figure key={photo.slug}>
              <a
                href={photo.image}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={'Open full photo: ' + photo.title}
              >
                <ResponsiveImage
                  src={photo.image}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes='(max-width: 639px) calc(100vw - 40px), (max-width: 1239px) calc((100vw - 68px) / 2), 582px'
                />
              </a>
              <figcaption>
                <strong>{photo.title}</strong>
                {photo.detail}
              </figcaption>
            </figure>
          ))}
        </div>
        {!all && (
          <div className={styles.links}>
            <Link href='/guides/photos-order-confirmation'>
              How to confirm the goods from a photo →
            </Link>
            <Link href='/guides'>Explore the buyer guides →</Link>
          </div>
        )}
      </div>
    </section>
  );
}
