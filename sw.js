// Route 80 PWA Service Worker
const CACHE_NAME = 'route80-pwa-v1.2';
const STATIC_CACHE_NAME = 'route80-static-v1.2';
const DYNAMIC_CACHE_NAME = 'route80-dynamic-v1.2';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add any additional static assets here
];

// API endpoints and dynamic content
const DYNAMIC_ASSETS = [
  'https://metromap.cityofmadison.com/gtfsrt/vehicles',
  'https://metromap.cityofmadison.com/gtfsrt/trips', 
  'https://metromap.cityofmadison.com/gtfsrt/alerts'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installed successfully');
        // Take control immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                (cacheName.startsWith('route80-static-') || 
                 cacheName.startsWith('route80-dynamic-'))) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        // Take control of all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Handle static assets (HTML, CSS, JS, images)
  if (request.method === 'GET' && isStaticAsset(request.url)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
    return;
  }
  
  // Handle API requests (Madison Metro GTFS-RT feeds)
  if (request.method === 'GET' && isAPIRequest(request.url)) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME));
    return;
  }
  
  // Default: network first for everything else
  event.respondWith(
    fetch(request)
      .catch(() => {
        // If network fails, try to serve from any cache
        return caches.match(request);
      })
  );
});

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request, cacheName) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('Service Worker: Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    console.log('Service Worker: Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache the response for next time
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Cache-first strategy failed:', error);
    // Return offline page or fallback
    return createOfflineResponse(request);
  }
}

// Network-first strategy (for API data)
async function networkFirstStrategy(request, cacheName) {
  try {
    // Try network first
    console.log('Service Worker: Fetching API data from network:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache:', request.url);
    
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('Service Worker: Serving stale API data from cache');
      return cachedResponse;
    }
    
    // If no cache, return offline response
    console.error('Service Worker: No cached data available');
    return createOfflineAPIResponse();
  }
}

// Helper functions
function isStaticAsset(url) {
  return url.includes('.html') || 
         url.includes('.css') || 
         url.includes('.js') || 
         url.includes('.png') || 
         url.includes('.jpg') || 
         url.includes('.svg') || 
         url.includes('manifest.json') ||
         url.endsWith('/');
}

function isAPIRequest(url) {
  return url.includes('metromap.cityofmadison.com') ||
         url.includes('/gtfsrt/') ||
         DYNAMIC_ASSETS.some(apiUrl => url.includes(apiUrl));
}

function createOfflineResponse(request) {
  if (request.destination === 'document') {
    // Return offline HTML page
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Route 80 - Offline</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #fef2f2; }
          .offline-icon { font-size: 64px; margin-bottom: 20px; }
          h1 { color: #dc2626; }
          p { color: #6b7280; margin-bottom: 20px; }
          .retry-btn { background: #dc2626; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="offline-icon">🚌</div>
        <h1>Route 80 - Offline</h1>
        <p>You're currently offline. The app will work with cached data when available.</p>
        <p>Check your internet connection and try again.</p>
        <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  return new Response('Offline', { status: 503 });
}

function createOfflineAPIResponse() {
  // Return mock data when API is unavailable
  const offlineData = {
    arrivals: [
      { time: '?', status: 'Offline', vehicleId: 'N/A', capacity: 'unknown' }
    ],
    lastUpdated: new Date().toISOString(),
    offline: true
  };
  
  return new Response(JSON.stringify(offlineData), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Handle background sync (when network comes back)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'bus-data-sync') {
    event.waitUntil(syncBusData());
  }
});

async function syncBusData() {
  try {
    // Refresh bus data when connection is restored
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    
    for (const apiUrl of DYNAMIC_ASSETS) {
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          await cache.put(apiUrl, response);
          console.log('Service Worker: Synced data for', apiUrl);
        }
      } catch (error) {
        console.log('Service Worker: Failed to sync', apiUrl);
      }
    }
    
    // Notify all clients about the sync
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'DATA_SYNCED',
        message: 'Bus data has been updated'
      });
    });
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Your Route 80 bus is arriving soon!',
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: 'View App',
          icon: '/icons/action-view.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Route 80 Update',
        options
      )
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app
    event.waitUntil(
      self.clients.matchAll({ type: 'window' })
        .then((clients) => {
          // Check if app is already open
          for (const client of clients) {
            if (client.url.includes('/') && 'focus' in client) {
              return client.focus();
            }
          }
          
          // If app is not open, open it
          if (self.clients.openWindow) {
            return self.clients.openWindow('/');
          }
        })
    );
  }
});

console.log('Service Worker: Script loaded successfully');
