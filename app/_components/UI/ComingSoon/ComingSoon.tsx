"use client";

import { motion } from "framer-motion";
import { FaTools } from "react-icons/fa";
import { FaRegCalendarDays } from "react-icons/fa6";
import { IoConstructOutline } from "react-icons/io5";
import GradientText from "../GradientText/GradientText";
import styles from "./ComingSoon.module.scss";

type Props = {
   title: string;
   message: string;
   icon?: "calendar" | "construction" | "tools";
};

function ComingSoon({ title, message, icon = "calendar" }: Props) {
   const renderIcon = () => {
      switch (icon) {
         case "calendar":
            return <FaRegCalendarDays className={styles.icon} />;
         case "construction":
            return <IoConstructOutline className={styles.icon} />;
         case "tools":
            return <FaTools className={styles.icon} />;
         default:
            return <FaRegCalendarDays className={styles.icon} />;
      }
   };

   return (
      <div className={styles.container}>
         <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
         >
            <motion.div
               className={styles.icon_container}
               initial={{ scale: 0.8 }}
               animate={{ scale: 1 }}
               transition={{
                  duration: 0.5,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
               }}
            >
               {renderIcon()}
            </motion.div>

            <motion.h1
               className={styles.title}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.5, delay: 0.3 }}
            >
               <GradientText
                  animationSpeed={50}
                  showBorder={false}
                  className={styles.gradient_text}
               >
                  {title}
               </GradientText>
            </motion.h1>

            <motion.p
               className={styles.message}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.5, delay: 0.4 }}
            >
               {message}
            </motion.p>
         </motion.div>
      </div>
   );
}

export default ComingSoon;
