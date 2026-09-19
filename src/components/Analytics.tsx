'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { resolveAttribution } from '@/lib/analyticsAttribution';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const attributionKey = 'jack_analytics_attribution';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const pathname = usePathname();
  const lastTrackedPath = useRef('');

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    const path = pathname;
    if (lastTrackedPath.current === path) return;
    lastTrackedPath.current = path;

    sendLocalEvent('page_view', path);

    if (!measurementId || !window.gtag) return;
    window.gtag('config', measurementId, {
      page_path: path
    });
  }, [pathname]);

  useEffect(() => {
    function trackWhatsAppClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest('a[href^="https://wa.me/"]');
      if (!link) return;

      sendLocalEvent('whatsapp_click', window.location.pathname);

      if (!measurementId || !window.gtag) return;
      window.gtag('event', 'whatsapp_click', {
        link_text: link.textContent?.trim() || 'WhatsApp',
        link_url: (link as HTMLAnchorElement).href,
        page_path: window.location.pathname
      });
    }

    document.addEventListener('click', trackWhatsAppClick);
    return () => document.removeEventListener('click', trackWhatsAppClick);
  }, []);

  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy='afterInteractive'
      />
      <Script id='ga4-init' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}

function sendLocalEvent(event: 'page_view' | 'whatsapp_click', path: string) {
  let stored: string | null = null;
  try {
    stored = sessionStorage.getItem(attributionKey);
  } catch {}
  const attribution = resolveAttribution(window.location.search, stored);
  if (attribution.serialized) {
    try {
      sessionStorage.setItem(attributionKey, attribution.serialized);
    } catch {}
  }

  const payload = JSON.stringify({
    event,
    path,
    source: attribution.source,
    campaign: attribution.campaign,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    referrer: document.referrer
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', new Blob([payload], { type: 'application/json' }));
    return;
  }

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true
  }).catch(() => {});
}
