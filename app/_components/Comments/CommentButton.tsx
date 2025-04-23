"use client";

import { useState } from "react";
import { FaRegComment } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import styles from "./Comments.module.scss";

type CommentButtonProps = {
   postId: string;
   postTitle: string;
};

export default function CommentButton({
   postId,
   postTitle,
}: CommentButtonProps) {
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const layoutId = `comment-dialog-${postId}`;

   const handleOpenDialog = () => {
      setIsDialogOpen(true);
   };

   const handleCloseDialog = () => {
      setIsDialogOpen(false);
   };

   return (
      <>
         <button
            className={styles.comment_button}
            onClick={handleOpenDialog}
            aria-label="View comments"
         >
            <FaRegComment />
            <span>View Comments</span>
         </button>

         <CommentDialog
            postId={postId}
            postTitle={postTitle}
            isOpen={isDialogOpen}
            onCloseAction={handleCloseDialog}
            layoutId={layoutId}
         />
      </>
   );
}
