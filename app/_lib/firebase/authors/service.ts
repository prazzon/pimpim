import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Get all authors from the database
 * @returns An array of author objects
 */
export async function getAuthors() {
   const querySnapshot = await getDocs(collection(db, "authors"));

   const authors = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
   }));

   return authors;
}

/**
 * Get an author by their ID
 * @param id The author's ID
 * @returns The author object or null if not found
 */
export async function getAuthorById(id: string) {
   if (!id) return null;

   const docRef = doc(db, "authors", id);

   const docSnap = await getDoc(docRef);

   if (!docSnap.exists()) {
      throw new Error(`Author with id ${id} not found`);
   }

   return {
      id: docSnap.id,
      ...docSnap.data(),
   };
}
