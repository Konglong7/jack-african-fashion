import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Analytics } from '@/components/Analytics';
import { RootChrome } from '@/components/RootChrome';
import { getSiteContent } from '@/lib/siteContent';
import { getSiteOrigin } from '@/lib/siteUrl';
import { buildOrganizationJsonLd } from '@/lib/organizationJsonLd';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jack-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700']
});

const displayFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-jack-display',
  display: 'swap',
  weight: ['600', '700', '800', '900']
});

const baseUrl = getSiteOrigin();

export const viewport: Viewport = {
  themeColor: '#112b47',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
};

export const metadata: Metadata = {
  title: {
    default: "Jack Fashion | Women's Clothing Wholesale from Guangzhou",
    template: '%s | Jack Fashion'
  },
  description:
    'Jack Fashion supplies dresses, matching sets and plus-size womenswear from Guangzhou for boutiques, wholesalers and importers worldwide. Discuss stock and prices on WhatsApp.',
  keywords: [
    "Guangzhou African women's clothing supplier",
    "African women's fashion wholesale supplier China",
    "women's clothing wholesale Guangzhou",
    'ready stock womenswear wholesale',
    'plus size clothing wholesale supplier',
    'international womenswear wholesale supplier',
    'wholesale dresses and matching sets'
  ],
  authors: [{ name: 'Jack Fashion' }],
  creator: 'Jack Fashion',
  publisher: 'Jack Fashion',
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Jack Fashion | Women's Clothing Wholesale from Guangzhou",
    description:
      "Guangzhou women's clothing wholesale for boutiques, wholesalers and importers worldwide.",
    type: 'website',
    url: baseUrl,
    locale: 'en_US',
    siteName: 'Jack Fashion',
    images: ['/images/site/jack-fashion-social.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: "Jack Fashion | Guangzhou Women's Clothing Supplier",
    description: "Guangzhou women's clothing wholesale for international B2B buyers.",
    images: ['/images/site/jack-fashion-social.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/images/site/jack-fashion-logo-192.png', type: 'image/png', sizes: '192x192' }
    ],
    apple: '/images/site/jack-fashion-logo-192.png'
  },
  manifest: '/manifest.webmanifest'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteContent = await getSiteContent();
  const organizationJsonLd = buildOrganizationJsonLd(siteContent, baseUrl);

  return (
    <html lang='en' className={`${sansFont.variable} ${displayFont.variable}`}>
      <head>
        {/* Preconnect to WhatsApp for faster external link loading */}
        <link rel='preconnect' href='https://wa.me' />
        {/* Preconnect to common CDN domains if using external images */}
        <link rel='dns-prefetch' href='https://wa.me' />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c')
          }}
        />
      </head>
      <body className='flex min-h-screen flex-col'>
        <RootChrome siteContent={siteContent}>{children}</RootChrome>
        <Analytics />
      </body>
    </html>
  );
}
