const CACHE_NAME = "midnight-engine-v4";
const SCOPE = self.registration.scope;
const APP_SHELL = [
  "",
  "index.html",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "fonts/PixelifySans-Variable.ttf",
  "fonts/Silkscreen-Regular.ttf",
  "art/characters.png",
  "art/enemies.png",
  "art/weapons.png",
  "art/summons.png",
  "art/glyphs.png",
  "art/environment.png"
].map((path) => new URL(path, SCOPE).toString());

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const indexUrl = new URL("index.html", SCOPE).toString();
    const indexResponse = await fetch(new Request(indexUrl, { cache: "reload" }));
    if (!indexResponse.ok) throw new Error(`Unable to precache ${indexUrl}`);
    const html = await indexResponse.clone().text();
    const buildAssets = Array.from(html.matchAll(/(?:src|href)="([^"]*\/assets\/[^"]+)"/g))
      .map((match) => new URL(match[1], SCOPE).toString());
    const requests = [...new Set([...APP_SHELL, ...buildAssets])].map((url) => new Request(url, { cache: "reload" }));
    await cache.put(indexUrl, indexResponse);
    await cache.addAll(requests.filter((request) => request.url !== indexUrl));
  })());
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
      fetch(new Request(event.request, { cache: "no-store" }))
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(new URL("index.html", SCOPE).toString(), clone));
          return response;
        })
        .catch(() => caches.match(new URL("index.html", SCOPE).toString()).then((cached) => cached || caches.match(SCOPE)))
    );
    return;
  }

  const url = new URL(event.request.url);
  const isBuildAsset = url.pathname.includes("/assets/");

  if (!isBuildAsset) {
    event.respondWith(
      fetch(new Request(event.request, { cache: "no-store" }))
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (!response.ok) return response;
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request));
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
