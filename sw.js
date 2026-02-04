const CACHE_NAME = 'gestor-fe-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './icon-192.png',
  './icon-512.png'
  // Si agregas CSS o JS externos locales, ponlos aquí.
  // Las fuentes de Google se cachean dinámicamente abajo.
];

// 1. Instalación: Guardar archivos estáticos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activación: Limpiar cachés viejas si actualizas la versión
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. Fetch: Estrategia de Red
self.addEventListener('fetch', (e) => {
  // Ignorar peticiones a la API de Google Apps Script (siempre queremos datos frescos)
  if (e.request.url.includes('script.google.com')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request).then((networkResponse) => {
        // Opcional: Cachear dinámicamente fuentes de Google Fonts si quieres
        return networkResponse;
      });
    })
  );
});
