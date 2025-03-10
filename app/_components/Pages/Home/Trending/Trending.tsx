import CategoryBtn from "@/app/_components/UI/CategoryBtn/CategoryBtn";
import Title from "@/app/_components/UI/Title/Title";
import { Post } from "@/app/_lib/firebase/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import styles from "./Trending.module.scss";

type Props = {
   posts: Post[];
};

function Trending({ posts }: Props) {
   return (
      <div className={styles.trending}>
         <Title type="secondary">Trending</Title>

         <div className={styles.trending_content}>
            {posts
               .slice(0, 5)
               .map((item, index) => (
                  <div className={styles.trending_item} key={item.id}>
                     <Link
                        href={`/feed/${item.slug}`}
                        className={styles.overlay}
                     />

                     <div className={styles.poster}>
                        <span className={styles.position}>{index + 1}</span>

                        <Image src={item.poster} alt={item.title} fill />
                     </div>

                     <div className={styles.info}>
                        <p className={styles.info_date}>
                           {formatDistanceToNow(item.createdAt, {
                              addSuffix: true,
                           })}
                        </p>

                        <p className={styles.info_title}>
                           <span>{item.title}</span>
                        </p>

                        {item.category && (
                           <CategoryBtn
                              href={`/categories/${item.category.slug}`}
                              className={styles.info_category}
                              text={item.category.name}
                           />
                        )}
                     </div>
                  </div>
               ))}
         </div>
      </div>
   );
}

export default Trending;
