"use client";

import { Comment } from "@/app/_lib/firebase/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import LoadingDots from "../UI/LoadingDots/LoadingDots";
import Skeleton from "../UI/Skeleton/Skeleton";
import CommentItem from "./CommentItem";
import styles from "./Comments.module.scss";

type CommentListProps = {
   postId: string;
   comments: (Comment & { replies: Comment[] })[];
   isLoading?: boolean;
   isLoadingMore?: boolean;
   hasMore?: boolean;
   onLoadMore?: () => void;
   onReplySubmit?: (reply?: Comment) => void;
   onCommentDeleted?: (commentId: string) => void;
};

export default function CommentList({
   postId,
   comments: initialComments,
   isLoading = false,
   isLoadingMore = false,
   hasMore = false,
   onLoadMore,
   onReplySubmit,
   onCommentDeleted,
}: CommentListProps) {
   // State to manage comments locally for optimistic UI updates
   const [comments, setComments] = useState(initialComments);

   // Update comments when props change
   useEffect(() => {
      setComments(initialComments);
   }, [initialComments]);

   // Handle comment deletion
   const handleCommentDeleted = (commentId: string) => {
      // Update the comments list by removing the deleted comment
      setComments((prevComments) =>
         prevComments.filter((comment) => comment.id !== commentId)
      );
      if (onCommentDeleted) onCommentDeleted(commentId);
   };

   // Show loading skeletons
   if (isLoading) {
      return (
         <div className={styles.comments_skeleton}>
            {[...Array(3)].map((_, index) => (
               <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                     duration: 0.3,
                     type: "spring",
                     stiffness: 500,
                     damping: 30,
                     delay: index * 0.1,
                  }}
               >
                  <Skeleton
                     variant="comment"
                     className={styles.comment_skeleton}
                  />
               </motion.div>
            ))}
         </div>
      );
   }

   // Show empty state
   if (comments.length === 0 && !isLoading) {
      return (
         <div className={styles.empty_container}>
            <p>No comments yet. Be the first to comment!</p>
         </div>
      );
   }

   return (
      <div className={styles.comments_list}>
         <AnimatePresence>
            {comments.map((comment) => (
               <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  layout
               >
                  <CommentItem
                     comment={comment}
                     postId={postId}
                     onReplySubmit={onReplySubmit}
                     onCommentDeleted={handleCommentDeleted}
                  />
               </motion.div>
            ))}
         </AnimatePresence>

         {/* View More Comments Button */}
         {hasMore && (
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3 }}
               className={styles.load_more_container}
            >
               <button
                  className={`${styles.load_more_button} ${isLoadingMore ? styles.loading : ""}`}
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
               >
                  {isLoadingMore ? <LoadingDots /> : "View more comments"}
               </button>
            </motion.div>
         )}
      </div>
   );
}
