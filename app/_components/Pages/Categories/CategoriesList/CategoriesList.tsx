"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./CategoriesList.module.scss";
import clsx from "clsx";
import { Category } from "@/app/_lib/firebase/types";

type Props = {
   categories: Category[];
   showTitle?: boolean;
   showDescription?: boolean;
};

function CategoriesList({ categories, showTitle, showDescription }: Props) {
   const pathname = usePathname();

   const activeCategory = categories.find((category: Category) =>
      pathname.startsWith(`/categories/${category.slug}`)
   );

   // function isActivePath(href: string) {
   //    if (href === "/" && pathname !== href) {
   //       return false;
   //    }

   //    return pathname.startsWith(href);
   // }

   return (
      <>
         <div className={styles.categories}>
            <Link href={"/categories"} className={styles.category}>
               <h3>All</h3>
            </Link>
            {categories.map((category) => (
               <Link
                  href={`/categories/${category.slug}`}
                  key={category.id}
                  // className={styles.category}
                  // className={
                  //    category.slug === activeCategory?.slug ? styles.active : ""
                  // }
                  className={clsx(styles.category, {
                     [styles.active]: category.slug === activeCategory?.slug,
                  })}
               >
                  <h3>{category.name}</h3>
               </Link>
            ))}
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
