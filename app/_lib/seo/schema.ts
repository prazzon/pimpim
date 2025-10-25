/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Post } from "../firebase/types";

// Website Schema
export function generateWebsiteSchema(url: string) {
   return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "PimPim",
      url: url,
      potentialAction: {
         "@type": "SearchAction",
         target: `${url}/search?q={search_term_string}`,
         "query-input": "required name=search_term_string",
      },
   };
}

// Organization Schema
export function generateOrganizationSchema(url: string) {
   return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "PimPim",
      url: url,
      logo: `${url}/logo.svg`,
      sameAs: [
         "https://www.facebook.com/pimpim",
         "https://www.twitter.com/pimpim_ng",
         "https://www.instagram.com/pimpim.ng",
      ],
   };
}

// Article Schema
export function generateArticleSchema(post: Post, url: string) {
   const headline = post.seo?.titleTag || post.title;
   const description =
      post.seo?.metaDescription ||
      post.summary ||
      post.content.substring(0, 160);
   const slug = post.seo?.slug || post.slug;

   return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline,
      image: [post.poster],
      datePublished: post.createdAt,
      dateModified: post.updatedAt ? post.updatedAt : post.createdAt,
      author: {
         "@type": "Person",
         name: post.author.name,
      },
      publisher: {
         "@type": "Organization",
         name: "PimPim",
         logo: {
            "@type": "ImageObject",
            url: `${url}/logo.svg`,
         },
      },
      description,
      mainEntityOfPage: {
         "@type": "WebPage",
         "@id": `${url}/feed/${slug}`,
      },
   };
}

// Movie Schema
export function generateMovieSchema(movie: any, url: string) {
   return {
      "@context": "https://schema.org",
      "@type": "Movie",
      name: movie.title,
      description: movie.description,
      image: movie.poster,
      datePublished: movie.year,
      director: movie.director || "Unknown",
      actor: movie.actors || [],
      aggregateRating: {
         "@type": "AggregateRating",
         ratingValue: movie.rating || "0",
         bestRating: "10",
         worstRating: "0",
         ratingCount: "1",
      },
      genre: movie.genres || [],
      trailer: {
         "@type": "VideoObject",
         name: `${movie.title} Trailer`,
         description: `Watch the trailer for ${movie.title}`,
         thumbnailUrl: movie.poster,
         contentUrl: movie.trailerLink || "",
         uploadDate: movie.createdAt
            ? movie.createdAt
            : new Date().toISOString(), // Assuming createdAt is a string
      },
   };
}

// TV Series Schema
export function generateTVSeriesSchema(series: any, url: string) {
   return {
      "@context": "https://schema.org",
      "@type": "TVSeries",
      name: series.title,
      description: series.description,
      image: series.poster,
      datePublished: series.year,
      actor: series.actors || [],
      aggregateRating: {
         "@type": "AggregateRating",
         ratingValue: series.rating || "0",
         bestRating: "10",
         worstRating: "0",
         ratingCount: "1",
      },
      genre: series.genres || [],
      trailer: {
         "@type": "VideoObject",
         name: `${series.title} Trailer`,
         description: `Watch the trailer for ${series.title}`,
         thumbnailUrl: series.poster,
         contentUrl: series.trailerLink || "",
         uploadDate: series.createdAt
            ? series.createdAt
            : new Date().toISOString(),
      },
      numberOfEpisodes: series.episodes ? series.episodes.length : 0,
      episode: series.episodes
         ? series.episodes.map((episode: any, index: number) => ({
              "@type": "TVEpisode",
              episodeNumber: episode.episodeNumber || index + 1,
              name: episode.title,
              description: episode.description,
           }))
         : [],
   };
}

// Event Schema
export function generateEventSchema(event: any) {
   return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.title,
      description: event.longDescription || event.shortDescription,
      image: event.poster,
      startDate: event.date,
      endDate: event.endDate || event.date, // Assuming same day if no end date
      location: {
         "@type": "Place",
         name: event.location,
         address: event.location,
      },
      offers: {
         "@type": "Offer",
         price: event.price ? (event.price / 100).toFixed(2) : "0.00",
         priceCurrency: "EUR",
         availability:
            event.availableTickets > 0
               ? "https://schema.org/InStock"
               : "https://schema.org/SoldOut",
         validFrom: new Date().toISOString(),
      },
      performer: {
         "@type": "PerformingGroup",
         name: event.performer || event.title,
      },
   };
}
