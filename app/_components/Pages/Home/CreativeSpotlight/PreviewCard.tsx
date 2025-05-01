"use client";

import { Post } from "@/app/_lib/firebase/types";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./PreviewCard.module.scss";

type PreviewCardProps = {
   post: Post;
   progress: number;
};

const PreviewCard = ({ post, progress }: PreviewCardProps) => {
   return (
      <div className={styles.preview_card}>
         <div className={styles.image_container}>
            <Image
               src={post.poster}
               alt={post.title}
               fill
               className={styles.image}
            />
         </div>
         <div className={styles.content}>
            <h3 className={styles.title}>Next: {post.title}</h3>
            <div className={styles.progress_container}>
               <div className={styles.progress_bar}>
                  <motion.div
                     className={styles.progress_fill}
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     transition={{ duration: 0.5 }}
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default PreviewCard;
