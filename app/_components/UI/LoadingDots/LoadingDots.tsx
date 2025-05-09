import styles from "./LoadingDots.module.scss";

function LoadingDots() {
   return (
      <>
         <span className={styles.loading_dots}>
            <span />
            <span />
            <span />
         </span>
      </>
   );
}

export default LoadingDots;
