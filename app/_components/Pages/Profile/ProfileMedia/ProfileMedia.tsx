import { MediaItem } from "@/app/_lib/firebase/types";
import Image from "next/image";
import { Suspense } from "react";
import { FaSpinner } from "react-icons/fa";
import styles from "./ProfileMedia.module.scss";

type ProfileMediaProps = {
   media?: MediaItem[];
};

function MediaGrid({ media = [] }: ProfileMediaProps) {
   return (
      <>
         <div className={styles.grid}>
            {media.map((item) => (
               <div key={item.id} className={styles.media_item}>
                  <div className={styles.image_container}>
                     <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        className={styles.image}
                     />
                  </div>
                  <div className={styles.info}>
                     <h3 className={styles.media_title}>{item.title}</h3>
                     <p className={styles.date}>
                        {new Date(item.createdAt).toLocaleDateString()}
                     </p>
                  </div>
               </div>
            ))}
         </div>

         {media.length === 0 && (
            <div className={styles.empty}>
               <p>No media found</p>
            </div>
         )}
      </>
   );
}

export default function ProfileMedia({ media = [] }: ProfileMediaProps) {
   return (
      <div className={styles.media}>
         <h2 className={styles.title}>Media</h2>

         <Suspense
            fallback={
               <div className={styles.loading}>
                  <FaSpinner className={styles.spinner} /> Loading media...
               </div>
            }
         >
            <MediaGrid media={media} />
         </Suspense>
      </div>
   );
}
