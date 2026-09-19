import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Analytics } from '@/components/Analytics';
import { RootChrome } from '@/components/RootChrome';
import { getSiteContent } from '@/lib/siteContent';

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
};

export const metadata: Metadata = {
  title: {
    default: "Jack African Fashion | Guangzhou Women's Fashion Wholesale",
    template: '%s | Jack African Fashion'
  },
  description:
    "Guangzhou women's fashion wholesale supplier for African boutiques, importers and distributors. Ready stock, plus size dresses, pleated styles, two piece sets and custom orders.",
  keywords:
    'African women fashion wholesale, Guangzhou women clothing supplier, plus size dresses wholesale, African market dresses, two piece sets wholesale, China clothing supplier, Nigeria fashion, Ghana wholesale, Kenya boutique',
  authors: [{ name: 'Jack African Fashion' }],
  creator: 'Jack African Fashion',
  publisher: 'Jack African Fashion',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Jack African Fashion | Guangzhou Women's Fashion Wholesale",
    description:
      "Guangzhou women's fashion wholesale supplier for African boutiques, importers and distributors.",
    type: 'website',
    locale: 'en_US',
    siteName: 'Jack African Fashion'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jack African Fashion',
    description: "Guangzhou women's fashion wholesale for African market."
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/site/logo-192.png', type: 'image/png', sizes: '192x192' }
    ],
    apple: '/apple-touch-icon.png'
  },
  manifest: '/manifest.webmanifest'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteContent = await getSiteContent();

  return (
    <html lang='en'>
      <head>
        {/* Preconnect to WhatsApp for faster external link loading */}
        <link rel='preconnect' href='https://wa.me' />
        {/* Preconnect to common CDN domains if using external images */}
        <link rel='dns-prefetch' href='https://wa.me' />
      </head>
      <body className='flex min-h-screen flex-col'>
        <RootChrome siteContent={siteContent}>{children}</RootChrome>
        <Analytics />
      </body>
    </html>
  );
}
