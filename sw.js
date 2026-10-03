// Service Worker for THE BLOOM - PWA support
const CACHE_NAME = 'bloom-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/favicon.svg',
  '/logo.svg',
  '/js/01-core.js',
  '/js/02-rendering.js',
  '/js/03-level-engine.js',
  '/js/04-entities.js',
  '/js/05-game-state.js',
  '/js/06-ui-flow.js',
  '/js/07-levels.js',
  '/js/08-main.js',
  '/js/09-enhancements.js',
  '/js/10-combat.js',
  '/js/11-visuals.js',
  '/js/12-mobile.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : null).filter(Boolean)
    )).then(() => self.clients.claim())
  );
});
