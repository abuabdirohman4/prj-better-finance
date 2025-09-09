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
            return caches.delete(cacheName);
          })
        );
        
        // Unregister service worker
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-1">Clear PWA Cache</h3>
          <p className="text-xs text-gray-600">
            Clear all cached data and unregister service worker. This will force the app to reload fresh data.
          </p>
        </div>
        <button
          onClick={clearCache}
          disabled={isClearing}
          className="ml-4 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isClearing ? 'Clearing...' : 'Clear Cache'}
        </button>
      </div>
    </div>
  );
}
