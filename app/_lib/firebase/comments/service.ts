import {
   collection,
   doc,
   getDoc,
   getDocs,
   limit as limitFirestore,
   orderBy,
   query,
   startAfter,
   where,
} from "firebase/firestore";
import { getUserById } from "../auth/service";
import { db } from "../firebase";
import { Comment } from "../types";

/**
 * Get comments for a specific post with pagination
 * @param postId The post's ID
 * @param limit Number of comments to fetch per page (default: 5)
 * @param lastCommentId Optional ID of the last comment for pagination
 * @returns An object containing comments array and hasMore flag
 */
export async function getCommentsByPostId(
   postId: string,
   limit: number = 5,
   lastCommentId?: string
) {
   const commentsRef = collection(db, "comments");
   let q;

   // Base query for top-level comments (no parentId)
   if (lastCommentId) {
      // Get the last document as a reference point
      const lastCommentDoc = await getDoc(doc(db, "comments", lastCommentId));

      if (!lastCommentDoc.exists()) {
         throw new Error(`Comment with id ${lastCommentId} not found`);
      }

      // Create a query that starts after the last document
      q = query(
         commentsRef,
         where("postId", "==", postId),
         orderBy("createdAt", "desc"),
         startAfter(lastCommentDoc),
         // Request one more document than needed to check if there are more
         limitFirestore(limit + 1)
      );
   } else {
      // Initial query without a starting point
      q = query(
         commentsRef,
         where("postId", "==", postId),
         orderBy("createdAt", "desc"),
         // Request one more document than needed to check if there are more
         limitFirestore(limit + 1)
      );
   }

   const querySnapshot = await getDocs(q);

   if (querySnapshot.empty) {
      return { comments: [], hasMore: false };
   }

   // Filter out replies (comments with parentId)
   const topLevelDocs = querySnapshot.docs.filter((doc) => {
      const data = doc.data();
      return !data.parentId;
   });

   const commentsToReturn = topLevelDocs.slice(0, limit);
   const hasMore = topLevelDocs.length > limit;

   const comments = await Promise.all(
      commentsToReturn.map(async (doc) => {
         const data = doc.data();
         const userId = data.userId;

         // Get user data
         const user = await getUserById(userId);

         // Get replies for this comment
         const replies = await getRepliesByCommentId(doc.id);

         return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            user: user
               ? {
                    name: user.name || "Anonymous",
                    profileImage: user.image,
                    username: user.username,
                 }
               : undefined,
            replies,
         } as Comment & { replies: Comment[] };
      })
   );

   return { comments, hasMore };
}

/**
 * Get all replies for a specific comment
 * @param commentId The parent comment's ID
 * @returns An array of reply comment objects with user data
 */
export async function getRepliesByCommentId(commentId: string) {
   const commentsRef = collection(db, "comments");

   const q = query(
      commentsRef,
      where("parentId", "==", commentId),
      orderBy("createdAt", "desc")
   );

   const querySnapshot = await getDocs(q);

   const replies = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
         const data = doc.data();
         const userId = data.userId;

         // Get user data
         const user = await getUserById(userId);

         return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            user: user
               ? {
                    name: user.name || "Anonymous",
                    profileImage: user.image,
                    username: user.username,
                 }
               : undefined,
         } as Comment;
      })
   );

   return replies;
}

/**
 * Get a comment by its ID
 * @param commentId The comment's ID
 * @returns The comment object with user data
 */
export async function getCommentById(commentId: string) {
   const docRef = doc(db, "comments", commentId);
   const docSnap = await getDoc(docRef);

   if (!docSnap.exists()) {
      throw new Error(`Comment with id ${commentId} not found`);
   }

   const data = docSnap.data();
   const userId = data.userId;

   // Get user data
   const user = await getUserById(userId);

   return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      user: user
         ? {
              name: user.name || "Anonymous",
              profileImage: user.image,
              username: user.username,
           }
         : undefined,
   } as Comment;
}
