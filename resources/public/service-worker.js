// Define a cache name
const CACHE_NAME = 'gloomhaven-storyline-cache-v1';

// List of URLs to cache
const URLS_TO_CACHE = [
    '/',
    '/tracker/#/story',
    '/js/app.js',
    '/js/resources_js_pages_Achievements_vue.js',
    '/js/resources_js_pages_Buildings_vue.js',
    '/js/resources_js_pages_Campaigns_vue.js',
    '/js/resources_js_pages_Characters_vue.js',
    '/js/resources_js_pages_Info_vue.js',
    '/js/resources_js_pages_Items_vue.js',
    '/js/resources_js_pages_Login_vue.js',
    '/js/resources_js_pages_Map_vue.js',
    '/js/resources_js_pages_Party_vue.js',
    '/js/resources_js_pages_Scenarios_vue.js',
    '/js/resources_js_pages_Settings_vue.js',
    '/js/resources_js_pages_Shared_vue.js',
    '/js/resources_js_pages_Story_vue.js',
    '/svg/storylines/cs.svg',
    '/svg/storylines/fc.svg',
    '/svg/storylines/gh.svg',
    '/svg/storylines/fh.svg',
    '/svg/storylines/jotl.svg',
    '/css/app.css',
    '/css/theme.css',
    '/fonts/PirataOne-Regular.woff2',
    '/fonts/Nyala-Regular.woff2',
    '/fonts/Moyenage.woff2',
    '/fonts/Material-Icons-Fallback.woff2',
    '/fonts/ArialMT.woff2',
    'android-chrome-72x72.png',
    'apple-touch-icon.png'
];

// Install event: Cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// Fetch event: Serve cached resources
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return the response from the cache
                if (response) {
                    return response;
                }
                // Not in cache - fetch from network
                return fetch(event.request).then(
                    networkResponse => {
                        // Check if we received a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clone the response
                        const responseToCache = networkResponse.clone();

                        // Open cache and store the response
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                );
            })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
