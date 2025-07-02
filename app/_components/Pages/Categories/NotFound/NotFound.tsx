import Link from "next/link";
import styles from "./NotFound.module.scss";

function NotFound() {
   return (
      <div className={styles.not_found}>
         <h1>No post found</h1>
         <p>
            Sorry, we couldn&apos;t find any post in this category. Please try
            another category.
         </p>
         <p>
            <Link href="/categories">Back to all categories</Link>
         </p>
      </div>
   );
}

export default NotFound;
