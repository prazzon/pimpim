import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import Button from "../UI/Button/Button";
import styles from "./Footer.module.scss";

function Footer() {
   return (
      <footer className={styles.footer}>
         <div className={styles.footer_top}>
            <Link href="/" className={styles.footer_logo}>
               <Image src={Logo} alt="logo" width={120} />
            </Link>
            <div className={styles.footer_btns}>
               <Button>Register</Button>
               <Button btnStyle="secondary">Login</Button>
            </div>
         </div>

         <div className={styles.footer_bottom}>
            <p className={styles.copyright}>
               © PimPim, Inc. 2025. All Rights Reserved
            </p>

            <div className={styles.social}>
               Follow us:
               <div className={styles.social_links}>
                  <a href="" className={styles.social_link}>
                     <FaXTwitter />
                  </a>
                  <a href="" className={styles.social_link}>
                     <FaInstagram />
                  </a>
                  <a href="" className={styles.social_link}>
                     <FaTiktok />
                  </a>
               </div>
            </div>
         </div>
      </footer>
   );
}

export default Footer;
