"use client";

import { useOutsideClick } from "@/app/_hooks/useOutsideClick";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaKey } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { Button } from "../Input/Input";
import styles from "./SettingsDropdown.module.scss";

interface SettingsDropdownProps {
   onChangePassword: () => void;
}

export default function SettingsDropdown({
   onChangePassword,
}: SettingsDropdownProps) {
   const [isOpen, setIsOpen] = useState(false);
   const ref = useOutsideClick(() => setIsOpen(false));

   const handleToggle = () => {
      setIsOpen((prev) => !prev);
   };

   const handleChangePassword = () => {
      setIsOpen(false);
      onChangePassword();
   };

   return (
      <div className={styles.dropdown} ref={ref}>
         <Button
            variant="secondary"
            className={styles.settings_button}
            onClick={handleToggle}
         >
            <IoSettingsOutline />
            Settings
         </Button>

         <AnimatePresence>
            {isOpen && (
               <motion.div
                  className={styles.dropdown_menu}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
               >
                  <div
                     className={styles.dropdown_menu_item}
                     onClick={handleChangePassword}
                  >
                     <FaKey />
                     Change Password
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}
