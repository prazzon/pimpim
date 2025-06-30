"use client";

import { updateLastViewTime } from "../../utils/localStorage";
import { incrementViewCount } from "./actions";
import { shouldTrackView, getViewTrackingInfo } from "./client-service";

/**
 * Result of a view tracking attempt
 */
export type ViewTrackingResult = {
   success: boolean;
   tracked: boolean;
   reason?: string;
   error?: string;
   cooldownInfo?: ReturnType<typeof getViewTrackingInfo>;
};

/**
 * Track a post view with cooldown protection
 * This function checks the cooldown period before calling incrementViewCount
 * and updates localStorage after a successful increment
 * 
 * @param postId The post's ID
 * @param options Optional configuration
 * @returns Promise<ViewTrackingResult> with tracking result details
 */
export async function trackPostView(
   postId: string,
   options: {
      /** Force tracking even if cooldown hasn't expired (for testing) */
      force?: boolean;
      /** Custom timestamp for localStorage update (for testing) */
      timestamp?: number;
   } = {}
): Promise<ViewTrackingResult> {
   if (!postId) {
      return {
         success: false,
         tracked: false,
         reason: "Post ID is required",
      };
   }

   try {
      // Get cooldown information for debugging/logging
      const cooldownInfo = getViewTrackingInfo(postId);

      // Check if we should track this view (unless forced)
      if (!options.force && !shouldTrackView(postId)) {
         return {
            success: true,
            tracked: false,
            reason: "Cooldown period has not expired",
            cooldownInfo,
         };
      }

      // Attempt to increment the view count in Firebase
      await incrementViewCount(postId);

      // Update localStorage with the current timestamp
      const timestamp = options.timestamp || Date.now();
      const localStorageUpdated = updateLastViewTime(postId, timestamp);

      if (!localStorageUpdated) {
         console.warn(`View tracked in Firebase but localStorage update failed for post ${postId}`);
      }

      return {
         success: true,
         tracked: true,
         reason: "View successfully tracked",
         cooldownInfo,
      };
   } catch (error) {
      console.error(`Error tracking view for post ${postId}:`, error);
      
      return {
         success: false,
         tracked: false,
         error: error instanceof Error ? error.message : "Unknown error occurred",
         cooldownInfo: getViewTrackingInfo(postId),
      };
   }
}

/**
 * Check if a post view would be tracked without actually tracking it
 * Useful for UI indicators or analytics
 * 
 * @param postId The post's ID
 * @returns Promise<ViewTrackingResult> with what would happen if trackPostView was called
 */
export async function checkViewTracking(postId: string): Promise<ViewTrackingResult> {
   if (!postId) {
      return {
         success: false,
         tracked: false,
         reason: "Post ID is required",
      };
   }

   try {
      const cooldownInfo = getViewTrackingInfo(postId);
      const wouldTrack = shouldTrackView(postId);

      return {
         success: true,
         tracked: wouldTrack,
         reason: wouldTrack 
            ? "View would be tracked" 
            : "Cooldown period has not expired",
         cooldownInfo,
      };
   } catch (error) {
      console.error(`Error checking view tracking for post ${postId}:`, error);
      
      return {
         success: false,
         tracked: false,
         error: error instanceof Error ? error.message : "Unknown error occurred",
      };
   }
}

/**
 * Batch check multiple posts for view tracking eligibility
 * Useful for analytics or bulk operations
 * 
 * @param postIds Array of post IDs to check
 * @returns Promise<Map<string, ViewTrackingResult>> mapping post IDs to their tracking status
 */
export async function batchCheckViewTracking(
   postIds: string[]
): Promise<Map<string, ViewTrackingResult>> {
   const results = new Map<string, ViewTrackingResult>();

   const checkPromises = postIds.map(async (postId) => {
      const result = await checkViewTracking(postId);
      return { postId, result };
   });

   try {
      const resolvedChecks = await Promise.all(checkPromises);
      
      resolvedChecks.forEach(({ postId, result }) => {
         results.set(postId, result);
      });
   } catch (error) {
      console.error("Error in batch view tracking check:", error);
   }

   return results;
}
