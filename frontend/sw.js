// Service Worker de Pochirocho PWA (Network-first para código y assets cacheados)
const CACHE_NAME = 'pochirocho-pwa-v31';
const ASSETS_TO_CACHE = [
  '/',
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/particles.js',
  './manifest.json',
  './assets/themes/Burbujas.png',
  './assets/themes/Corazones.png',
  './assets/themes/Girasoles.png',
  './assets/themes/Hojas.png',
  './assets/themes/Lluvia.png',
  './assets/themes/Rosas.png',
  // Avatares Amy
  './assets/avatares/Amy/Normal_Amy.png',
  './assets/avatares/Amy/Feliz_Amy.png',
  './assets/avatares/Amy/Asustada_Amy.png',
  './assets/avatares/Amy/Aliviada_Amy.png',
  './assets/avatares/Amy/Menstrual_Amy.png',
  './assets/avatares/Amy/Folicular_Amy.png',
  './assets/avatares/Amy/Ovulatoria_Amy.png',
  './assets/avatares/Amy/Lutea_Amy.png',
  // Avatares Luffy
  './assets/avatares/Luffy/Normal_Luffy.png',
  './assets/avatares/Luffy/Feliz_Luffy.png',
  './assets/avatares/Luffy/Asustado_Luffy.png',
  './assets/avatares/Luffy/Aliviado_Luffy.png',
  './assets/avatares/Luffy/Menstrual_Luffy.png',
  './assets/avatares/Luffy/Folicular_Luffy.png',
  './assets/avatares/Luffy/Ovulatoria_Luffy.png',
  './assets/avatares/Luffy/Lutea_Luffy.png',
  // Avatares MaoMao
  './assets/avatares/MaoMao/Normal_Mao.png',
  './assets/avatares/MaoMao/Feliz_Mao.png',
  './assets/avatares/MaoMao/Asustada_Mao.png',
  './assets/avatares/MaoMao/Aliviada_Mao.png',
  './assets/avatares/MaoMao/Menstrual_Mao.png',
  './assets/avatares/MaoMao/Folicular_Mao.png',
  './assets/avatares/MaoMao/Ovulatoria_Mao.png',
  './assets/avatares/MaoMao/Lutea_Mao.png',
  // Avatares Pipo
  './assets/avatares/Pipo/Normal_Pipo.png',
  './assets/avatares/Pipo/Feliz_Pipo.png',
  './assets/avatares/Pipo/Asustado_Pipo.png',
  './assets/avatares/Pipo/Aliviado_Pipo.png',
  './assets/avatares/Pipo/Menstrual_Pipo.png',
  './assets/avatares/Pipo/Folicular_Pipo.png',
  './assets/avatares/Pipo/Ovulatoria_Pipo.png',
  './assets/avatares/Pipo/Lutea_Pipo.png',
  // Avatares Naveen
  './assets/avatares/Naveen/Normal_Naveen.png',
  './assets/avatares/Naveen/Feliz_Naveen.png',
  './assets/avatares/Naveen/Asustado_Naveen.png',
  './assets/avatares/Naveen/Aliviado_Naveen.png',
  './assets/avatares/Naveen/Menstrual_Naveen.png',
  './assets/avatares/Naveen/Folicular_Naveen.png',
  './assets/avatares/Naveen/Ovulatoria_Naveen.png',
  './assets/avatares/Naveen/Lutea_Naveen.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('PWA: No se pudieron cachear todos los assets iniciales:', err);
      });
    })
  );
  self.skipWaiting();
});

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
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Las peticiones a Google Gemini y APIs externas siempre van por red
  if (event.request.url.includes('generativelanguage.googleapis.com') ||
      event.request.url.includes('spotify.com') ||
      event.request.url.includes('formsubmit.co')) {
    return;
  }

  const url = new URL(event.request.url);
  const isCodeOrDoc = event.request.mode === 'navigate' ||
                      url.pathname.endsWith('.html') ||
                      url.pathname.endsWith('.js') ||
                      url.pathname.endsWith('.css') ||
                      url.pathname === '/' ||
                      url.pathname.endsWith('/');

  if (isCodeOrDoc) {
    // Network-First para código: asegura que los celulares siempre reciban las últimas funciones y fixes
    event.respondWith(
      fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          return cachedResponse || caches.match('./index.html') || caches.match('/') || caches.match('./');
        });
      })
    );
    return;
  }

  // Cache-First para imágenes, audios y assets estáticos pesados
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
