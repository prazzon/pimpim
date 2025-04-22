"use server";

import EmailConfirmation from "@/emails/EmailConfirmation";
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
