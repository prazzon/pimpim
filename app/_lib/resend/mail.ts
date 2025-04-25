"use server";

import EmailConfirmation from "@/emails/EmailConfirmation";
import PasswordReset from "@/emails/PasswordReset";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = "https://www.pimpim.ng";

export const sendVerificationEmail = async (email: string, token: string) => {
   const confirmationLink = `${domain}/verify-email?token=${token}`;

   const { error } = await resend.emails.send({
      from: "PimPim <pimpim@pimpim.ng>",
      to: email,
      subject: "Verify your email",
      react: EmailConfirmation({ confirmationLink }),
   });

   if (error) {
      console.error("Email Verification error:", error);
      return {
         success: false,
         error: "Email Verification error, please try again later.",
      };
   }

   return {
      success: true,
      message: "Email sent successfully",
   };
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
   const resetLink = `${domain}/reset-password?token=${token}`;

   const { error } = await resend.emails.send({
      from: "PimPim <pimpim@pimpim.ng>",
      to: email,
      subject: "Reset your password",
      react: PasswordReset({ resetLink }),
   });

   if (error) {
      console.error("Password Reset Email error:", error);
      return {
         success: false,
         error: "Password Reset Email error, please try again later.",
      };
   }

   return {
      success: true,
      message: "Email sent successfully",
   };
};
