import CategoryBtn from "@/app/_components/UI/CategoryBtn/CategoryBtn";
import Title from "@/app/_components/UI/Title/Title";
import { Post } from "@/app/_lib/firebase/types";
import Image from "next/image";
import Link from "next/link";
import styles from "./Featured.module.scss";

type Props = {
   features: Post[];
};

async function Featured({ features }: Props) {
   if (!features) return null;

   const main = features[0];

   const content = features.slice(1, 5);

   if (!main) return null;

   return (
      <div className={styles.featured}>
         <Title type="secondary">Featured</Title>

         <div className={styles.featured_list}>
            <div className={styles.main}>
               <Link href={`/feed/${main.slug}`} className={styles.overlay} />

               <div className={styles.poster}>
                  <Image src={main.poster} alt={main.title} fill />
               </div>
               <div className={styles.info}>
                  {main.category && (
                     <CategoryBtn
                        href={`/categories/${main.category.slug}`}
                        text={main.category.name}
                     />
                  )}
                  <span className={styles.date}>
                     {main.createdAt.toDateString()}
                  </span>
               </div>
               <h1 className={styles.title}>
                  <span>{main.title}</span>
               </h1>
               <p className={styles.summary}>{main.summary}</p>
            </div>

            <div className={styles.content}>
               {content.map((item) => FeatureContent(item))}
            </div>
         </div>
      </div>
   );

   async function FeatureContent(item: Post) {
      return (
         <div className={styles.content_item} key={item.id}>
            <Link href={`/feed/${item.slug}`} className={styles.overlay} />

            <div className={styles.poster}>
               <Image src={item.poster} alt={item.title} fill />
            </div>
            <div className={styles.content_info}>
               <div className={styles.info}>
                  {item.category && (
                     <CategoryBtn
                        href={`/categories/${item.category.slug}`}
                        text={item.category.name}
                     />
                  )}
                  <span className={styles.date}>
                     {item.createdAt.toDateString()}
                  </span>
               </div>
               <h1 className={styles.title}>
                  <span>{item.title}</span>
               </h1>
               {/* <p className={styles.summary}>{item.summary}</p> */}
            </div>
         </div>
      );
   }
}

export default Featured;
