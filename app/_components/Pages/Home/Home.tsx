import { Category, Post } from "@/app/_lib/firebase/types";
import Image from "next/image";
import Link from "next/link";
import AdBanner from "../../Ads/AdBanner";
import MiniCarousel from "../../UI/MiniCarousel/MiniCarousel";
import Title from "../../UI/Title/Title";
import CategoriesGroup from "../Categories/CategoriesGroup/CategoriesGroup";
import CreativeSpotlight from "./CreativeSpotlight/CreativeSpotlight";
import Featured from "./Featured/Featured";
import styles from "./Home.module.scss";
import ItemCard from "./ItemCard/ItemCard";
import LatestPosts from "./LatestPosts/LatestPosts";
import Trending from "./Trending/Trending";

type Props = {
   trendingPosts: Post[];
   mainPosts: Post[];
   spotlightPosts: Post[];
   featuredPosts: Post[];
   creativeSpotlightPosts: Post[];
   categories: Category[];
};

function Home({
   trendingPosts,
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
               {/* <AdBanner
                  dataAdSlot="5010019560"
                  dataAdClient="ca-pub-7227150050392511"
                  className={styles.ads}
               /> */}
               <div>
                  <Title type="secondary">Spotlight</Title>
                  {spotlightPosts.map((item) => (
                     <ItemCard key={item.id} item={item} />
                  ))}
               </div>
            </div>

            <div className={styles.sidebar}>
               <div>
                  <Trending posts={trendingPosts} />
               </div>

               {/* <div className={styles.ads_container}>
                  <AdBanner
                     dataAdSlot="5010019560"
                     dataAdClient="ca-pub-7227150050392511"
                     className={styles.ads}
                  />
               </div> */}

               <Link
                  href="https://www.relatedmotion.com/"
                  className={styles.ads}
                  target="_blank"
               >
                  <Image
                     src="/images/ads/ad.png"
                     alt="Ad"
                     width={325}
                     height={500}
                     className={styles.ads}
                  />
               </Link>

               <div className={styles.ads_container}>
                  <AdBanner
                     dataAdSlot="5010019560"
                     dataAdClient="ca-pub-7227150050392511"
                     className={styles.ads}
                  />
               </div>
            </div>
         </div>

         <Featured features={featuredPosts} />

         {creativeSpotlightPosts.length > 0 && (
            <CreativeSpotlight posts={creativeSpotlightPosts} />
         )}

         <CategoriesGroup categories={categories} />

         <div className={styles.grid}>
            <div className={styles.main}>
               <LatestPosts />
            </div>

            <div className={styles.sidebar}>
               <Link
                  href="https://www.relatedmotion.com/legacy-film"
                  className={styles.ads}
                  target="_blank"
               >
                  <Image
                     src="/images/ads/ad2.png"
                     alt="Ad"
                     width={325}
                     height={500}
                     className={styles.ads}
                  />
               </Link>
            </div>
         </div>
      </section>
   );
}

export default Home;
