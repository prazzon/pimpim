"use client";

import { Category } from "@/app/_lib/firebase/types";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./CategoriesList.module.scss";

type Props = {
   categories: (Category & { count: number })[];
   showTitle?: boolean;
   showDescription?: boolean;
};

function CategoriesList({ categories, showTitle, showDescription }: Props) {
   const pathname = usePathname();

   const activeCategory = categories.find((category: Category) =>
      pathname.startsWith(`/categories/${category.slug}`)
   );

   return (
      <>
         <div className={styles.categories_container}>
            <h4 className={styles.filter_title}>Filter by Category</h4>
            <div className={styles.categories_grid}>
               <Link
                  href="/categories"
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
                     href={`/categories/${category.slug}`}
                     key={category.id}
                     className={clsx(styles.category_btn, {
                        [styles.active]: category.slug === activeCategory?.slug,
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
            <h1 className={styles.title}>{activeCategory?.name ?? "All"}</h1>
         )}

         {showDescription && (
            <p className={styles.description}>
               {activeCategory?.description ??
                  "Stay updated with the latest and trending posts across all categories, from breaking news to viral content"}
            </p>
         )}
      </>
   );
}

export default CategoriesList;
