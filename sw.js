// Service worker mínimo: solo hace falta que exista y responda para que Android
// considere la app "instalable" como PWA. Sirve los archivos desde la red y, si no hay
// conexión, intenta devolver lo último que haya quedado en caché.
const CACHE = 'pagos-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copia = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
