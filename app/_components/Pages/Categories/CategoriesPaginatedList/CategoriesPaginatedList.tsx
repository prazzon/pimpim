"use client";

import Loader from "@/app/_components/UI/Loader/Loader";
import Spinner from "@/app/_components/UI/Spinner/Spinner";
import {
   getPaginatedPosts,
   getPaginatedPostsByCategorySlug,
} from "@/app/_lib/firebase/posts/service";
import { Post } from "@/app/_lib/firebase/types";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import ItemCard from "../../Home/ItemCard/ItemCard";
import styles from "./CategoriesPaginatedList.module.scss";

type CategoriesPaginatedListProps = {
   categorySlug?: string; // If provided, fetch posts for that category; otherwise fetch all posts
};

export default function CategoriesPaginatedList({
   categorySlug,
}: CategoriesPaginatedListProps) {
   // State for pagination
   const [posts, setPosts] = useState<Post[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const [hasMore, setHasMore] = useState(true);
   const [lastPostId, setLastPostId] = useState<string | undefined>(undefined);
   const [error, setError] = useState<string | null>(null);

   // Function to fetch initial posts
   useEffect(() => {
      async function fetchInitialPosts() {
         try {
            setError(null);
            let result;

            if (categorySlug) {
               result = await getPaginatedPostsByCategorySlug(categorySlug, 10);
               if (!result) {
                  setError("Category not found");
                  setIsLoading(false);
                  return;
               }
            } else {
               result = await getPaginatedPosts(10);
            }

            if (result.posts.length > 0) {
               setPosts(result.posts);
               setLastPostId(result.posts[result.posts.length - 1].id);
            }

            setHasMore(result.hasMore);
         } catch (err) {
            console.error("Error fetching initial posts:", err);
            setError("Failed to load posts. Please try again.");
         } finally {
            setIsLoading(false);
         }
      }

      fetchInitialPosts();
   }, [categorySlug]);

   // Function to load more posts
   const loadMorePosts = useCallback(async () => {
      if (isLoadingMore || !hasMore) return;

      setIsLoadingMore(true);
      setError(null);

      try {
         let result;

         if (categorySlug) {
            result = await getPaginatedPostsByCategorySlug(
               categorySlug,
               10,
               lastPostId
            );
            if (!result) {
               setError("Category not found");
               setIsLoadingMore(false);
               return;
            }
         } else {
            result = await getPaginatedPosts(10, lastPostId);
         }

         if (result.posts.length > 0) {
            setPosts((prevPosts) => [...prevPosts, ...result.posts]);
            setLastPostId(result.posts[result.posts.length - 1].id);
         }

         setHasMore(result.hasMore);
      } catch (err) {
         console.error("Error loading more posts:", err);
         setError("Failed to load more posts. Please try again.");
      } finally {
         setIsLoadingMore(false);
      }
   }, [isLoadingMore, hasMore, lastPostId, categorySlug]);

   // Show error state
   if (error && posts.length === 0) {
      return (
         <div className={styles.error_state}>
            <p>{error}</p>
         </div>
      );
   }

   return (
      <div className={styles.categories_paginated_list}>
         {isLoading ? (
            <Spinner />
         ) : (
            // Show posts once loaded
            <div className={styles.posts_list}>
               {posts.length > 0 ? (
                  posts.map((item) => <ItemCard key={item.id} item={item} />)
               ) : (
                  <div className={styles.no_posts}>
                     <p>No posts found</p>
                  </div>
               )}
            </div>
         )}

         {/* Only show the button if we're not in initial loading state and there are more posts */}
         {!isLoading && hasMore && (
            <button
               className={styles.see_more}
               onClick={loadMorePosts}
               disabled={isLoadingMore}
               aria-label="Load more posts"
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
