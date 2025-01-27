import { Data } from "@/app/_data/types";
import { AnimatePresence, motion } from "motion/react";
import { FaPlay, FaReadme } from "react-icons/fa6";
import AnimatedText from "../UI/AnimatedText/AnimatedText";
import { CurrentSlideData } from "./Carousel";
// import ShinyText from "../UI/ShinyText/ShinyText";
import Link from "next/link";
import IFrame from "../IFrame/IFrame";
import Modal, { Content, OpenBtn } from "../UI/Modal/Modal";
import styles from "./SlideInfo.module.scss";

type Props = {
   transitionData: Data;
   currentSlideData: CurrentSlideData;
};

function SlideInfo({ transitionData, currentSlideData }: Props) {
   const data = transitionData ? transitionData : currentSlideData.data;
   const page =
      data.category === "movie"
         ? "movies"
         : data.category === "show"
         ? "shows"
         : data.category;

   return (
      <div className={styles.slide_info}>
         <motion.div className={styles.slide_info_content}>
            <motion.span layout className={styles.divider} />
            {/* <AnimatePresence mode="wait">
               <AnimatedText
                  id={data.id + "divider"}
                  key={data.id + "divider"}
                  // className={styles.divider}
               >
                  <motion.span layout className={styles.divider} />
               </AnimatedText>
            </AnimatePresence> */}

            {/* <motion.div layout className={styles.category}>
               <ShinyText
                  text={data.category}
                  disabled={false}
                  speed={3}
                  className="custom-class"
               />
            </motion.div> */}

            <AnimatePresence mode="wait">
               <AnimatedText
                  id={data.id + "title"}
                  key={data.id + "title"}
                  className={styles.title}
               >
                  {data.title}
               </AnimatedText>
            </AnimatePresence>

            <AnimatePresence mode="wait">
               {data.category !== "event" && (
                  <AnimatedText
                     id={data.id + "desc"}
                     key={data.id + "desc"}
                     className={styles.description}
                  >
                     {data.description.split(" ").slice(0, 40).join(" ")}
                  </AnimatedText>
               )}
            </AnimatePresence>
         </motion.div>

         <motion.div layout className={styles.slide_info_btns}>
            <AnimatePresence mode="wait">
               {(data.category === "movie" ||
                  data.category === "series" ||
                  data.category === "show") && (
                  <AnimatedText id={data.id + "btn"} key={data.id + "btn"}>
                     <motion.button className={styles.btn_primary}>
                        <Link href={`/${page}/${data.id}`} scroll={false}>
                           <FaPlay />
                           Watch now
                        </Link>
                     </motion.button>
                  </AnimatedText>
               )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
               {data.category === "news" && (
                  <AnimatedText
                     id={data.id + "btnNews"}
                     key={data.id + "btnNews"}
                  >
                     <motion.button className={styles.btn_primary}>
                        <Link href={`/${page}/${data.id}`}>
                           <FaReadme />
                           Read now
                        </Link>
                     </motion.button>
                  </AnimatedText>
               )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
               {(data.category === "movie" ||
                  data.category === "series" ||
                  data.category === "show") && (
                  <AnimatedText
                     id={data.id + "btnTrailer"}
                     key={data.id + "btnTrailer"}
                  >
                     {/* <motion.button className={styles.btn_secondary}>
                        Watch Trailer
                     </motion.button> */}
                     <Modal>
                        <OpenBtn>
                           <button className={styles.btn_secondary}>
                              <FaPlay />
                              Watch trailer
                           </button>
                        </OpenBtn>
                        <Content>
                           <IFrame link={data.trailerLink} />
                        </Content>
                     </Modal>
                  </AnimatedText>
               )}
            </AnimatePresence>
         </motion.div>
      </div>
   );
}

export default SlideInfo;
