// sw.js - basic offline cache
const CACHE_NAME = 'opensrc-guides-v1';
const CORE = [
  'index.html',
  'shared.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if(url.origin === location.origin){
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request).then(net => {
        if(e.request.method === 'GET' && net.status === 200){
          const copy = net.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
        }
        return net;
      }).catch(()=> caches.match('index.html')))
    );
  }
});
