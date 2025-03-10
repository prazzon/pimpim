import { getCategories } from "@/app/_lib/firebase/categories/service";
import { getPosts } from "@/app/_lib/firebase/posts/service";
import MiniCarousel from "../../UI/MiniCarousel/MiniCarousel";
import Title from "../../UI/Title/Title";
import CategoriesGroup from "../Categories/CategoriesGroup/CategoriesGroup";
import CategoriesList from "../Categories/CategoriesList/CategoriesList";
import Featured from "./Featured/Featured";
import styles from "./Home.module.scss";
import ItemCard from "./ItemCard/ItemCard";
import Trending from "./Trending/Trending";

async function Home() {
   const allPosts = await getPosts();
   const categories = await getCategories();

   return (
      <section className={styles.home}>
         <div className={styles.grid}>
            <div className={styles.main}>
               <MiniCarousel items={allPosts} />
               <div>
                  <Title type="secondary">Spotlight</Title>
                  {allPosts.slice(0, 7).map((item) => (
                     <ItemCard key={item.id} item={item} />
                  ))}
               </div>
            </div>

            <div className={styles.sidebar}>
               <div>
                  <Trending posts={allPosts} />
                  {/* <Title type="secondary">Trending</Title>
                  {addPositionToPosts(allPosts)
                     .slice(0, 5)
                     .map((item, index) => (
                        <ItemCard
                           key={item.id}
                           item={item}
                           position={index + 1}
                           layout="vertical"
                        />
                     ))} */}
               </div>

               <div>
                  <Title type="secondary">Categories</Title>
                  <CategoriesList categories={categories} />
               </div>

               <div className={styles.ads}>Ads</div>
            </div>
         </div>

         <Featured features={allPosts} />

         <CategoriesGroup categories={categories} />

         <div className={styles.grid}>
            <div className={styles.main}>
               <div>
                  <Title type="secondary">Latest</Title>

                  {allPosts.slice(0, 5).map((item) => (
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
