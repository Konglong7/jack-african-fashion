import Image from './ResponsiveImage';
import type { CSSProperties } from 'react';

type SiteImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  fit?: 'cover' | 'contain';
  position?: CSSProperties['objectPosition'];
  useBlurBackground?: boolean;
};

export function SiteImage({
  src,
  alt,
  className = '',
  imageClassName = '',
  sizes = '100vw',
  priority = false,
  fit = 'cover',
  position = 'center',
  useBlurBackground = false
}: SiteImageProps) {
  const positionClass = /(?:^|\s)(?:absolute|fixed|relative|sticky|static)(?:\s|$)/.test(className) ? '' : 'relative';
  const imageStyle: CSSProperties = { objectFit: fit, objectPosition: position };

  return (
    <div className={`${positionClass} bg-brand-sand/30 overflow-hidden ${className}`}>
      {useBlurBackground && (
        <>
          <Image
            src={src}
            alt=''
            aria-hidden='true'
            fill
            priority={priority}
            sizes={sizes}
            className='scale-110 object-cover opacity-45 blur-xl'
            style={{ objectPosition: position }}
          />
          <div className='absolute inset-0 bg-black/10' />
        </>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`z-10 ${imageClassName}`}
        style={imageStyle}
      />
    </div>
  );
}
