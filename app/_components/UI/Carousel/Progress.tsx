import { motion } from "motion/react";
import AnimatedText from "../AnimatedText/AnimatedText";
import styles from "./Progress.module.scss";

type Props = {
   currIndex: number;
   length: number;
};

function Progress({ currIndex, length }: Props) {
   return (
      <>
         <div className={styles.progress}>
            <motion.div
               layout
               style={{
                  width: (((currIndex + 1) / length) * 100).toString() + "%",
               }}
               className={styles.progress_bar}
            />
         </div>

         <span
            key={currIndex}
            style={{ overflow: "hidden", display: "inline-block" }}
         >
            {/* <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               key={currIndex + "progress"}
               transition={{
                  duration: 0.6,
                  ease: "easeInOut",
               }}
               className={styles.progress_number}
            >
               0{currIndex + 1}
            </motion.div> */}
            <AnimatedText
               // data={(currIndex + 1).toString()}
               className={styles.progress_number}
               id={currIndex + "progress"}
            >
               {currIndex + 1}
            </AnimatedText>
         </span>
      </>
   );
}

export default Progress;
