"use server";

import { sendPasswordResetEmail } from "@/app/_lib/resend/mail";
import { generatePasswordResetToken } from "@/app/_lib/token";
import bcryptjs from "bcryptjs";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
   deleteResetTokensByEmail,
   verifyResetToken,
} from "../reset-token/actions";
import { getUserByEmail } from "./service";

/**
 * Initiates the password reset process for a user
 * @param email The user's email
 * @returns An object with success status and message
 */
export const initiatePasswordReset = async (
   email: string
): Promise<{
   success: boolean;
   message: string;
}> => {
   try {
      // Check if the user exists
      const user = await getUserByEmail(email);

      if (!user) {
         return {
            success: false,
            message: "No account found with this email address.",
         };
      }

      // Generate a password reset token
      const resetToken = await generatePasswordResetToken(email);

      // Send the password reset email
      await sendPasswordResetEmail(email, resetToken.token);

      return {
         success: true,
         message: "Password reset email sent. Please check your inbox.",
      };
   } catch (error) {
      console.error("Error initiating password reset:", error);
      return {
         success: false,
         message: "An error occurred while processing your request.",
      };
   }
};

/**
 * Resets a user's password using a reset token
 * @param token The reset token
 * @param newPassword The new password to set
 * @returns An object with success status and message
 */
export const resetPassword = async (
   token: string,
   newPassword: string
): Promise<{
   success: boolean;
   message: string;
}> => {
   try {
      // Verify the reset token
      const verificationResult = await verifyResetToken(token);

      if (!verificationResult.success) {
         return {
            success: false,
            message: verificationResult.error || "Invalid or expired token.",
         };
      }

      if (!verificationResult.email) {
         return {
            success: false,
            message: "Email not found in token.",
         };
      }

      // Get the user by email
      const user = await getUserByEmail(verificationResult.email);

      if (!user) {
         return {
            success: false,
            message: "User not found.",
         };
      }

      // Check if the new password is the same as the old password
      if (
         user.password &&
         (await bcryptjs.compare(newPassword, user.password))
      ) {
         return {
            success: false,
            message: "New password cannot be the same as the old password.",
         };
      }

      // Hash the new password
      const hash = await bcryptjs.hash(newPassword, 10);

      // Update the user's password
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
         password: hash,
      });

      // Delete all reset tokens for the user
      await deleteResetTokensByEmail(verificationResult.email);

      return {
         success: true,
         message:
            "Password reset successful. You can now log in with your new password.",
      };
   } catch (error) {
      console.error("Error resetting password:", error);
      return {
         success: false,
         message: "An error occurred while resetting your password.",
      };
   }
};
