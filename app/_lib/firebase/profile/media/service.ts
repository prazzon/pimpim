"use server";

import { MediaItem } from "@/app/_lib/firebase/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

/**
 * Get a user's media items from the media collection in Firestore
 * @param userId The user's ID from the session
 * @returns Array of media items or empty array if none found
 */
export async function getUserMedia(userId: string): Promise<MediaItem[]> {
   if (!userId) return [];

   try {
      // Query the media collection for items with matching userId
      const mediaRef = collection(db, "media");
      const q = query(mediaRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      // Map the documents to MediaItem objects
      const mediaItems = querySnapshot.docs.map((doc) => {
         const data = doc.data();

         return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
         } as MediaItem;
      });

      return mediaItems;
   } catch (error) {
      console.error("Error getting user media:", error);
      return [];
   }
}
