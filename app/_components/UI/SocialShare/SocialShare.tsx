"use client";

import { useEffect, useState } from "react";
import { FaLink, FaLinkedin, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";
import styles from "./SocialShare.module.scss";

interface SocialShareProps {
   title: string;
   authorName: string;
   className?: string;
}

export default function SocialShare({
   title,
   authorName,
   className,
}: SocialShareProps) {
   const [url, setUrl] = useState<string>("");

   // Get the current URL when the component mounts
   useEffect(() => {
      setUrl(window.location.href);
   }, []);

   // Function to copy the URL to clipboard
   const copyToClipboard = async () => {
      try {
         await navigator.clipboard.writeText(url);
         toast.success("Link copied to clipboard", {
            description: "You can now paste the link anywhere",
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

   // Function to open a popup window for social sharing
   const openShareWindow = (shareUrl: string) => {
      const width = 600;
      const height = 600;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;

      window.open(
         shareUrl,
         "share",
         `width=${width},height=${height},top=${top},left=${left},toolbar=0,location=0,menubar=0,directories=0,scrollbars=0`
      );
   };

   // Generate the share text
   const shareText = `${title} by ${authorName}`;
   const encodedShareText = encodeURIComponent(shareText);
   const encodedUrl = encodeURIComponent(url);

   // Share to X (Twitter)
   const shareToX = () => {
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedUrl}`;
      openShareWindow(shareUrl);
   };

   // Share to LinkedIn
   const shareToLinkedIn = () => {
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedShareText}`;
      openShareWindow(shareUrl);
   };

   // Share to WhatsApp
   const shareToWhatsApp = () => {
      const shareUrl = `https://wa.me/?text=${encodedShareText} ${encodedUrl}`;
      openShareWindow(shareUrl);
   };

   return (
      <div className={`${styles.social_icons} ${className || ""}`}>
         <button
            className={`${styles.social_icon} ${styles.link}`}
            onClick={copyToClipboard}
            aria-label="Copy link to clipboard"
         >
            <FaLink />
         </button>
         <button
            className={`${styles.social_icon} ${styles.twitter}`}
            onClick={shareToX}
            aria-label="Share on X (Twitter)"
         >
            <FaXTwitter />
         </button>
         <button
            className={`${styles.social_icon} ${styles.linkedin}`}
            onClick={shareToLinkedIn}
            aria-label="Share on LinkedIn"
         >
            <FaLinkedin />
         </button>
         <button
            className={`${styles.social_icon} ${styles.whatsapp}`}
            onClick={shareToWhatsApp}
            aria-label="Share on WhatsApp"
         >
            <FaWhatsapp />
         </button>
      </div>
   );
}
