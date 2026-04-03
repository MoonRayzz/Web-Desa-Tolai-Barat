const CACHE_NAME = 'tolai-barat-cache-v1';

// Saat service worker diinstal, cache halaman utama
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Strategi: Stale-While-Revalidate (Simpan cache untuk akses offline)
self.addEventListener('fetch', (event) => {
  // Hanya proses metode GET (jangan cache POST seperti form upload)
  if (event.request.method !== 'GET') return;
  // Jangan cache request ke Firebase Firestore/Auth
  if (event.request.url.includes('firestore.googleapis.com')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Jika respon sukses, simpan salinannya ke cache untuk offline nanti
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Jika gagal fetch (misal offline), kembalikan cache jika ada
        return cachedResponse;
      });

      // Kembalikan cache secepatnya jika ada, sambil memperbarui data di background
      return cachedResponse || fetchPromise;
    })
  );
});