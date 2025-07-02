import Link from "next/link";
import styles from "./NotFound.module.scss";

function NotFound() {
   return (
      <div className={styles.not_found}>
         <h1>No trends found</h1>
         <p>
            Sorry, we couldn&apos;t find any trends in this category. Please try
            another category.
         </p>
         <p>
            <Link href="/trending">Back to all trending</Link>
         </p>
      </div>
   );
}

export default NotFound;
