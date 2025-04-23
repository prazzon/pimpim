import clsx from "clsx";
import styles from "./Button.module.scss";

type ButtonProps = {
   children: React.ReactNode;
   type?: "normal" | "play" | "button";
   size?: "small" | "medium" | "large";
   onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
   btnStyle?: "primary" | "secondary";
   disabled?: boolean;
};
function Button({
   children,
   btnStyle = "primary",
   type = "normal",
   size,
   onClick,
   disabled = false,
}: ButtonProps) {
   return (
      <button
         className={clsx(
            styles.button,
            styles[btnStyle],
            styles[type],
            size && styles[size],
            disabled && styles.disabled
         )}
         onClick={onClick}
         disabled={disabled}
      >
         {children}
      </button>
   );
}

export default Button;
