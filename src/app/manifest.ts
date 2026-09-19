export default function manifest() {
  return {
    name: 'Jack African Fashion',
    short_name: 'Jack Fashion',
    description: "Guangzhou Women's Fashion Wholesale for African Market",
    start_url: '/',
    display: 'standalone',
    background_color: '#faf6f0',
    theme_color: '#d97706',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon'
      },
      {
        src: '/images/site/logo-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/images/site/logo.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
}
