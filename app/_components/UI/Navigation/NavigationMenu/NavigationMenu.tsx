"use client";

import { useClickAway } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoHomeOutline, IoLogOutOutline } from "react-icons/io5";
import { MdOutlineEventNote, MdTrendingUp } from "react-icons/md";
import { PiFilmSlate, PiTelevisionSimple } from "react-icons/pi";
import GradientText from "../../GradientText/GradientText";
import UserAvatar from "../../UserAvatar/UserAvatar";
import NavigationBtn from "./NavigationBtn";
import styles from "./NavigationMenu.module.scss";

type Props = {
   navLinks: { name: string; href: string; icon?: React.ReactNode }[];
   onRegisterClick?: () => void;
   isScrolled?: boolean;
};

const listVariants = {
   open: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + index * 0.1, type: "linear" },
   }),
   closed: {
      opacity: 0,
      y: 10,
   },
};

function NavigationMenu({
   navLinks,
   onRegisterClick,
   isScrolled = false,
}: Props) {
   const [menuOpen, setMenuOpen] = useState(false);
   const { data: session, status } = useSession();

   // Default navigation links with icons if not provided
   const defaultNavLinks = [
      { name: "Home", href: "/", icon: <IoHomeOutline /> },
      { name: "Trending", href: "/trending", icon: <MdTrendingUp /> },
      { name: "Movies", href: "/movies", icon: <PiFilmSlate /> },
      { name: "Shows", href: "/shows", icon: <PiTelevisionSimple /> },
      { name: "Events", href: "/events", icon: <MdOutlineEventNote /> },
   ];

   // Use provided navLinks or default ones
   const linksToRender = navLinks.length > 0 ? navLinks : defaultNavLinks;

   const ref = useClickAway<HTMLDivElement>(() => setMenuOpen(false));

   const handleRegisterClick = () => {
      setMenuOpen(false);
      if (onRegisterClick) {
         onRegisterClick();
      }
   };

   const handleLogout = async () => {
      setMenuOpen(false);
      await signOut();
   };

   return (
      <div className={styles.nav_menu} ref={ref}>
         <div className={styles.nav_menu_controls}>
            {status === "authenticated" && session?.user && (
               <div className={styles.avatar_container}>
                  <UserAvatar
                     name={session.user.name}
                     image={session.user.image}
                     darkBackground={true}
                     size={isScrolled ? "small" : "medium"}
                  />
               </div>
            )}
            <NavigationBtn menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
         </div>

         <AnimatePresence>
            {menuOpen && (
               <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  style={{ transformOrigin: "top right" }}
                  className={styles.menu}
               >
                  {status === "authenticated" && session?.user ? (
                     <>
                        <div className={styles.user_info}>
                           <div className={styles.avatar_container}>
                              <UserAvatar
                                 name={session.user.name}
                                 image={session.user.image}
                                 darkBackground={true}
                              />
                           </div>
                           <p className={styles.user_name}>
                              {session.user.name || "User"}
                           </p>
                           <p className={styles.user_email}>
                              {session.user.email}
                           </p>
                        </div>

                        <div className={styles.user_menu}>
                           <Link
                              href="/profile"
                              className={styles.user_menu_item}
                              onClick={() => setMenuOpen(false)}
                           >
                              <FaUser />
                              <span>My Profile</span>
                           </Link>
                           <div
                              className={styles.user_menu_item}
                              onClick={handleLogout}
                           >
                              <IoLogOutOutline />
                              <span>Logout</span>
                           </div>
                        </div>
                     </>
                  ) : (
                     <div onClick={handleRegisterClick}>
                        <GradientText
                           animationSpeed={40}
                           showBorder={true}
                           className={styles.nav_btn}
                        >
                           Sign In
                        </GradientText>
                     </div>
                  )}

                  <ul className={styles.menu_links}>
                     {linksToRender.map((link, index) => (
                        <motion.li
                           key={link.name}
                           custom={index}
                           variants={listVariants}
                           initial="closed"
                           animate="open"
                           exit="closed"
                           onClick={() => setMenuOpen(false)}
                        >
                           <Link href={link.href} className={styles.nav_link}>
                              {link.icon && (
                                 <span className={styles.nav_icon}>
                                    {link.icon}
                                 </span>
                              )}
                              <span>{link.name}</span>
                           </Link>
                        </motion.li>
                     ))}
                  </ul>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}

export default NavigationMenu;
