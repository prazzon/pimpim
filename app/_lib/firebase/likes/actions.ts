"use server";

import {
   collection,
   doc,
   getDocs,
   query,
   runTransaction,
   serverTimestamp,
   where,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Toggle like status for a post by a user
 * This function adds a like if it doesn't exist, or removes it if it does
 * Also updates the like count in the postLikes collection
 * @param userId The user's ID
 * @param postId The post's ID
 * @returns Object with success status, new like status, and like count
 */
export async function togglePostLike(userId: string, postId: string) {
   if (!userId || !postId) {
      return {
         success: false,
         message: "User ID and Post ID are required",
         isLiked: false,
         likeCount: 0,
      };
   }

   try {
      const result = await runTransaction(db, async (transaction) => {
         // Check if user has already liked this post
         const likesRef = collection(db, "likes");
         const q = query(
            likesRef,
            where("userId", "==", userId),
            where("postId", "==", postId)
         );

         const existingLikes = await getDocs(q);
         const isCurrentlyLiked = !existingLikes.empty;

         // Get current like count
         const postLikesRef = doc(db, "postLikes", postId);
         const postLikesDoc = await transaction.get(postLikesRef);
         const currentLikeCount = postLikesDoc.exists()
            ? postLikesDoc.data().likeCount || 0
            : 0;

         let newLikeCount: number;
         let newLikeStatus: boolean;

         if (isCurrentlyLiked) {
            // Remove the like
            const likeDoc = existingLikes.docs[0];
            transaction.delete(likeDoc.ref);
            newLikeCount = Math.max(0, currentLikeCount - 1);
            newLikeStatus = false;
         } else {
            // Add a new like
            const likeId = doc(collection(db, "likes")).id;
            const likeRef = doc(db, "likes", likeId);

            transaction.set(likeRef, {
               userId,
               postId,
               createdAt: serverTimestamp(),
            });

            newLikeCount = currentLikeCount + 1;
            newLikeStatus = true;
         }

         // Update the like count in postLikes collection
         transaction.set(
            postLikesRef,
            {
               likeCount: newLikeCount,
               lastUpdated: serverTimestamp(),
            },
            { merge: true }
         );

         return {
            isLiked: newLikeStatus,
            likeCount: newLikeCount,
         };
      });

      return {
         success: true,
         message: result.isLiked ? "Post liked" : "Post unliked",
         isLiked: result.isLiked,
         likeCount: result.likeCount,
      };
   } catch (error) {
      console.error(
         `Error toggling like for user ${userId} and post ${postId}:`,
         error
      );
      return {
         success: false,
         message: "Failed to toggle like",
         isLiked: false,
         likeCount: 0,
      };
   }
}

/**
 * Add a like to a post
 * @param userId The user's ID
 * @param postId The post's ID
 * @returns Object with success status and like count
 */
export async function addPostLike(userId: string, postId: string) {
   if (!userId || !postId) {
      return {
         success: false,
         message: "User ID and Post ID are required",
         likeCount: 0,
      };
   }

   try {
      const result = await runTransaction(db, async (transaction) => {
         // Check if user has already liked this post
         const likesRef = collection(db, "likes");
         const q = query(
            likesRef,
            where("userId", "==", userId),
            where("postId", "==", postId)
         );

         const existingLikes = await getDocs(q);

         if (!existingLikes.empty) {
            throw new Error("User has already liked this post");
         }

         // Add the like
         const likeId = doc(collection(db, "likes")).id;
         const likeRef = doc(db, "likes", likeId);

         transaction.set(likeRef, {
            userId,
            postId,
            createdAt: serverTimestamp(),
         });

         // Update like count
         const postLikesRef = doc(db, "postLikes", postId);
         const postLikesDoc = await transaction.get(postLikesRef);
         const currentLikeCount = postLikesDoc.exists()
            ? postLikesDoc.data().likeCount || 0
            : 0;

         const newLikeCount = currentLikeCount + 1;

         transaction.set(
            postLikesRef,
            {
               likeCount: newLikeCount,
               lastUpdated: serverTimestamp(),
            },
            { merge: true }
         );

         return newLikeCount;
      });

      return {
         success: true,
         message: "Post liked successfully",
         likeCount: result,
      };
   } catch (error) {
      console.error(
         `Error adding like for user ${userId} and post ${postId}:`,
         error
      );
      return {
         success: false,
         message:
            error instanceof Error ? error.message : "Failed to like post",
         likeCount: 0,
      };
   }
}

/**
 * Remove a like from a post
 * @param userId The user's ID
 * @param postId The post's ID
 * @returns Object with success status and like count
 */
export async function removePostLike(userId: string, postId: string) {
   if (!userId || !postId) {
      return {
         success: false,
         message: "User ID and Post ID are required",
         likeCount: 0,
      };
   }

   try {
      const result = await runTransaction(db, async (transaction) => {
         // Find the like to remove
         const likesRef = collection(db, "likes");
         const q = query(
            likesRef,
            where("userId", "==", userId),
            where("postId", "==", postId)
         );

         const existingLikes = await getDocs(q);

         if (existingLikes.empty) {
            throw new Error("User has not liked this post");
         }

         // Remove the like
         const likeDoc = existingLikes.docs[0];
         transaction.delete(likeDoc.ref);

         // Update like count
         const postLikesRef = doc(db, "postLikes", postId);
         const postLikesDoc = await transaction.get(postLikesRef);
         const currentLikeCount = postLikesDoc.exists()
            ? postLikesDoc.data().likeCount || 0
            : 0;

         const newLikeCount = Math.max(0, currentLikeCount - 1);

         transaction.set(
            postLikesRef,
            {
               likeCount: newLikeCount,
               lastUpdated: serverTimestamp(),
            },
            { merge: true }
         );

         return newLikeCount;
      });

      return {
         success: true,
         message: "Post unliked successfully",
         likeCount: result,
      };
   } catch (error) {
      console.error(
         `Error removing like for user ${userId} and post ${postId}:`,
         error
      );
      return {
         success: false,
         message:
            error instanceof Error ? error.message : "Failed to unlike post",
         likeCount: 0,
      };
   }
}
