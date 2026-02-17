import type { Album } from '../types';
import albumsData from './albums.json';

// Import albums from JSON file with validation
function validateAlbum(album: any): album is Album {
  return (
    album &&
    typeof album.id === 'string' &&
    album.id.trim() !== '' &&
    typeof album.urlPath === 'string' &&
    album.urlPath.trim() !== '' &&
    typeof album.artist === 'string' &&
    album.artist.trim() !== '' &&
    typeof album.title === 'string' &&
    album.title.trim() !== '' &&
    typeof album.releaseDate === 'string' &&
    album.releaseDate.trim() !== '' &&
    typeof album.cover === 'string' &&
    album.cover.trim() !== '' &&
    album.description &&
    Array.isArray(album.description.paragraphs)
  );
}

export const ALBUMS: Album[] = (albumsData.albums || [])
  .filter(validateAlbum)
  .map(album => ({
    ...album,
    description: {
      paragraphs: album.description.paragraphs || [],
      credits: {
        artists: album.description.credits?.artists || [],
        production: album.description.credits?.production || [],
        coverArt: album.description.credits?.coverArt || [],
        additional: album.description.credits?.additional || []
      }
    }
  }));

/**
 * Get albums in the order they appear in the JSON file
 * The order can be changed via the admin console sorting feature
 * Invalid albums are filtered out
 */
export function getSortedAlbums(): Album[] {
  // Return albums in the order they appear in the JSON (no sorting)
  // This respects the manual ordering set via the admin console
  // Invalid albums are already filtered out during initialization
  return [...ALBUMS];
}

/**
 * Get an album by its ID
 */
export function getAlbumById(id: string): Album | undefined {
  return ALBUMS.find(album => album.id === id);
}

/**
 * Get an album by its URL path
 */
export function getAlbumByUrlPath(urlPath: string): Album | undefined {
  return ALBUMS.find(album => album.urlPath === urlPath);
}