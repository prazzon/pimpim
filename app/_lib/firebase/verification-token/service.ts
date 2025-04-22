import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { VerificationToken } from "../types";

/**
 * Get a verification token by email
 * @param email The user's email
 * @returns The verification token or null if not found
 */
export const getVerificationTokenByEmail = async (email: string) => {
   const verificationTokenRef = collection(db, "verificationTokens");
   const q = query(verificationTokenRef, where("email", "==", email));
   const querySnapshot = await getDocs(q);

   if (querySnapshot.empty) {
      return null;
   }

   const data = querySnapshot.docs[0].data();

   const verificationToken = {
      ...data,
      expires: data.expires.toDate(),
   } as VerificationToken;

   return verificationToken;
};

/**
 * Get a verification token by token
 * @param token The verification token
 * @returns The verification token or null if not found
 */
export const getVerificationTokenByToken = async (token: string) => {
   const verificationTokenRef = collection(db, "verificationTokens");
   const q = query(verificationTokenRef, where("token", "==", token));
   const querySnapshot = await getDocs(q);

   if (querySnapshot.empty) {
      return null;
   }

   const data = querySnapshot.docs[0].data();

   const verificationToken = {
      ...data,
      expires: data.expires.toDate(),
   } as VerificationToken;

   return verificationToken;
};
