"use server";

import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { updateUserVerification } from "../auth/actions";
import { getUserByEmail } from "../auth/service";
import { db } from "../firebase";
import { VerificationToken } from "../types";
import { getVerificationTokenByToken } from "./service";

/**
 * Create a new verification token
 * @param email The user's email
 * @param token The verification token
 * @param expires The expiration date of the token
 * @returns The created verification token
 */
export const createVerificationToken = async (
   email: string,
   token: string,
   expires: Date
) => {
   // generate a unique id for the verification token document
   const id = doc(collection(db, "verificationTokens")).id;

   // create a new verification token
   await setDoc(doc(db, "verificationTokens", id), {
      id,
      email,
      token,
      expires,
   } as VerificationToken);

   // return the verification token
   const verificationToken = await getVerificationTokenByToken(token);

   return verificationToken as VerificationToken;
};

/**
 * Delete a verification token
 * @param id The ID of the verification token to delete
 */
export const deleteVerificationToken = async (id: string) => {
   await deleteDoc(doc(db, "verificationTokens", id));
};

/**
 * Verify a user's email using a verification token
 * @param token The verification token
 * @returns An object with success or error message
 */
export const newVerification = async (token: string) => {
   const existingToken = await getVerificationTokenByToken(token);

   if (!existingToken) {
      return { error: "Invalid token" };
   }

   const hasExpired = new Date(existingToken.expires) < new Date();

   if (hasExpired) {
      return { error: "Token has expired" };
   }

   const existingUser = await getUserByEmail(existingToken.email);

   if (!existingUser) {
      return { error: "User not found" };
   }

   await updateUserVerification(existingUser.id);

   await deleteVerificationToken(existingToken.id);

   return { success: "Email verified" };
};
