const CACHE_NAME = "medicandov1"

const urlsToCache = ["/", "/manifest.json"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    })
  )
})

function cacheFirst(request) {
  return caches.match(request).then((response) => {
    if (response) return response
    return fetch(request).then((response) => {
      if (!response || response.status !== 200 || response.type !== "basic") return response
      const cloned = response.clone()
      caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned))
      return response
    })
  })
}

function networkFirst(request) {
  return fetch(request).then((response) => {
    if (response && response.status === 200 && response.type === "basic") {
      const cloned = response.clone()
      caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned))
    }
    return response
  }).catch(() => {
    return caches.match(request)
  })
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request))
    return
  }

  if (event.request.destination === "style" || event.request.destination === "script" || event.request.destination === "font" || event.request.destination === "image") {
    event.respondWith(cacheFirst(event.request))
    return
  }

  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(cacheFirst(event.request))
    return
  }

  event.respondWith(fetch(event.request))
})
