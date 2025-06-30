import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { PostView } from "../types";

/**
 * Get the view count for a specific post
 * @param postId The post's ID
 * @returns The view count for the post, or 0 if no views recorded
 */
export async function getViewCount(postId: string): Promise<number> {
   try {
      const docRef = doc(db, "postViews", postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
         return 0;
      }

      const data = docSnap.data();
      return data.viewCount || 0;
   } catch (error) {
      console.error(`Error getting view count for post ${postId}:`, error);
      return 0;
   }
}

/**
 * Get view data for a specific post including count and last updated timestamp
 * @param postId The post's ID
 * @returns The view data for the post, or null if no views recorded
 */
export async function getPostViewData(
   postId: string
): Promise<PostView | null> {
   try {
      const docRef = doc(db, "postViews", postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
         return null;
      }

      const data = docSnap.data();
      return {
         id: docSnap.id,
         viewCount: data.viewCount || 0,
         lastUpdated: data.lastUpdated?.toDate() || new Date(),
      };
   } catch (error) {
      console.error(`Error getting view data for post ${postId}:`, error);
      return null;
   }
}

/**
 * Get view counts for multiple posts
 * @param postIds Array of post IDs
 * @returns Map of post ID to view count
 */
export async function getViewCounts(
   postIds: string[]
): Promise<Map<string, number>> {
   const viewCounts = new Map<string, number>();

   try {
      // Get all view documents for the provided post IDs
      const viewPromises = postIds.map(async (postId) => {
         const viewCount = await getViewCount(postId);
         return { postId, viewCount };
      });

      const results = await Promise.all(viewPromises);

      results.forEach(({ postId, viewCount }) => {
         viewCounts.set(postId, viewCount);
      });

      return viewCounts;
   } catch (error) {
      console.error("Error getting view counts for multiple posts:", error);
      return viewCounts;
   }
}

/**
 * Get all view data from the postViews collection
 * @returns Array of all post view data
 */
export async function getAllViewCounts(): Promise<PostView[]> {
   try {
      const viewsRef = collection(db, "postViews");
      const querySnapshot = await getDocs(query(viewsRef));

      const viewData = querySnapshot.docs.map((doc) => {
         const data = doc.data();
         return {
            id: doc.id,
            viewCount: data.viewCount || 0,
            lastUpdated: data.lastUpdated?.toDate() || new Date(),
         } as PostView;
      });

      return viewData;
   } catch (error) {
      console.error("Error getting all view counts:", error);
      return [];
   }
}
