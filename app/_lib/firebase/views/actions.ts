"use server";

import {
   doc,
   runTransaction,
   serverTimestamp,
   setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Increment the view count for a specific post
 * Uses Firestore transactions to prevent race conditions
 * @param postId The post's ID
 * @returns Promise that resolves when the view count is incremented
 */
export async function incrementViewCount(postId: string): Promise<void> {
   if (!postId) {
      throw new Error("Post ID is required");
   }

   try {
      const viewDocRef = doc(db, "postViews", postId);

      await runTransaction(db, async (transaction) => {
         const viewDoc = await transaction.get(viewDocRef);

         if (!viewDoc.exists()) {
            // Create new document with initial view count of 1
            transaction.set(viewDocRef, {
               viewCount: 1,
               lastUpdated: serverTimestamp(),
            });
         } else {
            // Increment existing view count
            const currentCount = viewDoc.data().viewCount || 0;
            transaction.update(viewDocRef, {
               viewCount: currentCount + 1,
               lastUpdated: serverTimestamp(),
            });
         }
      });
   } catch (error) {
      console.error(`Error incrementing view count for post ${postId}:`, error);
      throw error;
   }
}

/**
 * Set the view count for a specific post to a specific value
 * This is useful for administrative purposes or data migration
 * @param postId The post's ID
 * @param viewCount The view count to set
 * @returns Promise that resolves when the view count is set
 */
export async function setViewCount(
   postId: string,
   viewCount: number
): Promise<void> {
   if (!postId) {
      throw new Error("Post ID is required");
   }

   if (viewCount < 0) {
      throw new Error("View count cannot be negative");
   }

   try {
      const viewDocRef = doc(db, "postViews", postId);

      await setDoc(viewDocRef, {
         viewCount,
         lastUpdated: serverTimestamp(),
      });
   } catch (error) {
      console.error(`Error setting view count for post ${postId}:`, error);
      throw error;
   }
}

/**
 * Reset the view count for a specific post to 0
 * @param postId The post's ID
 * @returns Promise that resolves when the view count is reset
 */
export async function resetViewCount(postId: string): Promise<void> {
   return setViewCount(postId, 0);
}
