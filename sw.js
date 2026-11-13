// NFL Cairo Auto Hub — service worker
const CACHE = 'nfl-cairo-v2';
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Never cache ESPN API — always network, but fall back gracefully
  if (req.url.includes('site.api.espn.com')) {
    event.respondWith(
      fetch(req).catch(() => new Response(JSON.stringify({ events: [] }), {
        headers: { 'Content-Type': 'application/json' }
      }))
    );
    return;
  }

  // Cache-first for shell assets
  if (req.method === 'GET' && req.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        }).catch(() => caches.match('./offline.html'));
      })
    );
    return;
  }

  // Default: network
  event.respondWith(fetch(req).catch(() => caches.match('./offline.html')));
});

// Allow page to request SW update skip
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
