import { Category, Post } from "@/app/_lib/firebase/types";
import { IoChevronDownOutline } from "react-icons/io5";
import MiniCarousel from "../../UI/MiniCarousel/MiniCarousel";
import Title from "../../UI/Title/Title";
import CategoriesGroup from "../Categories/CategoriesGroup/CategoriesGroup";
import CreativeSpotlight from "./CreativeSpotlight/CreativeSpotlight";
import Featured from "./Featured/Featured";
import styles from "./Home.module.scss";
import ItemCard from "./ItemCard/ItemCard";
import Trending from "./Trending/Trending";

type Props = {
   posts: Post[];
   mainPosts: Post[];
   spotlightPosts: Post[];
   featuredPosts: Post[];
   creativeSpotlightPosts: Post[];
   categories: Category[];
};

async function Home({
   posts,
   spotlightPosts,
   mainPosts,
   featuredPosts,
   creativeSpotlightPosts,
   categories,
}: Props) {
   return (
      <section className={styles.home}>
         <div className={styles.grid}>
            <div className={styles.main}>
               <MiniCarousel items={mainPosts} />
               <div>
                  <Title type="secondary">Spotlight</Title>
                  {spotlightPosts.map((item) => (
                     <ItemCard key={item.id} item={item} />
                  ))}
               </div>
            </div>

            <div className={styles.sidebar}>
               <div>
                  <Trending posts={posts} />
               </div>

               <div className={styles.ads}>Ads</div>
            </div>
         </div>

         <Featured features={featuredPosts} />

         {creativeSpotlightPosts.length > 0 && (
            <CreativeSpotlight posts={creativeSpotlightPosts} />
         )}

         <CategoriesGroup categories={categories} />

         <div className={styles.grid}>
            <div className={styles.main}>
               <div>
                  <Title type="secondary">Latest</Title>

                  {posts.map((item) => (
                     <ItemCard key={item.id} item={item} />
                  ))}
               </div>
               <button className={styles.see_more}>
                  <span>Show more</span>
                  <IoChevronDownOutline />
               </button>
            </div>

            <div className={styles.sidebar}>
               <div className={styles.ads}>Ads</div>
            </div>
         </div>
      </section>
   );
}

export default Home;
