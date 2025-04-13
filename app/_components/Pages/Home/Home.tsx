import { Category, Post } from "@/app/_lib/firebase/types";
import MiniCarousel from "../../UI/MiniCarousel/MiniCarousel";
import Title from "../../UI/Title/Title";
import CategoriesGroup from "../Categories/CategoriesGroup/CategoriesGroup";
import Featured from "./Featured/Featured";
import styles from "./Home.module.scss";
import ItemCard from "./ItemCard/ItemCard";
import Trending from "./Trending/Trending";

type Props = {
   posts: Post[];
   categories: Category[];
};

async function Home({ posts, categories }: Props) {
   return (
      <section className={styles.home}>
         <div className={styles.grid}>
            <div className={styles.main}>
               <MiniCarousel items={posts} />
               <div>
                  <Title type="secondary">Spotlight</Title>
                  {posts.slice(0, 7).map((item) => (
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

         <Featured features={posts} />

         <CategoriesGroup categories={categories} />

         <div className={styles.grid}>
            <div className={styles.main}>
               <div>
                  <Title type="secondary">Latest</Title>

                  {posts.slice(0, 5).map((item) => (
                     <ItemCard key={item.id} item={item} />
                  ))}
               </div>
               <button className={styles.see_more}>See more</button>
            </div>

            <div className={styles.sidebar}>
               <div className={styles.ads}>Ads</div>
            </div>
         </div>
      </section>
   );
}

export default Home;
