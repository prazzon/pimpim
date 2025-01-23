import clsx from "clsx";
import styles from "./GradientText.module.scss";

type Props = {
   children: React.ReactNode;
   className?: string;
   colors?: string[];
   animationSpeed?: number;
   showBorder?: boolean;
};

export default function GradientText({
   children,
   className = "",
   colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
   animationSpeed = 8,
   showBorder = false,
}: Props) {
   const gradientStyle = {
      backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
      animationDuration: `${animationSpeed}s`,
   };
   
   return (
      // <div className={`${styles.animated_gradient_text} ${className}`}>
      <div className={clsx(styles.animated_gradient_text, className)}>
         {showBorder && (
            <div className={styles.gradient_overlay} style={gradientStyle}></div>
         )}
         <div className={styles.text_content} style={gradientStyle}>
            {children}
         </div>
      </div>
   );
}
