import Title from "../Title/Title";
import styles from "./List.module.scss";

type Props = {
   children: React.ReactNode;
   title?: string;
};

function List({ children, title }: Props) {
   return (
      <div className={styles.list}>
         {title && <Title>{title}</Title>}
         {children}
      </div>
   );
}

export default List;
