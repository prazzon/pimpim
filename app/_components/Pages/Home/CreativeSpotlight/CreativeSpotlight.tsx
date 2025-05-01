"use client";

import { Post } from "@/app/_lib/firebase/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import CategoryBtn from "../../../UI/CategoryBtn/CategoryBtn";
import styles from "./CreativeSpotlight.module.scss";
import PreviewCard from "./PreviewCard";

type CreativeSpotlightProps = {
   posts: Post[];
};

const CreativeSpotlight = ({ posts }: CreativeSpotlightProps) => {
   const [currentIndex, setCurrentIndex] = useState(0);
   const [direction, setDirection] = useState(0);
   const [progress, setProgress] = useState(0);
   const [autoplayEnabled, setAutoplayEnabled] = useState(true);

   // Get current post
   const currentPost = posts[currentIndex];

   // Get next post (for preview card)
   const nextIndex = (currentIndex + 1) % posts.length;
   const nextPost = posts[nextIndex];

   // Handle navigation
   const goToPrevious = useCallback(() => {
      setDirection(-1);
      setCurrentIndex((prevIndex) =>
         prevIndex === 0 ? posts.length - 1 : prevIndex - 1
      );
      setProgress(0);
      // setAutoplayEnabled(true);
   }, [posts.length]);

   const goToNext = useCallback(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
      setProgress(0);
      // setAutoplayEnabled(true);
   }, [posts.length]);

   // Autoplay functionality
   useEffect(() => {
      if (!autoplayEnabled || posts.length <= 1) return;

      const interval = setInterval(() => {
         setProgress((prevProgress) => {
            const newProgress = prevProgress + 1;
            if (newProgress >= 100) {
               goToNext();
               return 0;
            }
            return newProgress;
         });
      }, 100); // Update progress every 100ms (10 seconds total for 0-100%)

      return () => clearInterval(interval);
   }, [autoplayEnabled, goToNext, posts.length]);

   // Disable autoplay when user interacts with navigation
   const handleNavClick = (navFunction: () => void) => {
      setAutoplayEnabled(false);
      navFunction();
      // Re-enable autoplay after 5 seconds of inactivity
      setTimeout(() => setAutoplayEnabled(true), 5000);
   };

   // Animation variants
   const slideVariants = {
      enter: (direction: number) => ({
         x: direction > 0 ? "100%" : "-100%",
         opacity: 0,
      }),
      center: {
         x: 0,
         opacity: 1,
      },
      exit: (direction: number) => ({
         x: direction < 0 ? "100%" : "-100%",
         opacity: 0,
      }),
   };

   // If no posts, don't render anything
   if (posts.length === 0) {
      return null;
   }

   return (
      <section className={styles.creative_spotlight}>
         <div className={styles.container}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
               <motion.div
                  key={currentPost.id}
                  className={styles.content}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                     x: { type: "spring", stiffness: 300, damping: 30 },
                     opacity: { duration: 0.2 },
                  }}
               >
                  <div className={styles.categories}>
                     {currentPost.category && (
                        <CategoryBtn
                           href={`/categories/${currentPost.category.slug}`}
                           text={currentPost.category.name}
                        />
                     )}
                  </div>
                  <Link
                     href={`/feed/${currentPost.slug}`}
                     className={styles.content_info}
                  >
                     <h2 className={styles.title}>
                        <span>{currentPost.title}</span>
                     </h2>
                     <p className={styles.description}>{currentPost.summary}</p>
                  </Link>

                  {/* Navigation and Preview Card */}
                  {posts.length > 1 && (
                     <>
                        <div className={styles.navigation}>
                           <button
                              className={styles.nav_button}
                              onClick={() => handleNavClick(goToPrevious)}
                              aria-label="Previous post"
                           >
                              <IoChevronBackOutline />
                           </button>
                           <button
                              className={styles.nav_button}
                              onClick={() => handleNavClick(goToNext)}
                              aria-label="Next post"
                           >
                              <IoChevronForwardOutline />
                           </button>
                        </div>

                        <div className={styles.preview_section}>
                           <PreviewCard post={nextPost} progress={progress} />
                        </div>
                     </>
                  )}
               </motion.div>
            </AnimatePresence>

            <AnimatePresence initial={false} custom={direction} mode="wait">
               <motion.div
                  key={`image-${currentPost.id}`}
                  className={styles.image_container}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                     x: { type: "spring", stiffness: 300, damping: 30 },
                     opacity: { duration: 0.2 },
                  }}
               >
                  <Image
                     src={currentPost.poster}
                     alt={currentPost.title}
                     fill
                  />
               </motion.div>
            </AnimatePresence>
         </div>
      </section>
   );
};

export default CreativeSpotlight;
