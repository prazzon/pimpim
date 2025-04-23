"use client";

import { sendVerificationEmail } from "@/app/_lib/resend/mail";
import { generateVerificationToken } from "@/app/_lib/token";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "sonner";
import styles from "./VerificationBanner.module.scss";

type VerificationBannerProps = {
   email: string;
};

export default function VerificationBanner({ email }: VerificationBannerProps) {
   const [isVisible, setIsVisible] = useState(true);
   const [isSending, setIsSending] = useState(false);

   const handleResendVerification = async () => {
      try {
         setIsSending(true);
         const verificationToken = await generateVerificationToken(email);
         await sendVerificationEmail(email, verificationToken.token);
         toast.success("Verification email sent! Please check your inbox.");
      } catch (error) {
         console.error("Error sending verification email:", error);
         toast.error(
            "Failed to send verification email. Please try again later."
         );
      } finally {
         setIsSending(false);
      }
   };

   const handleClose = () => {
      setIsVisible(false);
   };

   if (!isVisible) return null;

   return (
      <div className={styles.banner}>
         <div className={styles.content}>
            <div className={styles.icon}>
               <MdOutlineEmail />
            </div>
            <div className={styles.message}>
               <p>
                  Your email address is not verified. Please verify your email
                  to access all features.
               </p>
            </div>
         </div>
         <div className={styles.actions}>
            <button
               className={styles.resend_btn}
               onClick={handleResendVerification}
               disabled={isSending}
            >
               {isSending ? "Sending..." : "Resend verification email"}
            </button>
            <button
               className={styles.close_btn}
               onClick={handleClose}
               aria-label="Close"
            >
               <IoMdClose />
            </button>
         </div>
      </div>
   );
}
