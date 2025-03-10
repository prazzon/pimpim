import Title from "../Title/Title";
import styles from "./List.module.scss";

type Props = {
   children: React.ReactNode;
   title?: string;
   style?: React.CSSProperties;
};

function List({ children, title, style }: Props) {
   return (
      <div className={styles.list} style={style}>
         {title && <Title>{title}</Title>}
         {children}
      </div>
   );
}

export default List;
