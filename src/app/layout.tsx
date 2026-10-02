import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Analytics } from '@/components/Analytics';
import { RootChrome } from '@/components/RootChrome';
import { getSiteContent } from '@/lib/siteContent';
import { BRAND_ENTITY } from '@/lib/aioContent';
import { isConfiguredSocialLink } from '@/lib/siteContentTypes';
import { getSiteOrigin } from '@/lib/siteUrl';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700']
});

const displayFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['600', '700', '800', '900']
});

const baseUrl = getSiteOrigin();

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
};

export const metadata: Metadata = {
  title: {
    default: "Jack African Fashion | Guangzhou African Women's Clothing Supplier",
    template: '%s | Jack African Fashion'
  },
  description:
    "Jack African Fashion is a Guangzhou-based African women's clothing supplier for boutiques, wholesalers and importers. Ready stock, plus sizes, two piece sets and custom production.",
  keywords: [
    "Guangzhou African women's clothing supplier",
    "African women's fashion wholesale supplier China",
    "women's clothing wholesale Guangzhou",
    'ready stock womenswear wholesale',
    'plus size clothing wholesale supplier',
    'Nigeria Ghana Kenya fashion supplier'
  ],
  authors: [{ name: 'Jack African Fashion' }],
  creator: 'Jack African Fashion',
  publisher: 'Jack African Fashion',
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Jack African Fashion | Guangzhou African Women's Clothing Supplier",
    description:
      "Guangzhou-based women's clothing wholesale supplier serving boutiques, wholesalers and importers across African markets.",
    type: 'website',
    url: baseUrl,
    locale: 'en_US',
    siteName: 'Jack African Fashion',
    images: ['/images/site/social-whatsapp-catalog-banner.webp']
  },
  twitter: {
    card: 'summary_large_image',
    title: "Jack African Fashion | Guangzhou Women's Clothing Supplier",
    description: "Guangzhou women's clothing wholesale for African B2B buyers.",
    images: ['/images/site/social-whatsapp-catalog-banner.webp']
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
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: BRAND_ENTITY.name,
        logo: `${baseUrl}/images/site/logo.png`,
        url: baseUrl,
        description: BRAND_ENTITY.identityStatement,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Yulong Fashion Plaza, No. 229 Guangyuan Xi Road, Yuexiu District',
          addressLocality: 'Guangzhou',
          addressRegion: 'Guangdong',
          addressCountry: 'CN'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: siteContent.whatsappDisplay,
          url: siteContent.whatsappLink,
          contactType: 'sales',
          areaServed: ['Nigeria', 'Ghana', 'Kenya', 'Tanzania', 'South Africa'],
          availableLanguage: ['en']
        },
        areaServed: ['Nigeria', 'Ghana', 'Kenya', 'Tanzania', 'South Africa'].map((name) => ({
          '@type': 'Country',
          name
        })),
        sameAs: [
          siteContent.whatsappLink,
          siteContent.socialLinks.facebook,
          siteContent.socialLinks.tiktok,
          siteContent.socialLinks.instagram
        ].filter((url) => url === siteContent.whatsappLink || isConfiguredSocialLink(url)),
        knowsAbout: [...BRAND_ENTITY.products, ...BRAND_ENTITY.capabilities]
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: BRAND_ENTITY.name,
        description: BRAND_ENTITY.identityStatement,
        publisher: { '@id': `${baseUrl}/#organization` },
        inLanguage: 'en'
      }
    ]
  };

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
