import styles from "./Spinner.module.scss";

interface SpinnerProps {
   size?: number;
   containerMinHeight?: number;
}

function Spinner({ size = 50, containerMinHeight = 40 }: SpinnerProps) {
   return (
      <div
         className={styles.container}
         style={{ minHeight: `${containerMinHeight}rem` }}
      >
         <div
            className={styles.loader}
            style={{ width: size, height: size }}
         ></div>
      </div>
   );
}

export default Spinner;
