export interface Album {
  id: number;
  artist: string;
  title: string;
  releaseDate: string;
  cover: string;
  description?: {
    patagraphs: string[];
    credits: {
      artists: string[];
      additional: string[];
      coverArt: string[];
      production: string[];
    };
  };
  bandcampEmbedId?: string;
}

