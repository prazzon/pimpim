"use server";

import bcryptjs from "bcryptjs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Change a user's password in Firebase
 * @param userId The user's ID
 * @param currentPassword The user's current password
 * @param newPassword The new password to set
 * @returns An object with success status and message
 */
export const changeUserPassword = async (
   userId: string,
   currentPassword: string,
   newPassword: string
): Promise<{ success: boolean; message: string }> => {
   try {
      // Get the user document
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
         return {
            success: false,
            message: "User not found",
         };
      }

      const userData = userSnap.data();

      // Check if user has a password field
      if (!userData.password) {
         return {
            success: false,
            message: "No password is set for this account",
         };
      }

      // Verify the current password
      const isValid = await bcryptjs.compare(
         currentPassword,
         userData.password
      );

      if (!isValid) {
         return {
            success: false,
            message: "Current password is incorrect",
         };
      }

      // Hash the new password
      const hash = await bcryptjs.hash(newPassword, 10);

      // Update the password in the database
      await updateDoc(userRef, {
         password: hash,
      });

      return {
         success: true,
         message: "Password changed successfully",
      };
   } catch (error) {
      console.error("Error changing password:", error);
      return {
         success: false,
         message: "An error occurred while changing the password",
      };
   }
};

/**
 * Link a password to a user account that doesn't have one (e.g., Google login)
 * @param userId The user's ID
 * @param newPassword The password to set
 * @returns An object with success status and message
 */
export const linkUserPassword = async (
   userId: string,
   newPassword: string
): Promise<{ success: boolean; message: string }> => {
   try {
      // Get the user document
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
         return {
            success: false,
            message: "User not found",
         };
      }

      const userData = userSnap.data();

      // Check if user already has a password
      if (userData.password) {
         return {
            success: false,
            message: "This account already has a password",
         };
      }

      // Hash the new password
      const hash = await bcryptjs.hash(newPassword, 10);

      // Update the user document with the new password
      await updateDoc(userRef, {
         password: hash,
      });

      return {
         success: true,
         message: "Password linked successfully",
      };
   } catch (error) {
      console.error("Error linking password:", error);
      return {
         success: false,
         message: "An error occurred while linking the password",
      };
   }
};

/**
 * Check if a user has a password set
 * @param userId The user's ID
 * @returns Boolean indicating if the user has a password
 */
export const checkUserHasPassword = async (
   userId: string
): Promise<boolean> => {
   try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
         return false;
      }

      const userData = userSnap.data();
      return !!userData.password;
   } catch (error) {
      console.error("Error checking if user has password:", error);
      return false;
   }
};
