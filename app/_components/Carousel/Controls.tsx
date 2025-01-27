// import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { Dispatch, SetStateAction, useCallback } from "react";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { CurrentSlideData } from "./Carousel";
import styles from "./Controls.module.scss";
import Progress from "./Progress";
import { Data } from "@/app/_data/types";

type Props = {
   currentSlideData: CurrentSlideData;
   transitionData: Data;
   data: Data[];
   initData: Data;
   handleData: Dispatch<SetStateAction<Data[]>>;
   handleTransitionData: Dispatch<SetStateAction<Data>>;
   handleCurrentSlideData: Dispatch<SetStateAction<CurrentSlideData>>;
   sliderData: Data[];
};

function Controls({
   currentSlideData,
   transitionData,
   data,
   initData,
   handleData,
   handleTransitionData,
   handleCurrentSlideData,
   sliderData,
}: Props) {   
   const handlePrev = () => {
      handleData((prevData) => [
         transitionData ? transitionData : initData,
         ...prevData.slice(0, prevData.length - 1),
      ]);

      handleCurrentSlideData({
         data: transitionData ? transitionData : sliderData[0],
         index: sliderData.findIndex(
            (el) => el.id === data[data.length - 1].id
         ),
      });

      handleTransitionData(data[data.length - 1]);
   };

   const handleNext = useCallback(() => {
      handleData((prev) => prev.slice(1));

      handleCurrentSlideData({
         data: transitionData ? transitionData : initData,
         index: sliderData.findIndex((el) => el.id === data[0].id),
      });

      handleTransitionData(data[0]);

      setTimeout(() => {
         handleData((newData) => [
            ...newData,
            transitionData ? transitionData : initData,
         ]);
      }, 500);
   }, [
      transitionData,
      data,
      handleData,
      handleCurrentSlideData,
      initData,
      handleTransitionData,
      sliderData,
   ]);

   // useEffect(() => {
   //    const intervalId = setInterval(() => {
   //       handleNext();
   //    }, 5000);

   //    return () => {
   //       clearInterval(intervalId);
   //    };
   // }, [handleNext]);

   return (
      <div className={styles.controls}>
         <button className={styles.controls_btn} onClick={handlePrev}>
            <MdOutlineNavigateBefore />
         </button>
         <button className={styles.controls_btn} onClick={handleNext}>
            <MdOutlineNavigateNext />
         </button>
         <Progress
            currIndex={currentSlideData.index}
            length={sliderData.length}
         />
      </div>
   );
}

export default Controls;
