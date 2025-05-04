"use client";

import { toPng } from "html-to-image";
import { useEffect, useRef, useState } from "react";
import { BiSolidDownload } from "react-icons/bi";
import { FaCopy } from "react-icons/fa";
import { toast } from "sonner";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "../../../UI/Dialog/Dialog";
import { Button } from "../../../UI/Input/Input";
import QRCode from "../../../UI/QRCode/QRCode";
import styles from "./ProfileShareDialog.module.scss";

interface ProfileShareDialogProps {
   open: boolean;
   onOpenChangeAction: (open: boolean) => void;
   username: string;
}

export default function ProfileShareDialog({
   open,
   onOpenChangeAction,
   username,
}: ProfileShareDialogProps) {
   const [profileUrl, setProfileUrl] = useState<string>("");
   const qrCodeRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      // Get the base URL of the site
      const baseUrl = window.location.origin;
      // Create the profile URL
      setProfileUrl(`${baseUrl}/user/${username}`);
   }, [username]);

   const copyToClipboard = async () => {
      try {
         await navigator.clipboard.writeText(profileUrl);
         toast.success("Profile link copied to clipboard", {
            description: "You can now share it with others",
            duration: 3000,
         });
      } catch (err) {
         console.error("Failed to copy link:", err);
         toast.error("Failed to copy link", {
            description: "Please try again or copy the URL manually",
            duration: 5000,
         });
      }
   };

   const downloadQRCode = async () => {
      if (qrCodeRef.current) {
         try {
            const dataUrl = await toPng(qrCodeRef.current, { quality: 1.0 });
            const link = document.createElement("a");
            link.download = `${username}-profile-qr.png`;
            link.href = dataUrl;
            link.click();
            toast.success("QR code downloaded", {
               description: "You can now share it with others",
               duration: 3000,
            });
         } catch (err) {
            console.error("Failed to download QR code:", err);
            toast.error("Failed to download QR code", {
               description: "Please try again",
               duration: 5000,
            });
         }
      }
   };

   return (
      <Dialog
         open={open}
         onOpenChange={onOpenChangeAction}
         hasBlur={true}
         preventFullScreen={true}
      >
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Share Your Profile</DialogTitle>
            </DialogHeader>

            <div className={styles.share_content}>
               <div className={styles.qr_section} ref={qrCodeRef}>
                  <QRCode value={profileUrl} size={220} />
                  <div className={styles.username}>@{username}</div>
               </div>

               <div className={styles.share_options}>
                  <Button
                     variant="secondary"
                     className={styles.share_button}
                     onClick={copyToClipboard}
                  >
                     <FaCopy /> Copy Profile Link
                  </Button>
                  <Button
                     variant="secondary"
                     className={styles.share_button}
                     onClick={downloadQRCode}
                  >
                     <BiSolidDownload />
                     Download QR Code
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
