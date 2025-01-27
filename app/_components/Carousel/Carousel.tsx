"use client";

import { Data } from "@/app/_data/types";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import styles from "./Carousel.module.scss";
import Controls from "./Controls";
import SlideInfo from "./SlideInfo";
import SliderCard from "./SliderCard";

export type CurrentSlideData = {
   data: Data;
   index: number;
};

type Props = {
   sliderData: Data[];
};

function Carousel({ sliderData }: Props) {
   const initData = sliderData[0];

   const [data, setData] = useState<Data[]>(sliderData.slice(1));
   const [transitionData, setTransitionData] = useState(sliderData[0]);
   const [currentSlideData, setCurrentSlideData] = useState<CurrentSlideData>({
      data: initData,
      index: 0,
   });

   return (
      <>
         <AnimatePresence>
            <div className={styles.background} key={"currentSlideData.data.id"}>
               {/* Background Transition Animation */}
               {transitionData && (
                  <motion.img
                     key={transitionData.id}
                     layoutId={transitionData.id.toString()}
                     alt={transitionData.title}
                     transition={{
                        opacity: { ease: "linear" },
                        layout: { duration: 0.6 },
                     }}
                     className={styles.background_image}
                     src={transitionData.poster}
                  />
               )}
               {/* Background Image */}
               <motion.img
                  key={currentSlideData.data.id + "transition"}
                  alt={currentSlideData.data.title}
                  src={currentSlideData.data.poster}
                  className={styles.background_image_current}
               />
            </div>

            {/* Container */}
            <div className={styles.container}>
               <div className={styles.content}>
                  {/* Slider left section content */}
                  <div className={styles.slider_left}>
                     <SlideInfo
                        transitionData={transitionData}
                        currentSlideData={currentSlideData}
                     />
                  </div>

                  {/* Slider right carousel content */}
                  <div className={styles.slider_right}>
                     {/* Slides */}
                     <div className={styles.slides}>
                        {data.map((item) => (
                           <SliderCard key={item.id} data={item} />
                        ))}
                     </div>

                     <Controls
                        currentSlideData={currentSlideData}
                        transitionData={transitionData}
                        data={data}
                        initData={initData}
                        handleData={setData}
                        handleTransitionData={setTransitionData}
                        handleCurrentSlideData={setCurrentSlideData}
                        sliderData={sliderData}
                     />
                  </div>
               </div>
            </div>
         </AnimatePresence>
      </>
   );
}

export default Carousel;
