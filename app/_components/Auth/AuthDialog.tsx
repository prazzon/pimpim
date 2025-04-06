"use client";

import Logo from "@/public/logo.svg";
import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMail } from "react-icons/io5";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogDivider,
   DialogHeader,
   DialogLogo,
   DialogTitle,
} from "../UI/Dialog/Dialog";
import {
   Button,
   Checkbox,
   ForgotPassword,
   Input,
   Tabs,
} from "../UI/Input/Input";

interface AuthDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
   const [activeTab, setActiveTab] = useState(0);
   const [loginForm, setLoginForm] = useState({
      email: "",
      password: "",
      rememberMe: false,
   });

   const [signupForm, setSignupForm] = useState({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
   });

   const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setLoginForm({
         ...loginForm,
         [name]: type === "checkbox" ? checked : value,
      });
   };

   const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSignupForm({
         ...signupForm,
         [name]: value,
      });
   };

   const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Login form submitted:", loginForm);
      // Add your login logic here
   };

   const handleSignupSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Signup form submitted:", signupForm);
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
               <form onSubmit={handleLoginSubmit}>
                  <Input
                     label="Email"
                     type="email"
                     name="email"
                     placeholder="hi@yourcompany.com"
                     value={loginForm.email}
                     onChange={handleLoginChange}
                     required
                     icon={<IoMail />}
                  />
                  <Input
                     label="Password"
                     type="password"
                     name="password"
                     placeholder="Enter your password"
                     value={loginForm.password}
                     onChange={handleLoginChange}
                     required
                     icon={<FaLock />}
                  />
                  <div
                     style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                     }}
                  >
                     <Checkbox
                        label="Remember me"
                        name="rememberMe"
                        checked={loginForm.rememberMe}
                        onChange={handleLoginChange}
                     />
                     <ForgotPassword />
                  </div>
                  <Button type="submit">Sign in</Button>
               </form>
            ) : (
               <form onSubmit={handleSignupSubmit}>
                  <Input
                     label="Full Name"
                     type="text"
                     name="fullName"
                     placeholder="John Doe"
                     value={signupForm.fullName}
                     onChange={handleSignupChange}
                     required
                     icon={<FaUser />}
                  />
                  <Input
                     label="Email"
                     type="email"
                     name="email"
                     placeholder="hi@yourcompany.com"
                     value={signupForm.email}
                     onChange={handleSignupChange}
                     required
                     icon={<IoMail />}
                  />
                  <Input
                     label="Password"
                     type="password"
                     name="password"
                     placeholder="Create a password"
                     value={signupForm.password}
                     onChange={handleSignupChange}
                     required
                     icon={<FaLock />}
                  />
                  <Input
                     label="Confirm Password"
                     type="password"
                     name="confirmPassword"
                     placeholder="Confirm your password"
                     value={signupForm.confirmPassword}
                     onChange={handleSignupChange}
                     required
                     icon={<FaLock />}
                     error={
                        signupForm.confirmPassword &&
                        signupForm.password !== signupForm.confirmPassword
                           ? "Passwords do not match"
                           : ""
                     }
                  />
                  <Button style={{ marginTop: "20px" }} type="submit">
                     Create account
                  </Button>
               </form>
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
