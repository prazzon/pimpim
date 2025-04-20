import { Metadata } from "next";
import { notFound } from "next/navigation";
import ItemCard from "../_components/Pages/Home/ItemCard/ItemCard";
import List from "../_components/UI/List/List";
import Main from "../_components/UI/Main/Main";
import { getPosts } from "../_lib/firebase/posts/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
   title: "Trending Content",
   description: "Discover what's trending on PimPim. Stay updated with the most popular movies, shows, and entertainment content that everyone is talking about.",
   keywords: ["trending", "popular", "viral", "trending content", "popular content", "trending entertainment", "what's hot"],
   alternates: {
      canonical: "/trending",
   },
   openGraph: {
      title: "Trending Content | PimPim",
      description: "Discover what's trending on PimPim. Stay updated with the most popular movies, shows, and entertainment content that everyone is talking about.",
      url: "/trending",
      type: "website",
   },
};

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
