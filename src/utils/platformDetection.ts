import { PlatformType } from '../types';

export function detectPlatform(): PlatformType {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Android TV / Google TV
  if (userAgent.includes('android tv') || userAgent.includes('googletv')) {
    return 'googletv';
  }
  
  // Amazon Fire TV
  if (userAgent.includes('aftn') || userAgent.includes('amazon fire')) {
    return 'amazon';
  }
  
  // Freeview Play (FVP)
  if (userAgent.includes('freeview') || userAgent.includes('fvp')) {
    return 'fvp';
  }
  
  // YouView
  if (userAgent.includes('youview')) {
    return 'youview';
  }
  
  // Freesat
  if (userAgent.includes('freesat')) {
    return 'freesat';
  }
  
  // Virgin Media
  if (userAgent.includes('virgin') || userAgent.includes('vm')) {
    return 'vm';
  }
  
  // LG WebOS
  if (userAgent.includes('webos') || userAgent.includes('lg netcast')) {
    return 'lg';
  }
  
  // Sky
  if (userAgent.includes('sky')) {
    return 'sky';
  }
  
  // Default to 'all' for desktop/unknown platforms
  return 'all';
}