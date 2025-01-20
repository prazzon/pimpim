import { motion } from "motion/react";
import { SliderData } from "./Carousel";
import styles from "./SliderCard.module.scss";

type Prop = {
   data: SliderData;
};

function SliderCard({ data }: Prop) {
   return (
      <motion.div
         // layout
         layoutId={data.id.toString()}
         initial={{ scale: 0.8, opacity: 0 }}
         animate={{ scale: 1, opacity: 1, transition: { duration: .4 } }}
         exit={{ scale: 0.8, opacity: 0 }}
         transition={{
            type: "spring",
            damping: 20,
            stiffness: 100,
         }}
         className={styles.slider_card}
      >
         <motion.img
            // layoutId={data.id.toString()}
            // layout
            alt={data.title}
            src={data.thumbnail}
            className={styles.image}
         />
         <motion.div className={styles.content}>
            <motion.h2
               layoutId={data.id.toString() + "title"}
               className={styles.title}
            >
               {/* <motion.span layout className={styles.line} /> */}
               {data.title}
            </motion.h2>
         </motion.div>
      </motion.div>
   );
}

export default SliderCard;
