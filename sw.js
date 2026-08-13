/* Arise Kage — Service Worker
   Tiny companion file for offline caching. Browsers require service worker
   scripts to be a same-origin http(s) file, so it can't be inlined into
   index.html — this is the one unavoidable second file. Keep it next to
   index.html when you deploy (e.g. GitHub Pages repo root or /docs folder). */
const CACHE = 'arisekage-v5';
const CORE_ASSETS = ['./', './index.html'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE_ASSETS).catch(()=>{})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // don't try to cache cross-origin (e.g. Firebase CDN)

  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
