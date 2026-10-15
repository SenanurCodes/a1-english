/* ============================================================
   PatiLingo v2.6 - Service Worker (Offline First Caching)
   ============================================================ */

const CACHE_NAME = 'patilingo-cache-v2.6.0';

const PRECACHE_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/favicon.png',
  'css/style.css?v=2.2.3',
  'js/theme-init.js',
  'js/data.js?v=2.6.0',
  'js/logic.js?v=2.6.0',
  'js/storage.js?v=2.6.0',
  'js/firebase.js?v=2.6.0',
  'js/utils.js?v=2.6.0',
  'js/ai.js?v=2.6.0',
  'js/exercises.js?v=2.6.0',
  'js/app.js?v=2.6.0'
];

// Install: Core dosyaları önbelleğe al
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('SW Precache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Eski sürümleri temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Ağ öncelikli (Network First, internetsizken önbellek - Offline Destek)
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Sadece GET istekleri önbelleğe alınır
  if (req.method !== 'GET') return;

  // Firebase Realtime DB, Gemini AI veya harici API isteklerini doğrudan ağa bırak
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis.com/v1') || url.hostname.includes('restful-api.dev')) {
    return;
  }

  event.respondWith(
    fetch(req).then(networkResponse => {
      if (networkResponse && networkResponse.status === 200) {
        const resClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
      }
      return networkResponse;
    }).catch(() => {
      return caches.match(req);
    })
  );
});
