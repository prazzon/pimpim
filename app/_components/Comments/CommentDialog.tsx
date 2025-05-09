"use client";

import { getCommentsByPostId } from "@/app/_lib/firebase/comments/service";
import { Comment } from "@/app/_lib/firebase/types";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { MdRefresh } from "react-icons/md";
import { toast } from "sonner";
import AuthDialog from "../Auth/AuthDialog";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import styles from "./Comments.module.scss";

const COMMENTS_PER_PAGE = 10;

type CommentDialogProps = {
   postId: string;
   postTitle: string;
   isOpen: boolean;
   onCloseAction: () => void;
   layoutId: string;
};

export default function CommentDialog({
   postId,
   postTitle,
   isOpen,
   onCloseAction,
   layoutId,
}: CommentDialogProps) {
   const [mounted, setMounted] = useState(false);
   const [showAuthDialog, setShowAuthDialog] = useState(false);
   const [comments, setComments] = useState<
      (Comment & { replies: Comment[] })[]
   >([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const [hasMore, setHasMore] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const { data: session, status } = useSession();

   // Fetch comments when dialog opens or refresh button is clicked
   const fetchComments = useCallback(async () => {
      if (!isOpen) return;

      try {
         setIsLoading(true);
         setError(null);

         const result = await getCommentsByPostId(postId, COMMENTS_PER_PAGE);

         if (result) {
            setComments(result.comments || []);
            setHasMore(result.hasMore);
         } else {
            setComments([]);
            setHasMore(false);
         }
      } catch (err) {
         console.error("Error fetching comments:", err);
         setError("Failed to load comments. Please try again.");
      } finally {
         setIsLoading(false);
      }
   }, [isOpen, postId]);

   // Load more comments
   const loadMoreComments = async () => {
      if (!comments.length || isLoadingMore) return;

      try {
         setIsLoadingMore(true);

         // Get the last comment's ID for pagination
         const lastCommentId = comments[comments.length - 1].id;

         const result = await getCommentsByPostId(
            postId,
            COMMENTS_PER_PAGE,
            lastCommentId
         );

         if (result) {
            // Append new comments to existing ones
            setComments((prevComments) => [
               ...prevComments,
               ...result.comments,
            ]);
            setHasMore(result.hasMore);
         }
      } catch (err) {
         console.error("Error loading more comments:", err);
         toast.error("Failed to load more comments. Please try again.");
      } finally {
         setIsLoadingMore(false);
      }
   };

   // Handle refresh button click
   const handleRefresh = () => {
      fetchComments();
   };

   // Handle client-side mounting for portal
   useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
   }, []);

   // Fetch comments when dialog opens
   useEffect(() => {
      if (isOpen) {
         fetchComments();
      }
   }, [isOpen, postId, fetchComments]);

   // Function to add a new comment to the list
   const handleAddComment = (newComment?: Comment) => {
      if (!newComment) return;

      // Add the new comment to the top of the list
      setComments((prevComments) => [
         { ...newComment, replies: [] },
         ...prevComments,
      ]);
   };

   // Function to handle replies to comments
   const handleReplySubmit = (reply?: Comment) => {
      if (!reply || !reply.parentId) return;

      // Find the parent comment and add the reply to it
      setComments((prevComments) => {
         return prevComments.map((comment) => {
            if (comment.id === reply.parentId) {
               // Add the reply to this comment (at the beginning for newest first)
               return {
                  ...comment,
                  replies: [reply, ...(comment.replies || [])],
               };
            }
            return comment;
         });
      });

      // This will trigger a re-render in the CommentItem component
      // and clear the pending reply state
      const event = new CustomEvent("replyAdded", {
         detail: { parentId: reply.parentId },
      });
      document.dispatchEvent(event);
   };

   // Function to handle comment deletion
   const handleCommentDeleted = (commentId: string) => {
      // Remove the comment from the list
      setComments((prevComments) =>
         prevComments.filter((comment) => comment.id !== commentId)
      );
   };

   // Function to handle reply deletion
   const handleReplyDeleted = (replyId: string) => {
      // Find the parent comment and remove the reply from it
      setComments((prevComments) => {
         return prevComments.map((comment) => {
            // Check if this comment has the reply
            if (
               comment.replies &&
               comment.replies.some((reply) => reply.id === replyId)
            ) {
               // Remove the reply from this comment
               return {
                  ...comment,
                  replies: comment.replies.filter(
                     (reply) => reply.id !== replyId
                  ),
               };
            }
            return comment;
         });
      });

      // Dispatch a custom event to notify any parent CommentItem components
      // This is a fallback in case the direct prop update doesn't work
      const event = new CustomEvent("replyDeleted", {
         detail: { replyId },
      });
      document.dispatchEvent(event);
   };

   const handleCommentClick = () => {
      if (status === "unauthenticated") {
         setShowAuthDialog(true);
         toast.error("Login to comment");
         return;
      }

      if (status === "authenticated" && !session.user.emailVerified) {
         toast.error(
            "Email not verified. Please confirm your email or visit your profile to verify."
         );
      }
   };

   // Animation variants
   const overlayVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
   };

   const panelVariants = {
      hidden: { x: "100%" },
      visible: {
         x: 0,
         transition: { type: "spring", damping: 30, stiffness: 300 },
      },
   };

   if (!mounted) return null;

   return createPortal(
      <>
         <AnimatePresence>
            {isOpen && (
               <motion.div
                  key="comment-dialog-overlay"
                  className={styles.dialog_overlay}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={overlayVariants}
                  onClick={onCloseAction}
               >
                  <motion.div
                     layoutId={layoutId}
                     className={styles.dialog_panel}
                     variants={panelVariants}
                     initial="hidden"
                     animate="visible"
                     exit="hidden"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <div className={styles.dialog_header}>
                        <h2>Comments on &quot;{postTitle}&quot;</h2>
                        <div className={styles.header_buttons}>
                           <button
                              className={`${styles.action_button} ${styles.refresh_button}`}
                              onClick={handleRefresh}
                              aria-label="Refresh comments"
                           >
                              <MdRefresh />
                           </button>
                           <button
                              className={styles.action_button}
                              onClick={onCloseAction}
                              aria-label="Close"
                           >
                              <IoMdClose />
                           </button>
                        </div>
                     </div>

                     <div className={styles.dialog_content}>
                        <div className={styles.comments_container}>
                           {error ? (
                              <div className={styles.error_container}>
                                 <p>{error}</p>
                                 <button
                                    className={styles.retry_button}
                                    onClick={() => fetchComments()}
                                 >
                                    Try Again
                                 </button>
                              </div>
                           ) : (
                              <CommentList
                                 comments={comments}
                                 postId={postId}
                                 isLoading={isLoading}
                                 isLoadingMore={isLoadingMore}
                                 hasMore={hasMore}
                                 onLoadMore={loadMoreComments}
                                 onReplySubmit={handleReplySubmit}
                                 onCommentDeleted={(commentId) => {
                                    // Check if it's a top-level comment or a reply
                                    const isTopLevelComment = comments.some(
                                       (c) => c.id === commentId
                                    );

                                    if (isTopLevelComment) {
                                       handleCommentDeleted(commentId);
                                    } else {
                                       handleReplyDeleted(commentId);
                                    }
                                 }}
                              />
                           )}
                        </div>

                        <div
                           className={styles.comment_input_container}
                           onClick={handleCommentClick}
                        >
                           <CommentInput
                              postId={postId}
                              isLoading={isLoading}
                              onCommentSubmitted={handleAddComment}
                           />
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         <AuthDialog open={showAuthDialog} action={setShowAuthDialog} />
      </>,
      document.body
   );
}
