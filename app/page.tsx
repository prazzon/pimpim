import { Metadata } from "next";
import Home from "./_components/Pages/Home/Home";
import JsonLd from "./_components/SEO/JsonLd";
import Main from "./_components/UI/Main/Main";
import { getCategories } from "./_lib/firebase/categories/service";
import { getPosts, getPostsBySection } from "./_lib/firebase/posts/service";
import {
   generateOrganizationSchema,
   generateWebsiteSchema,
} from "./_lib/seo/schema";

export const dynamic = "force-dynamic";

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
   ],
   alternates: {
      canonical: "/",
   },
};

export default async function HomePage() {
   const allPosts = await getPosts();
   const spotlightPosts = await getPostsBySection("spotlight", 5);
   const mainPosts = await getPostsBySection("main", 5);
   const featuredPosts = await getPostsBySection("featured", 5);
   const categories = await getCategories();

   const baseUrl = process.env.SITE_URL || "https://pimpim.ng";
   const websiteSchema = generateWebsiteSchema(baseUrl);
   const organizationSchema = generateOrganizationSchema(baseUrl);

   return (
      <>
         <JsonLd data={[websiteSchema, organizationSchema]} />
         <Main>
            <Home
               posts={allPosts}
               spotlightPosts={spotlightPosts}
               mainPosts={mainPosts}
               featuredPosts={featuredPosts}
               categories={categories}
            />
         </Main>
      </>
   );
}
