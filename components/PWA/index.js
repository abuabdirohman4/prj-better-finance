'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PWAComponents() {
  // States for different PWA features
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Mobile device detection
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    // Check mobile on mount and resize
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    // PWA Install Prompt Handler
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show install prompt on mobile devices
      if (isMobile) {
        setShowInstallPrompt(false);
      }
    };

    // Offline/Online Handler
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Service Worker Update Handler
    const handleServiceWorkerUpdate = () => {
      setShowUpdatePrompt(true);
    };

    // Event Listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service Worker Update Listener
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleServiceWorkerUpdate);
    }

    // Set initial online state
    setIsOnline(navigator.onLine);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', checkIsMobile);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleServiceWorkerUpdate);
      }
    };
  }, [isMobile]);

  // PWA Install Prompt Handlers
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      // User accepted the install prompt
    } else {
      // User dismissed the install prompt
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleInstallDismiss = () => {
    setShowInstallPrompt(false);
  };

  // Update Available Handlers
  const handleUpdate = () => {
    window.location.reload();
  };

  const handleUpdateDismiss = () => {
    setShowUpdatePrompt(false);
  };

  return (
    <>
      {/* Offline Indicator - Top */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 px-4 z-50">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium">You are currently offline</span>
          </div>
        </div>
      )}

      {/* Update Available - Top */}
      {showUpdatePrompt && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 px-4 z-50">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-medium">New version available</span>
            <button
              onClick={handleUpdate}
              className="ml-2 bg-white text-blue-500 text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Update
            </button>
            <button
              onClick={handleUpdateDismiss}
              className="ml-2 text-white text-xs hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* PWA Install Prompt - Top Center (Improved Design) - Mobile Only */}
      {showInstallPrompt && isMobile && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 max-w-sm w-full mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Image 
                  src="/img/logo.svg" 
                  alt="App Icon" 
                  width={45}
                  height={45}
                  className="rounded-lg" 
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                Install Better Finance
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Add to home screen for quick access
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-blue-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Install
            </button>
            <button
              onClick={handleInstallDismiss}
              className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
