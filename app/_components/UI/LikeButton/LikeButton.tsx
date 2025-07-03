"use client";

import { togglePostLikeOptimistic } from "@/app/_lib/firebase/likes/client-actions";
import {
   subscribeLikeCount,
   subscribeUserLikeStatus,
} from "@/app/_lib/firebase/likes/service";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "sonner";
import AuthDialog from "../../Auth/AuthDialog";
import styles from "./LikeButton.module.scss";

type LikeButtonProps = {
   postId: string;
   initialLikeCount?: number;
   initialIsLiked?: boolean;
   className?: string;
   showCount?: boolean;
   size?: "small" | "medium" | "large";
};

export default function LikeButton({
   postId,
   initialLikeCount = 0,
   initialIsLiked = false,
   className = "",
   showCount = true,
   size = "medium",
}: LikeButtonProps) {
   const [likeCount, setLikeCount] = useState(initialLikeCount);
   const [isLiked, setIsLiked] = useState(initialIsLiked);
   const [isLoading, setIsLoading] = useState(false);
   const [showAuthDialog, setShowAuthDialog] = useState(false);
   const { data: session, status } = useSession();

   // Subscribe to real-time updates
   useEffect(() => {
      if (!postId) return;

      // Subscribe to like count changes
      const unsubscribeLikeCount = subscribeLikeCount(
         postId,
         (newLikeCount) => {
            setLikeCount(newLikeCount);
         }
      );

      // Subscribe to user like status changes (only if authenticated)
      let unsubscribeUserLikeStatus: (() => void) | undefined;
      if (session?.user?.id) {
         unsubscribeUserLikeStatus = subscribeUserLikeStatus(
            session.user.id,
            postId,
            (newIsLiked) => {
               setIsLiked(newIsLiked);
            }
         );
      }

      return () => {
         unsubscribeLikeCount();
         unsubscribeUserLikeStatus?.();
      };
   }, [postId, session?.user?.id]);

   const handleLikeClick = useCallback(async () => {
      // Check authentication
      if (status === "unauthenticated") {
         setShowAuthDialog(true);
         toast.error("Please sign in to like posts");
         return;
      }

      if (status === "authenticated" && !session.user.emailVerified) {
         toast.error(
            "Please verify your email to like posts. Check your profile for verification options."
         );
         return;
      }

      if (!session?.user?.id) {
         toast.error("User session not found");
         return;
      }

      if (isLoading) return;

      setIsLoading(true);

      // Optimistic update
      const optimisticIsLiked = !isLiked;
      const optimisticLikeCount = isLiked
         ? Math.max(0, likeCount - 1)
         : likeCount + 1;

      setIsLiked(optimisticIsLiked);
      setLikeCount(optimisticLikeCount);

      try {
         const result = await togglePostLikeOptimistic(
            session.user.id,
            postId,
            isLiked,
            likeCount
         );

         if (result.success) {
            // Update with actual values from server
            setIsLiked(result.isLiked);
            setLikeCount(result.likeCount);
         } else {
            // Revert optimistic update on failure
            setIsLiked(!optimisticIsLiked);
            setLikeCount(isLiked ? likeCount + 1 : Math.max(0, likeCount - 1));
         }
      } catch (error) {
         // Revert optimistic update on error
         setIsLiked(!optimisticIsLiked);
         setLikeCount(isLiked ? likeCount + 1 : Math.max(0, likeCount - 1));

         console.error("Error toggling like:", error);
         toast.error("Something went wrong. Please try again.");
      } finally {
         setIsLoading(false);
      }
   }, [status, session, isLiked, likeCount, isLoading, postId]);

   const handleCloseAuthDialog = () => {
      setShowAuthDialog(false);
   };

   // Animation variants
   const heartVariants = {
      liked: {
         scale: [1, 1.2, 1],
         transition: {
            duration: 0.3,
            ease: "easeInOut",
         },
      },
      unliked: {
         scale: 1,
         transition: {
            duration: 0.2,
            ease: "easeInOut",
         },
      },
   };

   const countVariants = {
      initial: { scale: 1 },
      animate: {
         scale: [1, 1.1, 1],
         transition: {
            duration: 0.3,
            ease: "easeInOut",
         },
      },
   };

   const sizeClass = {
      small: styles.small,
      medium: styles.medium,
      large: styles.large,
   }[size];

   return (
      <>
         <button
            className={`${styles.like_button} ${sizeClass} ${className} ${
               isLiked ? styles.liked : ""
            } ${isLoading ? styles.loading : ""}`}
            onClick={handleLikeClick}
            disabled={isLoading}
            aria-label={isLiked ? "Unlike this post" : "Like this post"}
            aria-pressed={isLiked}
         >
            <motion.div
               className={styles.heart_container}
               variants={heartVariants}
               animate={isLiked ? "liked" : "unliked"}
            >
               {isLiked ? (
                  <FaHeart className={styles.heart_filled} />
               ) : (
                  <FaRegHeart className={styles.heart_outline} />
               )}
            </motion.div>

            {showCount && (
               <AnimatePresence mode="wait">
                  <motion.span
                     key={likeCount}
                     className={styles.like_count}
                     variants={countVariants}
                     initial="initial"
                     animate="animate"
                     exit="initial"
                  >
                     {likeCount}
                  </motion.span>
               </AnimatePresence>
            )}
         </button>

         <AuthDialog open={showAuthDialog} action={handleCloseAuthDialog} />
      </>
   );
}
