"use client";

import { Category } from "@/app/_lib/firebase/types";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./TrendingCategoriesList.module.scss";

type Props = {
   categories: Category[];
   showTitle?: boolean;
   showDescription?: boolean;
};

function TrendingCategoriesList({
   categories,
   showTitle,
   showDescription,
}: Props) {
   const pathname = usePathname();

   // Extract category slug from pathname (e.g., "/trending/sports" -> "sports")
   const activeCategory = pathname.startsWith("/trending/")
      ? pathname.split("/trending/")[1]
      : null;

   const activeCategoryData = categories.find(
      (category: Category) => category.slug === activeCategory
   );

   return (
      <>
         <div className={styles.categories}>
            <Link
               href="/trending"
               className={clsx(styles.category, {
                  [styles.active]: !activeCategory,
               })}
            >
               <h3>All</h3>
            </Link>
            {categories.map((category) => (
               <Link
                  href={`/trending/${category.slug}`}
                  key={category.id}
                  className={clsx(styles.category, {
                     [styles.active]: category.slug === activeCategory,
                  })}
               >
                  <h3>{category.name}</h3>
               </Link>
            ))}
         </div>
         {showTitle && (
            <h1 className={styles.title}>
               {activeCategoryData?.name
                  ? `Trending in ${activeCategoryData.name}`
                  : "Trending"}
            </h1>
         )}

         {showDescription && (
            <p className={styles.description}>
               {activeCategoryData?.description ??
                  "Discover the most popular and trending posts based on view counts across all categories"}
            </p>
         )}
      </>
   );
}

export default TrendingCategoriesList;
