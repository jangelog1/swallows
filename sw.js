const CACHE = 'swallows-v1';
const ASSETS = ['./','index.html','manifest.webmanifest','icon-512.png','logo.gif'];
self.addEventListener('install', e => { self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{})); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys()
  .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(()=>self.clients.claim())); });
/* npb.json is NEVER served from the cache: it is the whole point of the app and a stale copy
   silently shows last week's standings as if they were current. */
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.pathname.endsWith('npb.json')) { e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))); return; }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
