import Title from "../Title/Title";
import styles from "./Grid.module.scss";

type Props = {
   children: React.ReactNode;
   title?: string;
};

function Grid({ children, title }: Props) {
   return (
      <>
         {title && <Title>{title}</Title>}
         <div className={styles.grid}>{children}</div>
      </>
   );
}

export default Grid;
