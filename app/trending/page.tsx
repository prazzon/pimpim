import { Metadata } from "next";
import { notFound } from "next/navigation";
import ItemCard from "../_components/Pages/Home/ItemCard/ItemCard";
import TrendingCategoriesList from "../_components/Pages/Trending/TrendingCategoriesList/TrendingCategoriesList";
import List from "../_components/UI/List/List";
import Main from "../_components/UI/Main/Main";
import {
   getCategories,
   getCategoryBySlug,
} from "../_lib/firebase/categories/service";
import { getTrendingPosts } from "../_lib/firebase/trending/service";

export const dynamic = "force-dynamic";

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

type Props = {
   searchParams: Promise<{ category?: string }>;
};

async function TrendingPage({ searchParams }: Props) {
   const { category: categorySlug } = await searchParams;

   // Get all categories for the filter UI
   const categories = await getCategories();

   // Get category ID if category filter is specified
   let categoryId: string | undefined;
   if (categorySlug) {
      try {
         const category = await getCategoryBySlug(categorySlug);
         categoryId = category?.id;
      } catch (error) {
         console.error("Error getting category by slug:", error);
         // Category not found, redirect to trending without filter
         notFound();
      }
   }

   // Get trending posts with optional category filter
   const trendingPosts = await getTrendingPosts(10, categoryId);

   if (trendingPosts.length < 1) notFound();

   return (
      <Main>
         <List style={{ gap: 0, marginTop: 0 }}>
            <TrendingCategoriesList
               categories={categories}
               showTitle={true}
               showDescription={true}
            />
            {trendingPosts.map((item, index) => (
               <ItemCard key={item.id} item={item} position={index + 1} />
            ))}
         </List>
      </Main>
   );
}

export default TrendingPage;
