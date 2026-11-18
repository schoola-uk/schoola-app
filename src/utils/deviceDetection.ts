import { useEffect, useState } from 'react';

export type DeviceType = 'iphone' | 'ipad' | 'mobile' | 'tablet' | 'desktop';

export interface DeviceProfile {
  deviceType: DeviceType;
  isIOS: boolean;
  isTouch: boolean;
  isCompact: boolean;
  isTablet: boolean;
  orientation: 'portrait' | 'landscape';
}

export function detectDeviceProfile(): DeviceProfile {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      deviceType: 'desktop',
      isIOS: false,
      isTouch: false,
      isCompact: false,
      isTablet: false,
      orientation: 'landscape',
    };
  }

  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const width = window.innerWidth;
  const height = window.innerHeight;

  const isIPhoneUA = /iPhone|iPod/i.test(ua);
  // Modern iPadOS reports Macintosh in UA while exposing multi-touch points
  const isIPadUA = /iPad/i.test(ua) || (/Macintosh/i.test(ua) && maxTouchPoints > 1) || (platform === 'MacIntel' && maxTouchPoints > 1);
  const isAndroidMobile = /Android/i.test(ua) && /Mobile/i.test(ua);
  const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
  const isGenericMobileUA = /webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTouch =
    maxTouchPoints > 0 ||
    'ontouchstart' in window ||
    (typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches);

  let deviceType: DeviceType = 'desktop';
  if (isIPhoneUA) {
    deviceType = 'iphone';
  } else if (isIPadUA) {
    deviceType = 'ipad';
  } else if (isAndroidMobile || isGenericMobileUA || (isTouch && width < 640)) {
    deviceType = 'mobile';
  } else if (isAndroidTablet || (isTouch && width >= 640 && width <= 1180)) {
    deviceType = 'tablet';
  }

  const isIOS = isIPhoneUA || isIPadUA;
  const isCompact = width < 768;
  const isTablet = deviceType === 'ipad' || deviceType === 'tablet' || (width >= 768 && width < 1100);
  const orientation: 'portrait' | 'landscape' = height >= width ? 'portrait' : 'landscape';

  return {
    deviceType,
    isIOS,
    isTouch,
    isCompact,
    isTablet,
    orientation,
  };
}

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(() => detectDeviceProfile());

  useEffect(() => {
    const syncProfile = () => {
      const next = detectDeviceProfile();
      setProfile(next);

      const root = document.documentElement;
      root.classList.remove(
        'device-iphone',
        'device-ipad',
        'device-mobile',
        'device-tablet',
        'device-desktop',
        'device-ios',
        'is-touch',
        'orientation-portrait',
        'orientation-landscape'
      );

      root.classList.add(`device-${next.deviceType}`);
      if (next.isIOS) root.classList.add('device-ios');
      if (next.isTouch) root.classList.add('is-touch');
      root.classList.add(`orientation-${next.orientation}`);
    };

    syncProfile();
    window.addEventListener('resize', syncProfile, { passive: true });
    window.addEventListener('orientationchange', syncProfile, { passive: true });
    return () => {
      window.removeEventListener('resize', syncProfile);
      window.removeEventListener('orientationchange', syncProfile);
    };
  }, []);

  return profile;
}
