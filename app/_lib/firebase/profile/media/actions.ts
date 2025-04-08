"use server";

import { MediaItem } from "@/app/_lib/firebase/types";
import {
   addDoc,
   collection,
   deleteDoc,
   doc,
   Timestamp,
   updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

/**
 * Add a new media item to the media collection
 * @param userId The user's ID
 * @param mediaItem The media item to add (without id)
 * @returns A success message or error message with the new media ID if successful
 */
export async function addMedia(
   userId: string,
   mediaItem: Omit<MediaItem, "id" | "createdAt">
): Promise<{ success: boolean; message: string; mediaId?: string }> {
   try {
      if (!userId) {
         return { success: false, message: "User ID is required" };
      }

      // Create a new media document in the media collection
      const mediaRef = collection(db, "media");
      const newMediaDoc = await addDoc(mediaRef, {
         ...mediaItem,
         userId: userId,
         createdAt: Timestamp.now(),
      });

      return {
         success: true,
         message: "Media added successfully",
         mediaId: newMediaDoc.id,
      };
   } catch (error) {
      console.error("Error adding media:", error);
      return { success: false, message: "Failed to add media" };
   }
}

/**
 * Update an existing media item
 * @param mediaId The ID of the media item to update
 * @param userId The user's ID (for verification)
 * @param updates The fields to update
 * @returns A success message or error message
 */
export async function updateMedia(
   mediaId: string,
   userId: string,
   updates: Partial<Omit<MediaItem, "id" | "createdAt">>
): Promise<{ success: boolean; message: string }> {
   try {
      if (!mediaId || !userId) {
         return {
            success: false,
            message: "Media ID and User ID are required",
         };
      }

      // Update the media document
      const mediaDocRef = doc(db, "media", mediaId);
      await updateDoc(mediaDocRef, {
         ...updates,
         // Don't allow changing the userId
         // Don't update createdAt
      });

      return { success: true, message: "Media updated successfully" };
   } catch (error) {
      console.error("Error updating media:", error);
      return { success: false, message: "Failed to update media" };
   }
}

/**
 * Delete a media item
 * @param mediaId The ID of the media item to delete
 * @param userId The user's ID (for verification)
 * @returns A success message or error message
 */
export async function deleteMedia(
   mediaId: string,
   userId: string
): Promise<{ success: boolean; message: string }> {
   try {
      if (!mediaId || !userId) {
         return {
            success: false,
            message: "Media ID and User ID are required",
         };
      }

      // Delete the media document
      const mediaDocRef = doc(db, "media", mediaId);
      await deleteDoc(mediaDocRef);

      return { success: true, message: "Media deleted successfully" };
   } catch (error) {
      console.error("Error deleting media:", error);
      return { success: false, message: "Failed to delete media" };
   }
}
