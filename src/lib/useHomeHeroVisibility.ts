'use client';

import { useEffect, useState } from 'react';

export function useHomeHeroVisibility(enabled: boolean) {
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    if (typeof IntersectionObserver === 'undefined') {
      setHeroVisible(false);
      return;
    }
    // Exclude an exiting mobile drawer when returning home through the logo.
    const navigation = document.querySelector('[data-main-navigation]');
    const headerHeight = navigation?.getBoundingClientRect().bottom || 0;
    let currentHero: HTMLElement | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.target === currentHero) setHeroVisible(entry.isIntersecting);
      },
      { rootMargin: `-${headerHeight}px 0px 0px 0px` }
    );
    const observeHero = () => {
      const hero = document.getElementById('home-hero');
      if (hero === currentHero) return;
      observer.disconnect();
      currentHero = hero;
      if (hero) {
        const bounds = hero.getBoundingClientRect();
        setHeroVisible(bounds.bottom > headerHeight && bounds.top < window.innerHeight);
        observer.observe(hero);
      } else {
        setHeroVisible(true);
      }
    };
    // Suspended page content can replace the hero after the surrounding shell mounts.
    const mutations = new MutationObserver(observeHero);
    mutations.observe(document.getElementById('main-content') || document.body, {
      childList: true,
      subtree: true
    });
    observeHero();
    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, [enabled]);

  return heroVisible;
}
