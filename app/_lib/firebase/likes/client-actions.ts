"use client";

import { togglePostLike } from "./actions";

export type LikeTrackingResult = {
   success: boolean;
   tracked: boolean;
   isLiked: boolean;
   likeCount: number;
   reason?: string;
   error?: string;
};

/**
 * Toggle like status for a post with optimistic updates
 * This function provides immediate UI feedback while the server operation completes
 *
 * @param userId The user's ID
 * @param postId The post's ID
 * @param currentIsLiked Current like status for optimistic update
 * @param currentLikeCount Current like count for optimistic update
 * @returns Promise<LikeTrackingResult> with tracking result details
 */
export async function togglePostLikeOptimistic(
   userId: string,
   postId: string,
   currentIsLiked: boolean,
   currentLikeCount: number
): Promise<LikeTrackingResult> {
   if (!userId || !postId) {
      return {
         success: false,
         tracked: false,
         isLiked: currentIsLiked,
         likeCount: currentLikeCount,
         reason: "User ID and Post ID are required",
      };
   }

   try {
      // Call the server action
      const result = await togglePostLike(userId, postId);

      if (result.success) {
         return {
            success: true,
            tracked: true,
            isLiked: result.isLiked,
            likeCount: result.likeCount,
         };
      } else {
         return {
            success: false,
            tracked: false,
            isLiked: currentIsLiked, // Revert to original state
            likeCount: currentLikeCount, // Revert to original count
            error: result.message,
         };
      }
   } catch (error) {
      console.error("Error toggling post like:", error);
      return {
         success: false,
         tracked: false,
         isLiked: currentIsLiked, // Revert to original state
         likeCount: currentLikeCount, // Revert to original count
         error:
            error instanceof Error ? error.message : "Unknown error occurred",
      };
   }
}

/**
 * Get like tracking information for debugging
 * @param postId The post's ID
 * @returns Object with tracking information
 */
export function getLikeTrackingInfo(postId: string) {
   const storageKey = `like_cooldown_${postId}`;
   const lastLikeTime = localStorage.getItem(storageKey);

   return {
      postId,
      lastLikeTime: lastLikeTime ? parseInt(lastLikeTime) : null,
      hasLocalStorage: typeof Storage !== "undefined",
   };
}

/**
 * Update the last like time in localStorage
 * This can be used to implement cooldown periods if needed
 * @param postId The post's ID
 * @param timestamp The timestamp to store (defaults to current time)
 * @returns True if localStorage was updated successfully
 */
export function updateLastLikeTime(
   postId: string,
   timestamp: number = Date.now()
): boolean {
   try {
      if (typeof Storage === "undefined") {
         return false;
      }

      const storageKey = `like_cooldown_${postId}`;
      localStorage.setItem(storageKey, timestamp.toString());
      return true;
   } catch (error) {
      console.warn("Failed to update localStorage for like tracking:", error);
      return false;
   }
}

/**
 * Check if enough time has passed since the last like action
 * This can be used to implement cooldown periods if needed
 * @param postId The post's ID
 * @param cooldownMs Cooldown period in milliseconds (default: 1000ms)
 * @returns True if the action should be allowed
 */
export function shouldAllowLikeAction(
   postId: string,
   cooldownMs: number = 1000
): boolean {
   try {
      if (typeof Storage === "undefined") {
         return true; // Allow if localStorage is not available
      }

      const storageKey = `like_cooldown_${postId}`;
      const lastLikeTime = localStorage.getItem(storageKey);

      if (!lastLikeTime) {
         return true; // No previous like recorded
      }

      const timeSinceLastLike = Date.now() - parseInt(lastLikeTime);
      return timeSinceLastLike >= cooldownMs;
   } catch (error) {
      console.warn("Error checking like cooldown:", error);
      return true; // Allow on error
   }
}

/**
 * Clear like tracking data for a specific post
 * @param postId The post's ID
 */
export function clearLikeTrackingData(postId: string): void {
   try {
      if (typeof Storage !== "undefined") {
         const storageKey = `like_cooldown_${postId}`;
         localStorage.removeItem(storageKey);
      }
   } catch (error) {
      console.warn("Failed to clear like tracking data:", error);
   }
}

/**
 * Clear all like tracking data
 */
export function clearAllLikeTrackingData(): void {
   try {
      if (typeof Storage !== "undefined") {
         const keys = Object.keys(localStorage);
         keys.forEach((key) => {
            if (key.startsWith("like_cooldown_")) {
               localStorage.removeItem(key);
            }
         });
      }
   } catch (error) {
      console.warn("Failed to clear all like tracking data:", error);
   }
}
