"use client";

import { getUserInteractionsPaginated, Interaction } from "@/app/_lib/firebase/interactions/service";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BiLike } from "react-icons/bi";
import { FaComment } from "react-icons/fa";
import { IoChevronDownOutline } from "react-icons/io5";
import Loader from "../../../UI/Loader/Loader";
import Skeleton from "../../../UI/Skeleton/Skeleton";
import styles from "./ProfileInteractions.module.scss";

type ProfileInteractionsProps = {
   userId: string;
};

export default function ProfileInteractions({ userId }: ProfileInteractionsProps) {
   const [interactions, setInteractions] = useState<Interaction[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const [hasMore, setHasMore] = useState(false);
   const [lastInteractionId, setLastInteractionId] = useState<string | undefined>();
   const [lastInteractionDate, setLastInteractionDate] = useState<Date | undefined>();

   // Function to fetch initial interactions
   useEffect(() => {
      async function fetchInitialInteractions() {
         if (!userId) return;

         try {
            const result = await getUserInteractionsPaginated(userId, 10);

            if (result.interactions.length > 0) {
               setInteractions(result.interactions);
               const lastInteraction = result.interactions[result.interactions.length - 1];
               setLastInteractionId(lastInteraction.id);
               setLastInteractionDate(lastInteraction.createdAt);
            }

            setHasMore(result.hasMore);
         } catch (error) {
            console.error("Error fetching initial interactions:", error);
         } finally {
            setIsLoading(false);
         }
      }

      fetchInitialInteractions();
   }, [userId]);

   // Function to load more interactions
   const loadMoreInteractions = useCallback(async () => {
      if (isLoadingMore || !hasMore || !userId) return;

      setIsLoadingMore(true);

      try {
         const result = await getUserInteractionsPaginated(
            userId,
            10,
            lastInteractionId,
            lastInteractionDate
         );

         if (result.interactions.length > 0) {
            setInteractions((prevInteractions) => [
               ...prevInteractions,
               ...result.interactions,
            ]);
            const lastInteraction = result.interactions[result.interactions.length - 1];
            setLastInteractionId(lastInteraction.id);
            setLastInteractionDate(lastInteraction.createdAt);
         }

         setHasMore(result.hasMore);
      } catch (error) {
         console.error("Error loading more interactions:", error);
      } finally {
         setIsLoadingMore(false);
      }
   }, [isLoadingMore, hasMore, lastInteractionId, lastInteractionDate, userId]);

   return (
      <div className={styles.interactions}>
         <h2 className={styles.title}>Comments & Likes</h2>

         {isLoading ? (
            // Show skeleton loading state for initial load
            <div className={styles.loading_state}>
               {[1, 2, 3].map((item) => (
                  <div key={item} className={styles.skeleton_interaction}>
                     <div className={styles.skeleton_icon}>
                        <Skeleton variant="rect" height="24px" width="24px" />
                     </div>
                     <div className={styles.skeleton_content}>
                        <Skeleton variant="text" width="60%" height={16} />
                        <Skeleton variant="text" width="90%" height={14} />
                        <Skeleton variant="text" width="40%" height={12} />
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            // Show interactions once loaded
            <div className={styles.list}>
               <AnimatePresence>
                  {interactions.map((interaction) => (
                     <motion.div
                        key={interaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={styles.interaction}
                     >
                        <div className={styles.icon}>
                           {interaction.type === "comment" ? (
                              <FaComment />
                           ) : (
                              <BiLike />
                           )}
                        </div>

                        <div className={styles.content}>
                           <div className={styles.header}>
                              <span className={styles.type}>
                                 {interaction.type === "comment"
                                    ? "Commented on"
                                    : "Liked"}
                              </span>
                              <Link
                                 href={`/feed/${interaction.postSlug || interaction.postId}`}
                                 className={styles.post_title}
                              >
                                 {interaction.postTitle}
                              </Link>
                           </div>

                           {interaction.type === "comment" && interaction.text && (
                              <p className={styles.comment_text}>
                                 {interaction.text}
                              </p>
                           )}

                           <div className={styles.date}>
                              {interaction.createdAt.toLocaleString()}
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         )}

         {/* Only show the button if we're not in initial loading state and there are more interactions */}
         {!isLoading && hasMore && (
            <button
               className={styles.see_more}
               onClick={loadMoreInteractions}
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
                           <span>Load more interactions</span>
                           <IoChevronDownOutline
                              className={styles.see_more_icon}
                           />
                        </>
                     )}
                  </motion.div>
               </AnimatePresence>
            </button>
         )}

         {!isLoading && interactions.length === 0 && (
            <div className={styles.empty}>
               <p>No comments or likes found</p>
            </div>
         )}
      </div>
   );
}
