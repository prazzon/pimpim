import { Data } from "@/app/_data/types";
import Image from "next/image";
import { FaCirclePlay } from "react-icons/fa6";
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
               <Image src={item.thumbnail} alt={item.title} fill />
               <button className={styles.play}>
                  <FaCirclePlay />
               </button>
            </div>
            <div className={styles.info}>
               <h2 className={`${styles.info_title} ${styles.small}`}>
                  {item.title}
               </h2>
               <p className={styles.info_text}>
                  {item.category !== "event" && item.year}
               </p>
            </div>
         </div>
      </>
   );
}

export default FilmCard;
