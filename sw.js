// Service worker mínimo: solo hace falta que exista y responda para que Android
// considere la app "instalable" como PWA. Sirve los archivos desde la red y, si no hay
// conexión, intenta devolver lo último que haya quedado en caché.
// IMPORTANTE: el fetch de red se hace con {cache:'no-store'} para saltar el caché
// HTTP del navegador (GitHub Pages manda cache-control:max-age=600) y así, cada vez
// que haya conexión, se traiga siempre la versión más nueva publicada, no una copia
// vieja guardada en el teléfono.
const CACHE = 'pagos-v2';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then(res => {
        const copia = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
