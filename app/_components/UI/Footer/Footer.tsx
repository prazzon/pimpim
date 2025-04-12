"use client";

import Logo from "@/public/logo.svg";
import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import AuthDialog from "../../Auth/AuthDialog";
import Button from "../Button/Button";
import Loader from "../Loader/Loader";
import styles from "./Footer.module.scss";

function Footer() {
   const { data: session, status } = useSession();
   const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
   const [isLoggingOut, setIsLoggingOut] = useState(false);

   const handleOpenAuthDialog = () => {
      setIsAuthDialogOpen(true);
   };

   const handleAuthDialogOpenChange = (open: boolean) => {
      setIsAuthDialogOpen(open);
   };

   const handleLogout = async () => {
      setIsLoggingOut(true);
      await signOut();
      setIsLoggingOut(false);
   };

   return (
      <footer
         className={clsx(styles.footer, styles.footer_gradient)}
         role="contentinfo"
         aria-label="Site footer"
      >
         <div className={styles.footer_top}>
            <Link href="/" className={styles.footer_logo}>
               <Image src={Logo} alt="logo" fill />
            </Link>
            <div className={styles.footer_btns}>
               {status === "authenticated" && session?.user ? (
                  <Button btnStyle="secondary" onClick={handleLogout}>
                     {isLoggingOut ? <Loader /> : "Logout"}
                  </Button>
               ) : (
                  <Button btnStyle="primary" onClick={handleOpenAuthDialog}>
                     Login
                  </Button>
               )}
            </div>
         </div>

         <div className={styles.footer_bottom}>
            <p className={styles.copyright}>
               © PimPim, Inc. 2025. All Rights Reserved
            </p>

            <div className={styles.social}>
               Follow us:
               <div className={styles.social_links}>
                  <a
                     href="#"
                     className={styles.social_link}
                     aria-label="Twitter"
                  >
                     <FaXTwitter />
                  </a>
                  <a
                     href="#"
                     className={styles.social_link}
                     aria-label="Instagram"
                  >
                     <FaInstagram />
                  </a>
                  <a
                     href="#"
                     className={styles.social_link}
                     aria-label="TikTok"
                  >
                     <FaTiktok />
                  </a>
               </div>
            </div>
         </div>

         <AuthDialog
            open={isAuthDialogOpen}
            action={handleAuthDialogOpenChange}
         />
      </footer>
   );
}

export default Footer;
