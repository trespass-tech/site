self.addEventListener('install', event => {
    console.log('Installing offline content caching V2');
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('Activating offline content caching V2');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    console.log('Wiping cache: ' + cacheName)
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open('offline-content').then(function(cache) {
            return fetch(event.request).then(function(response) {
                cache.put(event.request, response.clone());
                return response;
            }).catch(function() {
                return caches.match(event.request);
            })
        })
    );
});