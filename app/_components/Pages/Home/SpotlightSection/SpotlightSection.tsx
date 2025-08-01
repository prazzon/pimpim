"use client";

import Loader from "@/app/_components/UI/Loader/Loader";
import Title from "@/app/_components/UI/Title/Title";
import { getPaginatedPostsBySection } from "@/app/_lib/firebase/posts/service";
import { Post } from "@/app/_lib/firebase/types";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import ItemCard from "../ItemCard/ItemCard";
import styles from "./SpotlightSection.module.scss";

type SpotlightSectionProps = {
   initialPosts: Post[];
};

function SpotlightSection({ initialPosts }: SpotlightSectionProps) {
   const [posts, setPosts] = useState<Post[]>(initialPosts);
   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const [hasMore, setHasMore] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Function to load more spotlight posts
   const loadMorePosts = useCallback(async () => {
      if (isLoadingMore || !hasMore) return;

      setIsLoadingMore(true);
      setError(null);

      try {
         const lastPostId =
            posts.length > 0 ? posts[posts.length - 1].id : undefined;
         const result = await getPaginatedPostsBySection(
            "spotlight",
            6,
            lastPostId
         );

         if (result.posts.length > 0) {
            setPosts((prevPosts) => [...prevPosts, ...result.posts]);
         }

         setHasMore(result.hasMore);
      } catch (err) {
         console.error("Error loading more spotlight posts:", err);
         setError("Failed to load more posts. Please try again.");
      } finally {
         setIsLoadingMore(false);
      }
   }, [isLoadingMore, hasMore, posts]);

   return (
      <div className={styles.spotlight_section}>
         <Title type="secondary">Spotlight</Title>

         <div className={styles.posts_list}>
            {posts.map((item) => (
               <ItemCard key={item.id} item={item} />
            ))}
         </div>

         {/* Error message */}
         {error && (
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={styles.error_message}
            >
               {error}
            </motion.div>
         )}

         {/* Show More button */}
         {hasMore && (
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

export default SpotlightSection;
