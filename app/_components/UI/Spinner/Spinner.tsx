import styles from "./Spinner.module.scss";

function Spinner() {
   return (
      <div className={styles.spinner}>
         <div className={styles.double_bounce1} />
         <div className={styles.double_bounce2} />
      </div>
   );
}

export default Spinner;
