"use client";

import { motion } from "framer-motion";
import styles from "./Skeleton.module.scss";

type SkeletonProps = {
   variant?: "text" | "circle" | "rect" | "comment";
   width?: string | number;
   height?: string | number;
   className?: string;
   animate?: boolean;
};

export default function Skeleton({
   variant = "text",
   width,
   height,
   className = "",
   animate = true,
}: SkeletonProps) {
   const getVariantClass = () => {
      switch (variant) {
         case "text":
            return styles.text;
         case "circle":
            return styles.circle;
         case "rect":
            return styles.rect;
         case "comment":
            return styles.comment;
         default:
            return styles.text;
      }
   };

   const style = {
      width: width
         ? typeof width === "number"
            ? `${width}px`
            : width
         : undefined,
      height: height
         ? typeof height === "number"
            ? `${height}px`
            : height
         : undefined,
   };

   if (variant === "comment") {
      return (
         <div className={`${styles.skeleton_comment} ${className}`}>
            <div className={styles.comment_header}>
               <div
                  className={`${styles.skeleton} ${styles.circle}`}
                  style={{ width: 40, height: 40 }}
               />
               <div className={styles.comment_meta}>
                  <div
                     className={`${styles.skeleton} ${styles.text}`}
                     style={{ width: 120, height: 12 }}
                  />
                  <div
                     className={`${styles.skeleton} ${styles.text}`}
                     style={{ width: 80, height: 12 }}
                  />
               </div>
            </div>
            <div className={styles.comment_body}>
               <div
                  className={`${styles.skeleton} ${styles.text}`}
                  style={{ width: "95%", height: 12 }}
               />
               <div
                  className={`${styles.skeleton} ${styles.text}`}
                  style={{ width: "75%", height: 12 }}
               />
            </div>
            <div className={styles.comment_actions}>
               <div
                  className={`${styles.skeleton} ${styles.rect}`}
                  style={{ width: 40, height: 16, borderRadius: 4 }}
               />
               <div
                  className={`${styles.skeleton} ${styles.rect}`}
                  style={{ width: 50, height: 16, borderRadius: 4 }}
               />
            </div>
         </div>
      );
   }

   return (
      <motion.div
         className={`${styles.skeleton} ${getVariantClass()} ${className}`}
         style={style}
         animate={animate ? { opacity: [0.6, 0.8, 0.6] } : undefined}
         transition={
            animate
               ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
               : undefined
         }
      />
   );
}
