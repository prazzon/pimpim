export type Movie = {
   id: string;
   category: "movie";
   title: string;
   slug: string;
   year: string;
   description: string;
   poster: string;
   trailerLink?: string;
   movieLink: string;
   duration: number;
   genres: string[];
   createdAt: Date;
   rating?: number;
   credits?: string;
   viewCount?: number;
   position?: number;
};

export type Series = {
   id: string;
   category: "series" | "show";
   title: string;
   slug: string;
   year: string;
   description: string;
   poster: string;
   trailerLink: string;
   genres: string[];
   createdAt: Date;
   episodes: Episode[];
   rating?: number;
   credits?: string;
   viewCount?: number;
   position?: number;
};

export type Episode = {
   episodeNumber: number;
   title: string;
   episodeLink: string;
   description: string;
   rating?: number;
   viewCount?: number;
};

export type Event = {
   id: number;
   category: "event";
   title: string;
   shortDescription: string;
   longDescription: string;
   poster: string;
   date: string;
   location: string;
   price: number;
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

// export type News = {
//    id: number;
//    category: "news";
//    title: string;
//    description: string;
//    author: string;
//    time: string;
//    poster: string;
//    tags: string[];
//    shareLinks?: {
//       whatsapp?: string;
//       facebook?: string;
//       x?: string;
//       tiktok?: string;
//    };
//    position?: number;
// };

// export type Trending = Data & {
//    position?: number;
// };

export type Post = {
   id: string;
   slug: string;
   category: Category;
   title: string;
   summary: string;
   content: string;
   author: Author;
   createdAt: Date;
   updatedAt: Date;
   poster: string;
   tags: string[];
};

export type Category = {
   id: string;
   name: string;
   slug: string;
   image: string;
   description: string;
};

export type Author = {
   id: string;
   name: string;
   slug: string;
   bio: string;
   posts: Post[];
};

// export type Data = Movie | Series | Event | News;
export type Data = Movie | Series;

export type MediaItem = {
   id: string;
   userId: string;
   type: string;
   url: string;
   title: string;
   createdAt: string;
};

export type Interaction = {
   id: string;
   type: "comment" | "like";
   content?: string;
   postId: string;
   postTitle: string;
   createdAt: string;
};

export type Profile = {
   id: string;
   username: string;
   displayName?: string;
   firstName?: string;
   lastName?: string;
   email: string;
   phone?: string;
   location?: string;
   occupation?: string;
   bio?: string;
   dateOfBirth?: string;
   profileImage?: string | null;
   coverImage?: string | null;
   socialLinks?: {
      instagram?: string;
      facebook?: string;
      youtube?: string;
      tiktok?: string;
      twitter?: string;
   };
   portfolioLinks?: {
      behance?: string;
      dribbble?: string;
      linkedin?: string;
      website?: string;
   };
   commentsAndLikes?: Interaction[];
   createdAt?: Date;
   updatedAt?: Date;
};

export type VerificationToken = {
   id: string;
   email: string;
   token: string;
   expires: Date;
};

export type ResetToken = {
   id: string;
   email: string;
   token: string;
   expires: Date;
};

export type Comment = {
   id: string;
   postId: string;
   userId: string;
   text: string;
   createdAt: Date;
   updatedAt?: Date;
   likes: string[]; // Array of user IDs who liked the comment
   parentId?: string; // For replies, references parent comment ID
   user?: {
      name: string;
      profileImage?: string;
      username?: string;
   };
};
