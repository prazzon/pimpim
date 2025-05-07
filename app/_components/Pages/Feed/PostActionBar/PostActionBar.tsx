"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { FaShareNodes } from "react-icons/fa6";
import CommentDialog from "../../../Comments/CommentDialog";
import SocialShare from "../../../UI/SocialShare/SocialShare";
import styles from "./PostActionBar.module.scss";

type PostActionBarProps = {
   postId: string;
   postTitle: string;
   authorName: string;
};

export default function PostActionBar({
   postId,
   postTitle,
   authorName,
}: PostActionBarProps) {
   const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
   const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
   const shareDropdownRef = useRef<HTMLDivElement>(null);
   const layoutId = `comment-dialog-${postId}`;

   // Handle opening and closing the comment dialog
   const handleOpenCommentDialog = () => {
      setIsCommentDialogOpen(true);
      // Close share dropdown if open
      if (isShareDropdownOpen) {
         setIsShareDropdownOpen(false);
      }
   };

   const handleCloseCommentDialog = () => {
      setIsCommentDialogOpen(false);
   };

   // Handle toggling the share dropdown
   const handleToggleShareDropdown = () => {
      setIsShareDropdownOpen(!isShareDropdownOpen);
   };

   // Close dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            shareDropdownRef.current &&
            !shareDropdownRef.current.contains(event.target as Node)
         ) {
            setIsShareDropdownOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   // Animation variants for the share dropdown
   const dropdownVariants = {
      hidden: {
         opacity: 0,
         y: 20,
         scale: 0.95,
      },
      visible: {
         opacity: 1,
         y: 0,
         scale: 1,
         transition: {
            duration: 0.2,
            ease: "easeOut",
         },
      },
      exit: {
         opacity: 0,
         y: 10,
         scale: 0.95,
         transition: {
            duration: 0.15,
            ease: "easeIn",
         },
      },
   };

   return (
      <>
         <div className={styles.fixed_action_bar}>
            <div className={styles.action_buttons}>
               <button
                  className={styles.action_button}
                  onClick={handleOpenCommentDialog}
                  aria-label="View comments"
               >
                  <FaRegComment />
                  <span>Comments</span>
               </button>

               <div className={styles.share_container} ref={shareDropdownRef}>
                  <button
                     className={`${styles.action_button} ${
                        isShareDropdownOpen ? styles.active : ""
                     }`}
                     onClick={handleToggleShareDropdown}
                     aria-label="Share this post"
                     aria-expanded={isShareDropdownOpen}
                  >
                     <FaShareNodes />
                     <span>Share</span>
                  </button>

                  <AnimatePresence>
                     {isShareDropdownOpen && (
                        <motion.div
                           className={styles.share_dropdown}
                           initial="hidden"
                           animate="visible"
                           exit="exit"
                           variants={dropdownVariants}
                        >
                           <div className={styles.dropdown_header}>
                              <h3>Share this article</h3>
                           </div>
                           <div className={styles.dropdown_content}>
                              <SocialShare
                                 title={postTitle}
                                 authorName={authorName}
                                 className={styles.social_share}
                              />
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
         </div>

         <CommentDialog
            postId={postId}
            postTitle={postTitle}
            isOpen={isCommentDialogOpen}
            onCloseAction={handleCloseCommentDialog}
            layoutId={layoutId}
         />
      </>
   );
}
