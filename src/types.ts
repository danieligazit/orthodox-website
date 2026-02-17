export interface Album {
  id: string; // e.g., "orth001", "room001"
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

export interface PressItem {
  id: number;
  title: string;
  publication: string;
  author?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  excerpt?: string;
  link: string;
  image?: string; // Optional image URL or filename
  category?: string; // e.g., "Review", "Interview", "Feature", "News"
}