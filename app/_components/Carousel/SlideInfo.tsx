import { motion } from "motion/react";
import AnimatedText from "../UI/AnimatedText/AnimatedText";
import { CurrentSlideData, SliderData } from "./Carousel";
// import OtherInfo from "./OtherInfo";
import { FaCirclePlay } from "react-icons/fa6";
import styles from "./SlideInfo.module.scss";

type Props = {
   transitionData: SliderData;
   currentSlideData: CurrentSlideData;
};

function SlideInfo({ transitionData, currentSlideData }: Props) {
   const data = transitionData ? transitionData : currentSlideData.data;

   return (
      <div className={styles.slide_info}>
         <motion.div className={styles.slide_info_content}>
            <motion.span layout className={styles.divider} />
            <AnimatedText
               // data={data.title}
               id={data.id + "title"}
               className={styles.title}
            >
               {data.title}
            </AnimatedText>
            <AnimatedText
               // data={data.description}
               id={data.id + "desc"}
               className={styles.description}
            >
               {data.description}
            </AnimatedText>
         </motion.div>

         <motion.div layout className={styles.slide_info_btns}>
            {/* <AnimatedText id={data.id + "watch"}> */}
            <motion.button layout className={styles.btn_primary}>
               <FaCirclePlay />
               Watch now
            </motion.button>
            {/* </AnimatedText> */}
            {/* <AnimatedText id={data.id + "watch"}> */}
            <motion.button layout className={styles.btn_secondary}>
               Watch Trailer
            </motion.button>
            {/* </AnimatedText> */}
         </motion.div>
      </div>
   );
}

export default SlideInfo;
