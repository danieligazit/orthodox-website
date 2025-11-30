export interface Album {
  id: number;
  urlPath: string;
  artist: string;
  title: string;
  releaseDate: string;
  cover: string;
  description: {
    paragraphs: string[];
    credits: {
      artists?: string[];
      additional?: string[];
      coverArt?: string[];
      production?: string[];
    };
  };
  bandcampEmbedId?: number;
}