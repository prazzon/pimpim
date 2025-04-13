"use client";

import { uploadProfileImageByType } from "@/app/_lib/firebase/profile/actions";
import { Profile } from "@/app/_lib/firebase/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaCamera, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "../../../UI/Dialog/Dialog";
import { Button, Input } from "../../../UI/Input/Input";
import UserAvatar from "../../../UI/UserAvatar/UserAvatar";
import styles from "./ProfileImageEdit.module.scss";

type ProfileImageEditProps = {
   profile: Profile;
   type: "profile" | "cover";
};

export default function ProfileImageEdit({
   profile,
   type,
}: ProfileImageEditProps) {
   const router = useRouter();
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [imageUrl, setImageUrl] = useState("");
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(""); // Keep for form validation

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setError("");
      const file = e.target.files?.[0];

      if (!file) return;

      // Check file type
      if (!file.type.startsWith("image/")) {
         setError("Please select an image file");
         toast.error("Please select an image file");
         return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
         setError("Image size should be less than 5MB");
         toast.error("Image size should be less than 5MB");
         return;
      }

      // Store the file
      setSelectedFile(file);

      // Create a URL for the image preview
      const url = URL.createObjectURL(file);
      setImageUrl(url);
   };

   const handleSave = async () => {
      if (!selectedFile) {
         setError("Please select an image");
         toast.error("Please select an image");
         return;
      }

      setIsLoading(true);

      try {
         // Upload the image to Cloudinary and update the profile
         const result = await uploadProfileImageByType(
            profile.id,
            selectedFile,
            type
         );

         if (result.success) {
            toast.success(
               `${type.charAt(0).toUpperCase() + type.slice(1)} image updated!`
            );
            setIsDialogOpen(false);
            router.refresh();
         } else {
            setError(result.message || `Failed to update ${type} image`);
            toast.error(result.message || `Failed to update ${type} image`);
         }
      } catch (error) {
         console.error(`Error updating ${type} image:`, error);
         setError("An error occurred while updating the image");
         toast.error("An error occurred while updating the image");
      } finally {
         setIsLoading(false);
      }
   };

   const renderPreview = () => {
      if (type === "profile") {
         return imageUrl ? (
            <div className={styles.avatar_preview}>
               <Image
                  src={imageUrl}
                  alt="Profile Preview"
                  width={150}
                  height={150}
                  className={styles.preview_image}
               />
            </div>
         ) : (
            <UserAvatar
               name={profile.displayName}
               image={profile.profileImage}
               darkBackground={true}
               size="xlarge"
            />
         );
      } else {
         return (
            <div className={styles.cover_preview}>
               {imageUrl ? (
                  <Image
                     src={imageUrl}
                     alt="Cover Preview"
                     fill
                     className={styles.preview_image}
                  />
               ) : profile.coverImage ? (
                  <Image
                     src={profile.coverImage}
                     alt="Current Cover"
                     fill
                     className={styles.preview_image}
                  />
               ) : (
                  <div className={styles.cover_placeholder}>
                     <FaCamera size={24} />
                     <span>No cover image</span>
                  </div>
               )}
            </div>
         );
      }
   };

   return (
      <div className={styles.image_edit}>
         <div
            className={`${styles.image_container} ${
               type === "cover"
                  ? styles.cover_container
                  : styles.profile_container
            }`}
            onClick={() => setIsDialogOpen(true)}
         >
            {type === "profile" ? (
               <div className={styles.profile_image}>
                  <UserAvatar
                     name={profile.displayName}
                     image={profile.profileImage}
                     darkBackground={true}
                     size="xlarge"
                  />
                  <div className={styles.edit_overlay}>
                     <FaCamera size={24} />
                  </div>
               </div>
            ) : (
               <div className={styles.cover_image}>
                  {profile.coverImage ? (
                     <Image
                        src={profile.coverImage}
                        alt="Cover"
                        fill
                        className={styles.image}
                     />
                  ) : (
                     <div className={styles.cover_gradient}></div>
                  )}
                  <div className={styles.edit_overlay}>
                     <FaCamera size={24} />
                  </div>
               </div>
            )}
         </div>

         <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
               if (!open) {
                  // Reset state when dialog is closed
                  setImageUrl("");

                  setSelectedFile(null);
                  setError("");
               }
               setIsDialogOpen(open);
            }}
         >
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>
                     {type === "profile"
                        ? "Update Profile Picture"
                        : "Update Cover Image"}
                  </DialogTitle>
               </DialogHeader>

               <div className={styles.dialog_content}>
                  <div className={styles.preview_container}>
                     {renderPreview()}
                  </div>

                  <div className={styles.upload_controls}>
                     <Input
                        type="file"
                        accept="image/*"
                        id={`${type}-image-upload`}
                        onChange={handleImageChange}
                        error={error}
                     />
                  </div>

                  <div className={styles.dialog_actions}>
                     <Button
                        variant="secondary"
                        onClick={() => {
                           setIsDialogOpen(false);
                           setImageUrl("");

                           setSelectedFile(null);
                           setError("");
                        }}
                        disabled={isLoading}
                     >
                        Cancel
                     </Button>
                     <Button
                        onClick={handleSave}
                        disabled={!selectedFile || isLoading}
                     >
                        {isLoading ? (
                           <>
                              <FaSpinner className={styles.spinner} /> Saving...
                           </>
                        ) : (
                           "Save"
                        )}
                     </Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}
