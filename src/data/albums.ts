import type { Album } from '../types';
import albumsData from './albums.json';

// Import albums from JSON file
export const ALBUMS: Album[] = albumsData as Album[];

/**
 * Get albums sorted by release date (newest first)
 */
export function getSortedAlbums(): Album[] {
  return [...ALBUMS].sort((a, b) => {
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  });
}

/**
 * Get an album by its ID
 */
export function getAlbumById(id: number): Album | undefined {
  return ALBUMS.find(album => album.id === id);
}