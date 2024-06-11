const CACHE_KEY = 'open-static-data'

const FILES = [
    '/favicon.ico',
    '/loading.gif',
    '/manifest.json',
    '/profile/account.png',
    '/profile/geo.png',
    '/profile/security.png',
    '/profile/collections.png'
]

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_KEY).then(cache => cache.addAll(FILES))
    )
})

self.addEventListener('activate', async (e) => {
    console.log('Service Worker is activated...')

    let keys = await caches.keys()

    Promise.all(keys.map(async (name) => {
        if (name !== CACHE_KEY) {
            await caches.delete(name)
        }
    }))
})

self.addEventListener('fetch', async (e) => {
    e.respondWith(() => 
        new Promise((resolve, reject) => {
            fetch(e.request).then(res => {
                const clone = res.clone()

                caches.open(CACHE_KEY).then(cache => cache.put(e.request, clone))

                resolve(res)
            })
        }).catch(() => {
            caches.open(CACHE_KEY).then(cache => cache.match(e.request).then(data => data || Promise.reject('no-match')))
        })
    )
})