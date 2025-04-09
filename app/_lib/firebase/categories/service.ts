import {
   collection,
   doc,
   getDoc,
   getDocs,
   orderBy,
   query,
   where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Category } from "../types";

/**
 * Get all categories from the database, ordered by name
 * @returns An array of category objects
 */
export async function getCategories() {
   const categoriesRef = collection(db, "categories");
   const q = query(categoriesRef, orderBy("name"));
   const querySnapshot = await getDocs(q);

   const categories = querySnapshot.docs.map(
      (doc) =>
         ({
            id: doc.id,
            ...doc.data(),
         } as Category)
   );

   return categories;
}

/**
 * Get a category by its ID
 * @param id The category's ID
 * @returns The category object or null if not found
 */
export async function getCategoryById(id: string) {
   if (!id) return null;

   const docRef = doc(db, "categories", id);

   const docSnap = await getDoc(docRef);

   if (!docSnap.exists()) {
      throw new Error(`Category with id ${id} not found`);
   }

   return {
      id: docSnap.id,
      ...docSnap.data(),
   } as Category;
}

/**
 * Get a category by its slug
 * @param slug The category's slug
 * @returns The category object or null if not found
 */
export async function getCategoryBySlug(slug: string) {
   if (!slug) return null;

   const categoriesRef = collection(db, "categories");
   const q = query(categoriesRef, where("slug", "==", slug));

   const querySnapshot = await getDocs(q);

   if (querySnapshot.empty) {
      throw new Error(`Category with slug ${slug} not found`);
   }

   const categoryDoc = querySnapshot.docs[0];

   return {
      id: categoryDoc.id,
      ...categoryDoc.data(),
   } as Category;
}
