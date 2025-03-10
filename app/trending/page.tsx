import { notFound } from "next/navigation";
import ItemCard from "../_components/Pages/Home/ItemCard/ItemCard";
import List from "../_components/UI/List/List";
import { getPosts } from "../_lib/firebase/posts/service";
import Main from "../_components/UI/Main/Main";

async function TrendingPage() {
   const allPosts = await getPosts();

   if (allPosts.length < 1) notFound();

   return (
      <Main>
         <List title="Trending" style={{ gap: 0, marginTop: 0 }}>
            {allPosts.map((item, index) => (
               <ItemCard key={item.id} item={item} position={index + 1} />
            ))}
         </List>
      </Main>
   );
}

export default TrendingPage;
