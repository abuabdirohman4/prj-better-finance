# PWA Development Guidelines

## PWA Core Features

- **Service Worker**: Implement proper caching strategies and offline functionality
- **Web App Manifest**: Configure app metadata, icons, and display properties
- **Installable**: Ensure the app can be installed on mobile devices
- **Offline First**: Prioritize offline experience with proper data caching
- **Update Management**: Handle service worker updates and app versioning

## Service Worker Implementation

### next-pwa Configuration
```javascript
// next.config.mjs
import withPWA from "next-pwa";

const config = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    runtimeCaching: [
        // Static assets caching
        {
            urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
            handler: "StaleWhileRevalidate",
            options: {
                cacheName: "static-image-assets",
                expiration: {
                    maxEntries: 64,
                    maxAgeSeconds: 24 * 60 * 60, // 1 day
                },
            },
        },
        // API routes - NO CACHING for dynamic data
        {
            urlPattern: ({ url }) => {
                return (
                    url.origin === self.origin &&
                    url.pathname.startsWith("/api/")
                );
            },
            handler: "NetworkFirst",
            options: {
                cacheName: "apis-no-cache",
                networkTimeoutSeconds: 10,
                expiration: {
                    maxEntries: 0,
                    maxAgeSeconds: 0,
                },
            },
        },
    ],
})(nextConfig);
```

### PWA Component Implementation
```javascript
// components/PWA/index.js
export default function PWAComponents() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

    useEffect(() => {
        // Install prompt handler
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        // Offline/Online handlers
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        // Service worker update handler
        const handleServiceWorkerUpdate = () => {
            setShowUpdatePrompt(true);
        };

        // Event listeners
        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.addEventListener(
                "controllerchange",
                handleServiceWorkerUpdate
            );
        }

        return () => {
            // Cleanup event listeners
        };
    }, []);

    return (
        <>
            {/* Offline Indicator */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 px-4 z-50">
                    You are currently offline
                </div>
            )}

            {/* Update Available */}
            {showUpdatePrompt && (
                <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 px-4 z-50">
                    New version available
                    <button onClick={() => window.location.reload()}>
                        Update
                    </button>
                </div>
            )}

            {/* Install Prompt */}
            {showInstallPrompt && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 max-w-sm w-full mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Image src="/img/logo.svg" alt="App Icon" width={45} height={45} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Install App</h3>
                            <p className="text-xs text-gray-500">Add to home screen for quick access</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={handleInstallClick} className="flex-1 bg-blue-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg">
                            Install
                        </button>
                        <button onClick={handleInstallDismiss} className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-lg">
                            Not now
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
```

## Manifest Configuration

### Web App Manifest
```json
{
  "name": "Better Finance",
  "short_name": "Better Finance",
  "description": "A smart financial app to help you manage your money better",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f8fafc",
  "theme_color": "#1e40af",
  "orientation": "portrait-primary",
  "categories": ["finance", "productivity", "utilities"],
  "lang": "en",
  "scope": "/",
  "icons": [
    {
      "src": "/img/logo.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "/img/logo.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Transactions",
      "short_name": "Transactions",
      "description": "View your transaction history",
      "url": "/transactions",
      "icons": [
        {
          "src": "/img/logo.svg",
          "sizes": "96x96"
        }
      ]
    }
  ]
}
```

### Layout Integration
```javascript
// app/layout.js
import PWAComponents from "@/components/PWA";
import SplashScreen from "@/components/PWA/SplashScreen";

export const metadata = {
    title: "Better Finance",
    description: "A smart financial app to help you manage your money better",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Better Finance",
    },
    icons: {
        icon: [
            { url: "/img/logo.svg", sizes: "192x192", type: "image/svg+xml" },
            { url: "/img/logo.svg", sizes: "512x512", type: "image/svg+xml" },
        ],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="mx-auto max-w-md">
            <body className={`${inter.className} bg-gray-50`}>
                <PWAComponents />
                <SplashScreen />
                {children}
                <BottomNav />
            </body>
        </html>
    );
}
```

## Caching Strategies

### Static Assets
- **Images**: `StaleWhileRevalidate` for images, icons, and media
- **Fonts**: `CacheFirst` for font files, `StaleWhileRevalidate` for stylesheets
- **CSS/JS**: `StaleWhileRevalidate` for styles and scripts
- **Next.js Assets**: `StaleWhileRevalidate` for `_next/static` files

### API Routes
- **Dynamic Data**: `NetworkFirst` with no caching for API endpoints
- **Real-time Data**: Always fetch from network to ensure data freshness
- **Cache Busting**: Use timestamp parameters to prevent stale data

### Offline Handling
- **Fallback Pages**: Provide meaningful offline messages
- **Cached Content**: Serve cached static content when offline
- **Data Sync**: Queue actions for when connection is restored

## Performance Optimization

### Bundle Optimization
- **Code Splitting**: Leverage Next.js automatic code splitting
- **Dynamic Imports**: Use `dynamic()` for non-critical components
- **Tree Shaking**: Remove unused code from bundles
- **Image Optimization**: Use Next.js `Image` component with proper sizing

### Caching Strategy
- **Static Assets**: Long-term caching (1 year for fonts, 1 day for images)
- **API Data**: No caching for real-time financial data
- **Service Worker**: Efficient cache management with proper expiration

### Loading States
- **Skeleton Loaders**: Show loading placeholders for better UX
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Error Boundaries**: Graceful error handling and recovery

## Testing PWA Features

### Manual Testing Checklist
- [ ] **Install Prompt**: Test on mobile devices (Android/iOS)
- [ ] **Offline Mode**: Disable network and test core functionality
- [ ] **Service Worker**: Check registration and update mechanisms
- [ ] **Manifest**: Validate manifest.json properties
- [ ] **Icons**: Test all icon sizes and purposes
- [ ] **Shortcuts**: Test app shortcuts on home screen
- [ ] **Responsive**: Test across different screen sizes
- [ ] **Performance**: Check Lighthouse PWA score

### Development Tools
- **Chrome DevTools**: Application tab for service worker debugging
- **Lighthouse**: PWA audit and performance testing
- **Workbox**: Service worker debugging and testing
- **Network Tab**: Monitor caching behavior

## PWA Best Practices

### User Experience
- **Install Prompt**: Show only on mobile devices and after user engagement
- **Offline Indicators**: Clear visual feedback for connection status
- **Update Notifications**: Inform users about available updates
- **Error Handling**: Graceful degradation when features aren't available

### Technical Implementation
- **Error Boundaries**: Catch and handle PWA-related errors
- **Fallback Content**: Provide meaningful content when offline
- **Data Persistence**: Use localStorage for critical user data
- **Update Strategy**: Implement proper service worker update handling

### Security Considerations
- **HTTPS**: Ensure all PWA features work over secure connections
- **Content Security Policy**: Configure CSP for PWA features
- **Data Privacy**: Handle sensitive data appropriately in offline mode
- **Cache Security**: Implement proper cache validation and cleanup
