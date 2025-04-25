"use client";

import { registerUser } from "@/app/_lib/firebase/auth/actions";
import {
   LoginFormValues,
   SignupFormValues,
} from "@/app/_lib/zod/schema/auth.schema";
import { ForgotPasswordFormValues } from "@/app/_lib/zod/schema/password.schema";
import Logo from "@/public/logo.svg";
import { signIn } from "next-auth/react";
import Image from "next/image";
import type React from "react";
import { useEffect, useState, useTransition } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useOnboarding } from "../Onboarding/OnboardingProvider";
import Alert, { AlertType } from "../UI/Alert/Alert";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogDivider,
   DialogHeader,
   DialogLogo,
   DialogTitle,
} from "../UI/Dialog/Dialog";
import { Button, Tabs } from "../UI/Input/Input";
import ForgotPasswordForm from "./ForgotPasswordForm";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthDialogProps {
   open: boolean;
   action: (open: boolean) => void;
}

export default function AuthDialog({ open, action }: AuthDialogProps) {
   const [activeTab, setActiveTab] = useState(0);
   const [pending, startTransition] = useTransition();
   const [googlePending, startGoogleTransition] = useTransition();
   const [alert, setAlert] = useState<{
      type: AlertType;
      message: string;
   } | null>(null);
   const [showForgotPassword, setShowForgotPassword] = useState(false);
   const { showOnboarding } = useOnboarding();

   // Clear alert when tab changes or dialog closes/opens
   useEffect(() => {
      setAlert(null);
   }, [activeTab, open]);

   // Reset forgot password view when dialog closes
   useEffect(() => {
      if (!open) {
         setShowForgotPassword(false);
      }
   }, [open]);

   const handleLoginSubmit = (data: LoginFormValues) => {
      setAlert(null);

      startTransition(async () => {
         const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
         });

         if (result?.error) {
            setAlert({
               type: "error",
               message: "Invalid email or password. Please try again.",
            });
         } else {
            setAlert({
               type: "success",
               message: "Login successful!",
            });

            // Close dialog after 2 seconds
            setTimeout(() => {
               action(false);
            }, 2000);
         }
      });
   };

   const handleSignupSubmit = (data: SignupFormValues) => {
      setAlert(null);

      startTransition(async () => {
         const result = await registerUser(data);
         if (!result.success) {
            setAlert({
               type: "error",
               message:
                  result.message ||
                  "Failed to create account. Please try again.",
            });
            return;
         }

         setAlert({
            type: "success",
            message:
               "Account created! Please check your email for verification.",
         });

         // Close dialog after 3 seconds
         setTimeout(() => {
            action(false);
         }, 3000);

         // Automatically log in the user with their credentials
         const loginResult = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
         });

         if (loginResult?.error) {
            console.error("Auto-login failed:", loginResult.error);
            toast.error(
               "Auto-login failed, please login with your credentials"
            );
            return;
         }

         // Show onboarding after login
         showOnboarding();
      });
   };

   const handleGoogleLogin = async () => {
      startGoogleTransition(async () => {
         await signIn("google");
      });
   };

   const handleForgotPasswordSubmit = (
      _data: ForgotPasswordFormValues,
      result: { success: boolean; message: string }
   ) => {
      setAlert({
         type: result.success ? "success" : "error",
         message: result.message,
      });
   };

   const handleForgotPasswordClick = () => {
      setAlert(null);
      setShowForgotPassword(true);
   };

   const handleBackToLogin = () => {
      setAlert(null);
      setShowForgotPassword(false);
   };

   return (
      <Dialog open={open} onOpenChange={action} hasBlur={true}>
         <DialogContent onInteractOutside={() => action(false)}>
            <DialogHeader>
               <DialogLogo>
                  <Image
                     src={Logo || "/placeholder.svg"}
                     alt="PimPim Logo"
                     width={100}
                     height={40}
                  />
               </DialogLogo>
               {showForgotPassword ? (
                  <>
                     <div
                        style={{
                           display: "flex",
                           flexDirection: "column",
                           alignItems: "center",
                           marginBottom: "8px",
                        }}
                     >
                        <DialogTitle>Forgot Password</DialogTitle>
                        <button
                           onClick={handleBackToLogin}
                           style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "16px",
                              color: "#fff",
                           }}
                        >
                           <FaArrowLeft /> Back to Login
                        </button>
                     </div>
                     <DialogDescription>
                        Enter your email address and we&apos;ll send you a link
                        to reset your password.
                     </DialogDescription>
                  </>
               ) : (
                  <>
                     <DialogTitle>
                        {activeTab === 0 ? "Welcome back" : "Create an account"}
                     </DialogTitle>
                     <DialogDescription>
                        {activeTab === 0
                           ? "Enter your credentials to login to your account."
                           : "Fill in the details below to create your account."}
                     </DialogDescription>
                  </>
               )}
            </DialogHeader>

            {!showForgotPassword && (
               <Tabs
                  tabs={["Login", "Sign up"]}
                  activeTab={activeTab}
                  onChangeAction={setActiveTab}
               />
            )}

            {alert && (
               <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
               />
            )}

            {showForgotPassword ? (
               <ForgotPasswordForm
                  onSubmitAction={handleForgotPasswordSubmit}
               />
            ) : activeTab === 0 ? (
               <LoginForm
                  onSubmitAction={handleLoginSubmit}
                  pending={pending}
                  onForgotPasswordClick={handleForgotPasswordClick}
               />
            ) : (
               <SignupForm
                  onSubmitAction={handleSignupSubmit}
                  pending={pending}
               />
            )}

            {!showForgotPassword && (
               <>
                  <DialogDivider />
                  <Button
                     variant="secondary"
                     onClick={handleGoogleLogin}
                     disabled={pending || googlePending}
                  >
                     <FcGoogle style={{ fontSize: "20px" }} />
                     Login with Google
                  </Button>
               </>
            )}
         </DialogContent>
      </Dialog>
   );
}
