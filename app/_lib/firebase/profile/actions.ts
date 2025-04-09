"use server";

import { uploadImage } from "@/app/_lib/cloudinary/cloudinary";
import { updateUserProfile } from "./service";

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

      // Generate a unique ID for the image
      const uniqueId = `profile_${userId}_${Date.now()}`;

      // Upload the image to Cloudinary
      const imageUrl = await uploadImage(image, uniqueId);

      if (!imageUrl) {
         return {
            success: false,
            message: "Failed to upload image to Cloudinary",
         };
      }

      // Update the profile image URL in Firebase
      return await updateProfileImage(userId, imageUrl);
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
 * Update a user's profile image
 * @param userId The user's ID
 * @param imageUrl The URL of the new profile image
 * @returns A success message or error message
 */
export async function updateProfileImage(
   userId: string,
   imageUrl: string
): Promise<{ success: boolean; message: string }> {
   try {
      return await updateUserProfile(userId, {
         profileImage: imageUrl,
      });
   } catch (error) {
      console.error("Error updating profile image:", error);
      return { success: false, message: "Failed to update profile image" };
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
