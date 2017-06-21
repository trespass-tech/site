self.addEventListener('install', e => {
    let timeStamp = Date.now();
    e.waitUntil(
        caches.open('airhorner').then(cache => {
            return cache.addAll([
                `/`,
                `/index.html?timestamp=${timeStamp}`,
                `/styles/main.css?timestamp=${timeStamp}`
            ])
                .then(() => self.skipWaiting());
        })
    )
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, {ignoreSearch: true}).then(response => {
            return response || fetch(event.request);
        })
    );
});