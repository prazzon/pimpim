"use server";

import { SignupFormValues } from "@/app/_lib/zod/schema/auth.schema";
import bcryptjs from "bcryptjs";
import {
   collection,
   doc,
   getDocs,
   query,
   setDoc,
   where,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "../firebase";
import { createUserProfile, generateUniqueUsername } from "../profile/actions";

/**
 * Register a new user in Firebase
 * @param data The signup form data containing username, email, and password
 * @returns An object with success status and message
 */
export const registerUser = async (data: SignupFormValues) => {
   const { username, email, password } = data;

   const existedUser = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
   );
   if (!existedUser.empty) {
      return {
         message: "A user with the same email already exists",
         success: false,
      };
   }

   const hash = await bcryptjs.hash(password, 10);

   const user = { name: username, email, password: hash, role: "user" };

   const uniqueId = doc(collection(db, "users")).id;

   const docRef = doc(collection(db, "users"), uniqueId);

   await setDoc(docRef, user);

   // Generate unique username
   const uniqueUsername = await generateUniqueUsername(username);

   await createUserProfile(uniqueId, {
      id: uniqueId,
      username: uniqueUsername,
      displayName: username, // Set the display name to the same as the username
      email: email,
   });

   revalidatePath("/");

   return { message: "User created", success: true };
};

export const updateUserVerification = async (userId: string) => {
   const userRef = doc(db, "users", userId);
   await setDoc(userRef, { emailVerified: true }, { merge: true });
};

export const updateName = async (userId: string, name: string) => {
   const userRef = doc(db, "users", userId);
   await setDoc(userRef, { name: name }, { merge: true });
};
