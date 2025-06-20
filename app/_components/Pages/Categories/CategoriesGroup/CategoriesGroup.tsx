"use client";

import Title from "@/app/_components/UI/Title/Title";
import { Category } from "@/app/_lib/firebase/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GrFormNextLink } from "react-icons/gr";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import styles from "./CategoriesGroup.module.scss";

function CategoriesGroup({ categories }: { categories: Category[] }) {
   const ref = useRef<HTMLDivElement>(null);
   const [showLeft, setShowLeft] = useState(false);
   const [showRight, setShowRight] = useState(true);

   function handleLeftClick() {
      if (!ref.current) return;
      ref.current.scrollLeft -= ref.current.clientWidth;
   }

   function handleRightClick() {
      if (!ref.current) return;
      ref.current.scrollLeft += ref.current.clientWidth;
   }

   function updateHandlesVisibility() {
      if (!ref.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth);
   }

   useEffect(() => {
      const currentRef = ref.current;
      if (!currentRef) return;

      updateHandlesVisibility();
      currentRef.addEventListener("scroll", updateHandlesVisibility);

      return () => {
         currentRef.removeEventListener("scroll", updateHandlesVisibility);
      };
   }, []);

   return (
      <div className={styles.container}>
         {showLeft && (
            <button
               className={styles.left_handle}
               onClick={handleLeftClick}
               aria-label="Scroll left"
            >
               <MdOutlineNavigateBefore />
            </button>
         )}

         <div className={styles.title}>
            <Title type="secondary">Categories</Title>
            <Link href={"/categories"}>
               See all <GrFormNextLink />
            </Link>
         </div>

         <div className={styles.categories} ref={ref}>
            {categories.map((category) => (
               <Link
                  href={`/categories/${category.slug}`}
                  className={styles.category}
                  key={category.name}
               >
                  <div className={styles.category_img}>
                     <Image
                        src={category.image}
                        alt={
                           category.description ||
                           `pimpim ${category.name} category image`
                        }
                        fill
                     />
                  </div>
                  <h2 className={styles.category_name}>{category.name}</h2>
               </Link>
            ))}
         </div>

         {showRight && (
            <button
               className={styles.right_handle}
               onClick={handleRightClick}
               aria-label="Scroll right"
            >
               <MdOutlineNavigateNext />
            </button>
         )}
      </div>
   );
}

export default CategoriesGroup;
