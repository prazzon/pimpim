"use client";

import {
   changeUserPassword,
   linkUserPassword,
} from "@/app/_lib/firebase/auth/password-actions";
import {
   PasswordChangeFormValues,
   PasswordLinkFormValues,
   passwordChangeSchema,
   passwordLinkSchema,
} from "@/app/_lib/zod/schema/password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import { toast } from "sonner";
import Alert, { AlertType } from "../UI/Alert/Alert";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "../UI/Dialog/Dialog";
import { Button, Input } from "../UI/Input/Input";
import Loader from "../UI/Loader/Loader";
import styles from "./PasswordChangeDialog.module.scss";

interface PasswordChangeDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   userId: string;
   hasPassword: boolean;
}

export default function PasswordChangeDialog({
   open,
   onOpenChange,
   userId,
   hasPassword,
}: PasswordChangeDialogProps) {
   const [pending, startTransition] = useTransition();
   const [alert, setAlert] = useState<{
      type: AlertType;
      message: string;
   } | null>(null);

   // Use the appropriate form based on whether the user has a password
   const {
      register: registerChange,
      handleSubmit: handleSubmitChange,
      formState: { errors: errorsChange },
      reset: resetChange,
   } = useForm<PasswordChangeFormValues>({
      resolver: zodResolver(passwordChangeSchema),
      defaultValues: {
         currentPassword: "",
         newPassword: "",
         confirmPassword: "",
      },
   });

   const {
      register: registerLink,
      handleSubmit: handleSubmitLink,
      formState: { errors: errorsLink },
      reset: resetLink,
   } = useForm<PasswordLinkFormValues>({
      resolver: zodResolver(passwordLinkSchema),
      defaultValues: {
         newPassword: "",
         confirmPassword: "",
      },
   });

   // Reset form and alert when dialog opens/closes
   useEffect(() => {
      if (!open) {
         setAlert(null);
         resetChange();
         resetLink();
      }
   }, [open, resetChange, resetLink]);

   const handleChangePassword = (data: PasswordChangeFormValues) => {
      setAlert(null);
      startTransition(async () => {
         try {
            const result = await changeUserPassword(
               userId,
               data.currentPassword,
               data.newPassword
            );

            if (result.success) {
               toast.success("Password changed successfully");
               resetChange();
               // Close dialog after 1 second
               setTimeout(() => {
                  onOpenChange(false);
               }, 1000);
            } else {
               setAlert({
                  type: "error",
                  message: result.message,
               });
            }
         } catch (error) {
            console.error("Error changing password:", error);
            setAlert({
               type: "error",
               message: "An error occurred while changing the password",
            });
         }
      });
   };

   const handleLinkPassword = (data: PasswordLinkFormValues) => {
      setAlert(null);
      startTransition(async () => {
         try {
            const result = await linkUserPassword(userId, data.newPassword);

            if (result.success) {
               toast.success("Password linked successfully");
               resetLink();
               // Close dialog after 1 second
               setTimeout(() => {
                  onOpenChange(false);
               }, 1000);
            } else {
               setAlert({
                  type: "error",
                  message: result.message,
               });
            }
         } catch (error) {
            console.error("Error linking password:", error);
            setAlert({
               type: "error",
               message: "An error occurred while linking the password",
            });
         }
      });
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange} hasBlur={true}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>
                  {hasPassword ? "Change Password" : "Set Password"}
               </DialogTitle>
               <DialogDescription>
                  {hasPassword
                     ? "Enter your current password and a new password to change it."
                     : "Set a password for your account to login with email and password."}
               </DialogDescription>
            </DialogHeader>

            {alert && (
               <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
               />
            )}

            {hasPassword ? (
               <form
                  onSubmit={handleSubmitChange(handleChangePassword)}
                  className={styles.form}
               >
                  <Input
                     label="Current Password"
                     type="password"
                     placeholder="Enter your current password"
                     icon={<FaLock />}
                     error={errorsChange.currentPassword?.message}
                     {...registerChange("currentPassword")}
                  />
                  <Input
                     label="New Password"
                     type="password"
                     placeholder="Enter your new password"
                     icon={<FaLock />}
                     error={errorsChange.newPassword?.message}
                     {...registerChange("newPassword")}
                  />
                  <Input
                     label="Confirm New Password"
                     type="password"
                     placeholder="Confirm your new password"
                     icon={<FaLock />}
                     error={errorsChange.confirmPassword?.message}
                     {...registerChange("confirmPassword")}
                  />
                  <div className={styles.actions}>
                     <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={pending}
                     >
                        Cancel
                     </Button>
                     <Button type="submit" disabled={pending}>
                        {pending && <Loader />}
                        {pending ? "Changing..." : "Change Password"}
                     </Button>
                  </div>
               </form>
            ) : (
               <form
                  onSubmit={handleSubmitLink(handleLinkPassword)}
                  className={styles.form}
               >
                  <Input
                     label="New Password"
                     type="password"
                     placeholder="Enter a new password"
                     icon={<FaLock />}
                     error={errorsLink.newPassword?.message}
                     {...registerLink("newPassword")}
                  />
                  <Input
                     label="Confirm Password"
                     type="password"
                     placeholder="Confirm your password"
                     icon={<FaLock />}
                     error={errorsLink.confirmPassword?.message}
                     {...registerLink("confirmPassword")}
                  />
                  <div className={styles.actions}>
                     <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={pending}
                     >
                        Cancel
                     </Button>
                     <Button type="submit" disabled={pending}>
                        {pending && <Loader />}
                        {pending ? "Setting..." : "Set Password"}
                     </Button>
                  </div>
               </form>
            )}
         </DialogContent>
      </Dialog>
   );
}
