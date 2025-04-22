"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// const domain = "https://www.pimpim.ng"; // for production
const domain = "http://localhost:3000"; // for testing

export const sendVerificationEmail = async (email: string, token: string) => {
   const confirmationLink = `${domain}/verify-email?token=${token}`;

   const { error } = await resend.emails.send({
      from: "onboarding@pimpim.ng",
      to: email,
      subject: "Verify your email",
      html: `<p>Click <a href="${confirmationLink}">here</a> to verify your email.</p>`,
   });

   if (error) {
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
