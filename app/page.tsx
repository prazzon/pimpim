import Home from "./_components/Pages/Home/Home";
import Main from "./_components/UI/Main/Main";
import { getCategories } from "./_lib/firebase/categories/service";
import { getPosts } from "./_lib/firebase/posts/service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
   const allPosts = await getPosts();
   const categories = await getCategories();

   return (
      <Main>
         <Home posts={allPosts} categories={categories} />
      </Main>
   );
}
