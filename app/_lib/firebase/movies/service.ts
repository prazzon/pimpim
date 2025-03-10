import {
   collection,
   doc,
   getDoc,
   getDocs,
   query,
   where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Movie } from "../types";

export async function getMovies() {
   const moviesRef = collection(db, "movies");

   const querySnapshot = await getDocs(moviesRef);

   const movies = querySnapshot.docs.map(
      (doc) =>
         ({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt),
         } as Movie)
   );

   return movies;
}

export async function getMovieById(id: string) {
   if (!id) return null;

   const docRef = doc(db, "movies", id);

   const docSnap = await getDoc(docRef);

   if (!docSnap.exists()) {
      throw new Error(`Movie with id ${id} not found`);
   }

   return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: new Date(docSnap.data().createdAt),
   } as Movie;
}

export async function getMovieBySlug(slug: string) {
   if (!slug) return null;

   const moviesRef = collection(db, "movies");
   const q = query(moviesRef, where("slug", "==", slug));

   const querySnapshot = await getDocs(q);

   if (querySnapshot.empty) {
      throw new Error(`Movie with slug ${slug} not found`);
   }

   const movieDoc = querySnapshot.docs[0];

   return {
      id: movieDoc.id,
      ...movieDoc.data(),
      createdAt: new Date(movieDoc.data().createdAt),
   } as Movie;
}
