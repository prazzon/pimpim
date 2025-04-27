import { type Post } from "@/app/_lib/firebase/types";
import { generateArticleAltText } from "@/app/_lib/seo/imageAlt";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

import { BiTimeFive } from "react-icons/bi";
import CommentButton from "../../Comments/CommentButton";
import CategoryBtn from "../../UI/CategoryBtn/CategoryBtn";
import SocialShare from "../../UI/SocialShare/SocialShare";
import styles from "./Post.module.scss";

type Props = {
   post: Post;
};

async function Post({ post }: Props) {
   // Calculate estimated reading time
   const wordsPerMinute = 200;
   const wordCount = post.content.split(/\s+/).length;
   const readingTime = Math.ceil(wordCount / wordsPerMinute);

   // Extract headings from content for table of contents
   const headings: { id: string; text: string }[] = [];
   const contentWithIds = post.content.replace(
      /<h2>(.*?)<\/h2>/g,
      (_match, text) => {
         const id = text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");
         headings.push({ id, text });
         return `<h2 id="${id}">${text}</h2>`;
      }
   );

   const altText = generateArticleAltText(post.title, post.category?.name);

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

            <p className={styles.date}>
               {formatDistanceToNow(post.createdAt, {
                  addSuffix: true,
               })}
            </p>

            <div className={styles.reading_time}>
               <BiTimeFive />
               {readingTime} min read
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

         {/* Main content layout with sidebar */}
         <div className={styles.post_layout}>
            <div>
               {/* Main content */}
               <div
                  className={styles.content}
                  dangerouslySetInnerHTML={{ __html: contentWithIds }}
               />

               {/* Comments section */}
               <div className={styles.comments_section}>
                  <div className={styles.comment_button_container}>
                     <CommentButton postId={post.id} postTitle={post.title} />
                  </div>
               </div>
            </div>

            {/* Sidebar */}
            <div>
               {/* Table of contents */}
               {headings.length > 0 && (
                  <div className={styles.table_of_contents}>
                     <h3>Table of Contents</h3>
                     <ul>
                        {headings.map((heading) => (
                           <li key={heading.id}>
                              <a href={`#${heading.id}`}>{heading.text}</a>
                           </li>
                        ))}
                     </ul>
                  </div>
               )}

               {/* Social sharing */}
               <div className={styles.social_sharing}>
                  <h3>Share this article</h3>
                  <SocialShare
                     title={post.title}
                     authorName={post.author.name}
                  />
               </div>
            </div>
         </div>
      </div>
   );
}

export default Post;
