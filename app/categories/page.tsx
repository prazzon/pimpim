import { Metadata } from "next";
import ItemCard from "../_components/Pages/Home/ItemCard/ItemCard";
import { getPosts } from "../_lib/firebase/posts/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
   title: "Content Categories",
   description: "Browse content by categories on PimPim. Find movies, shows, and articles organized by genres, themes, and topics for easy discovery.",
   keywords: ["categories", "genres", "topics", "content categories", "browse by category", "entertainment categories"],
   alternates: {
      canonical: "/categories",
   },
   openGraph: {
      title: "Content Categories | PimPim",
      description: "Browse content by categories on PimPim. Find movies, shows, and articles organized by genres, themes, and topics for easy discovery.",
      url: "/categories",
      type: "website",
   },
};

async function CategoriesPage() {
   const allPosts = await getPosts();

   return (
      <>
         {allPosts.map((item) => (
            <ItemCard key={item.id} item={item} />
         ))}
      </>
   );
}

export default CategoriesPage;
