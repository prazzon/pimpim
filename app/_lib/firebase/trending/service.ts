import {
   collection,
   getDocs,
   limit,
   orderBy,
   query,
   where,
} from "firebase/firestore";
import { getCategoryBySlug } from "../categories/service";
import { db } from "../firebase";
import { Post } from "../types";
import { getAllViewCounts } from "../views/service";

// Internal types for batch processing
import type { Author, Category } from "../types";

interface PostData {
   id: string;
   data: Omit<Post, "id" | "author" | "category"> & {
      authorId: string;
      categoryId: string;
      createdAt: { toDate: () => Date };
      updatedAt: { toDate: () => Date };
   };
}

/**
 * Get multiple posts by their IDs with optimized batch queries
 * @param postIds Array of post IDs to fetch
 * @returns Array of posts with author and category data
 */
async function getPostsByIds(postIds: string[]): Promise<Post[]> {
   if (postIds.length === 0) return [];

   try {
      const posts: Post[] = [];

      // Fetch posts in batches (Firestore 'in' query limit is 10)
      const batchSize = 10;
      for (let i = 0; i < postIds.length; i += batchSize) {
         const batch = postIds.slice(i, i + batchSize);

         const postsRef = collection(db, "posts");
         const q = query(postsRef, where("__name__", "in", batch));
         const querySnapshot = await getDocs(q);

         // Collect all author and category IDs for batch fetching
         const authorIds = new Set<string>();
         const categoryIds = new Set<string>();
         const postData: PostData[] = [];

         querySnapshot.docs.forEach((doc) => {
            const data = doc.data() as Omit<
               Post,
               "id" | "author" | "category"
            > & {
               authorId: string;
               categoryId: string;
               createdAt: { toDate: () => Date };
               updatedAt: { toDate: () => Date };
            };
            postData.push({ id: doc.id, data });
            if (data.authorId) authorIds.add(data.authorId);
            if (data.categoryId) categoryIds.add(data.categoryId);
         });

         // Batch fetch authors and categories
         const [authorsMap, categoriesMap] = await Promise.all([
            getAuthorsByIds(Array.from(authorIds)),
            getCategoriesByIds(Array.from(categoryIds)),
         ]);

         // Construct posts with related data
         for (const { id, data } of postData) {
            const { authorId, categoryId, createdAt, updatedAt, ...rest } =
               data;

            const post = {
               id,
               ...rest,
               author: authorsMap.get(authorId) || null,
               category: categoriesMap.get(categoryId) || null,
               createdAt: createdAt.toDate(),
               updatedAt: updatedAt.toDate(),
            } as Post;

            posts.push(post);
         }
      }

      return posts;
   } catch (error) {
      console.error("Error getting posts by IDs:", error);
      return [];
   }
}

/**
 * Get multiple authors by their IDs
 * @param authorIds Array of author IDs
 * @returns Map of author ID to author data
 */
async function getAuthorsByIds(
   authorIds: string[]
): Promise<Map<string, Author>> {
   const authorsMap = new Map<string, Author>();

   if (authorIds.length === 0) return authorsMap;

   try {
      const batchSize = 10;
      for (let i = 0; i < authorIds.length; i += batchSize) {
         const batch = authorIds.slice(i, i + batchSize);

         const authorsRef = collection(db, "authors");
         const q = query(authorsRef, where("__name__", "in", batch));
         const querySnapshot = await getDocs(q);

         querySnapshot.docs.forEach((doc) => {
            authorsMap.set(doc.id, {
               id: doc.id,
               ...(doc.data() as Omit<Author, "id">),
            });
         });
      }
   } catch (error) {
      console.error("Error getting authors by IDs:", error);
   }

   return authorsMap;
}

/**
 * Get multiple categories by their IDs
 * @param categoryIds Array of category IDs
 * @returns Map of category ID to category data
 */
async function getCategoriesByIds(
   categoryIds: string[]
): Promise<Map<string, Category>> {
   const categoriesMap = new Map<string, Category>();

   if (categoryIds.length === 0) return categoriesMap;

   try {
      const batchSize = 10;
      for (let i = 0; i < categoryIds.length; i += batchSize) {
         const batch = categoryIds.slice(i, i + batchSize);

         const categoriesRef = collection(db, "categories");
         const q = query(categoriesRef, where("__name__", "in", batch));
         const querySnapshot = await getDocs(q);

         querySnapshot.docs.forEach((doc) => {
            categoriesMap.set(doc.id, {
               id: doc.id,
               ...(doc.data() as Omit<Category, "id">),
            });
         });
      }
   } catch (error) {
      console.error("Error getting categories by IDs:", error);
   }

   return categoriesMap;
}

/**
 * Get trending posts based on view counts with fallback logic
 * @param count Number of posts to return
 * @param categorySlug Optional category filter
 * @returns Array of trending posts ordered by view count (highest first)
 */
export async function getTrendingPosts(
   count: number = 10,
   categorySlug?: string
): Promise<Post[]> {
   try {
      // Get all view counts from the postViews collection
      const viewCounts = await getAllViewCounts();

      // Sort by view count (highest first)
      const sortedViewCounts = viewCounts.sort(
         (a, b) => b.viewCount - a.viewCount
      );

      // Get trending posts with view counts using optimized batch queries
      const trendingPosts: Post[] = [];
      const processedPostIds = new Set<string>();

      // Process posts in batches to reduce individual queries
      const batchSize = Math.min(count * 2, 20); // Get more than needed to account for filtering
      const postIds = sortedViewCounts.slice(0, batchSize).map((v) => v.id);

      if (postIds.length > 0) {
         const posts = await getPostsByIds(postIds);

         for (const viewData of sortedViewCounts) {
            if (trendingPosts.length >= count) break;

            const post = posts.find((p) => p.id === viewData.id);
            if (!post) continue;

            // Apply category filter if specified
            if (categorySlug && post.category.slug !== categorySlug) {
               continue;
            }

            trendingPosts.push(post);
            processedPostIds.add(post.id);
         }
      }

      // Fallback logic
      if (trendingPosts.length < count) {
         const remainingCount = count - trendingPosts.length;
         if (categorySlug) {
            // Category-specific fallback: fill with latest posts from the same category only
            const latestCategoryPosts = await getLatestPostsByCategory(
               remainingCount * 2,
               categorySlug,
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
 * @param categorySlug The category ID to filter by
 * @param excludeIds Set of post IDs to exclude
 * @returns Array of latest posts in the category
 */
async function getLatestPostsByCategory(
   count: number,
   categorySlug: string,
   excludeIds: Set<string> = new Set()
): Promise<Post[]> {
   try {
      // First get the category ID
      const category = await getCategoryBySlug(categorySlug);
      if (!category) return [];

      const postsRef = collection(db, "posts");

      // Query posts by category and order by creation date
      const q = query(
         postsRef,
         where("categoryId", "==", category.id),
         orderBy("createdAt", "desc"),
         limit(count * 2) // Get more to account for exclusions
      );

      const querySnapshot = await getDocs(q);

      // Collect all author and category IDs for batch fetching
      const authorIds = new Set<string>();
      const categoryIds = new Set<string>();
      const postData: PostData[] = [];

      querySnapshot.docs.forEach((doc) => {
         if (excludeIds.has(doc.id)) return;

         const data = doc.data() as Omit<Post, "id" | "author" | "category"> & {
            authorId: string;
            categoryId: string;
            createdAt: { toDate: () => Date };
            updatedAt: { toDate: () => Date };
         };
         postData.push({ id: doc.id, data });
         if (data.authorId) authorIds.add(data.authorId);
         if (data.categoryId) categoryIds.add(data.categoryId);
      });

      // Batch fetch authors and categories
      const [authorsMap, categoriesMap] = await Promise.all([
         getAuthorsByIds(Array.from(authorIds)),
         getCategoriesByIds(Array.from(categoryIds)),
      ]);

      // Construct posts with related data
      const posts: Post[] = [];
      for (const { id, data } of postData) {
         if (posts.length >= count) break;

         const { authorId, categoryId, createdAt, updatedAt, ...rest } = data;

         const post = {
            id,
            ...rest,
            author: authorsMap.get(authorId) || null,
            category: categoriesMap.get(categoryId) || null,
            createdAt: createdAt.toDate(),
            updatedAt: updatedAt.toDate(),
         } as Post;

         posts.push(post);
      }

      return posts;
   } catch (error) {
      console.error("Error getting latest posts by category:", error);
      return [];
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
         limit(count * 2) // Get more to account for exclusions
      );

      const querySnapshot = await getDocs(q);

      // Collect all author and category IDs for batch fetching
      const authorIds = new Set<string>();
      const categoryIds = new Set<string>();
      const postData: PostData[] = [];

      querySnapshot.docs.forEach((doc) => {
         if (excludeIds.has(doc.id)) return;

         const data = doc.data() as Omit<Post, "id" | "author" | "category"> & {
            authorId: string;
            categoryId: string;
            createdAt: { toDate: () => Date };
            updatedAt: { toDate: () => Date };
         };
         postData.push({ id: doc.id, data });
         if (data.authorId) authorIds.add(data.authorId);
         if (data.categoryId) categoryIds.add(data.categoryId);
      });

      // Batch fetch authors and categories
      const [authorsMap, categoriesMap] = await Promise.all([
         getAuthorsByIds(Array.from(authorIds)),
         getCategoriesByIds(Array.from(categoryIds)),
      ]);

      // Construct posts with related data
      const posts: Post[] = [];
      for (const { id, data } of postData) {
         if (posts.length >= count) break;

         const { authorId, categoryId, createdAt, updatedAt, ...rest } = data;

         const post = {
            id,
            ...rest,
            author: authorsMap.get(authorId) || null,
            category: categoriesMap.get(categoryId) || null,
            createdAt: createdAt.toDate(),
            updatedAt: updatedAt.toDate(),
         } as Post;

         posts.push(post);
      }

      return posts;
   } catch (error) {
      console.error("Error getting latest posts:", error);
      return [];
   }
}
