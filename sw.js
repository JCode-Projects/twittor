// TODO - Imports
importScripts('js/sw-utils.js');

// TODO - Crear variables para manejar el nombre del caché: STATIC, DINAMIC, INMUTABLE
const STATIC_CACHE_NAME = 'static-v1';
const DINAMIC_CACHE_NAME = 'dynamic-v1';
const INMUTABLE_CACHE_NAME = 'inmutable-v1';

// TODO - Crear un array con las rutas de los archivos para el app shell (STATIC CACHE)
const APP_SHELL = [
    '/',
    '/index.html',
    '/css/style.css',
    '/img/favicon.ico',
    '/img/avatars/hulk.jpg',
    '/img/avatars/ironman.jpg',
    '/img/avatars/spiderman.jpg',
    '/img/avatars/thor.jpg',
    '/img/avatars/wolverine.jpg',
    '/js/app.js',
    '/js/sw-utils.js'
];

// TODO - Crear un array con las rutas de los archivos para el app shell inmutable (INMUTABLE CACHE)
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
    '/css/animate.css',
    '/js/libs/jquery.js'
];

// TODO - Crear los espacios de caché cuando se instale el Service Worker
self.addEventListener('install', e => {
    const installCacheStatic = caches.open(STATIC_CACHE_NAME)
        .then(cache => cache.addAll(APP_SHELL));
    
    const installCacheInmutable = caches.open(INMUTABLE_CACHE_NAME)
        .then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([installCacheStatic, installCacheInmutable]));
});

// TODO - Limpiar caché antiguo cuando se instale un nuevo Service Worker
self.addEventListener('activate', e => {
    const response = caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if(key !== STATIC_CACHE_NAME && key.includes('static')) {
                    return caches.delete(key);
                }
            });
        });

    e.waitUntil(response);
});

self.addEventListener('fetch', e => {
    const response = caches.match(e.request)
        .then(res => {
            if(res) return res;

            return fetch(e.request)
                .then(newRes => {
                    return actualizarCacheDinamico(DINAMIC_CACHE_NAME, e.request, newRes);
                });
        });
    
    e.respondWith(response);
});