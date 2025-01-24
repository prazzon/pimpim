import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import styles from "./NotFound.module.scss";

type Props = {
   message: string;
   backLink: {
      href: string;
      label: string;
   };
};

function NotFound({ message, backLink }: Props) {
   return (
      <div className={styles.not_found}>
         <h1>{message}</h1>
         <p>
            <IoArrowBackOutline />
            <Link href={backLink.href}>Back to {backLink.label}</Link>
         </p>
      </div>
   );
}

export default NotFound;
