const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^\/api\//i,
      handler: 'NetworkFirst', // Try network, fallback to cache for API
      options: { networkTimeoutSeconds: 10, cacheName: 'api-cache' }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: 'CacheFirst', // Cache images aggressively
      options: { cacheName: 'static-images' }
    }
  ]
});

module.exports = withPWA({
  reactStrictMode: true,
});