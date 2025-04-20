import { type Event } from "@/app/_lib/firebase/types";
import { generateEventAltText } from "@/app/_lib/seo/imageAlt";
import Image from "next/image";
import Link from "next/link";
import { BsFileText } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { TfiLocationPin } from "react-icons/tfi";
import styles from "./Event.module.scss";

type Props = {
   event: Event;
};

function Event({ event }: Props) {
   const altText = generateEventAltText(
      event.title,
      event.location,
      event.date
   );

   return (
      <div className={styles.event}>
         <div className={styles.event_img}>
            <Image src={event.poster} alt={altText} fill />
         </div>

         <div className={styles.event_content}>
            <Link href="/events" className={styles.back}>
               <span>
                  <IoArrowBackOutline />
               </span>
               Back to all events
            </Link>
            <h1 className={styles.title}>{event.title}</h1>
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

            <hr />

            <div className={styles.about}>
               <h3 className={styles.about_title}>About this event</h3>
               <p className={styles.about_description}>
                  {event.longDescription}
               </p>
            </div>
         </div>
      </div>
   );
}

export default Event;
