import { MediaItem } from "@/app/_lib/firebase/types";
import Image from "next/image";
import styles from "./ProfileMedia.module.scss";

type ProfileMediaProps = {
   media?: MediaItem[];
};

export default function ProfileMedia({ media = [] }: ProfileMediaProps) {
   return (
      <div className={styles.media}>
         <h2 className={styles.title}>Media</h2>

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
      </div>
   );
}
