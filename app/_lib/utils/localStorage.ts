"use client";

type ViewTrackingData = {
   [postId: string]: number;
};

// Constants
export const VIEW_TRACKING_KEY = "post_views";
export const COOLDOWN_PERIOD_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Check if localStorage is available in the current environment
 * @returns boolean indicating if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
   try {
      if (typeof window === "undefined") return false;

      const test = "__localStorage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
   } catch (error) {
      console.warn("localStorage is not available:", error);
      return false;
   }
}

/**
 * Safely get view tracking data from localStorage
 * @returns ViewTrackingData object or empty object if unavailable/corrupted
 */
export function getViewTrackingData(): ViewTrackingData {
   if (!isLocalStorageAvailable()) {
      return {};
   }

   try {
      const data = localStorage.getItem(VIEW_TRACKING_KEY);
      if (!data) {
         return {};
      }

      const parsed = JSON.parse(data);

      // Validate that the parsed data is an object with string keys and number values
      if (typeof parsed !== "object" || parsed === null) {
         console.warn("Invalid view tracking data format, resetting");
         return {};
      }

      // Validate each entry
      const validatedData: ViewTrackingData = {};
      for (const [postId, timestamp] of Object.entries(parsed)) {
         if (
            typeof postId === "string" &&
            typeof timestamp === "number" &&
            !isNaN(timestamp)
         ) {
            validatedData[postId] = timestamp;
         }
      }

      return validatedData;
   } catch (error) {
      console.error(
         "Error reading view tracking data from localStorage:",
         error
      );
      return {};
   }
}

/**
 * Safely set view tracking data to localStorage
 * @param data ViewTrackingData object to store
 * @returns boolean indicating if the operation was successful
 */
export function setViewTrackingData(data: ViewTrackingData): boolean {
   if (!isLocalStorageAvailable()) {
      return false;
   }

   try {
      localStorage.setItem(VIEW_TRACKING_KEY, JSON.stringify(data));
      return true;
   } catch (error) {
      console.error("Error saving view tracking data to localStorage:", error);

      // Handle quota exceeded error by clearing old data
      if (
         error instanceof DOMException &&
         error.name === "QuotaExceededError"
      ) {
         try {
            console.warn(
               "localStorage quota exceeded, clearing old view tracking data"
            );
            clearOldViewTrackingData();
            localStorage.setItem(VIEW_TRACKING_KEY, JSON.stringify(data));
            return true;
         } catch (retryError) {
            console.error(
               "Failed to save even after clearing old data:",
               retryError
            );
            return false;
         }
      }

      return false;
   }
}

/**
 * Get the last view timestamp for a specific post
 * @param postId The post's ID
 * @returns timestamp of last view or null if never viewed
 */
export function getLastViewTime(postId: string): number | null {
   const data = getViewTrackingData();
   return data[postId] || null;
}

/**
 * Update the last view timestamp for a specific post
 * @param postId The post's ID
 * @param timestamp Optional timestamp (defaults to current time)
 * @returns boolean indicating if the operation was successful
 */
export function updateLastViewTime(
   postId: string,
   timestamp?: number
): boolean {
   const data = getViewTrackingData();
   data[postId] = timestamp || Date.now();
   return setViewTrackingData(data);
}

/**
 * Clear old view tracking data (older than 30 days) to manage storage space
 * This helps prevent localStorage quota issues
 */
export function clearOldViewTrackingData(): void {
   if (!isLocalStorageAvailable()) {
      return;
   }

   try {
      const data = getViewTrackingData();
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

      const cleanedData: ViewTrackingData = {};
      let removedCount = 0;

      for (const [postId, timestamp] of Object.entries(data)) {
         if (timestamp > thirtyDaysAgo) {
            cleanedData[postId] = timestamp;
         } else {
            removedCount++;
         }
      }

      if (removedCount > 0) {
         console.log(`Cleaned up ${removedCount} old view tracking entries`);
         setViewTrackingData(cleanedData);
      }
   } catch (error) {
      console.error("Error clearing old view tracking data:", error);
   }
}

/**
 * Clear all view tracking data from localStorage
 * Useful for testing or user privacy preferences
 */
export function clearAllViewTrackingData(): boolean {
   if (!isLocalStorageAvailable()) {
      return false;
   }

   try {
      localStorage.removeItem(VIEW_TRACKING_KEY);
      return true;
   } catch (error) {
      console.error("Error clearing view tracking data:", error);
      return false;
   }
}
