"use client";

import { resetPassword } from "@/app/_lib/firebase/auth/password-reset-actions";
import { verifyResetToken } from "@/app/_lib/firebase/reset-token/actions";
import {
   ResetPasswordFormValues,
   resetPasswordSchema,
} from "@/app/_lib/zod/schema/password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaCheck, FaLock } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";
import { MdError } from "react-icons/md";
import { Button, Input } from "../../UI/Input/Input";
import Loader from "../../UI/Loader/Loader";
import styles from "./ResetPassword.module.scss";

export default function ResetPasswordPage() {
   const searchParams = useSearchParams();
   const token = searchParams.get("token");
   const [tokenStatus, setTokenStatus] = useState<{
      isValid: boolean;
      message: string;
      isLoading: boolean;
   }>({
      isValid: false,
      message: "",
      isLoading: true,
   });
   const [pending, startTransition] = useTransition();
   const [resetStatus, setResetStatus] = useState<{
      success: boolean;
      message: string;
      completed: boolean;
   } | null>(null);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<ResetPasswordFormValues>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
         newPassword: "",
         confirmPassword: "",
      },
   });

   // Verify token when component mounts
   useEffect(() => {
      const verifyToken = async () => {
         if (!token) {
            setTokenStatus({
               isValid: false,
               message: "No reset token provided.",
               isLoading: false,
            });
            return;
         }

         try {
            const result = await verifyResetToken(token);
            setTokenStatus({
               isValid: result.success,
               message: result.error || "",
               isLoading: false,
            });
         } catch (error) {
            console.error("Error verifying reset token:", error);
            setTokenStatus({
               isValid: false,
               message: "An error occurred while verifying the token.",
               isLoading: false,
            });
         }
      };

      verifyToken();
   }, [token]);

   const onSubmit = handleSubmit((data) => {
      if (!token) return;

      startTransition(async () => {
         try {
            const result = await resetPassword(token, data.newPassword);
            setResetStatus({
               success: result.success,
               message: result.message,
               completed: true,
            });
         } catch (error) {
            console.error("Error resetting password:", error);
            setResetStatus({
               success: false,
               message: "An error occurred while resetting your password.",
               completed: true,
            });
         }
      });
   });

   // Render loading state
   if (tokenStatus.isLoading) {
      return (
         <div className={styles.container}>
            <div className={styles.card}>
               <div className={styles.loading}>
                  <LuLoader className={styles.loadingIcon} />
                  <h2>Verifying reset link...</h2>
                  <p>Please wait while we verify your password reset link.</p>
               </div>
            </div>
         </div>
      );
   }

   // Render error state if token is invalid
   if (!tokenStatus.isValid) {
      return (
         <div className={styles.container}>
            <div className={styles.card}>
               <div className={styles.error}>
                  <MdError className={styles.errorIcon} />
                  <h2>Invalid Reset Link</h2>
                  <p>
                     {tokenStatus.message ||
                        "The password reset link is invalid or has expired."}
                  </p>
               </div>
            </div>
         </div>
      );
   }

   // Render success state after password reset
   if (resetStatus?.completed && resetStatus.success) {
      return (
         <div className={styles.container}>
            <div className={styles.card}>
               <div className={styles.success}>
                  <FaCheck className={styles.successIcon} />
                  <h2>Password Reset Successful</h2>
                  <p>{resetStatus.message}</p>
               </div>
            </div>
         </div>
      );
   }

   // Render the password reset form
   return (
      <div className={styles.container}>
         <div className={styles.card}>
            <h2>Reset Your Password</h2>
            <p className={styles.subtitle}>
               Enter your new password below to reset your account password.
               Please note that this link is only valid for 15 minutes.
            </p>

            {resetStatus && !resetStatus.success && (
               <div className={styles.formError}>
                  <p>{resetStatus.message}</p>
               </div>
            )}

            <form onSubmit={onSubmit} className={styles.form}>
               <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter your new password"
                  icon={<FaLock />}
                  error={errors.newPassword?.message}
                  {...register("newPassword")}
               />
               <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your new password"
                  icon={<FaLock />}
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
               />
               <Button type="submit" disabled={pending}>
                  {pending && <Loader />}
                  {pending ? "Resetting Password..." : "Reset Password"}
               </Button>
            </form>
         </div>
      </div>
   );
}
