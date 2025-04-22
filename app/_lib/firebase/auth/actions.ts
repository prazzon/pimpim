"use server";

import { sendVerificationEmail } from "@/app/_lib/resend/mail";
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
import { generateVerificationToken } from "../../token";
import { db } from "../firebase";
import { createUserProfile, generateUniqueUsername } from "../profile/actions";

/**
 * Register a new user in Firebase
 * @param data The signup form data containing username, email, and password
 * @returns An object with success status and message
 */
export const registerUser = async (data: SignupFormValues) => {
   const { username, email, password } = data;

   const lowerCaseEmail = email.toLocaleLowerCase();

   const existedUser = await getDocs(
      query(collection(db, "users"), where("email", "==", lowerCaseEmail))
   );
   if (!existedUser.empty) {
      return {
         message: "A user with the same email already exists",
         success: false,
      };
   }

   const hash = await bcryptjs.hash(password, 10);

   const user = {
      name: username,
      email: lowerCaseEmail,
      password: hash,
      role: "user",
   };

   const uniqueId = doc(collection(db, "users")).id;

   const docRef = doc(collection(db, "users"), uniqueId);

   await setDoc(docRef, user);

   // Generate unique username
   const uniqueUsername = await generateUniqueUsername(username);

   await createUserProfile(uniqueId, {
      id: uniqueId,
      username: uniqueUsername,
      displayName: username, // Set the display name to the same as the username
      email: lowerCaseEmail,
   });

   // Generate a verification token
   const verificationToken = await generateVerificationToken(lowerCaseEmail);

   await sendVerificationEmail(lowerCaseEmail, verificationToken.token);

   revalidatePath("/");

   return { message: "User created", success: true };
};

/**
 * Update a user's email verification status in Firebase
 * @param userId The user's ID
 */
export const updateUserVerification = async (userId: string) => {
   const userRef = doc(db, "users", userId);
   await setDoc(userRef, { emailVerified: true }, { merge: true });
};

/**
 * Update a user's name in Firebase
 * @param userId The user's ID
 * @param name The new name to set
 */
export const updateName = async (userId: string, name: string) => {
   const userRef = doc(db, "users", userId);
   await setDoc(userRef, { name: name }, { merge: true });
};
