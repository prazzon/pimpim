import { Event } from "@/app/_data/types";
import Image from "next/image";
import styles from "./EventCard.module.scss";
import { MdOutlineDateRange } from "react-icons/md";
import { TfiLocationPin } from "react-icons/tfi";
import { BsFileText } from "react-icons/bs";
import Link from "next/link";

type Props = {
   event: Event;
};

function EventCard({ event }: Props) {
   return (
      <Link href={`/events/${event.id}`} className={styles.card}>
         <div className={styles.card_content}>
            <h2 className={styles.title}>{event.title}</h2>
            <p className={styles.date}>
               <MdOutlineDateRange />
               {new Date(event.date).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
               })}
            </p>
            <p className={styles.location}>
               <TfiLocationPin />
               {event.location}
            </p>
            <p className={styles.description}>
               <BsFileText />
               {event.shortDescription}
            </p>
            <p className={styles.price}>₦ {event.price}</p>
         </div>
         <div className={styles.card_img}>
            <Image src={event.poster} alt={event.title} fill />
         </div>
      </Link>
   );
}

export default EventCard;
