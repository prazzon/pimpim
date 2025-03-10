import styles from "./Spinner.module.scss";

type Props = { type?: "default" | "inline" };

function Spinner({ type }: Props) {
   return (
      <div
         className={`${styles.container} ${type === "inline" && styles.inline}`}
      >
         <div className={styles.spinner}>
            <div className={styles.double_bounce1} />
            <div className={styles.double_bounce2} />
         </div>
      </div>
   );
}

export default Spinner;
