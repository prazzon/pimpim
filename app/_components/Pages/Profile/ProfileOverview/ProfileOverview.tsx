import { Profile } from "@/app/_lib/firebase/types";
import {
   FaBehance,
   FaDribbble,
   FaFacebook,
   FaGlobe,
   FaInstagram,
   FaLinkedin,
   FaTiktok,
   FaXTwitter,
   FaYoutube,
} from "react-icons/fa6";
import styles from "./ProfileOverview.module.scss";

type ProfileOverviewProps = {
   profile: Profile;
   profileViewer?: "current" | "other";
};

export default function ProfileOverview({
   profile,
   profileViewer = "current",
}: ProfileOverviewProps) {
   const { socialLinks, portfolioLinks } = profile;

   return (
      <div className={styles.overview}>
         {/* Bio Section */}
         {profileViewer === "other" && profile?.bio && (
            <section className={styles.section}>
               <h2 className={styles.section_title}>Bio</h2>
               <p className={styles.bio}>{profile.bio}</p>
            </section>
         )}

         {profileViewer === "current" && (
            <section className={styles.section}>
               <h2 className={styles.section_title}>Bio</h2>
               {profile?.bio ? (
                  <p className={styles.bio}>{profile.bio}</p>
               ) : (
                  <p className={styles.empty_state}>
                     Click on &quot;Edit Profile&quot; to add your bio and tell
                     others about yourself.
                  </p>
               )}
            </section>
         )}

         {/* Personal Information */}
         <section className={styles.section}>
            <h2 className={styles.section_title}>Personal Information</h2>
            <div className={styles.personal_info}>
               <div className={styles.info_item}>
                  <span className={styles.label}>Username</span>
                  <span className={styles.value}>{profile?.username}</span>
               </div>

               {profileViewer === "other" && profile?.firstName && (
                  <div className={styles.info_item}>
                     <span className={styles.label}>First Name</span>
                     <span className={styles.value}>{profile?.firstName}</span>
                  </div>
               )}

               {profileViewer === "current" && (
                  <div className={styles.info_item}>
                     <span className={styles.label}>First Name</span>
                     <span className={styles.value}>
                        {profile?.firstName || (
                           <span className={styles.empty_state}>
                              Not specified
                           </span>
                        )}
                     </span>
                  </div>
               )}

               {profileViewer === "other" && profile?.lastName && (
                  <div className={styles.info_item}>
                     <span className={styles.label}>Last Name</span>
                     <span className={styles.value}>{profile?.lastName}</span>
                  </div>
               )}

               {profileViewer === "current" && (
                  <div className={styles.info_item}>
                     <span className={styles.label}>Last Name</span>
                     <span className={styles.value}>
                        {profile?.lastName || (
                           <span className={styles.empty_state}>
                              Not specified
                           </span>
                        )}
                     </span>
                  </div>
               )}

               <div className={styles.info_item}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{profile?.email}</span>
               </div>

               {profileViewer === "other" && profile?.phone && (
                  <div className={styles.info_item}>
                     <span className={styles.label}>Phone</span>
                     <span className={styles.value}>{profile?.phone}</span>
                  </div>
               )}

               {profileViewer === "current" && (
                  <div className={styles.info_item}>
                     <span className={styles.label}>Phone</span>
                     <span className={styles.value}>
                        {profile?.phone || (
                           <span className={styles.empty_state}>
                              No phone number added
                           </span>
                        )}
                     </span>
                  </div>
               )}

               {profileViewer === "other" && profile?.dateOfBirth && (
                  <div className={styles.info_item}>
                     <span className={styles.label}>Date of Birth</span>
                     <span className={styles.value}>
                        {new Date(profile.dateOfBirth).toLocaleDateString(
                           "en-US",
                           {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                           }
                        )}
                     </span>
                  </div>
               )}

               {profileViewer === "current" && (
                  <div className={styles.info_item}>
                     <span className={styles.label}>Date of Birth</span>
                     <span className={styles.value}>
                        {profile?.dateOfBirth ? (
                           new Date(profile.dateOfBirth).toLocaleDateString(
                              "en-US",
                              {
                                 year: "numeric",
                                 month: "2-digit",
                                 day: "2-digit",
                              }
                           )
                        ) : (
                           <span className={styles.empty_state}>
                              Not specified
                           </span>
                        )}
                     </span>
                  </div>
               )}
            </div>
         </section>

         {/* Social Media Links */}
         {profileViewer === "other" && !socialLinks ? null : (
            <section className={styles.section}>
               <h2 className={styles.section_title}>Social Media</h2>
               {socialLinks &&
               Object.values(socialLinks).some((link) => link) ? (
                  <div className={styles.social_links}>
                     {socialLinks?.instagram && (
                        <a
                           href={socialLinks.instagram}
                           target="_blank"
                           rel="noopener noreferrer"
                           className={styles.social_icon}
                        >
                           <FaInstagram />
                        </a>
                     )}
                     {socialLinks?.facebook && (
                        <a
                           href={socialLinks.facebook}
                           target="_blank"
                           rel="noopener noreferrer"
                           className={styles.social_icon}
                        >
                           <FaFacebook />
                        </a>
                     )}
                     {socialLinks?.youtube && (
                        <a
                           href={socialLinks.youtube}
                           target="_blank"
                           rel="noopener noreferrer"
                           className={styles.social_icon}
                        >
                           <FaYoutube />
                        </a>
                     )}
                     {socialLinks?.tiktok && (
                        <a
                           href={socialLinks.tiktok}
                           target="_blank"
                           rel="noopener noreferrer"
                           className={styles.social_icon}
                        >
                           <FaTiktok />
                        </a>
                     )}
                     {socialLinks?.twitter && (
                        <a
                           href={socialLinks.twitter}
                           target="_blank"
                           rel="noopener noreferrer"
                           className={styles.social_icon}
                        >
                           <FaXTwitter />
                        </a>
                     )}
                  </div>
               ) : (
                  <p className={styles.empty_state}>
                     No social media links added. Add your social media profiles
                     in the Edit Profile section.
                  </p>
               )}
            </section>
         )}

         {/* Portfolio Links */}
         {profileViewer === "other" && !portfolioLinks ? null : (
            <section className={styles.section}>
               <h2 className={styles.section_title}>Portfolio</h2>
               {portfolioLinks &&
               Object.values(portfolioLinks).some((link) => link) ? (
                  <div className={styles.social_links}>
                     {portfolioLinks?.behance && (
                        <a
                           href={portfolioLinks.behance}
                           target="_blank"
                           rel="noopener noreferrer"
                           className={styles.social_icon}
                        >
                           <FaBehance />
                        </a>
                     )}
                     {portfolioLinks?.dribbble && (
                        <a
                           href={portfolioLinks.dribbble}
                           target="_blank"
                           rel="noopener noreferrer"
                           className={styles.social_icon}
                        >
                           <FaDribbble />
                        </a>
                     )}
                     {portfolioLinks?.linkedin && (
                        <a
                           href={portfolioLinks.linkedin}
                           target="_blank"
                           rel="noopener noreferrer"
                           className={styles.social_icon}
                        >
                           <FaLinkedin />
                        </a>
                     )}
                     {portfolioLinks?.website && (
                        <a
                           href={portfolioLinks.website}
                           target="_blank"
                           rel="noopener noreferrer"
                           className={styles.social_icon}
                        >
                           <FaGlobe />
                        </a>
                     )}
                  </div>
               ) : (
                  <p className={styles.empty_state}>
                     No portfolio links added. Showcase your work by adding
                     portfolio links in the Edit Profile section.
                  </p>
               )}
            </section>
         )}
      </div>
   );
}
