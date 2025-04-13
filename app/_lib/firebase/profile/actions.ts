"use server";

import { uploadImage } from "@/app/_lib/cloudinary/cloudinary";
import { slugify } from "@/app/_utils/utils";
import {
   collection,
   doc,
   getDocs,
   query,
   setDoc,
   Timestamp,
   updateDoc,
   where,
} from "firebase/firestore";
import { updateName } from "../auth/actions";
import { db } from "../firebase";
import { MediaItem, Profile } from "../types";
import { getUserProfile } from "./service";

/**
 * Create a new user profile in Firestore
 * @param userId The user's ID
 * @param profileData The profile data to save
 */
export async function createUserProfile(
   userId: string,
   profileData: Profile
): Promise<void> {
   const { username } = profileData;

   // Generate unique username
   const uniqueUsername = await generateUniqueUsername(username);

   try {
      const profileDocRef = doc(db, "profiles", userId);
      await setDoc(
         profileDocRef,
         {
            ...profileData,
            username: uniqueUsername,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
         },
         { merge: true }
      );
   } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
   }
}

/**
 * Update a user's profile in Firestore
 * @param userId The user's ID
 * @param profileData The profile data to update
 * @returns A success message or error message
 */
export async function updateUserProfile(
   userId: string,
   profileData: Partial<Profile>
): Promise<{ success: boolean; message: string }> {
   try {
      const profileDocRef = doc(db, "profiles", userId);
      await setDoc(
         profileDocRef,
         {
            ...profileData,
            updatedAt: Timestamp.now(),
         },
         { merge: true }
      );

      if (profileData.displayName) {
         updateName(userId, profileData.displayName);
      }

      return { success: true, message: "Profile updated" };
   } catch (error) {
      console.error("Error updating user profile:", error);
      return { success: false, message: "Failed to update profile" };
   }
}

/**
 * Checks if a username is already taken in the 'profiles' collection.
 * @param username The username to check
 * @returns A boolean indicating whether the username is taken
 */
async function isUsernameTaken(username: string): Promise<boolean> {
   const querySnapshot = await getDocs(
      query(collection(db, "profiles"), where("username", "==", username))
   );
   return !querySnapshot.empty;
}

/**
 * Generates a unique username from a display name.
 * Appends a number if the base slug is already taken.
 * @param displayName the user's display name
 * @returns A unique username
 */
export async function generateUniqueUsername(
   displayName: string
): Promise<string> {
   // Generate the base slug from the display name
   const base = slugify(displayName);
   let username = base;
   let counter = 1;

   // Check if the base slug is already taken
   while (await isUsernameTaken(username)) {
      username = `${base}${counter}`;
      counter++;
   }

   return username;
}

/**
 * Generic function to upload any profile-related image to Cloudinary
 * @param userId The user's ID
 * @param image The image file to upload
 * @param type The type of image ('profile' or 'cover')
 * @returns A success message or error message
 */
export async function uploadProfileImageByType(
   userId: string,
   image: File,
   type: "profile" | "cover"
): Promise<{ success: boolean; message: string }> {
   return type === "profile"
      ? uploadProfileImageToCloudinary(userId, image)
      : uploadCoverImageToCloudinary(userId, image);
}

/**
 * Upload a profile image to Cloudinary and update the profile in Firebase
 * @param userId The user's ID
 * @param image The image file to upload
 * @returns A success message or error message
 */
export async function uploadProfileImageToCloudinary(
   userId: string,
   image: File
): Promise<{ success: boolean; message: string }> {
   try {
      if (!userId) {
         return { success: false, message: "User ID is required" };
      }

      if (!image) {
         return { success: false, message: "Image is required" };
      }

      // Generate an ID for the image
      const id = `profile_${userId}}`;

      // Upload the image to Cloudinary
      const imageUrl = await uploadImage(image, id);

      if (!imageUrl) {
         return {
            success: false,
            message: "Failed to upload image to Cloudinary",
         };
      }

      // Update the profile image URL in Firebase
      const userRef = doc(db, "users", userId);

      await updateDoc(userRef, {
         image: imageUrl,
      });

      return {
         success: true,
         message: "Profile image updated successfully",
      };
   } catch (error) {
      console.error("Error uploading profile image:", error);
      return { success: false, message: "Failed to upload profile image" };
   }
}

/**
 * Upload a cover image to Cloudinary and update the profile in Firebase
 * @param userId The user's ID
 * @param image The image file to upload
 * @returns A success message or error message
 */
export async function uploadCoverImageToCloudinary(
   userId: string,
   image: File
): Promise<{ success: boolean; message: string }> {
   try {
      if (!userId) {
         return { success: false, message: "User ID is required" };
      }

      if (!image) {
         return { success: false, message: "Image is required" };
      }

      // Generate a unique ID for the image
      const uniqueId = `cover_${userId}_${Date.now()}`;

      // Upload the image to Cloudinary
      const imageUrl = await uploadImage(image, uniqueId);

      if (!imageUrl) {
         return {
            success: false,
            message: "Failed to upload image to Cloudinary",
         };
      }

      // Update the cover image URL in Firebase
      return await updateCoverImage(userId, imageUrl);
   } catch (error) {
      console.error("Error uploading cover image:", error);
      return { success: false, message: "Failed to upload cover image" };
   }
}

/**
 * Update a user's cover image
 * @param userId The user's ID
 * @param imageUrl The URL of the new cover image
 * @returns A success message or error message
 */
export async function updateCoverImage(
   userId: string,
   imageUrl: string
): Promise<{ success: boolean; message: string }> {
   try {
      return await updateUserProfile(userId, {
         coverImage: imageUrl,
      });
   } catch (error) {
      console.error("Error updating cover image:", error);
      return { success: false, message: "Failed to update cover image" };
   }
}

/**
 * Add a social media link to a user's profile
 * @param userId The user's ID
 * @param platform The social media platform
 * @param url The URL of the social media profile
 * @returns A success message or error message
 */
export async function updateSocialLink(
   userId: string,
   platform: keyof NonNullable<Profile["socialLinks"]>,
   url: string
): Promise<{ success: boolean; message: string }> {
   try {
      // Get the current profile
      const profile = await getUserProfile(userId);
      if (!profile) {
         return { success: false, message: "Profile not found" };
      }

      // Update the social link
      const socialLinks = { ...(profile.socialLinks || {}), [platform]: url };

      // Update the profile
      const profileDocRef = doc(db, "profiles", userId);
      await setDoc(
         profileDocRef,
         {
            socialLinks,
            updatedAt: Timestamp.now(),
         },
         { merge: true }
      );

      return {
         success: true,
         message: `${platform} link updated successfully`,
      };
   } catch (error) {
      console.error("Error updating social link:", error);
      return { success: false, message: "Failed to update social link" };
   }
}

/**
 * Add a portfolio link to a user's profile
 * @param userId The user's ID
 * @param platform The portfolio platform
 * @param url The URL of the portfolio
 * @returns A success message or error message
 */
export async function updatePortfolioLink(
   userId: string,
   platform: keyof NonNullable<Profile["portfolioLinks"]>,
   url: string
): Promise<{ success: boolean; message: string }> {
   try {
      // Get the current profile
      const profile = await getUserProfile(userId);
      if (!profile) {
         return { success: false, message: "Profile not found" };
      }

      // Update the portfolio link
      const portfolioLinks = {
         ...(profile.portfolioLinks || {}),
         [platform]: url,
      };

      // Update the profile
      const profileDocRef = doc(db, "profiles", userId);
      await setDoc(
         profileDocRef,
         {
            portfolioLinks,
            updatedAt: Timestamp.now(),
         },
         { merge: true }
      );

      return {
         success: true,
         message: `${platform} portfolio link updated successfully`,
      };
   } catch (error) {
      console.error("Error updating portfolio link:", error);
      return { success: false, message: "Failed to update portfolio link" };
   }
}

/**
 * Add a media item to a user's profile
 * @param userId The user's ID
 * @param mediaItem The media item to add
 * @returns A success message or error message
 * @deprecated Use addMedia from _lib/firebase/profile/media/actions.ts instead
 */
export async function addUserMedia(
   userId: string,
   mediaItem: Omit<MediaItem, "id" | "createdAt">
): Promise<{ success: boolean; message: string; mediaId?: string }> {
   try {
      // Import the new addMedia function
      const { addMedia } = await import("./media/actions");

      // Use the new function instead
      return await addMedia(userId, mediaItem);
   } catch (error) {
      console.error("Error adding user media:", error);
      return { success: false, message: "Failed to add media" };
   }
}
