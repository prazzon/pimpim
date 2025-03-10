// import { Data } from "@/app/_data/types";
import { Data } from "@/app/_lib/firebase/types";
import Image from "next/image";
import Link from "next/link";
import { FaCirclePlay } from "react-icons/fa6";
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
         pageLink = `/movies/${item.slug}`;
         break;
      case "series":
         pageLink = `/series/${item.id}`;
         break;
      case "show":
         pageLink = `/shows/${item.id}`;
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
               <Image src={item.poster} alt={item.title} fill />

               <div className={styles.play}>
                  <FaCirclePlay />
               </div>
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

               <h2 className={`${styles.info_title} ${styles.small}`}>
                  {item.title}
               </h2>

               <p className={styles.info_description}>{item.description}</p>

               {item.category === "movie" && (
                  <p className={styles.info_text}>{item.year}</p>
               )}

               {(item.category === "series" || item.category === "show") && (
                  <p className={styles.info_text}>
                     {item.episodes.length} episodes
                  </p>
               )}
            </div>
         </div>
      </>
   );
}

export default ListCard;
