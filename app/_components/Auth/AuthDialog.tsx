"use client";

import {
   LoginFormValues,
   SignupFormValues,
} from "@/app/_lib/zod/schema/auth.schema";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
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

   const handleLoginSubmit = (data: LoginFormValues) => {
      console.log("Login form submitted:", data);
      // Add your login logic here
   };

   const handleSignupSubmit = (data: SignupFormValues) => {
      console.log("Signup form submitted:", data);
      // Add your signup logic here
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

            {activeTab === 0 ? (
               <LoginForm onSubmit={handleLoginSubmit} />
            ) : (
               <SignupForm onSubmit={handleSignupSubmit} />
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
