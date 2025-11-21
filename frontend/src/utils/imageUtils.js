import { API_BASE_URL } from '../config/api';

/**
 * Get the full image URL for a cafe image
 * Handles both Cloudinary URLs (http/https) and legacy local uploads
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    // Return inline SVG placeholder
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f59e0b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="%23ffffff"%3ECafe%3C/text%3E%3C/svg%3E';
  }
  
  // If it's already a full URL (Cloudinary), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // For legacy local uploads, prepend the backend URL
  return `${API_BASE_URL}${imagePath}`;
};
