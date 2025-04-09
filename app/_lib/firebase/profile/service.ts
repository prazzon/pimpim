"use server";

import { Profile } from "@/app/_lib/firebase/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { createUserProfile } from "./actions";

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
