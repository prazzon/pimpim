"use client";

import {
   deleteComment,
   toggleLikeComment,
} from "@/app/_lib/firebase/comments/actions";
import { Comment } from "@/app/_lib/firebase/types";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaChevronDown, FaChevronUp, FaReply } from "react-icons/fa";
import { MdRemoveCircle } from "react-icons/md";
import { toast } from "sonner";
import CommentInput from "../Comments/CommentInput";
import { AlertDialog } from "../UI/AlertDialog/AlertDialog";
import UserAvatar from "../UI/UserAvatar/UserAvatar";
import styles from "./Comments.module.scss";

type CommentItemProps = {
   comment: Comment & { replies?: Comment[] };
   postId: string;
   isReply?: boolean;
   onReplySubmit?: (comment?: Comment) => void;
   onCommentDeleted?: (commentId: string) => void;
};

export default function CommentItem({
   comment,
   postId,
   isReply = false,
   onReplySubmit,
   onCommentDeleted,
}: CommentItemProps) {
   const [showReplyInput, setShowReplyInput] = useState(false);
   const [showReplies, setShowReplies] = useState(false);
   const [isLiking, setIsLiking] = useState(false);
   const [isLiked, setIsLiked] = useState(false);
   const [currentLikes, setCurrentLikes] = useState<string[]>(
      comment.likes || []
   );
   const [pendingReply, setPendingReply] = useState<Comment | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [, startTransition] = useTransition(); // Using only startTransition
   const { data: session } = useSession();
   const userId = session?.user?.id;

   // Check if the current user is the author of the comment
   const isCommentAuthor = userId === comment.userId;

   // Initialize isLiked state based on likes array
   useEffect(() => {
      setIsLiked(userId ? comment.likes.includes(userId) : false);
      setCurrentLikes(comment.likes || []);
   }, [userId, comment.likes]);

   // Listen for reply added event
   useEffect(() => {
      const handleReplyAdded = (event: CustomEvent) => {
         if (event.detail.parentId === comment.id) {
            // Clear the pending reply state and hide the reply input
            // when the reply is added to the comment
            setPendingReply(null);
            setShowReplyInput(false);
         }
      };

      // Add event listener
      document.addEventListener(
         "replyAdded",
         handleReplyAdded as EventListener
      );

      // Clean up
      return () => {
         document.removeEventListener(
            "replyAdded",
            handleReplyAdded as EventListener
         );
      };
   }, [comment.id]);

   // Listen for reply deleted event
   useEffect(() => {
      const handleReplyDeleted = (event: CustomEvent) => {
         if (event.detail.parentId === comment.id) {
            // If this comment is the parent of the deleted reply,
            // update the replies list by filtering out the deleted reply
            if (comment.replies && comment.replies.length > 0) {
               const updatedReplies = comment.replies.filter(
                  (reply) => reply.id !== event.detail.replyId
               );

               // Update the comment's replies array
               comment.replies = updatedReplies;

               // Force a re-render
               setCurrentLikes([...currentLikes]);
            }
         }
      };

      // Add event listener
      document.addEventListener(
         "replyDeleted",
         handleReplyDeleted as EventListener
      );

      // Clean up
      return () => {
         document.removeEventListener(
            "replyDeleted",
            handleReplyDeleted as EventListener
         );
      };
   }, [comment, comment.id, comment.replies, currentLikes]);

   const likeCount = currentLikes.length;

   const handleLikeToggle = async () => {
      if (!userId) {
         toast.error("Please login to like comments");
         return;
      }

      if (!session?.user?.emailVerified) {
         toast.error("Please verify your email to like comments");
         return;
      }

      try {
         setIsLiking(true);

         // Optimistic update
         const newLikes = [...comment.likes];
         const userLikedIndex = newLikes.indexOf(userId);

         if (userLikedIndex === -1) {
            // Add like
            newLikes.push(userId);
         } else {
            // Remove like
            newLikes.splice(userLikedIndex, 1);
         }

         // Update the UI immediately
         setCurrentLikes(newLikes);
         setIsLiked(userLikedIndex === -1);

         // Send the update to the server
         await toggleLikeComment(comment.id, userId);
      } catch (error) {
         console.error("Error toggling like:", error);
         toast.error("Failed to like comment. Please try again.");

         // Revert the optimistic update on error
         setIsLiked(comment.likes.includes(userId));
      } finally {
         setIsLiking(false);
      }
   };

   // Check if user can reply (logged in and verified)
   const canReply = !!userId && !!session?.user?.emailVerified;

   const handleReplyClick = () => {
      if (!userId) {
         toast.error("Please login to reply to comments");
         return;
      }

      if (!session?.user?.emailVerified) {
         toast.error("Please verify your email to reply to comments");
         return;
      }

      setShowReplyInput(!showReplyInput);
   };

   const handleCancelReply = () => {
      setShowReplyInput(false);
   };

   const handleToggleReplies = () => {
      setShowReplies((prev) => !prev);
   };

   const handleReplySubmitted = (newReply?: Comment) => {
      if (!newReply) return;

      // Keep the input visible but set the pending reply
      setPendingReply(newReply);

      // Ensure replies are visible when replying
      if (!showReplies) {
         setShowReplies(true);
      }

      // Use startTransition to handle the reply submission
      startTransition(() => {
         // Notify parent component about the new reply
         if (onReplySubmit) {
            onReplySubmit(newReply);
         }
      });
   };

   return (
      <div className={`${styles.comment_item} ${isReply ? styles.reply : ""}`}>
         <div className={styles.comment_avatar}>
            <UserAvatar
               name={comment.user?.name || "User"}
               image={comment.user?.profileImage}
               darkBackground={true}
            />
         </div>

         <div className={styles.comment_content}>
            <div className={styles.comment_header}>
               <span className={styles.comment_author}>
                  {comment.user?.name || "Anonymous"}
               </span>
               <span className={styles.comment_time}>
                  {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
               </span>
            </div>

            <p className={styles.comment_text}>{comment.text}</p>

            <div className={styles.comment_actions}>
               <button
                  className={`${styles.action_button} ${isLiked ? styles.liked : ""} ${isLiking ? styles.disabled : ""}`}
                  onClick={handleLikeToggle}
               >
                  {isLiked ? <BiSolidLike /> : <BiLike />}
                  <span>{likeCount > 0 ? likeCount : ""}</span>
               </button>

               {!isReply && (
                  <button
                     className={`${styles.action_button} ${!canReply || !!pendingReply ? styles.disabled : ""}`}
                     onClick={handleReplyClick}
                  >
                     <FaReply />
                     <span>Reply</span>
                  </button>
               )}

               {!isReply && comment.replies && comment.replies.length > 0 && (
                  <button
                     className={`${styles.action_button} ${styles.view_replies_button}`}
                     onClick={handleToggleReplies}
                  >
                     {showReplies ? <FaChevronUp /> : <FaChevronDown />}
                     <span>{showReplies ? "Hide" : "View"} Replies</span>
                     <span className={styles.replies_count}>
                        {comment.replies.length}
                     </span>
                  </button>
               )}

               {isCommentAuthor && (
                  <button
                     className={`${styles.action_button} ${styles.delete_button} ${isDeleting ? styles.disabled : ""}`}
                     onClick={() => setShowDeleteDialog(true)}
                     disabled={isDeleting}
                  >
                     <MdRemoveCircle />
                  </button>
               )}
            </div>

            <AnimatePresence>
               {showReplyInput && (
                  <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: "auto" }}
                     exit={{ opacity: 0, height: 0 }}
                     className={styles.reply_input}
                  >
                     <CommentInput
                        postId={postId}
                        parentId={comment.id}
                        onCommentSubmitted={handleReplySubmitted}
                        onCancel={handleCancelReply}
                        placeholder="Write a reply..."
                     />
                  </motion.div>
               )}
            </AnimatePresence>

            {!isReply && (
               <div className={styles.replies}>
                  {/* Replies Container with Animation */}
                  <AnimatePresence>
                     {showReplies &&
                        comment.replies &&
                        comment.replies.length > 0 && (
                           <motion.div
                              initial={{
                                 opacity: 0,
                                 height: 0,
                                 overflow: "hidden",
                              }}
                              animate={{
                                 opacity: 1,
                                 height: "auto",
                                 transition: {
                                    height: { duration: 0.3 },
                                    opacity: { duration: 0.3, delay: 0.1 },
                                 },
                              }}
                              exit={{
                                 opacity: 0,
                                 height: 0,
                                 transition: {
                                    height: { duration: 0.3 },
                                    opacity: { duration: 0.2 },
                                 },
                              }}
                              className={styles.replies_container}
                           >
                              {/* Actual Replies */}
                              {comment.replies.map((reply) => (
                                 <motion.div
                                    key={reply.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{
                                       duration: 0.3,
                                       type: "spring",
                                       stiffness: 500,
                                       damping: 30,
                                       delay: 0.1,
                                    }}
                                 >
                                    <CommentItem
                                       comment={reply}
                                       postId={postId}
                                       isReply={true}
                                       onCommentDeleted={onCommentDeleted}
                                    />
                                 </motion.div>
                              ))}
                           </motion.div>
                        )}
                  </AnimatePresence>
               </div>
            )}
         </div>

         {/* Delete Confirmation Dialog */}
         <AlertDialog
            open={showDeleteDialog}
            onOpenChangeAction={setShowDeleteDialog}
            title="Delete Comment"
            description="Are you sure you want to delete this comment? This action cannot be undone."
            cancelText="Cancel"
            confirmText="Delete"
            onConfirmAction={handleDeleteComment}
            isConfirmLoading={isDeleting}
            isDanger={true}
         />
      </div>
   );

   // Function to handle comment deletion
   async function handleDeleteComment() {
      if (!userId || userId !== comment.userId) {
         toast.error("You can only delete your own comments");
         setShowDeleteDialog(false);
         return;
      }

      try {
         setIsDeleting(true);

         // Call the delete comment action
         await deleteComment(comment.id);

         // Close the dialog
         setShowDeleteDialog(false);

         // Notify parent component about the deleted comment
         if (onCommentDeleted) {
            onCommentDeleted(comment.id);
         }

         // If this is a reply, dispatch an event to notify the parent comment
         if (isReply && comment.parentId) {
            // This will trigger a re-render in the parent CommentItem component
            const event = new CustomEvent("replyDeleted", {
               detail: { replyId: comment.id, parentId: comment.parentId },
            });
            document.dispatchEvent(event);
         }
      } catch (error) {
         console.error("Error deleting comment:", error);
         toast.error("Failed to delete comment. Please try again.");
      } finally {
         setIsDeleting(false);
      }
   }
}
