import ItemCard from "@/app/_components/Pages/Home/ItemCard/ItemCard";
import NotFound from "@/app/_components/Pages/Trending/NotFound/NotFound";
import { getCategories } from "@/app/_lib/firebase/categories/service";
import { getTrendingPosts } from "@/app/_lib/firebase/trending/service";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
   params: Promise<{ slug: string }>;
};

export const revalidate = 3600; // 1 hour in seconds

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { slug } = await params;
   const posts = await getTrendingPosts(10, slug);

   if (!posts) {
      return {
         title: "Category Not Found",
         description: "The requested trending category could not be found.",
      };
   }

   // Get category name from the first post (if available)
   const categoryName =
      posts.length > 0 && posts[0].category
         ? posts[0].category.name
         : slug.charAt(0).toUpperCase() + slug.slice(1);

   return {
      title: `Trending ${categoryName} Content`,
      description: `Discover what's trending in ${categoryName.toLowerCase()} on PimPim. Stay updated with the most popular ${categoryName.toLowerCase()} movies, shows, and entertainment content.`,
      keywords: [
         "trending",
         "popular",
         categoryName.toLowerCase(),
         "trending category",
         `trending ${categoryName.toLowerCase()}`,
         `popular ${categoryName.toLowerCase()}`,
         "viral content",
      ],
      alternates: {
         canonical: `/trending/${slug}`,
      },
      openGraph: {
         title: `Trending ${categoryName} Content | PimPim`,
         description: `Discover what's trending in ${categoryName.toLowerCase()} on PimPim. Stay updated with the most popular ${categoryName.toLowerCase()} movies, shows, and entertainment content.`,
         url: `/trending/${slug}`,
         type: "website",
      },
   };
}

export async function generateStaticParams() {
   const categories = await getCategories();

   return categories.map((category) => ({
      params: { slug: category.slug },
   }));
}

async function TrendingCategoryPage({ params }: Props) {
   const { slug } = await params;

   const posts = await getTrendingPosts(10, slug);

   if (!posts) notFound();

   return (
      <>
         {posts.map((item, index) => (
            <ItemCard key={item.id} item={item} position={index + 1} />
         ))}

         {posts.length === 0 && <NotFound />}
      </>
   );
}

export default TrendingCategoryPage;
