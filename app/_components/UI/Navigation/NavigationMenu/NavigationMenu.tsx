"use client";

// import { useOutsideClick } from "@/app/_hooks/useOutsideClick";
import { useClickAway } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import GradientText from "../../GradientText/GradientText";
import NavigationBtn from "./NavigationBtn";
import styles from "./NavigationMenu.module.scss";

type Props = {
   navLinks: { name: string; href: string }[];
   onRegisterClick?: () => void;
};

const listVariants = {
   open: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + index * 0.1, type: "linear" },
   }),
   closed: {
      opacity: 0,
      y: 10,
   },
};

function NavigationMenu({ navLinks, onRegisterClick }: Props) {
   const [menuOpen, setMenuOpen] = useState(false);

   const ref = useClickAway<HTMLDivElement>(() => setMenuOpen(false));

   const handleRegisterClick = () => {
      setMenuOpen(false);
      if (onRegisterClick) {
         onRegisterClick();
      }
   };

   return (
      <div className={styles.nav_menu} ref={ref}>
         <NavigationBtn menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

         <AnimatePresence>
            {menuOpen && (
               <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  style={{ transformOrigin: "top right" }}
                  className={styles.menu}
               >
                  <div onClick={handleRegisterClick}>
                     <GradientText
                        animationSpeed={40}
                        showBorder={true}
                        className={styles.nav_btn}
                     >
                        Sign In
                     </GradientText>
                  </div>

                  <ul className={styles.menu_links}>
                     {navLinks.map((link, index) => (
                        <motion.li
                           key={link.name}
                           custom={index}
                           variants={listVariants}
                           initial="closed"
                           animate="open"
                           exit="closed"
                           onClick={() => setMenuOpen(false)}
                        >
                           <Link href={link.href}>{link.name}</Link>
                        </motion.li>
                     ))}
                  </ul>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}

export default NavigationMenu;
