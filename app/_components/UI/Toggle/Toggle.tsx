import { forwardRef } from "react";
import styles from "./Toggle.module.scss";

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
   label: string;
   description?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
   ({ label, description, className, ...props }, ref) => {
      return (
         <label className={styles.toggle_group}>
            <div className={styles.toggle_label_container}>
               <label className={styles.toggle_label}>{label}</label>
               {description && (
                  <p className={styles.toggle_description}>{description}</p>
               )}
            </div>
            <label className={styles.toggle_switch}>
               <input
                  ref={ref}
                  type="checkbox"
                  className={`${styles.toggle_input} ${className || ""}`}
                  {...props}
               />
               <span className={styles.toggle_slider}></span>
            </label>
         </label>
      );
   }
);

Toggle.displayName = "Toggle";
