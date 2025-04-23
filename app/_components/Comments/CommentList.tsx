"use client";

import { Comment } from "@/app/_lib/firebase/types";
import { AnimatePresence, motion } from "framer-motion";
import Skeleton from "../UI/Skeleton/Skeleton";
import CommentItem from "./CommentItem";
import styles from "./Comments.module.scss";

type CommentListProps = {
   postId: string;
   comments: (Comment & { replies: Comment[] })[];
   isLoading?: boolean;
   onReplySubmit?: (reply?: Comment) => void;
};

export default function CommentList({
   postId,
   comments,
   isLoading = false,
   onReplySubmit,
}: CommentListProps) {
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
            {comments.map((comment, index) => (
               <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  layout
               >
                  <CommentItem
                     comment={comment}
                     postId={postId}
                     onReplySubmit={onReplySubmit}
                  />
               </motion.div>
            ))}
         </AnimatePresence>
      </div>
   );
}
