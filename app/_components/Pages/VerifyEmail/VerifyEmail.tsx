"use client";

import { newVerification } from "@/app/_lib/firebase/verification-token/actions";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BsExclamationCircleFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";
import { IoArrowBackOutline } from "react-icons/io5";
import { LuLoader } from "react-icons/lu";
import styles from "./VerifyEmail.module.scss";

export default function VerifyEmail() {
   const [error, setError] = useState<string | undefined>(undefined);
   const [success, setSuccess] = useState<string | undefined>(undefined);
   const [isLoading, setIsLoading] = useState(true);
   const searchParams = useSearchParams();
   const token = searchParams.get("token");

   const onSubmit = useCallback(() => {
      if (success || error) {
         setIsLoading(false);
         return;
      }

      if (!token) {
         setError("No token provided");
         setIsLoading(false);
         return;
      }

      newVerification(token)
         .then((data) => {
            if (data.success) {
               setSuccess(data.success);
            }
            if (data.error) {
               setError(data.error);
            }
            setIsLoading(false);
         })
         .catch((error) => {
            console.error(error);
            setError("An unexpected error occurred");
            setIsLoading(false);
         });
   }, [token, success, error]);

   useEffect(() => {
      onSubmit();
   }, [onSubmit]);

   return (
      <div className={styles.verify_email}>
         <div className={styles.verify_email_card}>
            <div className={styles.verify_email_card_header}>
               <h1 className={styles.verify_email_card_header_title}>
                  Email Verification
               </h1>
               <p className={styles.verify_email_card_header_subtitle}>
                  We&apos;re confirming your email address
               </p>
            </div>

            <div className={styles.verify_email_card_content}>
               <AnimatePresence mode="wait">
                  {isLoading && <LoadingState key="loading" />}

                  {success && !isLoading && (
                     <SuccessState key="success" message={success} />
                  )}

                  {error && !isLoading && (
                     <ErrorState key="error" message={error} />
                  )}
               </AnimatePresence>
            </div>

            <div className={styles.verify_email_card_footer}>
               <button className={styles.verify_email_card_footer_btn}>
                  <Link href={"/"}>
                     <IoArrowBackOutline />
                     Back to home
                  </Link>
               </button>
            </div>
         </div>
      </div>
   );
}

interface StateProps {
   message?: string;
}

const LoadingState = () => {
   return (
      <motion.div
         className={styles.state}
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.3 }}
      >
         <div
            className={`${styles.state_icon} ${styles.loading} ${styles.pulse}`}
         >
            <LuLoader />
         </div>
         <h2 className={styles.state_title}>Verifying your email</h2>
         <p className={styles.state_message}>
            Please wait while we confirm your email address. This should only
            take a moment.
         </p>
      </motion.div>
   );
};

const SuccessState = ({ message }: StateProps) => {
   return (
      <motion.div
         className={styles.state}
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.3 }}
      >
         <div className={`${styles.state_icon} ${styles.success}`}>
            <FaCheck />
         </div>
         <h2 className={styles.state_title}>Email Verified</h2>
         <p className={styles.state_message}>
            {message ||
               "Your email has been successfully verified. You can now access all features of your account."}
         </p>
      </motion.div>
   );
};

const ErrorState = ({ message }: StateProps) => {
   return (
      <motion.div
         className={styles.state}
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.3 }}
      >
         <div className={`${styles.state_icon} ${styles.error}`}>
            <BsExclamationCircleFill />
         </div>
         <h2 className={styles.state_title}>Verification Failed</h2>
         <p className={styles.state_message}>
            {message ||
               "We couldn't verify your email address. The verification link may have expired or is invalid."}
         </p>
      </motion.div>
   );
};
