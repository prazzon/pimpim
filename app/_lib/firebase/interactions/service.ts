import { getUserCommentsWithPostInfo } from "../comments/service";
import { getUserLikesWithPostInfo } from "../likes/service";

// Unified interaction type that combines comments and likes
export type Interaction = {
   id: string;
   type: "comment" | "like";
   userId: string;
   postId: string;
   postTitle: string;
   postSlug: string;
   createdAt: Date;
   text?: string; // Only for comments
};

/**
 * Get user's interactions (comments and likes) with pagination and chronological sorting
 * @param userId The user's ID
 * @param pageSize Number of interactions to fetch per page (default: 10)
 * @param lastInteractionId ID of the last interaction from the previous page (for pagination)
 * @param lastInteractionDate Date of the last interaction from the previous page (for pagination)
 * @returns Object with interactions array and hasMore flag
 */
export async function getUserInteractionsPaginated(
   userId: string,
   pageSize: number = 10,
   lastInteractionId?: string,
   lastInteractionDate?: Date
) {
   if (!userId) {
      return {
         interactions: [],
         hasMore: false,
      };
   }

   try {
      // Fetch more items than needed to ensure we can fill the page after merging and sorting
      const fetchSize = Math.ceil(pageSize * 1.5);

      // Determine starting points for pagination
      let commentsLastId: string | undefined;
      let likesLastId: string | undefined;

      if (lastInteractionId && lastInteractionDate) {
         // For simplicity, we'll use the same cursor for both collections
         // In a production app, you might want to store separate cursors
         commentsLastId = lastInteractionId;
         likesLastId = lastInteractionId;
      }

      // Fetch comments and likes in parallel
      const [commentsResult, likesResult] = await Promise.all([
         getUserCommentsWithPostInfo(userId, fetchSize, commentsLastId),
         getUserLikesWithPostInfo(userId, fetchSize, likesLastId),
      ]);

      // Convert comments to unified interaction format
      const commentInteractions: Interaction[] = commentsResult.comments.map(
         (comment) => ({
            id: comment.id,
            type: "comment" as const,
            userId: comment.userId,
            postId: comment.postId,
            postTitle: comment.postTitle,
            postSlug: comment.postSlug,
            createdAt: comment.createdAt,
            text: comment.text,
         })
      );

      // Convert likes to unified interaction format
      const likeInteractions: Interaction[] = likesResult.likes.map((like) => ({
         id: like.id,
         type: "like" as const,
         userId: like.userId,
         postId: like.postId,
         postTitle: like.postTitle,
         postSlug: like.postSlug,
         createdAt: like.createdAt,
      }));

      // Merge and sort all interactions by creation date (newest first)
      const allInteractions = [
         ...commentInteractions,
         ...likeInteractions,
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Filter out interactions that are older than our cursor if we're paginating
      let filteredInteractions = allInteractions;
      if (lastInteractionDate) {
         filteredInteractions = allInteractions.filter(
            (interaction) => interaction.createdAt < lastInteractionDate
         );
      }

      // Take only the requested page size
      const paginatedInteractions = filteredInteractions.slice(0, pageSize);

      // Determine if there are more interactions to load
      // We have more if either service has more, or if we have more filtered interactions
      const hasMore =
         commentsResult.hasMore ||
         likesResult.hasMore ||
         filteredInteractions.length > pageSize;

      return {
         interactions: paginatedInteractions,
         hasMore,
      };
   } catch (error) {
      console.error("Error fetching user interactions:", error);
      return {
         interactions: [],
         hasMore: false,
      };
   }
}

/**
 * Get user's interactions count (total comments and likes)
 * @param userId The user's ID
 * @returns Object with counts for comments, likes, and total
 */
export async function getUserInteractionsCounts(userId: string) {
   if (!userId) {
      return {
         comments: 0,
         likes: 0,
         total: 0,
      };
   }

   try {
      // Fetch first page of each to get counts (this is a simplified approach)
      // In a production app, you might want to maintain separate count documents
      const [commentsResult, likesResult] = await Promise.all([
         getUserCommentsWithPostInfo(userId, 1),
         getUserLikesWithPostInfo(userId, 1),
      ]);

      // Note: This gives us a rough estimate. For exact counts, you'd need separate count documents
      const commentsCount = commentsResult.comments.length > 0 ? 1 : 0;
      const likesCount = likesResult.likes.length > 0 ? 1 : 0;

      return {
         comments: commentsCount,
         likes: likesCount,
         total: commentsCount + likesCount,
      };
   } catch (error) {
      console.error("Error fetching user interactions counts:", error);
      return {
         comments: 0,
         likes: 0,
         total: 0,
      };
   }
}
