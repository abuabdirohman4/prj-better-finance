"use client";
import { useEffect } from 'react';

export default function DeviceDetector() {
  useEffect(() => {
    // Detect Samsung devices
    const isSamsung = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return userAgent.includes('samsung') || 
             userAgent.includes('sm-') || 
             userAgent.includes('galaxy') ||
             userAgent.includes('samsungbrowser');
    };

    // Detect if it's a mobile device
    const isMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // Apply Samsung-specific classes
    if (isSamsung() && isMobile()) {
      document.documentElement.classList.add('samsung-device');
      document.body.classList.add('samsung-device');
    } else {
      document.documentElement.classList.remove('samsung-device');
      document.body.classList.remove('samsung-device');
    }
  }, []);

  return null; // This component doesn't render anything
}
