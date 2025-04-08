"use server";

import { Profile } from "@/app/_lib/firebase/types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Get a user's profile data from Firestore
 * @param userId The user's ID from the session
 * @returns The user's profile data or null if not found
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
   if (!userId) return null;

   try {
      // First, try to get the profile document
      const profileDocRef = doc(db, "profiles", userId);
      const profileSnapshot = await getDoc(profileDocRef);

      // If profile exists, return it
      if (profileSnapshot.exists()) {
         const { createdAt, updatedAt } = profileSnapshot.data();

         return {
            id: profileSnapshot.id,
            ...profileSnapshot.data(),
            createdAt: createdAt.toDate(),
            updatedAt: updatedAt.toDate(),
         } as Profile;
      }

      // If profile doesn't exist, try to get user data from users collection
      const userDocRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
         const userData = userSnapshot.data();

         // Create a basic profile from user data
         const basicProfile: Profile = {
            id: userId,
            username: userData.name,
            email: userData.email,
            profileImage: userData.image,
            // Add other fields as needed
         };

         // Create a profile document for future use
         await createUserProfile(userId, basicProfile);

         return basicProfile;
      }

      return null;
   } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
   }
}

/**
 * Create a new user profile in Firestore
 * @param userId The user's ID
 * @param profileData The profile data to save
 */
export async function createUserProfile(
   userId: string,
   profileData: Profile
): Promise<void> {
   try {
      const profileDocRef = doc(db, "profiles", userId);
      await setDoc(
         profileDocRef,
         {
            ...profileData,
            createdAt: new Date(),
            updatedAt: new Date(),
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
            updatedAt: new Date(),
         },
         { merge: true }
      );

      return { success: true, message: "Profile updated successfully" };
   } catch (error) {
      console.error("Error updating user profile:", error);
      return { success: false, message: "Failed to update profile" };
   }
}

/**
 * Add a media item to a user's profile
 * @param userId The user's ID
 * @param mediaItem The media item to add
 * @returns A success message or error message
 */
export async function addUserMedia(
   userId: string,
   mediaItem: Omit<Profile["media"][0], "id">
): Promise<{ success: boolean; message: string; mediaId?: string }> {
   try {
      // Get the current profile
      const profile = await getUserProfile(userId);
      if (!profile) {
         return { success: false, message: "Profile not found" };
      }

      // Generate a unique ID for the media item
      const mediaId = `media_${Date.now()}`;
      const newMediaItem = {
         id: mediaId,
         ...mediaItem,
         createdAt: new Date().toISOString(),
      };

      // Add the media item to the profile
      const updatedMedia = [...(profile.media || []), newMediaItem];

      // Update the profile
      const profileDocRef = doc(db, "profiles", userId);
      await setDoc(
         profileDocRef,
         {
            media: updatedMedia,
            updatedAt: new Date(),
         },
         { merge: true }
      );

      return { success: true, message: "Media added successfully", mediaId };
   } catch (error) {
      console.error("Error adding user media:", error);
      return { success: false, message: "Failed to add media" };
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
            updatedAt: new Date(),
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
            updatedAt: new Date(),
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
