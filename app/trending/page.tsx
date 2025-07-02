import { Metadata } from "next";
import { notFound } from "next/navigation";
import ItemCard from "../_components/Pages/Home/ItemCard/ItemCard";
import { getTrendingPosts } from "../_lib/firebase/trending/service";

export const revalidate = 21600; // 6 hours in seconds

export const metadata: Metadata = {
   title: "Trending Content",
   description:
      "Discover what's trending on PimPim. Stay updated with the most popular movies, shows, and entertainment content that everyone is talking about.",
   keywords: [
      "trending",
      "popular",
      "viral",
      "trending content",
      "popular content",
      "trending entertainment",
      "what's hot",
   ],
   alternates: {
      canonical: "/trending",
   },
   openGraph: {
      title: "Trending Content | PimPim",
      description:
         "Discover what's trending on PimPim. Stay updated with the most popular movies, shows, and entertainment content that everyone is talking about.",
      url: "/trending",
      type: "website",
   },
};

async function TrendingPage() {
   const trendingPosts = await getTrendingPosts(10);

   if (trendingPosts.length < 1) notFound();

   return (
      <>
         {trendingPosts.map((item, index) => (
            <ItemCard key={item.id} item={item} position={index + 1} />
         ))}
      </>
   );
}

export default TrendingPage;
