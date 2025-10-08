self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('food-order-demo-v2').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js',
        '/manifest.json',
        '/icon.png',
        '/cheeseburger.png',
        '/pizza.png',
        '/salad.png',
        '/fries.png',
        '/milkshake.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
