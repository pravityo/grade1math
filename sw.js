const V = 'grade1math-v3';
const FILES = ['./', 'index.html', 'css/style.css', 'js/app.js', 'js/render.js', 'js/illustrations.js', 'js/data/pics.js', 'js/data/gens.js', 'js/gen.js', 'manifest.webmanifest', 'icon-180.png', 'icon-512.png']
  .concat([1, 2, 3, 4, 5, 6, 7, 8].map(i => `js/data/week${i}.js`));
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(ch => ch.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
