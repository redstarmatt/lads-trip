const CACHE_NAME = 'lads-trip-v17';
const urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    './manifest.json',
    './images/icon-192.png',
    './images/icon-512.png',
    './images/matt.png',
    './images/ken.png',
    './images/chris.png',
    './images/andy.png',
    './images/mark.png',
    './images/boarding_pass.pdf',
    './images/fiorentina_tickets.pdf',
    './images/fiorentina_ken_chris.pdf',
    './images/verona_matt.pdf',
    './images/verona_mark.pdf',
    './images/verona_andy.pdf',
    './images/verona_chris.pdf',
    './images/verona_ken.pdf',
    './images/train_matt.pkpass',
    './images/train_mark.pkpass',
    './images/train_ken.pkpass',
    './images/train_chris.pkpass'
];

// Install event
self.addEventListener('install', event => {
    // Force the new service worker to activate immediately
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.log('Cache install error:', err);
            })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});

// Activate event - clean up old caches and take control immediately
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Take control of all pages immediately
            return self.clients.claim();
        })
    );
});
