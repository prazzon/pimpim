import { Profile } from "@/app/_lib/firebase/types";
import Image from "next/image";
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
         </div>
      </div>
   );
}
