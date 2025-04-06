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
   onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
   const [activeTab, setActiveTab] = useState(0);
   const [pending, startTransition] = useTransition();
   const [alert, setAlert] = useState<{
      type: AlertType;
      message: string;
   } | null>(null);

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
               message: "Login successful! Redirecting...",
            });

            // Close dialog after 2 seconds
            setTimeout(() => {
               onOpenChange(false);
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
            message: "Account created successfully! Redirecting...",
         });

         // Close dialog after 2 seconds
         setTimeout(() => {
            onOpenChange(false);
         }, 2000);
      });
   };

   const handleGoogleLogin = () => {
      console.log("Google login clicked");
      // Add your Google login logic here
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange} hasBlur={true}>
         <DialogContent onInteractOutside={() => onOpenChange(false)}>
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
               onChange={setActiveTab}
            />

            {alert && (
               <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
               />
            )}

            {activeTab === 0 ? (
               <LoginForm onSubmit={handleLoginSubmit} pending={pending} />
            ) : (
               <SignupForm onSubmit={handleSignupSubmit} pending={pending} />
            )}

            <DialogDivider />

            <Button variant="secondary" onClick={handleGoogleLogin}>
               <FcGoogle style={{ fontSize: "20px" }} />
               Login with Google
            </Button>
         </DialogContent>
      </Dialog>
   );
}
