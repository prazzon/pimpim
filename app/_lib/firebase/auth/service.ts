import bcryptjs from "bcryptjs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

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
