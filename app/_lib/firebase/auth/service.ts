import bcryptjs from "bcryptjs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Get a user from the database by email and password
 * @param email The user's email address
 * @param password The user's password (will be compared with hashed password in DB)
 * @returns The user object with additional fields or null if not found/invalid
 */
export const getUserFromDb = async (email: string, password: string) => {
   const usersRef = collection(db, "users");
   const q = query(usersRef, where("email", "==", email));
   const querySnapshot = await getDocs(q);

   if (querySnapshot.empty) return null;

   const user = querySnapshot.docs[0].data();
   const isValid = await bcryptjs.compare(password, user.password);
   if (!isValid) return null;

   return {
      ...user,
      id: querySnapshot.docs[0].id,
      emailVerified: user.emailVerified || null,
      image: user.image || null,
      role: user.role || "user",
   };
};

/**
 * Get a user from the database by email
 * @param email The user's email address
 * @returns The user object or null if not found
 */
export const getUserByEmail = async (email: string) => {
   const usersRef = collection(db, "users");
   const q = query(usersRef, where("email", "==", email));
   const querySnapshot = await getDocs(q);

   if (querySnapshot.empty) return null;

   const doc = querySnapshot.docs[0];

   const user = { id: doc.id, ...doc.data() };

   return user;
};
