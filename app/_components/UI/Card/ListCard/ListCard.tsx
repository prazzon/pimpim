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
   let pageLink;

   switch (item.category) {
      case "movie":
         pageLink = `/movies/${item.id}`;
         break;
      case "series":
         pageLink = `/series/${item.id}`;
         break;
      case "show":
         pageLink = `/shows/${item.id}`;
         break;
      case "news":
         pageLink = `/trending/${item.id}`;
         break;
      case "event":
         pageLink = `/events/${item.id}`;
         break;
      default:
         pageLink = "/";
         break;
   }

   return (
      <>
         <div key={item.id} className={`${styles.item}`}>
            {position && <span className={styles.position}>0{position}</span>}
            <Link href={pageLink} className={styles.image}>

               {item.position && (
                  <span className={styles.position}>
                     #{item.position} in {item.category} 🔥
                  </span>
               )}

               <Image src={item.poster} alt={item.title} fill />

               {(item.category === "movie" || item.category === "series") && (
                  <div className={styles.play}>
                     <FaCirclePlay />
                  </div>
               )}

               {item.category === "show" && (
                  <div className={styles.play}>
                     <FaCirclePlay />
                  </div>
               )}

               {item.category === "news" && (
                  <div className={styles.play}>
                     <FaReadme />
                  </div>
               )}

            </Link>
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
                  <p className={styles.info_description}>
                     {item.description.length > 200
                        ? `${item.description.substring(0, 200)} ...`
                        : item.description}
                  </p>
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
