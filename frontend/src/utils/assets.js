/** Public asset path (works on localhost and GitHub Pages subpath). */
export function publicAsset(path) {
  const base = import.meta.env.BASE_URL || '/';
  const clean = String(path || '').replace(/^\//, '');
  return `${base}${clean}`;
}
