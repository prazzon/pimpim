"use server";

import {
   collection,
   deleteDoc,
   doc,
   getDocs,
   query,
   setDoc,
   where,
} from "firebase/firestore";
import { db } from "../firebase";
import { ResetToken } from "../types";
import { getResetTokenByToken } from "./service";

/**
 * Create a new password reset token
 * @param email The user's email
 * @param token The reset token
 * @param expires The expiration date of the token
 * @returns The created reset token
 */
export const createResetToken = async (
   email: string,
   token: string,
   expires: Date
) => {
   // generate a unique id for the reset token document
   const id = doc(collection(db, "resetTokens")).id;

   // create a new reset token
   await setDoc(doc(db, "resetTokens", id), {
      id,
      email,
      token,
      expires,
   } as ResetToken);

   // return the reset token
   const resetToken = await getResetTokenByToken(token);

   return resetToken as ResetToken;
};

/**
 * Delete a reset token
 * @param id The ID of the reset token to delete
 */
export const deleteResetToken = async (id: string) => {
   await deleteDoc(doc(db, "resetTokens", id));
};

/**
 * Delete all reset tokens for a user
 * @param email The user's email
 */
export const deleteResetTokensByEmail = async (email: string) => {
   const resetTokenRef = collection(db, "resetTokens");
   const q = query(resetTokenRef, where("email", "==", email));
   const querySnapshot = await getDocs(q);

   for (const doc of querySnapshot.docs) {
      await deleteDoc(doc.ref);
   }
};

/**
 * Verify a reset token
 * @param token The reset token
 * @returns An object with success or error message
 */
export const verifyResetToken = async (token: string) => {
   const existingToken = await getResetTokenByToken(token);

   if (!existingToken) {
      return {
         success: false,
         error: "The password reset link is invalid.",
      };
   }

   const hasExpired = existingToken.expires < new Date();

   if (hasExpired) {
      await deleteResetToken(existingToken.id);

      return {
         success: false,
         error: "The password reset link has expired.",
      };
   }

   return {
      success: true,
      email: existingToken.email,
      id: existingToken.id,
   };
};
