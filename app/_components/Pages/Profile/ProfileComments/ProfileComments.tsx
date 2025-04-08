import { Interaction } from "@/app/_lib/firebase/types";
import Link from "next/link";
import { BiLike } from "react-icons/bi";
import { FaComment } from "react-icons/fa";
import styles from "./ProfileComments.module.scss";

type ProfileCommentsProps = {
   interactions?: Interaction[];
};

export default function ProfileComments({
   interactions = [],
}: ProfileCommentsProps) {
   // Sort interactions by date (newest first)
   const sortedInteractions = [...interactions].sort(
      (a, b) =>
         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
   );

   return (
      <div className={styles.comments}>
         <h2 className={styles.title}>Comments & Likes</h2>

         <div className={styles.list}>
            {sortedInteractions.map((interaction) => (
               <div key={interaction.id} className={styles.interaction}>
                  <div className={styles.icon}>
                     {interaction.type === "comment" ? (
                        <FaComment />
                     ) : (
                        <BiLike />
                     )}
                  </div>

                  <div className={styles.content}>
                     <div className={styles.header}>
                        <span className={styles.type}>
                           {interaction.type === "comment"
                              ? "Commented on"
                              : "Liked"}
                        </span>
                        <Link
                           href={`/feed/${interaction.postId}`}
                           className={styles.post_title}
                        >
                           {interaction.postTitle}
                        </Link>
                     </div>

                     {interaction.type === "comment" && interaction.content && (
                        <p className={styles.comment_text}>
                           {interaction.content}
                        </p>
                     )}

                     <div className={styles.date}>
                        {new Date(interaction.createdAt).toLocaleString()}
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {interactions.length === 0 && (
            <div className={styles.empty}>
               <p>No comments or likes found</p>
            </div>
         )}
      </div>
   );
}
