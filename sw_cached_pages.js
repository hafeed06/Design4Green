const cacheName = "v1";

const cacheAssets = ['./index.html','./data.js', './main.js'];

self.addEventListener('install', (event)=>{
    console.log("Service worker Installed")
    event.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log("Service worker: Caching files")
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
})

// Call activate event
self.addEventListener('activate', (event)=>{
    console.log("Activate function working")
    // Remove unwanted caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    // Delete old cache
                    if (cache !== cacheName){
                        console.log('Service worker: Clearing old cache data')
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

// call fetch event to load website even if we are offline
self.addEventListener('fetch', event => {
    console.log("Service worker: Fetching data");
    // Check if the live site is available otherwise it loads the offline site
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    )
})