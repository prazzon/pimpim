import { Metadata } from "next";
import Home from "./_components/Pages/Home/Home";
import JsonLd from "./_components/SEO/JsonLd";
import Main from "./_components/UI/Main/Main";
import { getCategories } from "./_lib/firebase/categories/service";
import { getPostsBySection } from "./_lib/firebase/posts/service";
import { getTrendingPosts } from "./_lib/firebase/trending/service";
import {
   generateOrganizationSchema,
   generateWebsiteSchema,
} from "./_lib/seo/schema";

export const revalidate = 300;

export const metadata: Metadata = {
   title: "PimPim - Entertainment & Media Platform",
   description:
      "Discover the latest movies, TV shows, events, and entertainment news on PimPim. Your go-to platform for trending content and entertainment updates.",
   keywords: [
      "entertainment",
      "movies",
      "TV shows",
      "events",
      "media",
      "trending",
      "news",
      "home",
      "pim",
      "pimpim",
      "pim pim",
      "pimpim network",
   ],
   alternates: {
      canonical: "https://pimpim.ng",
   },
};

export default async function HomePage() {
   const trendingPosts = await getTrendingPosts(5);
   const spotlightPosts = await getPostsBySection("spotlight", 6);
   const mainPosts = await getPostsBySection("main", 10);
   const featuredPosts = await getPostsBySection("featured", 5);
   const creativeSpotlightPosts = await getPostsBySection("creative-spotlight");
   const categories = await getCategories();

   const baseUrl = process.env.SITE_URL || "https://pimpim.ng";
   const websiteSchema = generateWebsiteSchema(baseUrl);
   const organizationSchema = generateOrganizationSchema(baseUrl);

   return (
      <>
         <JsonLd data={[websiteSchema, organizationSchema]} />
         <Main>
            <Home
               trendingPosts={trendingPosts}
               spotlightPosts={spotlightPosts}
               mainPosts={mainPosts}
               featuredPosts={featuredPosts}
               creativeSpotlightPosts={creativeSpotlightPosts}
               categories={categories}
            />
         </Main>
      </>
   );
}
