export type Movie = {
   id: number;
   category: "movie";
   title: string;
   year: string;
   description: string;
   poster: string;
   trailerLink: string;
   movieLink: string;
   duration: number;
   rating: number;
   genres: string[];
   credits: string;
   viewCount: number;
   position?: number;
};

export type Series = {
   id: number;
   category: "series" | "show";
   title: string;
   year: string;
   description: string;
   poster: string;
   trailerLink: string;
   episodes: Episode[];
   rating: number;
   genres: string[];
   credits: string;
   viewCount: number;
   position?: number;
};

export type Episode = {
   title: string;
   rating: number;
   episodeLink: string;
   description: string;
   viewCount: number;
};

export type Event = {
   id: number;
   category: "event";
   title: string;
   shortDescription: string;
   longDescription: string;
   time: string;
   poster: string;
   date: string;
   location: string;
   tags: string[];
   availableTickets: number;
   shareLinks?: {
      whatsapp?: string;
      facebook?: string;
      x?: string;
      tiktok?: string;
   };
   position?: number;
};

export type News = {
   id: number;
   category: "news";
   title: string;
   description: string;
   author: string;
   time: string;
   poster: string;
   tags: string[];
   shareLinks?: {
      whatsapp?: string;
      facebook?: string;
      x?: string;
      tiktok?: string;
   };
   position?: number;
};

export type Trending = Data & {
   position?: number;
};

export type Data = Movie | Series | Event | News;
