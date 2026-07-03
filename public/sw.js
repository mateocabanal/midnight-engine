const CACHE_NAME = "midnight-engine-v2";
const SCOPE = self.registration.scope;
const APP_SHELL = ["", "index.html", "assets/app.js", "assets/index.css", "manifest.webmanifest", "icons/icon.svg"].map(
  (path) => new URL(path, SCOPE).toString()
);

self.addEventListener("install", (event) => {
  const requests = APP_SHELL.map((url) => new Request(url, { cache: "reload" }));
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(requests)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith(SCOPE)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(new URL("index.html", SCOPE).toString(), clone));
          return response;
        })
        .catch(() => caches.match(new URL("index.html", SCOPE).toString()).then((cached) => cached || caches.match(SCOPE)))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(new URL("index.html", SCOPE).toString()).then((cached) => cached || caches.match(SCOPE)));
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
