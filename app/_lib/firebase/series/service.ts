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
import { Series } from "../types";

/**
 * Get all series from the database, ordered by creation date (newest first)
 * @returns An array of series objects
 */
export async function getSeries() {
   const seriesRef = collection(db, "series");

   const q = query(seriesRef, orderBy("createdAt", "desc"));

   const querySnapshot = await getDocs(q);

   const series = querySnapshot.docs.map(
      (doc) =>
         ({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt),
         }) as Series
   );

   return series;
}

/**
 * Get a series by its ID
 * @param id The series' ID
 * @returns The series object or null if not found
 */
export async function getSeriesById(id: string) {
   if (!id) return null;

   const docRef = doc(db, "series", id);

   const docSnap = await getDoc(docRef);

   if (!docSnap.exists()) {
      throw new Error(`Series with id ${id} not found`);
   }

   return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: new Date(docSnap.data().createdAt),
   } as Series;
}

/**
 * Get a series by its slug
 * @param slug The series' slug
 * @returns The series object or null if not found
 */
export async function getSeriesBySlug(slug: string) {
   if (!slug) return null;

   const seriesRef = collection(db, "series");
   const q = query(seriesRef, where("slug", "==", slug));

   const querySnapshot = await getDocs(q);

   if (querySnapshot.empty) {
      throw new Error(`Series with slug ${slug} not found`);
   }

   const seriesDoc = querySnapshot.docs[0];

   return {
      id: seriesDoc.id,
      ...seriesDoc.data(),
      createdAt: new Date(seriesDoc.data().createdAt),
   } as Series;
}
