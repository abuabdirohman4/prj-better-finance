// Clear PWA Cache Script
// Add this to your browser console or include in your app for debugging

if ('serviceWorker' in navigator) {
  // Clear all caches
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        console.log('Deleting cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
  }).then(function() {
    console.log('All caches cleared!');
    
    // Unregister service worker
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
        console.log('Service worker unregistered');
      }
    });
    
    // Reload page
    window.location.reload(true);
  });
} else {
  console.log('Service Worker not supported');
}
