"use client";

import { createComment } from "@/app/_lib/firebase/comments/actions";
import { Comment } from "@/app/_lib/firebase/types";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import Button from "../UI/Button/Button";
import Loader from "../UI/Loader/Loader";
import styles from "./Comments.module.scss";

type CommentInputProps = {
   postId: string;
   parentId?: string;
   onCommentSubmitted?: (comment?: Comment) => void;
   isLoading?: boolean;
   onCancel?: () => void;
   placeholder?: string;
};

export default function CommentInput({
   postId,
   parentId,
   onCommentSubmitted,
   isLoading,
   onCancel,
   placeholder = "Write your comment here...",
}: CommentInputProps) {
   const [isPending, startTransition] = useTransition();
   const [commentText, setCommentText] = useState("");
   const { data: session, status } = useSession();

   const isLoggedIn = status === "authenticated";
   const isVerified = isLoggedIn && session?.user?.emailVerified;
   const isDisabled = !isLoggedIn || !isVerified;

   const handleInputClick = () => {
      if (!isLoggedIn) {
         toast.error("Please login to comment");
         return;
      }

      if (!isVerified) {
         toast.error("Please verify your email to comment");
         return;
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!commentText.trim()) {
         toast.error("Comment cannot be empty");
         return;
      }

      if (!isLoggedIn) {
         toast.error("Please login to comment");
         return;
      }

      if (!isVerified) {
         toast.error("Please verify your email to comment");
         return;
      }

      try {
         // Create the comment in the database
         startTransition(async () => {
            // Create a temporary optimistic comment (optional)
            const tempComment: Comment = {
               id: `temp-${Date.now()}`,
               postId,
               userId: session.user.id,
               text: commentText.trim(),
               createdAt: new Date(),
               likes: [],
               ...(parentId && { parentId }),
               user: {
                  name: session.user.name || "You",
                  profileImage: session.user.image,
               },
            };

            // Clear the input immediately for better UX
            setCommentText("");

            // Notify parent component about the new comment for optimistic UI update
            if (onCommentSubmitted) {
               // Pass the temp comment for optimistic rendering
               onCommentSubmitted(tempComment);
            }

            await createComment(
               postId,
               session.user.id,
               commentText.trim(),
               parentId
            );
         });
      } catch (error) {
         console.error("Error posting comment:", error);
         toast.error("Failed to post comment. Please try again.");
      }
   };

   return (
      <form className={styles.comment_form} onSubmit={handleSubmit}>
         <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onClick={isDisabled ? handleInputClick : undefined}
            placeholder={
               isDisabled
                  ? isLoggedIn
                     ? "Verify your email to comment"
                     : "Login to comment"
                  : isPending
                    ? "Submitting reply..."
                    : placeholder
            }
            disabled={isDisabled || isPending || isLoading}
            className={`${styles.comment_textarea} ${isDisabled || isPending || isLoading ? styles.disabled : ""}`}
         />
         <div className={styles.form_actions}>
            {parentId && onCancel && (
               <Button
                  btnStyle="secondary"
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     onCancel();
                  }}
                  disabled={isPending}
               >
                  Cancel
               </Button>
            )}
            <Button
               btnStyle="primary"
               type="normal"
               disabled={isDisabled || isPending || isLoading}
            >
               {isPending ? <Loader /> : parentId ? "Reply" : "Post Comment"}
            </Button>
         </div>
      </form>
   );
}
