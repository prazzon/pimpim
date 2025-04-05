import { Event } from "@/app/_lib/firebase/types";
import Image from "next/image";
import Link from "next/link";
import { BsFileText } from "react-icons/bs";
import { MdOutlineDateRange } from "react-icons/md";
import { TfiLocationPin } from "react-icons/tfi";
import styles from "./EventCard.module.scss";

type Props = {
   event: Event;
};

function EventCard({ event }: Props) {
   return (
      <Link href={`/events/${event.id}`} className={styles.card}>
         <div className={styles.card_img}>
            <Image src={event.poster} alt={event.title} fill />
         </div>
         <div className={styles.card_content}>
            <h2 className={styles.title}>{event.title}</h2>
            <div className={styles.card_info}>
               <MdOutlineDateRange />
               <p className={styles.date}>
                  {new Date(event.date).toLocaleString("en-GB", {
                     year: "numeric",
                     month: "short",
                     day: "2-digit",
                     hour: "2-digit",
                     minute: "2-digit",
                  })}
               </p>
            </div>

            <div className={styles.card_info}>
               <TfiLocationPin />
               <p className={styles.location}>{event.location}</p>
            </div>

            <div className={styles.card_info}>
               <BsFileText />
               <p className={styles.description}>{event.shortDescription}</p>
            </div>

            <p className={styles.price}>₦ {event.price}</p>
         </div>
         {/* <div className={styles.card_img}>
            <Image src={event.poster} alt={event.title} fill />
         </div> */}
      </Link>
   );
}

export default EventCard;
