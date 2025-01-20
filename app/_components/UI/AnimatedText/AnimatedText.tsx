import { motion } from "motion/react";

type Props = {
   children: React.ReactNode;
   className?: string;
   id: string;
};

const item = {
   hidden: {
      y: "100%",
      transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.85 },
   },
   visible: {
      y: 0,
      transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.75 },
   },
};

function AnimatedText({ children, className, id }: Props) {
   return (
      <span style={{ overflow: "hidden", display: "inline-block" }}>
         <motion.p
            variants={item}
            initial="hidden"
            animate="visible"
            key={id}
            className={className}
         >
            {children}
         </motion.p>
      </span>
   );
}

export default AnimatedText;
