import {
   collection,
   doc,
   getDoc,
   getDocs,
   orderBy,
   query,
   where,
} from "firebase/firestore";
import { getAuthorById } from "../authors/service";
import { getCategoryById, getCategoryBySlug } from "../categories/service";
import { db } from "../firebase";
import { Post } from "../types";

/**
 * Get all posts from the database, ordered by creation date (newest first)
 * @returns An array of post objects with author and category data
 */
export async function getPosts() {
   const postsRef = collection(db, "posts");

   const q = query(postsRef, orderBy("createdAt", "desc"));

   const querySnapshot = await getDocs(q);

   // const posts = querySnapshot.docs.map((doc) => ({
   //    id: doc.id,
   //    ...doc.data(),
   //    authorId: await getAuthorById(doc.data().authorId),
   //    createdAt: doc.data().createdAt.toDate(),
   //    updatedAt: doc.data().updatedAt.toDate(),
   // } as Post));

   const posts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
         const { authorId, categoryId, createdAt, updatedAt, ...rest } =
            doc.data();

         return {
            id: doc.id,
            ...rest,
            author: await getAuthorById(authorId),
            category: await getCategoryById(categoryId),
            createdAt: createdAt.toDate(),
            updatedAt: updatedAt.toDate(),
         } as Post;
      })
   );

   return posts;
}

/**
 * Get all posts for a specific category by its slug
 * @param categorySlug The category's slug
 * @returns An array of post objects with author and category data, or null if category not found
 */
export async function getPostsByCategorySlug(categorySlug: string) {
   const postsRef = collection(db, "posts");

   const categoryId = (await getCategoryBySlug(categorySlug))?.id;

   if (!categoryId) return null;

   const q = query(
      postsRef,
      where("categoryId", "==", categoryId),
      orderBy("createdAt", "desc")
   );

   const querySnapshot = await getDocs(q);

   const posts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
         const { authorId, categoryId, createdAt, updatedAt, ...rest } =
            doc.data();

         return {
            id: doc.id,
            ...rest,
            author: await getAuthorById(authorId),
            category: await getCategoryById(categoryId),
            createdAt: createdAt.toDate(),
            updatedAt: updatedAt.toDate(),
         } as Post;
      })
   );

   return posts;
}

/**
 * Get a post by its ID
 * @param id The post's ID
 * @returns The post object with author and category data
 */
export async function getPostById(id: string) {
   const docRef = doc(db, "posts", id);

   const docSnap = await getDoc(docRef);

   if (!docSnap.exists()) {
      throw new Error(`Post with id ${id} not found`);
   }

   const { authorId, categoryId, createdAt, updatedAt, ...rest } =
      docSnap.data();

   const post = {
      id: docSnap.id,
      ...rest,
      author: await getAuthorById(authorId),
      category: await getCategoryById(categoryId),
      createdAt: createdAt.toDate(),
      updatedAt: updatedAt.toDate(),
   } as Post;

   return post;
}

/**
 * Get a post by its slug
 * @param slug The post's slug
 * @returns The post object with author and category data, or null if not found
 */
export async function getPostBySlug(slug: string) {
   const postsRef = collection(db, "posts");

   const q = query(postsRef, where("slug", "==", slug));

   const querySnapshot = await getDocs(q);

   // if (querySnapshot.empty) {
   //    throw new Error(`Post with slug ${slug} not found`);
   // } //! REMOVE LATER

   if (querySnapshot.empty) return null; //! REMOVE LATER

   const postDoc = querySnapshot.docs[0];

   const { authorId, categoryId, createdAt, updatedAt, ...rest } =
      postDoc.data();

   const post = {
      id: postDoc.id,
      ...rest,
      author: await getAuthorById(authorId),
      category: await getCategoryById(categoryId),
      createdAt: createdAt.toDate(),
      updatedAt: updatedAt.toDate(),
   } as Post;

   return post;

   // return {
   //    id: postDoc.id,
   //    ...postDoc.data(),
   //    createdAt: postDoc.data().createdAt.toDate(),
   //    updatedAt: postDoc.data().updatedAt.toDate(),
   // } as Post;
}

/**
 * Get all posts by a specific author
 * @param authorId The author's ID
 * @returns An array of post objects with author and category data
 */
export async function getPostsByAuthorId(authorId: string) {
   const postsRef = collection(db, "posts");

   const q = query(
      postsRef,
      where("authorId", "==", authorId),
      orderBy("createdAt", "desc")
   );

   const querySnapshot = await getDocs(q);

   const posts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
         const { authorId, categoryId, createdAt, updatedAt, ...rest } =
            doc.data();

         return {
            id: doc.id,
            ...rest,
            author: await getAuthorById(authorId),
            category: await getCategoryById(categoryId),
            createdAt: createdAt.toDate(),
            updatedAt: updatedAt.toDate(),
         } as Post;
      })
   );

   return posts;
}
