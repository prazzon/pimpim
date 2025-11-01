"use client";

import Logo from "@/public/logo.svg";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AuthDialog from "../../Auth/AuthDialog";
import GradientText from "../GradientText/GradientText";
import UserDropdown from "../UserDropdown/UserDropdown";
import styles from "./Navigation.module.scss";
import NavigationMenu from "./NavigationMenu/NavigationMenu";

const navLinks = [
   { name: "Home", href: "/" },
   { name: "Shows", href: "/shows" },
   { name: "Trending", href: "/trending" },
   { name: "Movies", href: "/movies" },
   { name: "Events", href: "/events" },
];

function Navigation() {
   const pathname = usePathname();
   const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false);
   const { data: session, status } = useSession();

   function isActivePath(href: string) {
      if (href === "/" && pathname !== href) {
         return false;
      }

      return pathname.startsWith(href);
   }

   const navRef = useRef<HTMLElement | null>(null);

   const activePath = navLinks.find((link) => isActivePath(link.href))?.href;

   useEffect(() => {
      const handleScroll = () => {
         if (!navRef.current) return;

         if (window.scrollY > 0) {
            navRef.current.classList.add(styles.scrolled);
            setIsScrolled(true);
         } else {
            navRef.current.classList.remove(styles.scrolled);
            setIsScrolled(false);
         }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, []);

   const handleOpenAuthDialog = () => {
      setIsAuthDialogOpen(true);
   };

   const handleAuthDialogOpenChange = (open: boolean) => {
      setIsAuthDialogOpen(open);
   };

   return (
      <nav className={styles.nav} ref={navRef}>
         <Link href="/" className={styles.nav_logo}>
            <Image src={Logo} alt="logo" width={120} priority />
         </Link>

         <ul className={styles.nav_links}>
            {navLinks.map((link) => (
               <li key={link.name} className={styles.nav_link}>
                  <Link href={link.href}>{link.name}</Link>
                  {activePath === link.href && (
                     <motion.span
                        layoutId="nav_link"
                        className={styles.active}
                     ></motion.span>
                  )}
               </li>
            ))}
         </ul>

         <div className={styles.desktop_auth}>
            {status === "authenticated" && session?.user && (
               <UserDropdown
                  name={session.user.name}
                  image={session.user.image}
                  isScrolled={isScrolled}
               />
            )}

            {status === "unauthenticated" && (
               <div onClick={handleOpenAuthDialog}>
                  <GradientText
                     animationSpeed={40}
                     showBorder={true}
                     className={styles.nav_btn}
                  >
                     Sign In
                  </GradientText>
               </div>
            )}
         </div>

         <NavigationMenu
            navLinks={navLinks}
            onRegisterClick={
               status === "authenticated" ? undefined : handleOpenAuthDialog
            }
            isScrolled={isScrolled}
         />

         <AuthDialog
            open={isAuthDialogOpen}
            action={handleAuthDialogOpenChange}
         />
      </nav>
   );
}

export default Navigation;
