import styles from "./Hero.module.scss";

function Hero({ children }: { children: React.ReactNode }) {
   return (
      <header className={styles.header}>
         {children}
      </header>
   );
}

export default Hero;
