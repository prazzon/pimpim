import { useOutsideClick } from "@/app/_hooks/useOutsideClick";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import GradientText from "../../GradientText/GradientText";
import NavigationBtn from "./NavigationBtn";
import styles from "./NavigationMenu.module.scss";

type Props = {
   navLinks: { name: string; href: string }[];
};

function NavigationMenu({ navLinks }: Props) {
   const [menuOpen, setMenuOpen] = useState(false);

   const ref = useOutsideClick(() => setMenuOpen(false));

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
                  <GradientText
                     animationSpeed={40}
                     showBorder={true}
                     className={styles.nav_btn}
                  >
                     Sign In
                  </GradientText>

                  <ul className={styles.menu_links}>
                     {navLinks.map((link) => (
                        <li key={link.name} onClick={() => setMenuOpen(false)}>
                           <Link href={link.href}>{link.name}</Link>
                        </li>
                     ))}
                  </ul>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}

export default NavigationMenu;
