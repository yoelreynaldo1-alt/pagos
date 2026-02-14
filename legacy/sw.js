const CACHE_NAME = 'weekpay-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install Event: Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    // Para el HTML principal, intenta red primero, si falla, usa caché
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});    })
  );
  self.clients.claim();
});

// Fetch Event: Stale-while-revalidate strategy for most things, or Cache-First
// The prompt asks for "Offline-first". This usually means checking cache first.
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests like browser extensions or specific protocols if necessary,
  // but we want to cache CDNs.
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Check if valid response
        if (!networkResponse || networkResponse.status !== 200) { //  || networkResponse.type !== 'basic' we allow cors for CDNs
          return networkResponse;
        }

        // Cache the new resource (runtime caching)
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Optional: Return a fallback offline page if everything fails
        // For this single-file app, index.html is likely already cached.
      });
    })
  );
});
