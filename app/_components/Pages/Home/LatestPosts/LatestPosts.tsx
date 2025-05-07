"use client";

import Loader from "@/app/_components/UI/Loader/Loader";
import Skeleton from "@/app/_components/UI/Skeleton/Skeleton";
import { getPaginatedPosts } from "@/app/_lib/firebase/posts/service";
import { Post } from "@/app/_lib/firebase/types";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import Title from "../../../UI/Title/Title";
import ItemCard from "../ItemCard/ItemCard";
import styles from "./LatestPosts.module.scss";

export default function LatestPosts() {
   // State for pagination
   const [posts, setPosts] = useState<Post[]>([]);
   const [isLoading, setIsLoading] = useState(true); // Start with loading state
   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const [hasMore, setHasMore] = useState(true);
   const [lastPostId, setLastPostId] = useState<string | undefined>(undefined);

   // Function to fetch initial posts
   useEffect(() => {
      async function fetchInitialPosts() {
         try {
            const result = await getPaginatedPosts(10);

            if (result.posts.length > 0) {
               setPosts(result.posts);
               setLastPostId(result.posts[result.posts.length - 1].id);
            }

            setHasMore(result.hasMore);
         } catch (error) {
            console.error("Error fetching initial posts:", error);
         } finally {
            setIsLoading(false);
         }
      }

      fetchInitialPosts();
   }, []);

   // Function to load more posts
   const loadMorePosts = useCallback(async () => {
      if (isLoadingMore || !hasMore) return;

      setIsLoadingMore(true);

      try {
         const result = await getPaginatedPosts(2, lastPostId);

         if (result.posts.length > 0) {
            setPosts((prevPosts) => [...prevPosts, ...result.posts]);
            setLastPostId(result.posts[result.posts.length - 1].id);
         }

         setHasMore(result.hasMore);
      } catch (error) {
         console.error("Error loading more posts:", error);
      } finally {
         setIsLoadingMore(false);
      }
   }, [isLoadingMore, hasMore, lastPostId]);

   return (
      <div className={styles.latest_posts}>
         <Title type="secondary">Latest</Title>

         {isLoading ? (
            // Show skeleton loading state for initial load
            <div className={styles.loading_state}>
               {[1, 2].map((item) => (
                  <div key={item} className={styles.skeleton_card}>
                     <div className={styles.skeleton_poster}>
                        <Skeleton variant="rect" height="100%" width="100%" />
                     </div>
                     <div className={styles.skeleton_info}>
                        <Skeleton variant="text" width={80} height={12} />
                        <Skeleton variant="text" width="90%" height={20} />
                        <Skeleton variant="text" width="70%" height={14} />
                        <Skeleton
                           variant="text"
                           width={100}
                           height={30}
                           className={styles.skeleton_category}
                        />
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            // Show posts once loaded
            <div className={styles.posts_list}>
               {posts.map((item) => (
                  <ItemCard key={item.id} item={item} />
               ))}
            </div>
         )}

         {/* Only show the button if we're not in initial loading state and there are more posts */}
         {!isLoading && hasMore && (
            <button
               className={styles.see_more}
               onClick={loadMorePosts}
               disabled={isLoadingMore}
            >
               <AnimatePresence mode="wait">
                  <motion.div
                     key={isLoadingMore ? "loading" : "show-more"}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.2 }}
                     className={styles.see_more_content}
                  >
                     {isLoadingMore ? (
                        <Loader />
                     ) : (
                        <>
                           <span>Show more</span>
                           <IoChevronDownOutline
                              className={styles.see_more_icon}
                           />
                        </>
                     )}
                  </motion.div>
               </AnimatePresence>
            </button>
         )}
      </div>
   );
}
