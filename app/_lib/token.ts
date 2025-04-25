import { v4 as uuidv4 } from "uuid";
import {
   createResetToken,
   deleteResetToken,
} from "./firebase/reset-token/actions";
import { getResetTokenByEmail } from "./firebase/reset-token/service";
import {
   createVerificationToken,
   deleteVerificationToken,
} from "./firebase/verification-token/actions";
import { getVerificationTokenByEmail } from "./firebase/verification-token/service";

/**
 * Generates a verification token for a user
 * @param email the user's email
 * @returns A verification token
 */
export const generateVerificationToken = async (email: string) => {
   // Generate a random token
   const token = uuidv4();
   const expires = new Date().getTime() + 1000 * 60 * 60 * 24; // 24 hours

   // Check if a token already exists for the user
   const existingToken = await getVerificationTokenByEmail(email);

   if (existingToken) {
      // If a token already exists, delete it
      await deleteVerificationToken(existingToken.id);
   }

   // Create a new verification token
   const verificationToken = await createVerificationToken(
      email,
      token,
      new Date(expires)
   );

   return verificationToken;
};

/**
 * Generates a password reset token for a user
 * @param email the user's email
 * @returns A reset token
 */
export const generatePasswordResetToken = async (email: string) => {
   // Generate a random token
   const token = uuidv4();
   const expires = new Date().getTime() + 1000 * 60 * 60 * 24; // 24 hours

   // Check if a token already exists for the user
   const existingToken = await getResetTokenByEmail(email);

   if (existingToken) {
      // If a token already exists, delete it
      await deleteResetToken(existingToken.id);
   }

   // Create a new reset token
   const resetToken = await createResetToken(email, token, new Date(expires));

   return resetToken;
};
