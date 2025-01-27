import clsx from "clsx";
import styles from "./Button.module.scss";

type ButtonProps = {
   children: React.ReactNode;
   type?: "normal" | "play";
   size?: "small" | "medium" | "large";
   onClick?: () => void;
   btnStyle?: "primary" | "secondary";
};
function Button({
   children,
   btnStyle = "primary",
   type = "normal",
   size,
}: ButtonProps) {
   return (
      <button
         className={clsx(
            styles.button,
            styles[btnStyle],
            styles[type],
            size && styles[size]
         )}
      >
         {children}
      </button>
   );
}

export default Button;
