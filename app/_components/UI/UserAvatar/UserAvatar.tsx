"use client";

import Image from "next/image";
import { useMemo } from "react";
import styles from "./UserAvatar.module.scss";

interface UserAvatarProps {
   name?: string | null;
   image?: string | null;
   onClick?: () => void;
   darkBackground?: boolean;
}

export default function UserAvatar({
   name,
   image,
   onClick,
   darkBackground = false,
}: UserAvatarProps) {
   const initials = useMemo(() => {
      if (!name) return "U";

      // Get first two letters of the name
      const nameParts = name.trim().split(" ");
      if (nameParts.length === 1) {
         return name.substring(0, 2).toUpperCase();
      }

      // Get first letter of first name and first letter of last name
      return (
         nameParts[0][0] + nameParts[nameParts.length - 1][0]
      ).toUpperCase();
   }, [name]);

   return (
      <div
         className={`${styles.avatar} ${darkBackground ? styles.dark_bg : ""}`}
         onClick={onClick}
      >
         {image ? (
            <Image
               src={image}
               alt={name || "User"}
               width={40}
               height={40}
               className={styles.image}
            />
         ) : (
            initials
         )}
      </div>
   );
}
