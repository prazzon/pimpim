"use client";

import { getRelatedPosts } from "@/app/_lib/firebase/posts/service";
import { Post } from "@/app/_lib/firebase/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Skeleton from "../../../UI/Skeleton/Skeleton";
import Title from "../../../UI/Title/Title";
import ItemCard from "../../Home/ItemCard/ItemCard";
import styles from "./RelatedPosts.module.scss";

type RelatedPostsProps = {
   currentPost: Post;
   limit?: number;
};

export default function RelatedPosts({
   currentPost,
   limit = 6,
}: RelatedPostsProps) {
   const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      let isMounted = true;

      const fetchRelatedPosts = async () => {
         try {
            setIsLoading(true);
            setError(null);

            const posts = await getRelatedPosts(
               currentPost.id,
               currentPost.category.id,
               currentPost.tags,
               limit
            );

            if (isMounted) {
               setRelatedPosts(posts);
            }
         } catch (err) {
            console.error("Error fetching related posts:", err);
            if (isMounted) {
               setError("Failed to load related posts");
            }
         } finally {
            if (isMounted) {
               setIsLoading(false);
            }
         }
      };

      // Add a small delay to implement lazy loading
      const timeoutId = setTimeout(fetchRelatedPosts, 100);

      return () => {
         isMounted = false;
         clearTimeout(timeoutId);
      };
   }, [currentPost.id, currentPost.tags, limit, currentPost.category.id]);

   // Don't render anything if there are no related posts and not loading
   if (!isLoading && relatedPosts.length === 0 && !error) {
      return null;
   }

   return (
      <section className={styles.related_posts}>
         <div className={styles.divider} />
         <Title type="secondary">Related Posts</Title>

         {error && (
            <div className={styles.error}>
               <p>{error}</p>
            </div>
         )}

         {isLoading ? (
            <div className={styles.loading_state}>
               {Array.from({ length: Math.min(limit, 3) }).map((_, index) => (
                  <div key={index} className={styles.skeleton_card}>
                     <div className={styles.skeleton_poster}>
                        <Skeleton variant="rect" height="100%" width="100%" />
                     </div>
                     <div className={styles.skeleton_info}>
                        <Skeleton variant="text" width={120} height={20} />
                        <Skeleton variant="text" width="90%" height={14} />
                        <Skeleton variant="text" width="70%" height={14} />
                        <Skeleton
                           variant="text"
                           width={80}
                           height={25}
                           className={styles.skeleton_category}
                        />
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className={styles.posts_grid}>
               <AnimatePresence>
                  {relatedPosts.map((post, index) => (
                     <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                           duration: 0.3,
                           delay: index * 0.1,
                        }}
                        className={styles.post_item}
                     >
                        <ItemCard
                           item={post}
                           layout="vertical"
                           showDate={false}
                        />
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         )}
      </section>
   );
}
