let CACHE_NAME = 'restaurant-cache';
var urlsToCache = [
    '/',
    '/css/styles.css',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/js/dbhelper.js'
];
// First I need to install Service worker
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

//Secondly, I need to activate the SW (Mainly clean up old SW jobs)
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then(function (cacheNames) {
                return Promise.all(
                    cacheNames.filter(function (cacheName) {
                        return cacheName.startsWith('restaurant-') &&
                            cacheName != CACHE_NAME;
                    }).map(function (cacheName) {
                        return caches.delete(cacheName);
                    })
                );
            })
    );
});

//Cache all fetch requests 
self.addEventListener('fetch', function (event) {
    console.log('Handling fetch event for', event.request.url);

    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                console.log('found a match');
                return response;
            }
            //no response in the chache =>go and fetch
            return fetch(event.request).then(function (response) {
                // got the response from network
                console.log('go and fetch');
                return response;
            }).catch(function (error) {
                // cannot fetch
                throw error;
            });
        })
    );
}); 