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
   colors = ["#ff0000", "#f5eb0c", "#ff0000", "#f5eb0c", "#ff0000"],
   animationSpeed = 8,
   showBorder = false,
}: Props) {
   const gradientStyle = {
      backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
      animationDuration: `${animationSpeed}s`,
   };

   return (
      <div className={clsx(styles.animated_gradient_text, className)}>
         {showBorder && (
            <div
               className={styles.gradient_overlay}
               style={gradientStyle}
            ></div>
         )}
         <div className={styles.text_content} style={gradientStyle}>
            {children}
         </div>
      </div>
   );
}
