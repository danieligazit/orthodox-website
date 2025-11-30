export interface Album {
  id: number;
  artist: string;
  title: string;
  releaseDate: string;
  cover: string;
  description?: string | {
    paragraphs: string[];
    credits: {
      artists: string[];
      additional: string[];
      coverArt: string[];
      production: string[];
    };
  };
  bandcampUrl?: string;
  bandcampEmbedId?: string;
}