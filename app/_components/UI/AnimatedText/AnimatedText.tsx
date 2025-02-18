import { motion } from "motion/react";

type Props = {
   children: React.ReactNode;
   className?: string;
   containerClassName?: string;
   id: string;
};

const item = {
   hidden: {
      y: "100%",
      opacity: 0,
      transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.85 },
   },
   visible: {
      y: 0,
      opacity: 1,
      transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.75 },
   },
   exit: {
      y: "100%",
      opacity: 0,
      transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.3 },
   },
};

function AnimatedText({ children, className, containerClassName, id }: Props) {
   return (
      <span
         style={{ overflow: "hidden", display: "inline-block" }}
         className={containerClassName}
      >
         <motion.p
            variants={item}
            initial="hidden"
            animate="visible"
            exit="exit"
            key={id}
            className={className}
         >
            <span>{children}</span>
         </motion.p>
      </span>
   );
}

export default AnimatedText;
