/**
 * Centralized image URL handler
 * Handles both local and external images
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || '';

/**
 * Get full image URL from backend path
 * @param {string|null|undefined} path - Image path from API
 * @returns {string|null} Full image URL or null
 */
export function getImageUrl(path) {
  if (!path) return null;
  
  // Already full URL (external images, YouTube thumbnails, etc)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Handle different path formats
  // Backend stores as: "artikel/filename.jpg" or "slides/filename.jpg"
  // We need to prepend storage URL
  if (cleanPath.includes('storage/')) {
    return `${API_BASE_URL}/${cleanPath}`;
  }
  
  // Default: assume it's in storage folder
  return `${API_BASE_URL}/storage/${cleanPath}`;
}

/**
 * Get image URL with fallback
 * @param {string|null|undefined} path 
 * @param {string} fallback 
 * @returns {string}
 */
export function getImageUrlWithFallback(path, fallback = '/placeholder.jpg') {
  const url = getImageUrl(path);
  return url || fallback;
}

/**
 * Check if image URL is valid (for external images)
 * @param {string} url 
 * @returns {Promise<boolean>}
 */
export async function isValidImageUrl(url) {
  if (!url) return false;
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}

/**
 * Generate YouTube thumbnail URL from video ID
 * @param {string} videoId 
 * @param {string} quality - 'default', 'mqdefault', 'hqdefault', 'sddefault', 'maxresdefault'
 * @returns {string}
 */
export function getYouTubeThumbnail(videoId, quality = 'hqdefault') {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Extract YouTube video ID from URL
 * @param {string} url 
 * @returns {string|null}
 */
export function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Preload image for better UX
 * @param {string} url 
 * @returns {Promise<void>}
 */
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Preload multiple images
 * @param {string[]} urls 
 * @returns {Promise<void[]>}
 */
export function preloadImages(urls) {
  return Promise.all(urls.map(preloadImage));
}

/**
 * Fix legacy URL format (replace /uploads/ with /storage/)
 * @param {string|null|undefined} url 
 * @returns {string|null}
 */
export function fixLegacyUrl(url) {
  if (!url) return null;
  return url.replace('/uploads/', '/storage/');
}
