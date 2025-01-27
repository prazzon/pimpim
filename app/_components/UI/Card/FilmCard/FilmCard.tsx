import { Data } from "@/app/_data/types";
import Image from "next/image";
import { FaCirclePlay, FaReadme } from "react-icons/fa6";
import styles from "./FilmCard.module.scss";

type Props = {
   item: Data;
   size?: "small" | "medium" | "large";
};

function FilmCard({ item, size = "small" }: Props) {
   return (
      <>
         <div key={item.id} className={`${styles.item} ${styles[size]}`}>
            <div className={styles.image}>
               {item.position && (
                  <span className={styles.position}>
                     #{item.position} in {item.category} 🔥
                  </span>
               )}
               <Image src={item.poster} alt={item.title} fill />
               {(item.category === "movie" ||
                  item.category === "series" ||
                  item.category === "show") && (
                  <button className={styles.play}>
                     <FaCirclePlay />
                  </button>
               )}
               {item.category === "news" && (
                  <button className={styles.play}>
                     <FaReadme />
                  </button>
               )}
            </div>
            <div className={styles.info}>
               <h2 className={`${styles.info_title} ${styles.small}`}>
                  {item.title}
               </h2>
               {item.category === "movie" && (
                  <p className={styles.info_text}>{item.year}</p>
               )}

               {(item.category === "series" || item.category === "show") && (
                  <p className={styles.info_text}>
                     {item.episodes.length} episodes
                  </p>
               )}

               {item.category === "news" && (
                  <p className={styles.info_text}>By {item.author}</p>
               )}
            </div>
         </div>
      </>
   );
}

export default FilmCard;
