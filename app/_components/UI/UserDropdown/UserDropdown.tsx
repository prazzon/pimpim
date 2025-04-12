"use client";

import { useOutsideClick } from "@/app/_hooks/useOutsideClick";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import Loader from "../Loader/Loader";
import UserAvatar from "../UserAvatar/UserAvatar";
import styles from "./UserDropdown.module.scss";

interface UserDropdownProps {
   name?: string | null;
   image?: string | null;
}

export default function UserDropdown({ name, image }: UserDropdownProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [isLoggingOut, setIsLoggingOut] = useState(false);
   const ref = useOutsideClick(() => setIsOpen(false));

   const handleToggle = () => {
      setIsOpen((prev) => !prev);
   };

   const handleLogout = async () => {
      setIsLoggingOut(true);
      await signOut();
   };

   return (
      <div className={styles.dropdown} ref={ref}>
         <UserAvatar
            name={name}
            image={image}
            onClick={handleToggle}
            darkBackground={true}
         />

         <AnimatePresence>
            {isOpen && (
               <motion.div
                  className={styles.dropdown_menu}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
               >
                  <Link
                     href="/profile"
                     className={styles.dropdown_menu_item}
                     onClick={() => setIsOpen(false)}
                  >
                     <FaUser />
                     My Profile
                  </Link>
                  <div
                     className={`${styles.dropdown_menu_item} ${
                        styles.logout
                     } ${isLoggingOut ? styles.logging_out : ""}`}
                     onClick={handleLogout}
                  >
                     {isLoggingOut ? (
                        <span className={styles.loader_icon}>
                           <Loader />
                        </span>
                     ) : (
                        <IoLogOutOutline />
                     )}
                     {isLoggingOut ? "Logging out" : "Logout"}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}
