import Carousel from "./Carousel/Carousel";
import styles from "./Hero.module.scss";

function Hero() {
   return (
      <header className={styles.header}>
         <Carousel />
      </header>
   );
}

export default Hero;
