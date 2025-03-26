"use client";

import { Post } from "@/app/_lib/firebase/types";
import { AnimatePresence, motion, wrap } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { GrFormNextLink } from "react-icons/gr";
import AnimatedText from "../AnimatedText/AnimatedText";
import styles from "./MiniCarousel.module.scss";

type Props = {
   items: Post[];
};

function MiniCarousel({ items }: Props) {
   const [[page, direction], setPage] = useState([0, 0]);
   const imageIndex = wrap(0, items.length, page);

   const paginate = useCallback(
      (newD: number) => setPage([page + newD, newD]),
      [page, setPage]
   );

   useEffect(() => {
      const timer = setInterval(() => paginate(1), 5000);
      return () => clearInterval(timer);
   }, [paginate]);

   if (!items.length) return null;

   return (
      <div className={styles.container}>
         <AnimatePresence>
            <motion.img
               key={page}
               src={items[imageIndex].poster}
               custom={direction}
               variants={{
                  enter: (dir) => ({
                     x: dir > 0 ? 1000 : -1000,
                     opacity: 0,
                  }),
                  center: { x: 0, opacity: 1 },
                  exit: (dir) => ({ x: dir < 0 ? 1000 : -1000, opacity: 0 }),
               }}
               initial="enter"
               animate="center"
               exit="exit"
               transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
               }}
            />
         </AnimatePresence>

         {/* <Link
            className={styles.overlay}
            href={`/feed/${items[imageIndex].id}`}
         /> */}

         <div className={styles.overlay} />

         <Link
            href={`/categories/${items[imageIndex].category.slug}`}
            className={styles.category}
         >
            <AnimatePresence mode="wait">
               <AnimatedText
                  id={items[imageIndex].id + "category"}
                  key={items[imageIndex].id + "category"}
                  className={styles.category_text}
               >
                  {items[imageIndex]?.category?.name}
               </AnimatedText>
            </AnimatePresence>
         </Link>

         <Link
            href={`/feed/${items[imageIndex].slug}`}
            className={styles.title}
         >
            <AnimatePresence mode="wait">
               <AnimatedText
                  id={items[imageIndex].id + "title"}
                  key={items[imageIndex].id + "title"}
                  className={styles.line_clamp}
                  containerClassName={styles.title_container}
               >
                  {items[imageIndex].title}
               </AnimatedText>
            </AnimatePresence>
         </Link>

         <div className={styles.next} onClick={() => paginate(1)}>
            <GrFormNextLink />
         </div>
         <div className={styles.prev} onClick={() => paginate(-1)}>
            <GrFormNextLink />
         </div>
         <div className={styles.dots}>
            {items.map((_, idx) => (
               <div
                  key={idx}
                  className={`${styles.dot} ${
                     imageIndex === idx ? styles.active : ""
                  }`}
                  onClick={() => setPage([idx, idx > page ? 1 : -1])}
               />
            ))}
         </div>
      </div>
   );
}

export default MiniCarousel;
