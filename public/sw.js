// Service worker de Sistema BRIE. Solo guarda lo ESTÁTICO (estilos, scripts públicos, imágenes, íconos).
// NUNCA guarda /api ni las páginas privadas (cocina, reparto): nada de datos ni de sesión queda en el celular.
const VERSION = 'brie-v2';
const BASICOS = ['/offline.html', '/css/brie.css', '/icons/icon-192.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(BASICOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api')) return;

  // Páginas: siempre de la red (así el servidor verifica la sesión); sin conexión, aviso amigable.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('/offline.html')));
    return;
  }
  // Íconos e imágenes: del caché primero. Estilos y scripts: de la red primero (para no quedar con versiones viejas).
  const estatico = /^\/(css|js|img|icons)\//.test(url.pathname);
  if (!estatico) return;
  const cacheFirst = /^\/(img|icons)\//.test(url.pathname);
  const guardar = (r) => {
    if (r.ok) { const c = r.clone(); caches.open(VERSION).then((x) => x.put(req, c)); }
    return r;
  };
  e.respondWith(
    cacheFirst
      ? caches.match(req).then((hit) => hit || fetch(req).then(guardar))
      : fetch(req).then(guardar).catch(() => caches.match(req))
  );
});