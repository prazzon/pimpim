import {
   collection,
   doc,
   getDoc,
   getDocs,
   limit,
   orderBy,
   query,
} from "firebase/firestore";
import { getAuthorById } from "../authors/service";
import { getCategoryById } from "../categories/service";
import { db } from "../firebase";
import { Post } from "../types";
import { getAllViewCounts } from "../views/service";

/**
 * Get trending posts based on view counts with fallback logic
 * @param count Number of posts to return
 * @param categoryId Optional category filter
 * @returns Array of trending posts ordered by view count (highest first)
 */
export async function getTrendingPosts(
   count: number = 10,
   categoryId?: string
): Promise<Post[]> {
   try {
      // Get all view counts from the postViews collection
      const viewCounts = await getAllViewCounts();

      // Sort by view count (highest first)
      const sortedViewCounts = viewCounts.sort(
         (a, b) => b.viewCount - a.viewCount
      );

      // Get trending posts with view counts
      const trendingPosts: Post[] = [];
      const processedPostIds = new Set<string>();

      for (const viewData of sortedViewCounts) {
         if (trendingPosts.length >= count) break;

         try {
            const post = await getPostById(viewData.id);
            if (!post) continue;

            // Apply category filter if specified
            if (categoryId && post.category.id !== categoryId) {
               continue;
            }

            trendingPosts.push(post);
            processedPostIds.add(post.id);
         } catch (error) {
            console.error(`Error fetching post ${viewData.id}:`, error);
            continue;
         }
      }

      // Fallback logic
      if (trendingPosts.length < count) {
         const remainingCount = count - trendingPosts.length;
         if (categoryId) {
            // Category-specific fallback: fill with latest posts from the same category only
            const latestCategoryPosts = await getLatestPostsByCategory(
               remainingCount * 2,
               categoryId,
               processedPostIds
            ); // Get more to account for filtering

            for (const post of latestCategoryPosts) {
               if (trendingPosts.length >= count) break;
               if (!processedPostIds.has(post.id)) {
                  trendingPosts.push(post);
                  processedPostIds.add(post.id);
               }
            }
         } else {
            // General fallback: fill with latest posts from all categories
            const latestPosts = await getLatestPosts(
               remainingCount * 2,
               processedPostIds
            ); // Get more to account for filtering

            for (const post of latestPosts) {
               if (trendingPosts.length >= count) break;
               if (!processedPostIds.has(post.id)) {
                  trendingPosts.push(post);
                  processedPostIds.add(post.id);
               }
            }
         }
      }

      return trendingPosts.slice(0, count);
   } catch (error) {
      console.error("Error getting trending posts:", error);
      // Fallback to latest posts if trending calculation fails
      return getLatestPosts(count);
   }
}

/**
 * Get latest posts for a specific category for fallback when insufficient trending data
 * @param count Number of posts to return
 * @param categoryId The category ID to filter by
 * @param excludeIds Set of post IDs to exclude
 * @returns Array of latest posts in the category
 */
async function getLatestPostsByCategory(
   count: number,
   categoryId: string,
   excludeIds: Set<string> = new Set()
): Promise<Post[]> {
   try {
      const postsRef = collection(db, "posts");
      // Get more posts than needed to account for exclusions
      const q = query(postsRef, orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);
      const posts: Post[] = [];

      for (const docSnap of querySnapshot.docs) {
         if (posts.length >= count) break;
         if (excludeIds.has(docSnap.id)) continue;

         try {
            const {
               authorId,
               categoryId: postCategoryId,
               createdAt,
               updatedAt,
               ...rest
            } = docSnap.data();

            if (postCategoryId !== categoryId) continue;

            const post = {
               id: docSnap.id,
               ...rest,
               author: await getAuthorById(authorId),
               category: await getCategoryById(postCategoryId),
               createdAt: createdAt.toDate(),
               updatedAt: updatedAt.toDate(),
            } as Post;

            posts.push(post);
         } catch (error) {
            console.error(`Error processing post ${docSnap.id}:`, error);
            continue;
         }
      }

      return posts;
   } catch (error) {
      console.error("Error getting latest posts by category:", error);
      return [];
   }
}

/**
 * Get a post by its ID with full author and category data
 * @param postId The post's ID
 * @returns The post object or null if not found
 */
async function getPostById(postId: string): Promise<Post | null> {
   try {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
         return null;
      }

      const { authorId, categoryId, createdAt, updatedAt, ...rest } =
         docSnap.data();

      return {
         id: docSnap.id,
         ...rest,
         author: await getAuthorById(authorId),
         category: await getCategoryById(categoryId),
         createdAt: createdAt.toDate(),
         updatedAt: updatedAt.toDate(),
      } as Post;
   } catch (error) {
      console.error(`Error getting post by ID ${postId}:`, error);
      return null;
   }
}

/**
 * Get latest posts for fallback when insufficient trending data
 * @param count Number of posts to return
 * @param excludeIds Set of post IDs to exclude
 * @returns Array of latest posts
 */
async function getLatestPosts(
   count: number,
   excludeIds: Set<string> = new Set()
): Promise<Post[]> {
   try {
      const postsRef = collection(db, "posts");

      // Get more posts than needed to account for exclusions
      const q = query(
         postsRef,
         orderBy("createdAt", "desc"),
         limit(count + excludeIds.size)
      );

      const querySnapshot = await getDocs(q);

      const posts: Post[] = [];

      for (const docSnap of querySnapshot.docs) {
         if (posts.length >= count) break;
         if (excludeIds.has(docSnap.id)) continue;

         try {
            const { authorId, categoryId, createdAt, updatedAt, ...rest } =
               docSnap.data();

            const post = {
               id: docSnap.id,
               ...rest,
               author: await getAuthorById(authorId),
               category: await getCategoryById(categoryId),
               createdAt: createdAt.toDate(),
               updatedAt: updatedAt.toDate(),
            } as Post;

            posts.push(post);
         } catch (error) {
            console.error(`Error processing post ${docSnap.id}:`, error);
            continue;
         }
      }

      return posts;
   } catch (error) {
      console.error("Error getting latest posts:", error);
      return [];
   }
}

/**
 * Get trending posts for a specific category
 * @param categoryId The category ID to filter by
 * @param count Number of posts to return
 * @returns Array of trending posts for the category
 */
export async function getTrendingPostsByCategory(
   categoryId: string,
   count: number = 10
): Promise<Post[]> {
   return getTrendingPosts(count, categoryId);
}
