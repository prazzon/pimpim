"use client";

import { MediaItem, Profile as ProfileType } from "@/app/_lib/firebase/types";
import Image from "next/image";
import { useState } from "react";
import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import UserAvatar from "../../../UI/UserAvatar/UserAvatar";
import ProfileMedia from "../ProfileMedia/ProfileMedia";
import ProfileOverview from "../ProfileOverview/ProfileOverview";
import styles from "./PublicProfile.module.scss";

type PublicProfileProps = {
   profile: ProfileType;
   mediaItems?: MediaItem[];
};

export default function PublicProfile({
   profile,
   mediaItems = [],
}: PublicProfileProps) {
   const [activeSection, setActiveSection] = useState<"overview" | "media">(
      "overview"
   );

   return (
      <div className={styles.public_profile}>
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
                  <h1 className={styles.name}>
                     {profile.displayName || profile.username}
                  </h1>

                  <div className={styles.meta_info}>
                     {profile.location && (
                        <div className={styles.meta_item}>
                           <FaMapMarkerAlt />
                           <span>{profile.location}</span>
                        </div>
                     )}

                     {profile.occupation && (
                        <div className={styles.meta_item}>
                           <MdWork />
                           <span>{profile.occupation}</span>
                        </div>
                     )}

                     {profile.portfolioLinks?.website && (
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
                  <ProfileOverview profile={profile} profileViewer="other" />
               </div>
            )}

            {activeSection === "media" && (
               <div className={styles.media_section}>
                  {mediaItems.length > 0 ? (
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
