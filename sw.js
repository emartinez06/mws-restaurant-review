//Some parts of this code are from Google documentation
//URL: https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker

//Let's cache all necessary files (JS, HTML, CSS, Images, Maps, Data)
let files = [
    //'data/restaurants.json',
    'css/styles.css',
    'favicon.ico',
    'index.html',
    'restaurant.html',
    'sw.js',
    //JS folder
    '/js/',
    //Images folder
    '/img/'
    // 'img/Busy_Restaurant.jpg',
    // 'img/Empty_Restaurant.jpg',
    // 'img/Outdoor_sign.jpg',
    // 'img/Outside_Burger_Restaurant.jpg',
    // 'img/Outside_Restaurant.jpg',
    // 'img/People_Eating.jpg',
    // 'img/People_sitting_Restaurant.jpg',
    // 'img/Pizza.jpg',
    // 'img/Round_table_restaurant.jpg',
    // 'img/Table_with_Grill.jpg',
];
let cacheName = 'rest-app';
self.addEventListener('install', function(event) {
    console.log('[ServiceWorker] Installing');
    self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(files);
        }).catch(function(err) {
            console.log('Error on installing: ' + err);
        })
    )
});

//Activate and refresh service worker
self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activated');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key != cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

//ToDo: Work in a solution to cache Google Maps
self.addEventListener('fetch', function(event) {
    console.log('[ServiceWorker] Fetching files');
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request).then(function(res) {
                    return caches.open(cacheName)
                        .then(function(cache) {

                            //save the response for future
                            cache.put(event.request.url, res.clone());
                            //return the cached data
                            return res;
                        })
                }).catch(function(err) {
                    console.log('Error on fetch: ' + err);
                });
            })
    );
});

