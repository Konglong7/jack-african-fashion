import Link from 'next/link';
import ResponsiveImage from '@/components/ResponsiveImage';
import { WhatsAppIcon } from '@/components/Icons';
import { SCENE_ILLUSTRATIONS } from '@/lib/sceneIllustrations';
import homeStyles from '@/components/home/homepage.module.css';
import styles from './BuyingIllustrations.module.css';

export function BuyingIllustrations({
  whatsAppHref,
  compact = false
}: {
  whatsAppHref: string;
  compact?: boolean;
}) {
  const scenes = compact
    ? SCENE_ILLUSTRATIONS.filter(({ id }) => id === 'measurement' || id === 'packing')
    : SCENE_ILLUSTRATIONS;
  const headingId = compact ? 'buying-illustrations-preview-title' : 'buying-illustrations-title';

  return (
    <section
      id={compact ? undefined : 'buying-illustrations'}
      className={styles.section}
      aria-labelledby={headingId}
      data-scene-illustrations={compact ? 'preview' : 'complete'}
    >
      <div className={styles.container}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Visual buying guide</p>
          <h2 id={headingId} className='font-display'>
            {compact ? 'Before you place a wholesale order' : 'See what to confirm for your order'}
          </h2>
          <p>
            Confirm the actual garment, its measurements and your packing requirements before
            ordering. Use these illustrations to prepare the details to send Jack on WhatsApp.
          </p>
        </div>
        <div className={styles.gallery}>
          {scenes.map((scene) => (
            <figure key={scene.id} className={styles.figure} data-scene-id={scene.id}>
              <div className={styles.imageFrame}>
                <ResponsiveImage
                  src={scene.image}
                  alt={scene.alt}
                  width={scene.width}
                  height={scene.height}
                  loading='lazy'
                  sizes='(max-width: 639px) calc(100vw - 40px), (max-width: 1239px) calc((100vw - 68px) / 2), 586px'
                  className={styles.image}
                />
              </div>
              <figcaption className={styles.caption}>
                <h3>{scene.title}</h3>
                <p>{scene.description}</p>
                <Link href={scene.guideHref}>
                  {scene.guideLabel} <span aria-hidden='true'>→</span>
                </Link>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className={styles.contact}>
          <div>
            <h3>Ready to discuss your shortlist?</h3>
            <p>Send Jack the product codes, quantities and destination on WhatsApp.</p>
          </div>
          <div className={styles.actions}>
            <a
              href={whatsAppHref}
              target='_blank'
              rel='noopener noreferrer'
              data-cta-location={
                compact ? 'buying-illustrations-home' : 'buying-illustrations-about'
              }
              className={`${homeStyles.button} ${homeStyles.primary}`}
            >
              <WhatsAppIcon className='h-5 w-5' />
              Discuss your order
            </a>
            <Link
              href={compact ? '/about#buying-illustrations' : '/guides'}
              className={styles.moreLink}
            >
              {compact ? 'See all buying steps' : 'Browse the buying guides'}{' '}
              <span aria-hidden='true'>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
