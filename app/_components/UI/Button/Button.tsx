import clsx from "clsx";
import styles from "./Button.module.scss";

type ButtonProps = {
   children: React.ReactNode;
   type?: "normal" | "play";
   size?: "small" | "medium" | "large";
   onClick?: () => void | Promise<void>;
   btnStyle?: "primary" | "secondary";
};
function Button({
   children,
   btnStyle = "primary",
   type = "normal",
   size,
   onClick,
}: ButtonProps) {
   return (
      <button
         className={clsx(
            styles.button,
            styles[btnStyle],
            styles[type],
            size && styles[size]
         )}
         onClick={onClick}
      >
         {children}
      </button>
   );
}

export default Button;
