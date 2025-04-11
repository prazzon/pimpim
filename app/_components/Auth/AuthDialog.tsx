"use client";

import { registerUser } from "@/app/_lib/firebase/auth/actions";
import {
   LoginFormValues,
   SignupFormValues,
} from "@/app/_lib/zod/schema/auth.schema";
import Logo from "@/public/logo.svg";
import { signIn } from "next-auth/react";
import Image from "next/image";
import type React from "react";
import { useEffect, useState, useTransition } from "react";
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
   const { showOnboarding } = useOnboarding();

   // Clear alert when tab changes or dialog closes/opens
   useEffect(() => {
      setAlert(null);
   }, [activeTab, open]);

   const handleLoginSubmit = (data: LoginFormValues) => {
      console.log("Login form submitted:", data);
      setAlert(null);

      startTransition(async () => {
         const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
         });

         console.log(result);
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
      console.log("Signup form submitted:", data);
      setAlert(null);

      startTransition(async () => {
         const result = await registerUser(data);
         console.log(result);
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
            message: "Account created successfully!",
         });

         // Close dialog after 2 seconds
         setTimeout(() => {
            action(false);
         }, 2000);

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

   return (
      <Dialog open={open} onOpenChange={action} hasBlur={true}>
         <DialogContent onInteractOutside={() => action(false)}>
            <DialogHeader>
               <DialogLogo>
                  <Image
                     src={Logo || "/placeholder.svg"}
                     alt="PimPim Logo"
                     width={40}
                     height={40}
                  />
               </DialogLogo>
               <DialogTitle>
                  {activeTab === 0 ? "Welcome back" : "Create an account"}
               </DialogTitle>
               <DialogDescription>
                  {activeTab === 0
                     ? "Enter your credentials to login to your account."
                     : "Fill in the details below to create your account."}
               </DialogDescription>
            </DialogHeader>

            <Tabs
               tabs={["Login", "Sign up"]}
               activeTab={activeTab}
               onChangeAction={setActiveTab}
            />

            {alert && (
               <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
               />
            )}

            {activeTab === 0 ? (
               <LoginForm
                  onSubmitAction={handleLoginSubmit}
                  pending={pending}
               />
            ) : (
               <SignupForm
                  onSubmitAction={handleSignupSubmit}
                  pending={pending}
               />
            )}

            <DialogDivider />

            <Button
               variant="secondary"
               onClick={handleGoogleLogin}
               disabled={pending || googlePending}
            >
               <FcGoogle style={{ fontSize: "20px" }} />
               Login with Google
            </Button>
         </DialogContent>
      </Dialog>
   );
}
