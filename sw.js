/* ============================================================
   PatiLingo - Service Worker (Offline First Caching)
   APP_VERSION tek kaynaktır: scripts/bump-version.js bu satırı,
   index.html'deki ?v= parametrelerini ve aşağıdaki listeyi birlikte günceller.
   ============================================================ */

const APP_VERSION = '2.9.17';
const CACHE_NAME = 'patilingo-cache-v' + APP_VERSION;

const PRECACHE_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/favicon.png',
  'css/style.css?v=2.9.17',
  'js/theme-init.js?v=2.9.17',
  'js/data.js?v=2.9.17',
  'js/logic.js?v=2.9.17',
  'js/storage.js?v=2.9.17',
  'js/firebase.js?v=2.9.17',
  'js/icons.js?v=2.9.17',
  'js/utils.js?v=2.9.17',
  'js/ai.js?v=2.9.17',
  'js/exercises.js?v=2.9.17',
  'js/app.js?v=2.9.17'
];

// Install: Core dosyaları önbelleğe al ve beklemeden anında aktif et
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('SW Precache warning:', err);
      });
    })
  );
});

// Sayfadan gelen "şimdi güncelle" isteği
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
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

  // Firebase, Gemini AI veya harici API isteklerini doğrudan ağa bırak
  if (url.hostname.includes('firebase') ||
      url.hostname === 'generativelanguage.googleapis.com' ||
      url.hostname.includes('restful-api.dev')) {
    return;
  }

  // Kendi dosyalarımızda tarayıcının HTTP önbelleğini atla (bayat JS/CSS gelmesin)
  const sameOrigin = url.origin === self.location.origin;
  const netReq = sameOrigin ? new Request(req, { cache: 'no-cache' }) : req;

  event.respondWith(
    fetch(netReq).then(networkResponse => {
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
