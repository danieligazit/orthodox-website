export type AlbumCoverType = 'geometric' | 'noise' | 'minimal' | 'abstract' | 'lines';

export interface Album {
  id: number;
  artist: string;
  title: string;
  year: string;
  coverType: AlbumCoverType;
  description: string;
  tracks: string[];
}

