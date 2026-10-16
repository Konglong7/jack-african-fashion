export default function manifest() {
  return {
    name: 'Jack Fashion',
    short_name: 'Jack Fashion',
    description: "Jack Fashion — Women's clothing wholesale from Guangzhou",
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f6f7',
    theme_color: '#112b47',
    icons: [
      {
        src: '/images/site/jack-fashion-logo-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/images/site/jack-fashion-logo-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
}
