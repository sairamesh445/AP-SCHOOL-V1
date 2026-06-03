import { publicAsset } from './assets.js';

export const AP_GOV_LOGO = publicAsset('ap-gov-logo.png');

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || '';

/** Resolve image URL for carousel, diagrams, uploads (works with Vite proxy or direct API host). */
export function getImageSrc(url) {
  if (!url) return AP_GOV_LOGO;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  let path = url;
  if (path.startsWith('uploads/')) path = `/${path}`;
  if (!path.startsWith('/')) path = `/${path}`;

  if (path.startsWith('/uploads') && API_ORIGIN) {
    return `${API_ORIGIN.replace(/\/$/, '')}${path}`;
  }

  return path;
}
