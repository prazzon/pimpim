"use server";

import { Profile } from "@/app/_lib/firebase/types";
import {
   collection,
   doc,
   getDoc,
   getDocs,
   query,
   where,
} from "firebase/firestore";
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

/**
 * Get a user's username from Firestore
 * @param userId The user's ID from the session
 * @returns The user's username or null if not found
 */

export async function getUsername(userId: string): Promise<string | null> {
   if (!userId) return null;

   try {
      const profileDocRef = doc(db, "profiles", userId);
      const profileSnapshot = await getDoc(profileDocRef);

      if (profileSnapshot.exists()) {
         return profileSnapshot.data().username;
      }

      return null;
   } catch (error) {
      console.error("Error getting username:", error);
      return null;
   }
}

/**
 * Get a user's profile data by username
 * @param username The username to look up
 * @returns The user's profile data or null if not found
 */
export async function getUserProfileByUsername(
   username: string
): Promise<Profile | null> {
   if (!username) return null;

   try {
      // Query the profiles collection for the username
      const profilesRef = collection(db, "profiles");
      const q = query(profilesRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return null;

      // Get the first matching profile
      const profileDoc = querySnapshot.docs[0];
      const profileData = profileDoc.data();

      // Format dates
      const { createdAt, updatedAt } = profileData;

      return {
         id: profileDoc.id,
         ...profileData,
         createdAt: createdAt?.toDate(),
         updatedAt: updatedAt?.toDate(),
      } as Profile;
   } catch (error) {
      console.error("Error getting user profile by username:", error);
      return null;
   }
}
