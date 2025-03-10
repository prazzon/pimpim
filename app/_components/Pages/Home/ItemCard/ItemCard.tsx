// import { getAuthorById } from "@/app/_lib/firebase/authors/service";
// import { getCategoryById } from "@/app/_lib/firebase/categories/service";
import CategoryBtn from "@/app/_components/UI/CategoryBtn/CategoryBtn";
import { Post } from "@/app/_lib/firebase/types";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import styles from "./ItemCard.module.scss";

type Props = {
   item: Post;
   position?: number;
   layout?: "horizontal" | "vertical";
};

async function ItemCard({ item, position, layout = "horizontal" }: Props) {
   return (
      <div className={clsx(styles.item, styles[layout])}>
         <Link href={`/feed/${item.slug}`} className={styles.overlay} />

         <div className={styles.poster}>
            {position && <span className={styles.position}>{position}</span>}
            {/* {item.position && (
               <span className={styles.position}>
                  #{item.position} in {item.category} 🔥
               </span>
            )} */}

            <Image src={item.poster} alt={item.title} fill />
         </div>

         <div className={styles.info}>
            <p className={styles.info_date}>
               {formatDistanceToNow(item.createdAt, {
                  addSuffix: true,
               })}
            </p>

            {/* <p className={styles.info_tags}>
               {item.tags?.map((tag) => (
                  <span key={tag}>#{tag}</span>
               ))}
            </p> */}

            <p className={styles.info_title}>
               <span>{item.title}</span>
            </p>

            {/* <p className={styles.info_date}>By {item.author?.name}</p> */}

            {/* <p className={styles.info_tags}>
               {item.tags?.map((tag) => (
                  <span key={tag}>#{tag}</span>
               ))}
            </p> */}

            <p className={styles.info_summary}>{item.summary}</p>

            {item.category && (
               <CategoryBtn
                  href={`/categories/${item.category.slug}`}
                  className={styles.info_category}
                  text={item.category.name}
               />
            )}
         </div>
      </div>
   );
}

export default ItemCard;
