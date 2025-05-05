"use client";

import { useOutsideClick } from "@/app/_hooks/useOutsideClick";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import { FaKey } from "react-icons/fa";
import { Button } from "../Input/Input";
import styles from "./SettingsDropdown.module.scss";

interface SettingsDropdownProps {
   onChangePasswordAction: () => void;
}

export default function SettingsDropdown({
   onChangePasswordAction,
}: SettingsDropdownProps) {
   const [isOpen, setIsOpen] = useState(false);
   const ref = useOutsideClick<HTMLButtonElement>(() => setIsOpen(false));

   const handleToggle = () => {
      setIsOpen((prev) => !prev);
   };

   const handleChangePassword = () => {
      setIsOpen(false);
      onChangePasswordAction();
   };

   return (
      <>
         <Button variant="primary" onClick={handleToggle} ref={ref}>
            <AiFillSetting />
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
      </>
   );
}
