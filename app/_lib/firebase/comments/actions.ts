"use server";

import {
   collection,
   deleteDoc,
   doc,
   getDoc,
   serverTimestamp,
   setDoc,
   updateDoc,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "../firebase";
import { Comment } from "../types";
import { getCommentById } from "./service";

/**
 * Create a new comment
 * @param postId The post's ID
 * @param userId The user's ID
 * @param text The comment text
 * @param parentId Optional parent comment ID for replies
 * @returns The created comment
 */
export async function createComment(
   postId: string,
   userId: string,
   text: string,
   parentId?: string
) {
   // Generate a unique ID for the comment
   const commentId = doc(collection(db, "comments")).id;

   // Create the comment object
   const comment = {
      id: commentId,
      postId,
      userId,
      text,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: [],
      ...(parentId && { parentId }),
   };

   // Add the comment to Firestore
   await setDoc(doc(db, "comments", commentId), comment);

   // Revalidate the post page to show the new comment
   revalidatePath(`/feed/${postId}`);

   // Get the comment with user data
   const newComment = await getCommentById(commentId);

   return newComment as Comment;
}

/**
 * Update a comment
 * @param commentId The comment's ID
 * @param text The new comment text
 * @returns The updated comment
 */
export async function updateComment(commentId: string, text: string) {
   const commentRef = doc(db, "comments", commentId);
   const commentSnap = await getDoc(commentRef);

   if (!commentSnap.exists()) {
      throw new Error(`Comment with id ${commentId} not found`);
   }

   // Update the comment
   await updateDoc(commentRef, {
      text,
      updatedAt: serverTimestamp(),
   });

   // Get the post ID to revalidate the page
   const { postId } = commentSnap.data();

   // Revalidate the post page
   revalidatePath(`/feed/${postId}`);

   // Get the updated comment with user data
   const updatedComment = await getCommentById(commentId);

   return updatedComment;
}

/**
 * Delete a comment
 * @param commentId The comment's ID
 * @returns Success message
 */
export async function deleteComment(commentId: string) {
   const commentRef = doc(db, "comments", commentId);
   const commentSnap = await getDoc(commentRef);

   if (!commentSnap.exists()) {
      throw new Error(`Comment with id ${commentId} not found`);
   }

   // Get the post ID to revalidate the page
   const { postId } = commentSnap.data();

   // Delete the comment
   await deleteDoc(commentRef);

   // Revalidate the post page
   revalidatePath(`/feed/${postId}`);

   return { success: true, message: "Comment deleted successfully" };
}

/**
 * Toggle like on a comment
 * @param commentId The comment's ID
 * @param userId The user's ID
 * @returns The updated comment
 */
export async function toggleLikeComment(commentId: string, userId: string) {
   const commentRef = doc(db, "comments", commentId);
   const commentSnap = await getDoc(commentRef);

   if (!commentSnap.exists()) {
      throw new Error(`Comment with id ${commentId} not found`);
   }

   const comment = commentSnap.data() as Comment;
   const likes = comment.likes || [];

   // Check if the user already liked the comment
   const userLikedIndex = likes.indexOf(userId);

   if (userLikedIndex === -1) {
      // User hasn't liked the comment, add the like
      likes.push(userId);
   } else {
      // User already liked the comment, remove the like
      likes.splice(userLikedIndex, 1);
   }

   // Update the comment with the new likes array
   await updateDoc(commentRef, { likes });

   // Revalidate the post page
   revalidatePath(`/feed/${comment.postId}`);

   // Get the updated comment with user data
   const updatedComment = await getCommentById(commentId);

   return updatedComment;
}
