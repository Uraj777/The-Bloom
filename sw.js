/* THE BLOOM — service worker: cache-first offline play.
   Bump VERSION on every deploy so clients pick up new code. */
const VERSION='bloom-v1';
const ASSETS=['./','index.html','css/style.css','manifest.json','favicon.svg','logo.svg',
'js/01-core.js','js/02-rendering.js','js/03-level-engine.js','js/04-entities.js',
'js/05-game-state.js','js/06-ui-flow.js','js/07-levels.js','js/08-main.js',
'js/09-enhancements.js','js/10-combat.js','js/11-visuals.js','js/12-mobile.js'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const u=e.request.url;
  if(e.request.method!=='GET'||!u.startsWith(self.location.origin))return;
  /* never serve cached HTML when the network has a newer deploy */
  if(u.endsWith('index.html')||u.endsWith('/')){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put('index.html',cp));return r;}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(VERSION).then(c=>c.put(e.request,cp));}return r;})));
});
