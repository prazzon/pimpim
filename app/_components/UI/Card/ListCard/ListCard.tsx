import { Data } from "@/app/_data/types";
import Image from "next/image";
import Link from "next/link";
import { FaCirclePlay, FaReadme } from "react-icons/fa6";
import ShinyText from "../../ShinyText/ShinyText";
import styles from "./ListCard.module.scss";

type Props = {
   item: Data;
   position?: number;
};

function ListCard({ item, position }: Props) {
   return (
      <>
         <div key={item.id} className={`${styles.item}`}>
            {position && <span className={styles.position}>0{position}</span>}
            <div className={styles.image}>

               {item.position && (
                  <span className={styles.position}>
                     #{item.position} in {item.category} 🔥
                  </span>
               )}

               <Image src={item.poster} alt={item.title} fill />

               {(item.category === "movie" || item.category === "series") && (
                  <Link href={`/movies/${item.id}`} scroll={false} className={styles.play}>
                     <FaCirclePlay />
                  </Link>
               )}

               {item.category === "show" && (
                  <Link href={`/shows/${item.id}`} className={styles.play}>
                     <FaCirclePlay />
                  </Link>
               )}

               {item.category === "news" && (
                  <Link href={`/trending/${item.id}`} className={styles.play}>
                     <FaReadme />
                  </Link>
               )}

            </div>
            <div className={styles.info}>
               <div className={styles.info_category}>
                  <ShinyText
                     text={item.category}
                     disabled={false}
                     speed={3}
                     className="custom-class"
                  />
               </div>

               {item.category === "news" && (
                  <p className={styles.info_author}>By {item.author}</p>
               )}

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

               {item.category !== "event" && (
                  <p className={styles.info_description}>{item.description}</p>
               )}

               {item.category === "news" && (
                  <p className={styles.info_time}>8 hours ago</p>
                  // ! CHANGE THIS LATER
               )}
            </div>
         </div>
      </>
   );
}

export default ListCard;
