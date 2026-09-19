'use client';

import { motion } from 'framer-motion';

/**
 * Infinite horizontal marquee — inspired by trionn.com's scrolling text bands.
 * Renders the children twice side-by-side and translates the track by -50%,
 * so the loop is seamless. Pauses on hover.
 */
export function Marquee({
  children,
  className,
  speed = 40,
  reverse = false,
  pauseOnHover = true
}: {
  children: React.ReactNode;
  className?: string;
  /** Seconds for one full loop (lower = faster). */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
}) {
  return (
    <div className={`group relative flex overflow-hidden ${className ?? ''}`}>
      <motion.div
        className='flex w-max items-center'
        animate={{ x: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity
        }}
        style={{ willChange: 'transform' }}
        data-pausable={pauseOnHover ? '' : undefined}
      >
        {/* Render the content twice for a seamless loop. */}
        <div className='flex items-center group-hover:[animation-play-state:paused]'>
          <Track>{children}</Track>
          <Track aria-hidden>{children}</Track>
        </div>
      </motion.div>
    </div>
  );
}

function Track({ children, ariaHidden }: { children: React.ReactNode; ariaHidden?: boolean }) {
  return (
    <div className='flex items-center gap-8 pr-8' aria-hidden={ariaHidden || undefined}>
      {children}
    </div>
  );
}
