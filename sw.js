/**
 * Service worker: makes 3 Studio installable and usable offline on iOS/Android
 * (Add to Home Screen) and desktop. Static assets are cache-first with a
 * background refresh; page navigations are network-first so customers
 * always see fresh content when online, falling back to cache offline.
 *
 * Bump CACHE_VERSION whenever app-shell files change so old caches are
 * cleared out on the next visit.
 */
const CACHE_VERSION = "v1";
const CACHE_NAME = `three-studio-${CACHE_VERSION}`;

const APP_SHELL = [
  "./",
  "index.html", "3d-prints.html", "neon.html", "product.html", "customize.html",
  "cart.html", "checkout.html", "order-success.html", "orders.html", "order.html",
  "admin.html", "gallery.html", "favorites.html", "about.html", "contact.html",
  "css/variables.css", "css/reset.css", "css/global.css", "css/components.css",
  "css/shop.css", "css/admin.css", "css/responsive.css",
  "js/config.js", "js/utils.js", "js/translations.js", "js/products.js",
  "js/favorites.js", "js/cart.js", "js/orders.js", "js/whatsapp.js", "js/app.js",
  "js/home.js", "js/shop-listing.js", "js/product-page.js", "js/cart-page.js",
  "js/checkout.js", "js/custom-orders.js", "js/orders-page.js", "js/order-detail.js",
  "js/admin.js", "js/gallery.js", "js/favorites-page.js", "js/contact.js",
  "manifest.webmanifest",
  "assets/logo/logo.svg", "assets/icons/icon-192.png", "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-512.png", "assets/icons/apple-touch-icon-180.png",
  "assets/icons/favicon-32.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // let cross-origin (fonts, WhatsApp) pass through untouched

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
