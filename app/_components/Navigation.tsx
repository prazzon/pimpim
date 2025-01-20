"use client";

import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.scss";
import Button from "./UI/Button/Button";
import { motion } from "motion/react";

const navLinks = [
   { name: "Home", href: "/" },
   { name: "Trending", href: "/trending" },
   { name: "Shows", href: "/shows" },
   { name: "Movies", href: "/movies" },
   { name: "Events", href: "/events" },
];

function Navigation() {
   const pathname = usePathname();

   return (
      <nav className={styles.nav}>
         <Link href="/" className={styles.nav_logo}>
            <Image src={Logo} alt="logo" width={120} />
         </Link>

         <ul className={styles.nav_links}>
            {navLinks.map((link) => (
               <li key={link.name} className={styles.nav_link}>
                  <Link href={link.href}>{link.name}</Link>
                  {pathname === link.href && (
                     <motion.span layoutId="nav_link" className={styles.active}></motion.span>
                  )}
               </li>
            ))}
         </ul>
         <Button>Log in</Button>
      </nav>
   );
}

export default Navigation;
