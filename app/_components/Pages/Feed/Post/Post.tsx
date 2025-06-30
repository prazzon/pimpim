"use client";

import { type Post } from "@/app/_lib/firebase/types";
import { incrementViewCount } from "@/app/_lib/firebase/views/actions";
import { generateArticleAltText } from "@/app/_lib/seo/imageAlt";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useEffect } from "react";
import { BiTimeFive } from "react-icons/bi";
import { FiEye } from "react-icons/fi";
import CategoryBtn from "../../../UI/CategoryBtn/CategoryBtn";
import PostContent from "../../../UI/PostContent/PostContent";
import PostActionBar from "../PostActionBar/PostActionBar";
import styles from "./Post.module.scss";

type Props = {
   post: Post;
   viewCount: number;
};

function Post({ post, viewCount }: Props) {
   // Calculate estimated reading time
   const wordsPerMinute = 200;
   const wordCount = post.content.split(/\s+/).length;
   const readingTime = Math.ceil(wordCount / wordsPerMinute);

   const altText = generateArticleAltText(post.title, post.category?.name);

   const hasBeenModified = post.updatedAt > post.createdAt;

   // Track view count when component mounts
   useEffect(() => {
      const trackView = async () => {
         try {
            await incrementViewCount(post.id);
         } catch (error) {
            // Silently fail - view tracking shouldn't break the user experience
            console.error("Failed to track view for post:", post.id, error);
         }
      };

      trackView();
   }, [post.id]);

   return (
      <div className={styles.post}>
         {/* Header with category and metadata */}
         <div className={styles.header}>
            {post.category && (
               <CategoryBtn
                  href={`/categories/${post.category.slug}`}
                  text={post.category.name}
               />
            )}

            <div className={styles.metadata}>
               <p className={styles.date}>
                  {formatDistanceToNow(post.createdAt, {
                     addSuffix: true,
                  })}
               </p>
               {hasBeenModified && (
                  <p className={styles.modified}>
                     <span>
                        edited{" "}
                        {formatDistanceToNow(post.updatedAt, {
                           addSuffix: true,
                        })}
                     </span>
                  </p>
               )}
               <div className={styles.reading_time}>
                  <BiTimeFive />
                  {readingTime} min read
               </div>
               {viewCount !== undefined && viewCount > 0 && (
                  <div className={styles.view_count}>
                     <FiEye />
                     {viewCount.toLocaleString()} views
                  </div>
               )}
            </div>
         </div>

         {/* Post title */}
         <h1 className={styles.title}>{post.title}</h1>

         {/* Featured image */}
         <div className={styles.poster}>
            <Image src={post.poster} alt={altText} fill priority />
         </div>

         {/* Summary */}
         <p className={styles.summary}>{post.summary}</p>

         <div className={styles.post_layout}>
            <PostContent content={post.content} className={styles.content} />
         </div>
         <PostActionBar
            postId={post.id}
            postTitle={post.title}
            authorName={post.author.name}
         />
      </div>
   );
}

export default Post;
