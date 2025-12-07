import pressData from './press.json';
import { PressItem } from '../types';

export interface PressData {
  items: PressItem[];
}

export const PRESS_DATA: PressData = pressData as PressData;

export function getAllPressItems(): PressItem[] {
  return PRESS_DATA.items;
}

export function getPressItemById(id: number): PressItem | undefined {
  return PRESS_DATA.items.find(item => item.id === id);
}
