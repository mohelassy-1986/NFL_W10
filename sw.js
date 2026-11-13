const CACHE_NAME = 'nfl-cairo-hub-v5';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// Install: Cache core app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Network-first for ESPN API (with offline cache fallback), Cache-first for static assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.hostname.includes('espn.com')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
```eof

I've generated the updated service worker file. Save this as `sw.js` alongside your `index.html` file to keep your offline caching fully synchronized with the new narrative insights!
