"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import styles from "./Carousel.module.scss";
import Controls from "./Controls";
import SlideInfo from "./SlideInfo";
import SliderCard from "./SliderCard";

export const sliderData = [
   {
      id: 1,
      category: "movie",
      title: "The Homecoming",
      year: "2022",
      description:
         "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit ullam mollitia commodi ut facere soluta, vel corporis nobis modi at, accusantium aliquid tempore eos asperiores illo! Recusandae non eligendi quibusdam!",
      thumbnail: "/images/movie1.webp",
      trailerLink: "https://www.youtube.com/watch?v=cuATJ5Mlrok",
      movieLink: "https://www.youtube.com/watch?v=cuATJ5Mlrok",
      rating: 9.5,
      genres: ["Action", "Adventure", "Comedy"],
      credits: "Cast: Actor 1, Actor 2, Actor 3",
      viewCount: 1000,
   },
   {
      id: 2,
      category: "movie",
      title: "Chemistry",
      year: "2023",
      description:
         "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit ullam mollitia commodi ut facere soluta, vel corporis nobis modi at, accusantium aliquid tempore eos asperiores illo! Recusandae non eligendi quibusdam!",
      thumbnail: "/images/movie2.webp",
      trailerLink: "https://www.youtube.com/watch?v=cuATJ5Mlrok",
      movieLink: "https://www.youtube.com/watch?v=cuATJ5Mlrok",
      rating: 9.5,
      genres: ["Adventure", "Comedy"],
      credits: "Cast: Actor 1, Actor 2, Actor 3",
      viewCount: 1000,
   },
   {
      id: 3,
      category: "movie",
      title: "The Jailer",
      year: "2021",
      description:
         "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit ullam mollitia commodi ut facere soluta, vel corporis nobis modi at, accusantium aliquid tempore eos asperiores illo! Recusandae non eligendi quibusdam!",
      thumbnail: "/images/movie1.webp",
      trailerLink: "https://www.youtube.com/watch?v=cuATJ5Mlrok",
      movieLink: "https://www.youtube.com/watch?v=cuATJ5Mlrok",
      rating: 9.5,
      genres: ["Action", "Adventure", "Comedy"],
      credits: "Cast: Actor 1, Actor 2, Actor 3",
      viewCount: 1000,
   },
   {
      id: 4,
      category: "movie",
      title: "Mission: Impossible",
      year: "2020",
      description:
         "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit ullam mollitia commodi ut facere soluta, vel corporis nobis modi at, accusantium aliquid tempore eos asperiores illo! Recusandae non eligendi quibusdam!",
      thumbnail: "/images/movie2.webp",
      trailerLink: "https://www.youtube.com/watch?v=cuATJ5Mlrok",
      movieLink: "https://www.youtube.com/watch?v=cuATJ5Mlrok",
      rating: 9.5,
      genres: ["Action", "Adventure", "Comedy"],
      credits: "Cast: Actor 1, Actor 2, Actor 3",
      viewCount: 1000,
   },
   {
      id: 5,
      category: "movie",
      title: "Fractured Identity",
      year: "2024",
      description:
         "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit ullam mollitia commodi ut facere soluta, vel corporis nobis modi at, accusantium aliquid tempore eos asperiores illo! Recusandae non eligendi quibusdam!",
      thumbnail: "/images/movie1.webp",
      trailerLink: "https://www.youtube.com/watch?v=cuATJ5Mlrok",
      movieLink: "https://www.youtube.com/watch?v=cuATJ5Mlrok",
      rating: 9.5,
      genres: ["Action", "Adventure", "Comedy"],
      credits: "Cast: Actor 1, Actor 2, Actor 3",
      viewCount: 1000,
   },
   {
      id: 6,
      category: "movie",
      title: "The Devil's Conspiracy",
      year: "2025",
      description:
         "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit ullam mollitia commodi ut facere soluta, vel corporis nobis modi at, accusantium aliquid tempore eos asperiores illo! Recusandae non eligendi quibusdam!",
      thumbnail: "/images/movie2.webp",
      trailerLink: "https://www.youtube.com/watch?v=cuATJ5Mlrok",
      movieLink: "https://www.youtube.com/watch?v=cuATJ5Mlrok",
      rating: 9.5,
      genres: ["Action", "Adventure", "Comedy"],
      credits: "Cast: Actor 1, Actor 2, Actor 3",
      viewCount: 1000,
   },
];

const initData = sliderData[0];

export type SliderData = {
   id: number;
   category: string;
   title: string;
   year: string;
   description: string;
   thumbnail: string;
   trailerLink: string;
   movieLink: string;
   rating: number;
   genres: string[];
   credits: string;
   viewCount: number;
};

export type CurrentSlideData = {
   data: SliderData;
   index: number;
};

function Carousel() {
   const [data, setData] = useState<SliderData[]>(sliderData.slice(1));
   const [transitionData, setTransitionData] = useState(sliderData[0]);
   const [currentSlideData, setCurrentSlideData] = useState<CurrentSlideData>({
      data: initData,
      index: 0,
   });

   return (
      <>
         <AnimatePresence>
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
                  src={transitionData.thumbnail}
               />
            )}

            {/* Background Image */}

            <motion.img
               key={currentSlideData.data.id + "transition"}
               alt={currentSlideData.data.title}
               src={currentSlideData.data.thumbnail}
               className={styles.background_image_current}
            />

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
