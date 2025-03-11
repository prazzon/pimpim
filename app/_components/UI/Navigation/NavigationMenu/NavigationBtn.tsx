"use client";

import { motion, useAnimation } from "motion/react";
import { useEffect } from "react";
import styles from "./NavigationBtn.module.scss";

const path1Variants = {
   closed: { d: "M 2 3 L 23 3" },
   open: { d: "M3.06061 2.99999L21.0606 21" },
};

const path2Variants = {
   closed: { d: "M 2 17 L 23 17" },
   open: { d: "M3.00006 21.0606L21 3.06064" },
};

const path3Variants = {
   closed: { opacity: 1 },
   open: { opacity: 0 },
};

type Props = {
   menuOpen: boolean;
   setMenuOpen: (_: boolean) => void;
};

function NavigationBtn({ menuOpen, setMenuOpen }: Props) {
   const path1Controls = useAnimation();
   const path2Controls = useAnimation();
   const path3Controls = useAnimation();

   useEffect(() => {
      if (menuOpen) {
         path1Controls.start(path1Variants.open);
         path2Controls.start(path2Variants.open);
         path3Controls.start(path3Variants.open);
      } else {
         path1Controls.start(path1Variants.closed);
         path2Controls.start(path2Variants.closed);
         path3Controls.start(path3Variants.closed);
      }
   }, [menuOpen, path1Controls, path2Controls, path3Controls]);

   return (
      <div onClick={() => setMenuOpen(!menuOpen)} className={styles.menu_btn}>
         <svg width={24} height={24} viewBox="0 0 24 24">
            <motion.path
               {...path1Variants.closed}
               animate={path1Controls}
               transition={{ duration: 0.2 }}
            />
            <motion.path
               d="M 2 10 L 23 10"
               animate={path3Controls}
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
