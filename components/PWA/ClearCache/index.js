"use client";
import { useState } from 'react';

export default function ClearCache() {
  const [isClearing, setIsClearing] = useState(false);

  const clearCache = async () => {
    if (isClearing) return;
    
    setIsClearing(true);
    
    try {
      if ('serviceWorker' in navigator) {
        // Clear all caches
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log('Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
        
        // Unregister service worker
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        
        console.log('All caches cleared and service worker unregistered!');
        
        // Reload page after a short delay
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      } else {
        alert('Service Worker not supported');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Error clearing cache: ' + error.message);
    } finally {
      setIsClearing(false);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <button
      onClick={clearCache}
      disabled={isClearing}
      className="fixed bottom-20 right-4 bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-600 disabled:opacity-50 z-50"
      title="Clear PWA Cache (Dev Only)"
    >
      {isClearing ? 'Clearing...' : 'Clear Cache'}
    </button>
  );
}
