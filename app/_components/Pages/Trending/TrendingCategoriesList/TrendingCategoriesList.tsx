"use client";

import { Category } from "@/app/_lib/firebase/types";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./TrendingCategoriesList.module.scss";

type Props = {
   categories: (Category & { count: number })[];
   showTitle?: boolean;
   showDescription?: boolean;
};

function TrendingCategoriesList({
   categories,
   showTitle,
   showDescription,
}: Props) {
   const pathname = usePathname();

   const activeCategory = pathname.startsWith("/trending/")
      ? pathname.split("/trending/")[1]
      : null;

   const activeCategoryData = categories.find(
      (category: Category) => category.slug === activeCategory
   );

   return (
      <>
         <div className={styles.categories_container}>
            <h4 className={styles.filter_title}>Filter by Category</h4>
            <div className={styles.categories_grid}>
               <Link
                  href="/trending"
                  className={clsx(styles.category_btn, styles.all_category, {
                     [styles.active]: !activeCategory,
                  })}
               >
                  <span className={styles.category_label}>All Categories</span>
                  <span className={styles.category_count}>
                     {categories.reduce((acc, c) => acc + (c.count ?? 0), 0)}
                  </span>
               </Link>
               {categories.map((category) => (
                  <Link
                     href={`/trending/${category.slug}`}
                     key={category.id}
                     className={clsx(styles.category_btn, {
                        [styles.active]: category.slug === activeCategory,
                     })}
                  >
                     <span className={styles.category_label}>
                        {category.name}
                     </span>
                     <span className={styles.category_count}>
                        {category.count ?? 0}
                     </span>
                  </Link>
               ))}
            </div>
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
                  "Discover the most popular and trending posts based on views across all categories"}
            </p>
         )}
      </>
   );
}

export default TrendingCategoriesList;
