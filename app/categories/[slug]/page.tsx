import ItemCard from "@/app/_components/Pages/Home/ItemCard/ItemCard";
import { getPostsByCategorySlug } from "@/app/_lib/firebase/posts/service";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
   params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { slug } = await params;
   const posts = await getPostsByCategorySlug(slug);

   if (!posts) {
      return {
         title: "Category Not Found",
         description: "The requested category could not be found.",
      };
   }

   // Get category name from the first post (if available)
   const categoryName =
      posts.length > 0 && posts[0].category
         ? posts[0].category.name
         : slug.charAt(0).toUpperCase() + slug.slice(1);

   return {
      title: `${categoryName} Content`,
      description: `Browse all ${categoryName.toLowerCase()} content on PimPim. Find the latest movies, shows, and articles in the ${categoryName.toLowerCase()} category.`,
      keywords: [
         categoryName.toLowerCase(),
         "category",
         "content category",
         "entertainment category",
         `${categoryName.toLowerCase()} content`,
      ],
      alternates: {
         canonical: `/categories/${slug}`,
      },
      openGraph: {
         title: `${categoryName} Content | PimPim`,
         description: `Browse all ${categoryName.toLowerCase()} content on PimPim. Find the latest movies, shows, and articles in the ${categoryName.toLowerCase()} category.`,
         url: `/categories/${slug}`,
         type: "website",
      },
   };
}

async function CategoryPage({ params }: Props) {
   const { slug } = await params;

   const posts = await getPostsByCategorySlug(slug);

   if (!posts) notFound();

   return (
      <>
         {posts.map((item) => (
            <ItemCard key={item.id} item={item} />
         ))}

         {posts.length === 0 && (
            <div>
               <h1>No posts found</h1>
               <p>There are no posts in this category</p>
            </div>
         )}
      </>
   );
}

export default CategoryPage;
