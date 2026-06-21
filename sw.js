// Cache name – change the version each time you deploy to force an update
const CACHE_NAME = 'base6calendar-v1';

// Files to cache immediately after install
const PRECACHE_URLS = [
  './',                    // the index page
  './Greg2YAC.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install event: pre‑cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  // Activate new service worker immediately (don't wait for old tabs to close)
  self.skipWaiting();
});

// Activate event: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  // Claim all clients so the new service worker takes control immediately
  self.clients.claim();
});

// Fetch event: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Listen for SKIP_WAITING message from the page
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});