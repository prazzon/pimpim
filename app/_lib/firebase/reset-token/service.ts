import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { ResetToken } from "../types";

/**
 * Get a reset token by email
 * @param email The user's email
 * @returns The reset token or null if not found
 */
export const getResetTokenByEmail = async (email: string) => {
   const resetTokenRef = collection(db, "resetTokens");
   const q = query(resetTokenRef, where("email", "==", email));
   const querySnapshot = await getDocs(q);

   if (querySnapshot.empty) {
      return null;
   }

   const data = querySnapshot.docs[0].data();

   const resetToken = {
      ...data,
      expires: data.expires.toDate(),
   } as ResetToken;

   return resetToken;
};

/**
 * Get a reset token by token
 * @param token The reset token
 * @returns The reset token or null if not found
 */
export const getResetTokenByToken = async (token: string) => {
   const resetTokenRef = collection(db, "resetTokens");
   const q = query(resetTokenRef, where("token", "==", token));
   const querySnapshot = await getDocs(q);

   if (querySnapshot.empty) {
      return null;
   }

   const data = querySnapshot.docs[0].data();

   const resetToken = {
      ...data,
      expires: data.expires.toDate(),
   } as ResetToken;

   return resetToken;
};
