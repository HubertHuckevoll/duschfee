/**
 * The damn service worker
 * Strategy:
 * First: cache everything
 * Then: use cache
 * This is basically an "offline-only" app
 * ToDo: find out if files that are using es-modules can be cached too
 */

const staticCacheName = 'duschfee_v27';
const filesToCache = [
  'manifest.json',
  'index.html',
  'styles.css',
  'Duschfee.js',
  'NoSleep.js',
  'Options.js',
  'Speech.js',
  'Squeak.js',
  'Timer.js',
  'TimerView.js',
  'PrefsView.js',
  'img/fairy.jpg',
  'img/icon96.png',
  'img/icon192.png',
  'img/icon512.png',
  'img/timer_white_24dp.svg',
  'img/settings_white_24dp.svg',
  'img/help_outline_white_24dp.svg',
  'img/play_arrow_white_24dp.svg',
  'img/stop_white_24dp.svg',
  '/frontschweine/css/FormoSlider.css',
  '/frontschweine/css/FormoTabbox.css',
  '/frontschweine/js/FormoSlider.js',
  '/frontschweine/js/FormoTabbox.js'
];

/**
 * install
 * __________________________________________________________________
 */
self.addEventListener('install', event =>
{
  console.log('Attempting to install service worker and cache assets.');

  self.skipWaiting();
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

/**
 * activated, delete old caches
 * __________________________________________________________________
 */
self.addEventListener('activate', function(event)
{
  console.log('Activating new service worker...');

  var static_cache_prefix = staticCacheName.substring(0,staticCacheName.indexOf("_"));

  event.waitUntil(
    caches.keys().then(function(keyList)
    {
      return Promise.all(keyList.map(function(key)
      {
        if ((key.indexOf(static_cache_prefix) > -1) && (key != staticCacheName))
        {
          console.log('Deleting cache: ' + key);
          return caches.delete(key);
        }
      }));
    })
  );
});

/**
 * just cache
 * __________________________________________________________________
 */
self.addEventListener('fetch', function(event)
{
  event.respondWith(caches.match(event.request));
});
