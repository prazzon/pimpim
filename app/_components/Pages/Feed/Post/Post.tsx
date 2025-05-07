import { type Post } from "@/app/_lib/firebase/types";
import { generateArticleAltText } from "@/app/_lib/seo/imageAlt";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { BiTimeFive } from "react-icons/bi";
import CategoryBtn from "../../../UI/CategoryBtn/CategoryBtn";
import PostActionBar from "../PostActionBar/PostActionBar";
import styles from "./Post.module.scss";

type Props = {
   post: Post;
};

async function Post({ post }: Props) {
   // Calculate estimated reading time
   const wordsPerMinute = 200;
   const wordCount = post.content.split(/\s+/).length;
   const readingTime = Math.ceil(wordCount / wordsPerMinute);

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

         <div className={styles.post_layout}>
            <div
               className={styles.content}
               dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Action bar - sticky to the post content */}
            <PostActionBar
               postId={post.id}
               postTitle={post.title}
               authorName={post.author.name}
            />
         </div>
      </div>
   );
}

export default Post;
