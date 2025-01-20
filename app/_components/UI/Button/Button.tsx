import styles from "./Button.module.scss";

type ButtonProps = {
   children: React.ReactNode;
   type?: "button" | "submit" | "reset" | undefined;
   onClick?: () => void;
   btnStyle?: "primary" | "secondary";
};
function Button({ children, btnStyle }: ButtonProps) {
   return (
      <button className={`${styles.button} ${btnStyle ? styles[btnStyle] : ""}`}>
         {children}
      </button>
   );
}

export default Button;
