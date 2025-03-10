import ItemCard from "../_components/Pages/Home/ItemCard/ItemCard";
import { getPosts } from "../_lib/firebase/posts/service";

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

export default CategoriesPage
