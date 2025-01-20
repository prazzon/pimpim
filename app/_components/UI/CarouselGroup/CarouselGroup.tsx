"use client";

import Link from "next/link";
import { useRef } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import styles from "./CarouselGroup.module.scss";

export type Props = {
   title: string;
   link: string;
   size?: "small" | "medium" | "large";
   children: React.ReactNode;
};

function CarouselGroup({ title, link, size = "small", children }: Props) {
   const ref = useRef<HTMLDivElement>(null);

   function handleLeftClick() {
      if (!ref.current) return;
      ref.current.scrollLeft -= ref.current!.clientWidth;
   }

   function handleRightClick() {
      if (!ref.current) return;
      ref.current.scrollLeft += ref.current!.clientWidth;
   }

   return (
      <div className={styles.container}>
         <button className={styles.left_handle} onClick={handleLeftClick}>
            <MdOutlineNavigateBefore />
         </button>

         <div className={styles.content}>
            <div className={styles.header}>
               <h1 className={styles.title}>{title}</h1>
               <Link href={link} className={styles.see_more}>
                  See more <FaArrowRight />
               </Link>
            </div>
            <div
               className={`${styles.carousel_group} ${styles[size]}`}
               ref={ref}
            >
               {children}
            </div>
         </div>

         <button className={styles.right_handle} onClick={handleRightClick}>
            <MdOutlineNavigateNext />
         </button>
      </div>
   );
}

export default CarouselGroup;
