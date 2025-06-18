import type { MetadataRoute } from "next";
import { getPosts } from "./_lib/firebase/posts/service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const data = await getPosts();

   const posts = data.map((post) => {
      return {
         url: `https://pimpim.ng/feed/${post.slug}`,
         lastModified: new Date(post.updatedAt),
         changeFrequency: "daily" as const,
         priority: 0.7,
      };
   });

   return [
      {
         url: "https://pimpim.ng",
         lastModified: new Date(),
         changeFrequency: "yearly",
         priority: 1,
      },
      {
         url: "https://pimpim.ng/trending",
         lastModified: new Date(),
         changeFrequency: "daily",
         priority: 0.8,
      },
      {
         url: "https://pimpim.ng/movies",
         lastModified: new Date(),
         changeFrequency: "daily",
         priority: 0.8,
      },
      {
         url: "https://pimpim.ng/shows",
         lastModified: new Date(),
         changeFrequency: "daily",
         priority: 0.8,
      },
      {
         url: "https://pimpim.ng/events",
         lastModified: new Date(),
         changeFrequency: "daily",
         priority: 0.8,
      },
      {
         url: "https://pimpim.ng/icon.svg",
         lastModified: new Date(),
         changeFrequency: "daily",
         priority: 0.7,
      },
      {
         url: "https://pimpim.ng/opengraph-image.png",
         lastModified: new Date(),
         changeFrequency: "daily",
         priority: 0.7,
      },
      ...posts,
   ];
}
