"use client";

import { MediaItem, Profile as ProfileType } from "@/app/_lib/firebase/types";
import { useState } from "react";
import { Tabs } from "../../UI/Input/Input";
import styles from "./Profile.module.scss";
import ProfileHeader from "./ProfileHeader/ProfileHeader";
import ProfileInteractions from "./ProfileInteractions/ProfileInteractions";
import ProfileMedia from "./ProfileMedia/ProfileMedia";
import ProfileOverview from "./ProfileOverview/ProfileOverview";
import VerificationBanner from "./VerificationBanner/VerificationBanner";

type ProfileProps = {
   profile: ProfileType;
   isVerified: boolean;
   mediaItems?: MediaItem[];
};

export default function Profile({
   profile,
   mediaItems = [],
   isVerified,
}: ProfileProps) {
   const [activeTab, setActiveTab] = useState(0);

   const tabs = ["Overview", "Media", "Comments & Likes"];

   return (
      <div className={styles.profile}>
         <ProfileHeader profile={profile} />

         {!isVerified && <VerificationBanner email={profile.email} />}

         <div className={styles.tabs_container}>
            <Tabs
               tabs={tabs}
               activeTab={activeTab}
               onChangeAction={setActiveTab}
            />
         </div>

         <div className={styles.content}>
            {activeTab === 0 && <ProfileOverview profile={profile} />}
            {activeTab === 1 && <ProfileMedia media={mediaItems} />}
            {activeTab === 2 && <ProfileInteractions userId={profile.id} />}
         </div>
      </div>
   );
}
