import clsx from "clsx";
import styles from "./Title.module.scss";

type Props = {
   children: React.ReactNode;
   type?: "primary" | "secondary";
};

function Title({ children, type = "primary" }: Props) {
   return <h1 className={clsx(styles.title, styles[type])}>{children}</h1>;
}

export default Title;
