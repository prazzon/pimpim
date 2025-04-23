import {
   collection,
   doc,
   getDoc,
   getDocs,
   orderBy,
   query,
   where,
} from "firebase/firestore";
import { getUserById } from "../auth/service";
import { db } from "../firebase";
import { Comment } from "../types";

/**
 * Get all comments for a specific post
 * @param postId The post's ID
 * @returns An array of comment objects with user data
 */
export async function getCommentsByPostId(postId: string) {
   const commentsRef = collection(db, "comments");

   // Get all comments for the post
   const q = query(
      commentsRef,
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
   );

   const querySnapshot = await getDocs(q);

   if (querySnapshot.empty) {
      return null;
   }

   // Filter for top-level comments (no parentId or parentId is null)
   const topLevelDocs = querySnapshot.docs.filter((doc) => {
      const data = doc.data();
      return data.parentId === undefined || data.parentId === null;
   });

   const comments = await Promise.all(
      topLevelDocs.map(async (doc) => {
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

   return comments;
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
