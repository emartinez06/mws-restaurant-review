//Some parts of this code are from Google documentation
//URL: https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker

//Let's cache all necessary files (JS, HTML, CSS, Images, Maps, Data)
let files = [
    // API URL
    //'http://localhost:1337/restaurants',
    // Files and root
    '/',
    'restaurant.html',
    'css/styles.css',
    'manifest.json',
    'img/1-small.jpg',
    'img/2-small.jpg',
    'img/3-small.jpg',
    'img/4-small.jpg',
    'img/5-small.jpg',
    'img/6-small.jpg',
    'img/7-small.jpg',
    'img/8-small.jpg',
    'img/9-small.jpg',
    'img/10-small.jpg',
    'img/1-medium.jpg',
    'img/2-medium.jpg',
    'img/3-medium.jpg',
    'img/4-medium.jpg',
    'img/5-medium.jpg',
    'img/6-medium.jpg',
    'img/7-medium.jpg',
    'img/8-medium.jpg',
    'img/9-medium.jpg',
    'img/10-medium.jpg',
    'img/1-large.jpg',
    'img/2-large.jpg',
    'img/3-large.jpg',
    'img/4-large.jpg',
    'img/5-large.jpg',
    'img/6-large.jpg',
    'img/7-large.jpg',
    'img/8-large.jpg',
    'img/9-large.jpg',
    'img/10-large.jpg',
    'img/bell-icon-32.png',
    'img/bell-icon-256.png',
    'img/bell-icon-512.png',
    'js/idb.js',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
    'sw.js'
];
let cacheName = 'rest-app';

//Install the service worker and open the cache
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
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

//Fetch files and save them on storage
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


