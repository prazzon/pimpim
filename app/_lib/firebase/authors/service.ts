import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function getAuthors() {
   const querySnapshot = await getDocs(collection(db, "authors"));
   
   const authors = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
   }));

   return authors;
}

export async function getAuthorById(id: string) {
   if (!id) return null;
   
   const docRef = doc(db, "authors", id);

   const docSnap = await getDoc(docRef);

   if (!docSnap.exists()) {
      throw new Error(`Author with id ${id} not found`);
   }

   console.log(docSnap.data());
   
   return {
      id: docSnap.id,
      ...docSnap.data(),
   };
}
