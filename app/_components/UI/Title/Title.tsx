import clsx from "clsx";
import styles from "./Title.module.scss";

type Props = {
   children: React.ReactNode;
   type?: "primary" | "secondary";
};

function Title({ children, type = "primary" }: Props) {
   return <h2 className={clsx(styles.title, styles[type])}>{children}</h2>;
}

export default Title;
