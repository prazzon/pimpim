import ItemCard from "@/app/_components/Pages/Home/ItemCard/ItemCard";
import { getPostsByCategorySlug } from "@/app/_lib/firebase/posts/service";
import { notFound } from "next/navigation";

type Props = {
   params: {
      slug: string;
   };
};

async function CategoryPage({ params }: Props) {
   const { slug } = await params;

   const posts = await getPostsByCategorySlug(slug);
   // const posts = [];

   if (!posts) notFound();

   return (
      <>
         {posts.map((item) => (
            <ItemCard key={item.id} item={item} />
         ))}

         {posts.length === 0 && (
            <div>
               <h1>No posts found</h1>
               <p>
                  There are no posts in this category
               </p>
            </div>
         )}
      </>
   );
}

export default CategoryPage;
