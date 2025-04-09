"use client";

import {
   updatePortfolioLink,
   updateSocialLink,
   updateUserProfile,
} from "@/app/_lib/firebase/profile/actions";
import { Profile } from "@/app/_lib/firebase/types";
import {
   ProfileEditFormValues,
   profileEditSchema,
} from "@/app/_lib/zod/schema/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import {
   FaBriefcase,
   FaCalendarAlt,
   FaMapMarkerAlt,
   FaPhone,
   FaUser,
} from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { toast } from "sonner";
import { Button, Input, Textarea } from "../../../UI/Input/Input";
import styles from "./ProfileEditForm.module.scss";
import ProfileImageEdit from "./ProfileImageEdit";

type ProfileEditFormProps = {
   profile: Profile;
};

export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
   const router = useRouter();
   const [pending, startTransition] = useTransition();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<ProfileEditFormValues>({
      resolver: zodResolver(profileEditSchema),
      defaultValues: {
         username: profile.username || "",
         firstName: profile.firstName || "",
         lastName: profile.lastName || "",
         email: profile.email || "",
         phone: profile.phone || "",
         location: profile.location || "",
         occupation: profile.occupation || "",
         bio: profile.bio || "",
         dateOfBirth: profile.dateOfBirth || "",
         // Social links
         instagram: profile.socialLinks?.instagram || "",
         facebook: profile.socialLinks?.facebook || "",
         youtube: profile.socialLinks?.youtube || "",
         tiktok: profile.socialLinks?.tiktok || "",
         twitter: profile.socialLinks?.twitter || "",
         // Portfolio links
         behance: profile.portfolioLinks?.behance || "",
         dribbble: profile.portfolioLinks?.dribbble || "",
         linkedin: profile.portfolioLinks?.linkedin || "",
         website: profile.portfolioLinks?.website || "",
      },
   });

   const onSubmit = async (data: ProfileEditFormValues) => {
      startTransition(async () => {
         try {
            // Update basic profile information
            const basicProfileData = {
               username: data.username,
               firstName: data.firstName,
               lastName: data.lastName,
               phone: data.phone,
               location: data.location,
               occupation: data.occupation,
               bio: data.bio,
               dateOfBirth: data.dateOfBirth,
            };

            const result = await updateUserProfile(
               profile.id,
               basicProfileData
            );

            if (!result.success) {
               toast.error(result.message || "Failed to update profile");
               return;
            }

            // Update social links
            const socialPlatforms = [
               "instagram",
               "facebook",
               "youtube",
               "tiktok",
               "twitter",
            ] as const;
            for (const platform of socialPlatforms) {
               if (data[platform] !== (profile.socialLinks?.[platform] || "")) {
                  await updateSocialLink(
                     profile.id,
                     platform,
                     data[platform] || ""
                  );
               }
            }

            // Update portfolio links
            const portfolioPlatforms = [
               "behance",
               "dribbble",
               "linkedin",
               "website",
            ] as const;
            for (const platform of portfolioPlatforms) {
               if (
                  data[platform] !== (profile.portfolioLinks?.[platform] || "")
               ) {
                  await updatePortfolioLink(
                     profile.id,
                     platform,
                     data[platform] || ""
                  );
               }
            }

            toast.success("Profile updated successfully!");

            // Navigate back to profile page after 1 second
            setTimeout(() => {
               router.push("/profile");
               router.refresh();
            }, 1000);
         } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred while updating your profile");
         }
      });
   };

   return (
      <div className={styles.edit_form_container}>
         <h1 className={styles.title}>Edit Profile</h1>

         <div className={styles.image_editors}>
            <ProfileImageEdit profile={profile} type="profile" />
            <ProfileImageEdit profile={profile} type="cover" />
         </div>

         <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.form_section}>
               <h2 className={styles.section_title}>Basic Information</h2>

               <div className={styles.form_grid}>
                  <Input
                     label="Username"
                     icon={<FaUser />}
                     error={errors.username?.message}
                     {...register("username")}
                  />

                  <Input
                     label="First Name"
                     error={errors.firstName?.message}
                     {...register("firstName")}
                  />

                  <Input
                     label="Last Name"
                     error={errors.lastName?.message}
                     {...register("lastName")}
                  />

                  <Input
                     label="Email"
                     icon={<IoMail />}
                     disabled
                     {...register("email")}
                  />

                  <Input
                     label="Phone"
                     icon={<FaPhone />}
                     error={errors.phone?.message}
                     {...register("phone")}
                  />

                  <Input
                     label="Location"
                     icon={<FaMapMarkerAlt />}
                     error={errors.location?.message}
                     {...register("location")}
                  />

                  <Input
                     label="Occupation"
                     icon={<FaBriefcase />}
                     error={errors.occupation?.message}
                     {...register("occupation")}
                  />

                  <Input
                     label="Date of Birth"
                     type="date"
                     icon={<FaCalendarAlt />}
                     error={errors.dateOfBirth?.message}
                     {...register("dateOfBirth")}
                  />
               </div>

               <Textarea
                  label="Bio"
                  error={errors.bio?.message}
                  {...register("bio")}
               />
            </div>

            <div className={styles.form_section}>
               <h2 className={styles.section_title}>Social Media Links</h2>

               <div className={styles.form_grid}>
                  <Input
                     label="Instagram"
                     placeholder="https://instagram.com/username"
                     error={errors.instagram?.message}
                     {...register("instagram")}
                  />

                  <Input
                     label="Facebook"
                     placeholder="https://facebook.com/username"
                     error={errors.facebook?.message}
                     {...register("facebook")}
                  />

                  <Input
                     label="YouTube"
                     placeholder="https://youtube.com/username"
                     error={errors.youtube?.message}
                     {...register("youtube")}
                  />

                  <Input
                     label="TikTok"
                     placeholder="https://tiktok.com/@username"
                     error={errors.tiktok?.message}
                     {...register("tiktok")}
                  />

                  <Input
                     label="Twitter"
                     placeholder="https://twitter.com/username"
                     error={errors.twitter?.message}
                     {...register("twitter")}
                  />
               </div>
            </div>

            <div className={styles.form_section}>
               <h2 className={styles.section_title}>Portfolio Links</h2>

               <div className={styles.form_grid}>
                  <Input
                     label="Behance"
                     placeholder="https://behance.net/username"
                     error={errors.behance?.message}
                     {...register("behance")}
                  />

                  <Input
                     label="Dribbble"
                     placeholder="https://dribbble.com/username"
                     error={errors.dribbble?.message}
                     {...register("dribbble")}
                  />

                  <Input
                     label="LinkedIn"
                     placeholder="https://linkedin.com/in/username"
                     error={errors.linkedin?.message}
                     {...register("linkedin")}
                  />

                  <Input
                     label="Website"
                     placeholder="https://yourwebsite.com"
                     error={errors.website?.message}
                     {...register("website")}
                  />
               </div>
            </div>

            <div className={styles.form_actions}>
               <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/profile")}
               >
                  Cancel
               </Button>
               <Button type="submit" disabled={pending}>
                  {pending ? "Saving..." : "Save Changes"}
               </Button>
            </div>
         </form>
      </div>
   );
}
