"use client";

import { motion, useAnimation } from "motion/react";
import { useEffect } from "react";
import styles from "./NavigationBtn.module.scss";

const path1Variants = {
   open: { d: "M3.06061 2.99999L21.0606 21" },
   closed: { d: "M0 8.5L24 8.5" },
};

const path2Variants = {
   open: { d: "M3.00006 21.0606L21 3.06064" },
   closed: { d: "M0 15.5L24 15.5" },
};

type Props = {
   menuOpen: boolean;
   setMenuOpen: (_: boolean) => void;
};

function NavigationBtn({ menuOpen, setMenuOpen }: Props) {
   const path1Controls = useAnimation();
   const path2Controls = useAnimation();

   useEffect(() => {
      if (menuOpen) {
         path1Controls.start(path1Variants.open);
         path2Controls.start(path2Variants.open);
      } else {
         path1Controls.start(path1Variants.closed);
         path2Controls.start(path2Variants.closed);
      }
   }, [menuOpen, path1Controls, path2Controls]);

   return (
      <div onClick={() => setMenuOpen(!menuOpen)} className={styles.menu_btn}>
         <svg width={24} height={24} viewBox="0 0 24 24">
            <motion.path
               {...path1Variants.closed}
               animate={path1Controls}
               transition={{ duration: 0.2 }}
            />
            <motion.path
               {...path2Variants.closed}
               animate={path2Controls}
               transition={{ duration: 0.2 }}
            />
         </svg>
      </div>
   );
}

export default NavigationBtn;
