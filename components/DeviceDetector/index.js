"use client";
import { useEffect } from 'react';

export default function DeviceDetector() {
  useEffect(() => {
    // Only run on client side and if it's actually a mobile device
    if (typeof window === 'undefined') return;
    
    // Detect Samsung devices with more comprehensive patterns
    const isSamsung = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const samsungPatterns = [
        'samsung',
        'sm-',
        'galaxy',
        'samsungbrowser',
        'samsung internet',
        'samsung galaxy',
        'gt-',
        'sch-',
        'sgh-',
        'shv-',
        'sph-',
        'sm-g',
        'sm-n',
        'sm-a',
        'sm-j',
        'sm-t',
        'sm-p'
      ];
      
      return samsungPatterns.some(pattern => userAgent.includes(pattern));
    };

    // Detect if it's a mobile device (more strict check)
    const isMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      
      return isMobileUA && isTouchDevice && isSmallScreen;
    };

    // Debug logging
    console.log('User Agent:', navigator.userAgent);
    console.log('Is Samsung:', isSamsung());
    console.log('Is Mobile:', isMobile());
    console.log('Window width:', window.innerWidth);
    console.log('Touch support:', 'ontouchstart' in window);

    // Apply Samsung-specific classes ONLY if it's a Samsung mobile device
    if (isSamsung() && isMobile()) {
      console.log('Applying Samsung device classes');
      document.documentElement.classList.add('samsung-device');
      document.body.classList.add('samsung-device');
      document.documentElement.setAttribute('data-device', 'samsung');
    } else {
      console.log('Not a Samsung mobile device, removing classes');
      document.documentElement.classList.remove('samsung-device');
      document.body.classList.remove('samsung-device');
      document.documentElement.removeAttribute('data-device');
    }
  }, []);

  return null; // This component doesn't render anything
}
