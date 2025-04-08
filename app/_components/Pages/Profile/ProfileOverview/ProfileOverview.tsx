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
};

export default function ProfileOverview({ profile }: ProfileOverviewProps) {
   const { socialLinks, portfolioLinks } = profile;

   return (
      <div className={styles.overview}>
         {/* Bio Section */}
         <section className={styles.section}>
            <h2 className={styles.section_title}>About Me</h2>
            <p className={styles.bio}>{profile?.bio}</p>
         </section>

         {/* Personal Information */}
         <section className={styles.section}>
            <h2 className={styles.section_title}>Personal Information</h2>
            <div className={styles.personal_info}>
               <div className={styles.info_item}>
                  <span className={styles.label}>First Name</span>
                  <span className={styles.value}>{profile?.firstName}</span>
               </div>
               <div className={styles.info_item}>
                  <span className={styles.label}>Last Name</span>
                  <span className={styles.value}>{profile?.lastName}</span>
               </div>
               <div className={styles.info_item}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{profile?.email}</span>
               </div>
               <div className={styles.info_item}>
                  <span className={styles.label}>Phone</span>
                  <span className={styles.value}>{profile?.phone}</span>
               </div>
               <div className={styles.info_item}>
                  <span className={styles.label}>Date of Birth</span>
                  <span className={styles.value}>
                     {profile?.dateOfBirth &&
                        new Date(profile.dateOfBirth).toLocaleDateString()}
                  </span>
               </div>
            </div>
         </section>

         {/* Social Media Links */}
         {socialLinks && (
            <section className={styles.section}>
               <h2 className={styles.section_title}>Social Media</h2>
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
            </section>
         )}

         {/* Portfolio Links */}
         {portfolioLinks && (
            <section className={styles.section}>
               <h2 className={styles.section_title}>Portfolio</h2>
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
            </section>
         )}
      </div>
   );
}
