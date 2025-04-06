"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IoMdCheckmarkCircle, IoMdClose } from "react-icons/io";
import { MdError } from "react-icons/md";
import styles from "./Alert.module.scss";

export type AlertType = "success" | "error";

interface AlertProps {
   type: AlertType;
   message: string;
   onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
   if (!message) return null;

   return (
      <AnimatePresence>
         <motion.div
            className={`${styles.alert} ${styles[type]}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
         >
            <div className={styles.content}>
               <span className={styles.icon}>
                  {type === "success" ? <IoMdCheckmarkCircle /> : <MdError />}
               </span>
               {message}
            </div>
            {onClose && (
               <button
                  className={styles.close}
                  onClick={onClose}
                  aria-label="Close"
               >
                  <IoMdClose />
               </button>
            )}
         </motion.div>
      </AnimatePresence>
   );
}
