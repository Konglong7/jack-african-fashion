import Link from 'next/link';
import Image from '@/components/ResponsiveImage';
import { getFactoryPhotos } from '@/lib/factoryPhotos';
import { getSiteOrigin } from '@/lib/siteUrl';
import styles from '@/components/home/homepage.module.css';
import galleryStyles from './FactoryGallery.module.css';

export function FactoryGallery({ path, compact = false }: { path: string; compact?: boolean }) {
  const photos = getFactoryPhotos(compact);
  const origin = getSiteOrigin();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${origin}${path === '/' ? '' : path}#factory-workshop`,
    name: 'Inside the Jack Fashion womenswear factory',
    about: { '@id': `${origin}/#organization` },
    image: photos.map((photo) => ({
      '@type': 'ImageObject',
      '@id': `${origin}${photo.src}#image`,
      contentUrl: `${origin}${photo.src}`,
      name: photo.title,
      caption: photo.caption,
      description: photo.alt,
      width: photo.width,
      height: photo.height
    }))
  };
  return (
    <section
      id='factory-workshop'
      className={`${styles.section} ${styles.whiteSection}`}
      aria-labelledby='factory-workshop-title'
    >
      <div className={styles.container}>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
        <h2 id='factory-workshop-title' className={`font-display ${styles.sectionHeading}`}>
          Inside our womenswear factory
        </h2>
        <p className={`${styles.sectionDescription} mb-6`}>
          See our garment production work, from paper patterns and fabric cutting to sewing,
          finishing and packing. Discuss the design, fabric, measurements and quantity for your
          custom order with our Guangzhou team.
        </p>
        <div className={galleryStyles.grid}>
          {photos.map((photo) => (
            <figure key={photo.id} className={galleryStyles.figure}>
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes='(max-width: 767px) calc(100vw - 40px), (max-width: 1319px) calc((100vw - 104px) / 2), 620px'
                className={galleryStyles.photo}
              />
              <figcaption className={galleryStyles.caption}>
                <h3>{photo.title}</h3>
                <p>{photo.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        {compact && (
          <Link href='/about#factory-workshop' className={`${styles.textLink} mt-6`}>
            See the complete factory workflow
          </Link>
        )}
      </div>
    </section>
  );
}
