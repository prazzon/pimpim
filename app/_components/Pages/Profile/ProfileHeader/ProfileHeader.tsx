import { Profile } from "@/app/_lib/firebase/types";
import Image from "next/image";
import Link from "next/link";
import { FaPen } from "react-icons/fa6";
import { Button } from "../../../UI/Input/Input";
import UserAvatar from "../../../UI/UserAvatar/UserAvatar";
import styles from "./ProfileHeader.module.scss";

type ProfileHeaderProps = {
   profile: Profile;
};

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
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
            </div>
         </div>
      </div>
   );
}
