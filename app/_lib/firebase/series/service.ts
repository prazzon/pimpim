import {
   collection,
   doc,
   getDoc,
   getDocs,
   query,
   where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Series } from "../types";

export async function getSeries() {
   const seriesRef = collection(db, "series");

   const querySnapshot = await getDocs(seriesRef);

   const series = querySnapshot.docs.map(
      (doc) =>
         ({
            id: doc.id,
         ...doc.data(),
            createdAt: new Date(doc.data().createdAt),
         } as Series)
   );

   return series;
}

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
