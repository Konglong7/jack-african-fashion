'use client';

import {
  motion,
  useInView,
  useReducedMotion,
  type Variants
} from 'framer-motion';
import { useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  Variants                                                           */
/* ------------------------------------------------------------------ */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

/** Stagger container — children fade up in sequence. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 }
  }
};

/** Fast stagger for tighter grids (product cards). */
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 }
  }
};

/* ------------------------------------------------------------------ */
/*  <Reveal> — single element fade-up on scroll into view             */
/* ------------------------------------------------------------------ */

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  once = true
}: RevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-80px' });
  const prefersReduced = useReducedMotion();
  const hiddenY = prefersReduced ? 0 : y;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial='hidden'
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: hiddenY },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  <StaggerGroup> + <StaggerItem>                                     */
/* ------------------------------------------------------------------ */

export function StaggerGroup({
  children,
  className,
  fast = false,
  once = true
}: {
  children: React.ReactNode;
  className?: string;
  fast?: boolean;
  once?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial='hidden'
      animate={inView ? 'visible' : 'hidden'}
      variants={fast ? staggerFast : staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
