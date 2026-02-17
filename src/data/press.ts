import pressData from './press.json';
import { PressItem } from '../types';

export interface PressData {
  items: PressItem[];
}

function validatePressItem(item: any): item is PressItem {
  return (
    item &&
    typeof item.id === 'number' &&
    item.id > 0 &&
    typeof item.title === 'string' &&
    item.title.trim() !== '' &&
    typeof item.publication === 'string' &&
    item.publication.trim() !== '' &&
    typeof item.date === 'string' &&
    item.date.trim() !== '' &&
    typeof item.link === 'string' &&
    item.link.trim() !== ''
  );
}

export const PRESS_DATA: PressData = {
  items: (pressData.items || [])
    .filter(validatePressItem)
    .map(item => ({
      ...item,
      author: item.author || undefined,
      excerpt: item.excerpt || undefined,
      image: item.image || undefined,
      category: item.category || undefined
    }))
};

export function getAllPressItems(): PressItem[] {
  // Return only valid press items
  return PRESS_DATA.items;
}

export function getPressItemById(id: number): PressItem | undefined {
  return PRESS_DATA.items.find(item => item.id === id);
}
