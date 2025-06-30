"use client";

import {
   COOLDOWN_PERIOD_MS,
   getLastViewTime,
   isLocalStorageAvailable,
} from "../../utils/localStorage";

export type ViewCooldownResult = {
   canView: boolean;
   timeRemaining?: number; // milliseconds until next view allowed
   lastViewTime?: number; // timestamp of last view
};

/**
 * Check if a post view should be tracked based on cooldown period
 * @param postId The post's ID
 * @returns ViewCooldownResult with tracking decision and timing info
 */
export function checkViewCooldown(postId: string): ViewCooldownResult {
   if (!postId) {
      return {
         canView: false,
      };
   }

   // If localStorage is not available, allow the view but note the limitation
   if (!isLocalStorageAvailable()) {
      console.warn("localStorage unavailable, view tracking cooldown disabled");
      return {
         canView: true,
      };
   }

   try {
      const lastViewTime = getLastViewTime(postId);

      // If this is the first view, allow it
      if (lastViewTime === null) {
         return {
            canView: true,
         };
      }

      const currentTime = Date.now();
      const timeSinceLastView = currentTime - lastViewTime;

      // Check if cooldown period has passed
      if (timeSinceLastView >= COOLDOWN_PERIOD_MS) {
         return {
            canView: true,
            lastViewTime,
         };
      }

      // Cooldown period has not passed
      const timeRemaining = COOLDOWN_PERIOD_MS - timeSinceLastView;
      return {
         canView: false,
         timeRemaining,
         lastViewTime,
      };
   } catch (error) {
      console.error("Error checking view cooldown:", error);
      // On error, allow the view to prevent breaking user experience
      return {
         canView: true,
      };
   }
}

/**
 * Get human-readable time remaining until next view is allowed
 * @param timeRemaining Time remaining in milliseconds
 * @returns Formatted string describing time remaining
 */
export function formatTimeRemaining(timeRemaining: number): string {
   if (timeRemaining <= 0) {
      return "Now";
   }

   const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
   const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

   if (hours > 0) {
      return `${hours}h ${minutes}m`;
   } else if (minutes > 0) {
      return `${minutes}m`;
   } else {
      return "Less than 1m";
   }
}

/**
 * Check if view tracking should be performed for a post
 * This is the main function components should use
 * @param postId The post's ID
 * @returns boolean indicating if the view should be tracked
 */
export function shouldTrackView(postId: string): boolean {
   const cooldownResult = checkViewCooldown(postId);
   return cooldownResult.canView;
}

/**
 * Get detailed view tracking information for debugging or UI purposes
 * @param postId The post's ID
 * @returns Detailed information about view tracking status
 */
export function getViewTrackingInfo(postId: string) {
   const cooldownResult = checkViewCooldown(postId);

   return {
      ...cooldownResult,
      postId,
      cooldownPeriodHours: COOLDOWN_PERIOD_MS / (1000 * 60 * 60),
      localStorageAvailable: isLocalStorageAvailable(),
      timeRemainingFormatted: cooldownResult.timeRemaining
         ? formatTimeRemaining(cooldownResult.timeRemaining)
         : null,
   };
}
