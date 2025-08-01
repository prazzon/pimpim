import {
   collection,
   doc,
   getDoc,
   getDocs,
   limit,
   orderBy,
   query,
   startAfter,
   where,
} from "firebase/firestore";
import { getAuthorById, getAuthorsByIds } from "../authors/service";
import {
   getCategoriesByIds,
   getCategoryById,
   getCategoryBySlug,
} from "../categories/service";
import { db } from "../firebase";
import { Post } from "../types";

/**
 * Get all posts from the database, ordered by creation date (newest first)
 * @returns An array of post objects with author and category data
 */
export async function getPosts(numberOfPosts?: number) {
   const postsRef = collection(db, "posts");

   // Create base query ordered by creation date
   let q = query(postsRef, orderBy("createdAt", "desc"));

   // If numberOfPosts is specified, add limit to query
   if (numberOfPosts) {
      q = query(q, limit(numberOfPosts));
   }

   const querySnapshot = await getDocs(q);

   const posts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
         const { authorId, categoryId, createdAt, updatedAt, ...rest } =
            doc.data();

         return {
            id: doc.id,
            ...rest,
            author: await getAuthorById(authorId),
            category: await getCategoryById(categoryId),
            createdAt: createdAt.toDate(),
            updatedAt: updatedAt.toDate(),
         } as Post;
      })
   );

   return posts;
}

/**
 * Get paginated posts from the database, ordered by creation date (newest first)
 * @param pageSize Number of posts to fetch per page
 * @param lastPostId ID of the last post from the previous page (for pagination)
 * @returns An array of post objects with author and category data and a flag indicating if more posts are available
 */
export async function getPaginatedPosts(
   pageSize: number = 2,
   lastPostId?: string
) {
   const postsRef = collection(db, "posts");
   let q;

   // If we have a lastPostId, use it as a cursor for pagination
   if (lastPostId) {
      // Get the last document as a reference point
      const lastPostDoc = await getDoc(doc(db, "posts", lastPostId));

      if (!lastPostDoc.exists()) {
         throw new Error(`Post with id ${lastPostId} not found`);
      }

      // Create a query that starts after the last document
      q = query(
         postsRef,
         orderBy("createdAt", "desc"),
         startAfter(lastPostDoc),
         limit(pageSize)
      );
   } else {
      // Initial query without a starting point
      q = query(postsRef, orderBy("createdAt", "desc"), limit(pageSize));
   }

   const querySnapshot = await getDocs(q);

   // Check if there are more posts to load
   const hasMore = querySnapshot.docs.length === pageSize;

   const posts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
         const { authorId, categoryId, createdAt, updatedAt, ...rest } =
            doc.data();

         return {
            id: doc.id,
            ...rest,
            author: await getAuthorById(authorId),
            category: await getCategoryById(categoryId),
            createdAt: createdAt.toDate(),
            updatedAt: updatedAt.toDate(),
         } as Post;
      })
   );

   return {
      posts,
      hasMore,
   };
}

/**
 * Get all posts for a specific category by its slug
 * @param categorySlug The category's slug
 * @returns An array of post objects with author and category data, or null if category not found
 */
export async function getPostsByCategorySlug(categorySlug: string) {
   const postsRef = collection(db, "posts");

   const categoryId = (await getCategoryBySlug(categorySlug))?.id;

   if (!categoryId) return null;

   const q = query(
      postsRef,
      where("categoryId", "==", categoryId),
      orderBy("createdAt", "desc")
   );

   const querySnapshot = await getDocs(q);

   const posts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
         const { authorId, categoryId, createdAt, updatedAt, ...rest } =
            doc.data();

         return {
            id: doc.id,
            ...rest,
            author: await getAuthorById(authorId),
            category: await getCategoryById(categoryId),
            createdAt: createdAt.toDate(),
            updatedAt: updatedAt.toDate(),
         } as Post;
      })
   );

   return posts;
}

/**
 * Get a post by its ID
 * @param id The post's ID
 * @returns The post object with author and category data
 */
export async function getPostById(id: string) {
   const docRef = doc(db, "posts", id);

   const docSnap = await getDoc(docRef);

   if (!docSnap.exists()) {
      throw new Error(`Post with id ${id} not found`);
   }

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

   return post;
}

/**
 * Get a post by its slug
 * @param slug The post's slug
 * @returns The post object with author and category data, or null if not found
 */
export async function getPostBySlug(slug: string) {
   const postsRef = collection(db, "posts");

   const q = query(postsRef, where("slug", "==", slug));

   const querySnapshot = await getDocs(q);

   // if (querySnapshot.empty) {
   //    throw new Error(`Post with slug ${slug} not found`);
   // } //! REMOVE LATER

   if (querySnapshot.empty) return null; //! REMOVE LATER

   const postDoc = querySnapshot.docs[0];

   const { authorId, categoryId, createdAt, updatedAt, ...rest } =
      postDoc.data();

   const post = {
      id: postDoc.id,
      ...rest,
      author: await getAuthorById(authorId),
      category: await getCategoryById(categoryId),
      createdAt: createdAt.toDate(),
      updatedAt: updatedAt.toDate(),
   } as Post;

   return post;

   // return {
   //    id: postDoc.id,
   //    ...postDoc.data(),
   //    createdAt: postDoc.data().createdAt.toDate(),
   //    updatedAt: postDoc.data().updatedAt.toDate(),
   // } as Post;
}

/**
 * Get all posts by a specific author
 * @param authorId The author's ID
 * @returns An array of post objects with author and category data
 */
export async function getPostsByAuthorId(authorId: string) {
   const postsRef = collection(db, "posts");

   const q = query(
      postsRef,
      where("authorId", "==", authorId),
      orderBy("createdAt", "desc")
   );

   const querySnapshot = await getDocs(q);

   const posts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
         const { authorId, categoryId, createdAt, updatedAt, ...rest } =
            doc.data();

         return {
            id: doc.id,
            ...rest,
            author: await getAuthorById(authorId),
            category: await getCategoryById(categoryId),
            createdAt: createdAt.toDate(),
            updatedAt: updatedAt.toDate(),
         } as Post;
      })
   );

   return posts;
}

/**
 * Get posts by section
 * @param sectionId The ID of the section to filter by
 * @param limitCount Optional limit on the number of posts to return
 * @returns Array of posts in the specified section
 */
export async function getPostsBySection(
   sectionId: string,
   limitCount?: number
) {
   const postsRef = collection(db, "posts");

   // Create a query to find posts that have the specified section in their sections array
   let q = query(
      postsRef,
      where("sections", "array-contains", sectionId),
      orderBy("createdAt", "desc")
   );

   // If a limitCount is provided, apply it to the query
   if (limitCount && limitCount > 0) {
      q = query(q, limit(limitCount));
   }

   const querySnapshot = await getDocs(q);

   const posts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
         const { authorId, categoryId, createdAt, updatedAt, ...rest } =
            doc.data();

         return {
            id: doc.id,
            ...rest,
            author: await getAuthorById(authorId),
            category: await getCategoryById(categoryId),
            createdAt: createdAt.toDate(),
            updatedAt: updatedAt.toDate(),
         } as Post;
      })
   );

   return posts;
}

/**
 * Get posts from multiple sections
 * @param sections Array of section IDs to get posts from
 * @param limit Optional limit on the number of posts to return per section
 * @returns Object with section IDs as keys and arrays of posts as values
 */
export async function getPostsFromMultipleSections(
   sections: string[],
   limit?: number
) {
   // Create an object to store posts by section
   const postsBySection: Record<string, Post[]> = {};

   // Get posts for each section
   await Promise.all(
      sections.map(async (sectionId) => {
         const posts = await getPostsBySection(sectionId, limit);
         postsBySection[sectionId] = posts;
      })
   );

   return postsBySection;
}

/**
 * Get paginated posts by section with cursor-based pagination
 * @param sectionId The ID of the section to filter by
 * @param pageSize Number of posts to fetch per page (default: 5)
 * @param lastPostId Optional ID of the last post for pagination
 * @returns Object containing posts array and hasMore flag
 */
export async function getPaginatedPostsBySection(
   sectionId: string,
   pageSize: number = 5,
   lastPostId?: string
) {
   const postsRef = collection(db, "posts");
   let q;

   // If we have a lastPostId, use it as a cursor for pagination
   if (lastPostId) {
      // Get the last document as a reference point
      const lastPostDoc = await getDoc(doc(db, "posts", lastPostId));

      if (!lastPostDoc.exists()) {
         throw new Error(`Post with id ${lastPostId} not found`);
      }

      // Create a query that starts after the last document
      q = query(
         postsRef,
         where("sections", "array-contains", sectionId),
         orderBy("createdAt", "desc"),
         startAfter(lastPostDoc),
         limit(pageSize + 1) // Fetch one extra to check if there are more
      );
   } else {
      // Initial query without a starting point
      q = query(
         postsRef,
         where("sections", "array-contains", sectionId),
         orderBy("createdAt", "desc"),
         limit(pageSize + 1) // Fetch one extra to check if there are more
      );
   }

   const querySnapshot = await getDocs(q);
   const docs = querySnapshot.docs;

   // Check if there are more posts
   const hasMore = docs.length > pageSize;
   const postsToReturn = hasMore ? docs.slice(0, pageSize) : docs;

   // Get unique author and category IDs
   const authorIds = new Set<string>();
   const categoryIds = new Set<string>();

   postsToReturn.forEach((doc) => {
      const data = doc.data();
      if (data.authorId) authorIds.add(data.authorId);
      if (data.categoryId) categoryIds.add(data.categoryId);
   });

   // Batch fetch authors and categories
   // const [authorsMap, categoriesMap] = await Promise.all([
   //    getAuthorsByIds(Array.from(authorIds)),
   //    getCategoriesByIds(Array.from(categoryIds)),
   // ]);

   const [authorsMap, categoriesMap] = await Promise.all([
      getAuthorsByIds(Array.from(authorIds)).then(
         (authors) => new Map(authors.map((author) => [author.id, author]))
      ),
      getCategoriesByIds(Array.from(categoryIds)).then(
         (categories) =>
            new Map(categories.map((category) => [category.id, category]))
      ),
   ]);

   // Construct posts with related data
   const posts: Post[] = postsToReturn.map((doc) => {
      const data = doc.data();
      const { authorId, categoryId, createdAt, updatedAt, ...rest } = data;

      return {
         id: doc.id,
         ...rest,
         author: authorsMap.get(authorId) || null,
         category: categoriesMap.get(categoryId) || null,
         createdAt: createdAt.toDate(),
         updatedAt: updatedAt.toDate(),
      } as Post;
   });

   return { posts, hasMore };
}

/**
 * Get the count of posts for a specific category
 * @param categoryId The category's ID
 * @returns The number of posts in the category
 */
export async function getPostCountByCategoryId(categoryId: string) {
   const postsRef = collection(db, "posts");
   const q = query(postsRef, where("categoryId", "==", categoryId));
   const querySnapshot = await getDocs(q);
   return querySnapshot.size;
}

/**
 * Get related posts based on shared tags with two-tier fallback strategy
 * @param currentPostId The ID of the current post to exclude from results
 * @param currentPostCategoryId The category ID of the current post for fallback
 * @param tags Array of tags to match against
 * @param limitCount Number of related posts to return (default: 6)
 * @returns Array of related posts
 */
export async function getRelatedPosts(
   currentPostId: string,
   currentPostCategoryId: string,
   tags: string[],
   limitCount: number = 6
) {
   const postsRef = collection(db, "posts");
   let relatedPosts: Post[] = [];

   // First, try to find posts with matching tags
   if (tags && tags.length > 0) {
      try {
         // Firebase array-contains-any can only handle up to 10 values
         const tagsToQuery = tags.slice(0, 10);

         // Get more posts than needed to account for filtering out current post
         const q = query(
            postsRef,
            where("tags", "array-contains-any", tagsToQuery),
            orderBy("createdAt", "desc"),
            limit(limitCount + 5) // Get extra to account for filtering
         );

         const querySnapshot = await getDocs(q);

         // Filter out current post and limit results
         const filteredDocs = querySnapshot.docs
            .filter((doc) => doc.id !== currentPostId)
            .slice(0, limitCount);

         relatedPosts = await Promise.all(
            filteredDocs.map(async (doc) => {
               const { authorId, categoryId, createdAt, updatedAt, ...rest } =
                  doc.data();

               return {
                  id: doc.id,
                  ...rest,
                  author: await getAuthorById(authorId),
                  category: await getCategoryById(categoryId),
                  createdAt: createdAt.toDate(),
                  updatedAt: updatedAt.toDate(),
               } as Post;
            })
         );
      } catch (error) {
         console.error("Error fetching posts by tags:", error);
         // Continue to fallback logic
      }
   }

   // Primary fallback: If we don't have enough related posts, try posts from the same category
   if (relatedPosts.length < limitCount && currentPostCategoryId) {
      const remainingCount = limitCount - relatedPosts.length;

      try {
         // Get posts from the same category excluding already found posts and current post
         const excludeIds = [currentPostId, ...relatedPosts.map((p) => p.id)];

         const categoryQuery = query(
            postsRef,
            where("categoryId", "==", currentPostCategoryId),
            orderBy("createdAt", "desc"),
            limit(remainingCount + excludeIds.length) // Get extra to account for filtering
         );

         const categorySnapshot = await getDocs(categoryQuery);

         const categoryPosts = await Promise.all(
            categorySnapshot.docs
               .filter((doc) => !excludeIds.includes(doc.id))
               .slice(0, remainingCount)
               .map(async (doc) => {
                  const {
                     authorId,
                     categoryId,
                     createdAt,
                     updatedAt,
                     ...rest
                  } = doc.data();

                  return {
                     id: doc.id,
                     ...rest,
                     author: await getAuthorById(authorId),
                     category: await getCategoryById(categoryId),
                     createdAt: createdAt.toDate(),
                     updatedAt: updatedAt.toDate(),
                  } as Post;
               })
         );

         relatedPosts = [...relatedPosts, ...categoryPosts];
      } catch (error) {
         console.error("Error fetching posts by category for fallback:", error);
         // Continue to secondary fallback
      }
   }

   // Secondary fallback: If we still don't have enough posts, supplement with latest posts
   if (relatedPosts.length < limitCount) {
      const remainingCount = limitCount - relatedPosts.length;

      try {
         // Get latest posts excluding the current post and already found related posts
         const excludeIds = [currentPostId, ...relatedPosts.map((p) => p.id)];

         const latestQuery = query(
            postsRef,
            orderBy("createdAt", "desc"),
            limit(remainingCount + excludeIds.length) // Get extra to account for filtering
         );

         const latestSnapshot = await getDocs(latestQuery);

         const latestPosts = await Promise.all(
            latestSnapshot.docs
               .filter((doc) => !excludeIds.includes(doc.id))
               .slice(0, remainingCount)
               .map(async (doc) => {
                  const {
                     authorId,
                     categoryId,
                     createdAt,
                     updatedAt,
                     ...rest
                  } = doc.data();

                  return {
                     id: doc.id,
                     ...rest,
                     author: await getAuthorById(authorId),
                     category: await getCategoryById(categoryId),
                     createdAt: createdAt.toDate(),
                     updatedAt: updatedAt.toDate(),
                  } as Post;
               })
         );

         relatedPosts = [...relatedPosts, ...latestPosts];
      } catch (error) {
         console.error(
            "Error fetching latest posts for secondary fallback:",
            error
         );
      }
   }

   return relatedPosts.slice(0, limitCount);
}
