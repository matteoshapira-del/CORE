// Minimal offline-first service worker.
// Strategy: cache-first for app shell, stale-while-revalidate for everything else.
const VERSION = 'core-v1.3.0';
const APP_SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'styles/tokens.css',
  'styles/base.css',
  'styles/components.css',
  'styles/screens.css',
  'scripts/app.js',
  'scripts/store.js',
  'scripts/data/areas.js',
  'scripts/data/kpis.js',
  'scripts/data/exercises.js',
  'scripts/engine/routine.js',
  'scripts/engine/flex.js',
  'scripts/engine/score.js',
  'scripts/engine/safety.js',
  'scripts/engine/bookends.js',
  'scripts/engine/resolve.js',
  'scripts/components/icons.js',
  'scripts/components/sparkline.js',
  'scripts/components/radar.js',
  'scripts/components/score-band.js',
  'scripts/components/asymmetry.js',
  'scripts/components/illustration.js',
  'scripts/components/figure-primitives.js',
  'scripts/components/exercise-illustrations.js',
  'scripts/components/exercise-icons.js',
  'scripts/components/shell.js',
  'scripts/screens/home.js',
  'scripts/screens/routines.js',
  'scripts/screens/progress.js',
  'scripts/screens/profile.js',
  'scripts/screens/player.js',
  'scripts/screens/complete.js',
  'scripts/screens/kpi-detail.js',
  'scripts/screens/sunday-check.js',
  'scripts/screens/onboarding/index.js',
  'scripts/screens/onboarding/welcome.js',
  'scripts/screens/onboarding/info.js',
  'scripts/screens/onboarding/areas.js',
  'scripts/screens/onboarding/measure-intro.js',
  'scripts/screens/onboarding/measure-test.js',
  'scripts/screens/onboarding/baseline-reveal.js',
  'icons/icon-192.svg',
  'icons/icon-512.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'icons/icon-maskable.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(APP_SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Don't intercept analytics or cross-origin font requests we don't cache
  if (url.origin !== location.origin && !url.hostname.includes('fonts.')) return;
  e.respondWith(
    caches.match(req).then(cached => {
      const fetched = fetch(req).then(res => {
        if (res && res.status === 200 && (url.origin === location.origin || url.hostname.includes('fonts.'))) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
