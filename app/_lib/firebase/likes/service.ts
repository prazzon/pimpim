import {
   collection,
   doc,
   getDoc,
   getDocs,
   onSnapshot,
   query,
   where,
} from "firebase/firestore";
import { db } from "../firebase";
import { PostLike, PostLikeData } from "../types";

/**
 * Get the like count for a specific post
 * @param postId The post's ID
 * @returns The like count for the post, or 0 if no likes recorded
 */
export async function getLikeCount(postId: string): Promise<number> {
   try {
      const docRef = doc(db, "postLikes", postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
         return 0;
      }

      const data = docSnap.data();
      return data.likeCount || 0;
   } catch (error) {
      console.error(`Error getting like count for post ${postId}:`, error);
      return 0;
   }
}

/**
 * Get like data for a specific post including count and last updated timestamp
 * @param postId The post's ID
 * @returns The like data for the post, or null if no likes recorded
 */
export async function getPostLikeData(
   postId: string
): Promise<PostLikeData | null> {
   try {
      const docRef = doc(db, "postLikes", postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
         return null;
      }

      const data = docSnap.data();
      return {
         id: docSnap.id,
         likeCount: data.likeCount || 0,
         lastUpdated: data.lastUpdated?.toDate() || new Date(),
      };
   } catch (error) {
      console.error(`Error getting like data for post ${postId}:`, error);
      return null;
   }
}

/**
 * Check if a user has liked a specific post
 * @param userId The user's ID
 * @param postId The post's ID
 * @returns True if the user has liked the post, false otherwise
 */
export async function hasUserLikedPost(
   userId: string,
   postId: string
): Promise<boolean> {
   try {
      const likesRef = collection(db, "likes");
      const q = query(
         likesRef,
         where("userId", "==", userId),
         where("postId", "==", postId)
      );

      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
   } catch (error) {
      console.error(
         `Error checking if user ${userId} liked post ${postId}:`,
         error
      );
      return false;
   }
}

/**
 * Get like counts for multiple posts
 * @param postIds Array of post IDs
 * @returns Map of post ID to like count
 */
export async function getLikeCounts(
   postIds: string[]
): Promise<Map<string, number>> {
   const likeCounts = new Map<string, number>();

   try {
      // Get all like documents for the provided post IDs
      const likePromises = postIds.map(async (postId) => {
         const likeCount = await getLikeCount(postId);
         return { postId, likeCount };
      });

      const results = await Promise.all(likePromises);

      results.forEach(({ postId, likeCount }) => {
         likeCounts.set(postId, likeCount);
      });

      return likeCounts;
   } catch (error) {
      console.error("Error getting like counts for multiple posts:", error);
      return likeCounts;
   }
}

/**
 * Get user like statuses for multiple posts
 * @param userId The user's ID
 * @param postIds Array of post IDs
 * @returns Map of post ID to like status
 */
export async function getUserLikeStatuses(
   userId: string,
   postIds: string[]
): Promise<Map<string, boolean>> {
   const likeStatuses = new Map<string, boolean>();

   try {
      // Get all like documents for this user and the provided post IDs
      const likesRef = collection(db, "likes");
      const q = query(likesRef, where("userId", "==", userId));

      const querySnapshot = await getDocs(q);
      const userLikedPosts = new Set(
         querySnapshot.docs.map((doc) => doc.data().postId)
      );

      postIds.forEach((postId) => {
         likeStatuses.set(postId, userLikedPosts.has(postId));
      });

      return likeStatuses;
   } catch (error) {
      console.error(
         `Error getting like statuses for user ${userId}:`,
         error
      );
      return likeStatuses;
   }
}

/**
 * Get all likes by a specific user
 * @param userId The user's ID
 * @returns Array of PostLike objects
 */
export async function getUserLikes(userId: string): Promise<PostLike[]> {
   try {
      const likesRef = collection(db, "likes");
      const q = query(likesRef, where("userId", "==", userId));

      const querySnapshot = await getDocs(q);

      const likes = querySnapshot.docs.map((doc) => {
         const data = doc.data();
         return {
            id: doc.id,
            userId: data.userId,
            postId: data.postId,
            createdAt: data.createdAt?.toDate() || new Date(),
         } as PostLike;
      });

      return likes;
   } catch (error) {
      console.error(`Error getting likes for user ${userId}:`, error);
      return [];
   }
}

/**
 * Subscribe to real-time like count updates for a post
 * @param postId The post's ID
 * @param callback Function to call when like count changes
 * @returns Unsubscribe function
 */
export function subscribeLikeCount(
   postId: string,
   callback: (likeCount: number) => void
): () => void {
   const docRef = doc(db, "postLikes", postId);

   return onSnapshot(
      docRef,
      (doc) => {
         if (doc.exists()) {
            const data = doc.data();
            callback(data.likeCount || 0);
         } else {
            callback(0);
         }
      },
      (error) => {
         console.error(
            `Error subscribing to like count for post ${postId}:`,
            error
         );
         callback(0);
      }
   );
}

/**
 * Subscribe to real-time user like status updates for a post
 * @param userId The user's ID
 * @param postId The post's ID
 * @param callback Function to call when like status changes
 * @returns Unsubscribe function
 */
export function subscribeUserLikeStatus(
   userId: string,
   postId: string,
   callback: (isLiked: boolean) => void
): () => void {
   const likesRef = collection(db, "likes");
   const q = query(
      likesRef,
      where("userId", "==", userId),
      where("postId", "==", postId)
   );

   return onSnapshot(
      q,
      (querySnapshot) => {
         callback(!querySnapshot.empty);
      },
      (error) => {
         console.error(
            `Error subscribing to like status for user ${userId} and post ${postId}:`,
            error
         );
         callback(false);
      }
   );
}
