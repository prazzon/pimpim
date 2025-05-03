"use client";

import { MediaItem, Profile as ProfileType } from "@/app/_lib/firebase/types";
import Image from "next/image";
import { useState } from "react";
import { FaGlobe, FaLock, FaMapMarkerAlt } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import UserAvatar from "../../../UI/UserAvatar/UserAvatar";
import ProfileMedia from "../ProfileMedia/ProfileMedia";
import ProfileOverview from "../ProfileOverview/ProfileOverview";
import styles from "./UserProfile.module.scss";

type UserProfileProps = {
   profile: ProfileType;
   mediaItems?: MediaItem[];
};

export default function UserProfile({
   profile,
   mediaItems = [],
}: UserProfileProps) {
   const [activeSection, setActiveSection] = useState<"overview" | "media">(
      "overview"
   );

   // Check if the profile is private
   const isPrivate = profile.isPrivate === true;

   return (
      <div className={styles.user_profile}>
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
                     name={profile.displayName}
                     image={profile.profileImage}
                     darkBackground={true}
                     size="xlarge"
                  />
               </div>

               <div className={styles.user_details}>
                  <div className={styles.name_container}>
                     <h1 className={styles.name}>
                        {profile.displayName || profile.username}
                     </h1>
                     {isPrivate && (
                        <div
                           className={styles.private_badge}
                           title="Private Profile"
                        >
                           <FaLock /> Private Profile
                        </div>
                     )}
                  </div>

                  <div className={styles.meta_info}>
                     {!isPrivate && profile.location && (
                        <div className={styles.meta_item}>
                           <FaMapMarkerAlt />
                           <span>{profile.location}</span>
                        </div>
                     )}

                     {isPrivate && (
                        <div className={`${styles.meta_item} ${styles.masked}`}>
                           <FaMapMarkerAlt />
                           <span className={styles.masked_content}></span>
                        </div>
                     )}

                     {!isPrivate && profile.occupation && (
                        <div className={styles.meta_item}>
                           <MdWork />
                           <span>{profile.occupation}</span>
                        </div>
                     )}

                     {isPrivate && (
                        <div className={`${styles.meta_item} ${styles.masked}`}>
                           <MdWork />
                           <span className={styles.masked_content}></span>
                        </div>
                     )}

                     {!isPrivate && profile.portfolioLinks?.website && (
                        <div className={styles.meta_item}>
                           <FaGlobe />
                           <a
                              href={profile.portfolioLinks.website}
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              {profile.portfolioLinks.website.replace(
                                 "https://",
                                 ""
                              )}
                           </a>
                        </div>
                     )}

                     {isPrivate && (
                        <div className={`${styles.meta_item} ${styles.masked}`}>
                           <FaGlobe />
                           <span className={styles.masked_content}></span>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         <div className={styles.content_selector}>
            <button
               className={`${styles.selector_button} ${activeSection === "overview" ? styles.active : ""}`}
               onClick={() => setActiveSection("overview")}
            >
               Overview
            </button>
            <button
               className={`${styles.selector_button} ${activeSection === "media" ? styles.active : ""}`}
               onClick={() => setActiveSection("media")}
            >
               Media
            </button>
         </div>

         <div className={styles.content}>
            {activeSection === "overview" && (
               <div className={styles.overview_section}>
                  {isPrivate ? (
                     <div className={styles.private_content}>
                        <div className={styles.private_message}>
                           <FaLock className={styles.lock_icon} />
                           <p>
                              This profile is private. You cannot view their
                              content.
                           </p>
                        </div>
                     </div>
                  ) : (
                     <ProfileOverview profile={profile} profileViewer="other" />
                  )}
               </div>
            )}

            {activeSection === "media" && (
               <div className={styles.media_section}>
                  {isPrivate ? (
                     <div className={styles.private_content}>
                        <div className={styles.private_message}>
                           <FaLock className={styles.lock_icon} />
                           <p>
                              This profile is private. You cannot view their
                              media content.
                           </p>
                        </div>
                     </div>
                  ) : mediaItems.length > 0 ? (
                     <ProfileMedia media={mediaItems} />
                  ) : (
                     <div className={styles.no_media}>
                        <p>No media items to display</p>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   );
}
