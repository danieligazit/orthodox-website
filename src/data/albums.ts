import type { Album } from '../types';
import albumsData from './albums.json';

// Import albums from JSON file
export const ALBUMS: Album[] = albumsData.albums as Album[];

/**
 * Get albums in the order they appear in the JSON file
 * The order can be changed via the admin console sorting feature
 */
export function getSortedAlbums(): Album[] {
  // Return albums in the order they appear in the JSON (no sorting)
  // This respects the manual ordering set via the admin console
  return [...ALBUMS];
}

/**
 * Get an album by its ID
 */
export function getAlbumById(id: number): Album | undefined {
  return ALBUMS.find(album => album.id === id);
}

/**
 * Get an album by its URL path
 */
export function getAlbumByUrlPath(urlPath: string): Album | undefined {
  return ALBUMS.find(album => album.urlPath === urlPath);
}