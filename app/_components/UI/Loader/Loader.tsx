import { LuLoader } from "react-icons/lu";
import styles from "./Loader.module.scss";

function Loader() {
   return (
      <>
         <LuLoader className={styles.loader} />
      </>
   );
}

export default Loader;
