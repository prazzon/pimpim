"use client";

import { checkUserHasPassword } from "@/app/_lib/firebase/auth/password-actions";
import { Profile } from "@/app/_lib/firebase/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa6";
import PasswordChangeDialog from "../../../Auth/PasswordChangeDialog";
import { Button } from "../../../UI/Input/Input";
import SettingsDropdown from "../../../UI/SettingsDropdown/SettingsDropdown";
import UserAvatar from "../../../UI/UserAvatar/UserAvatar";
import styles from "./ProfileHeader.module.scss";

type ProfileHeaderProps = {
   profile: Profile;
};

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
   const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
   const [hasPassword, setHasPassword] = useState(false);

   useEffect(() => {
      // Check if the user has a password when the component mounts
      const checkPassword = async () => {
         if (profile.id) {
            const result = await checkUserHasPassword(profile.id);
            setHasPassword(result);
         }
      };

      checkPassword();
   }, [profile.id]);
   return (
      <div className={styles.header}>
         <div className={styles.cover}>
            {profile.coverImage ? (
               <Image
                  src={profile.coverImage}
                  alt="Cover"
                  fill
                  className={styles.cover_image}
               />
            ) : (
               <div className={styles.cover_gradient}></div>
            )}
         </div>

         <div className={styles.profile_info}>
            <div className={styles.avatar_container}>
               <UserAvatar
                  name={profile.username}
                  image={profile.profileImage}
                  darkBackground={true}
                  size="xlarge"
               />
            </div>

            <div className={styles.details}>
               <h1 className={styles.name}>{profile.username}</h1>
               <div className={styles.location}>{profile.location}</div>
               <div className={styles.occupation}>{profile.occupation}</div>
            </div>

            <div className={styles.edit_button_container}>
               <Link href="/profile/edit">
                  <Button variant="secondary" className={styles.edit_button}>
                     <FaPen /> Edit Profile
                  </Button>
               </Link>
               <SettingsDropdown
                  onChangePassword={() => setIsPasswordDialogOpen(true)}
               />
            </div>

            {/* Password Change Dialog */}
            <PasswordChangeDialog
               open={isPasswordDialogOpen}
               onOpenChange={setIsPasswordDialogOpen}
               userId={profile.id}
               hasPassword={hasPassword}
            />
         </div>
      </div>
   );
}
