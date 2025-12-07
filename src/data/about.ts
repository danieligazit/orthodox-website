import aboutData from './about.json';

export interface AboutData {
  paragraphs: string[];
}

export const ABOUT_DATA: AboutData = aboutData as AboutData;
