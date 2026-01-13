const cacheName = 'v1';
const cacheAssets = [
  'index.html',
  'style.css',  // تأكد من كتابة أسماء ملفاتك الحقيقية هنا
  'icons/icon-192.png',
  'barcodecreator.html'
];

// مرحلة التثبيت (Install)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Caching Files...');
      cache.addAll(cacheAssets);
    })
  );
});

// مرحلة جلب البيانات (Fetch)
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
