import { z } from "zod";

// Password change schema for users with existing password
export const passwordChangeSchema = z
   .object({
      currentPassword: z
         .string()
         .min(1, { message: "Current password is required" }),
      newPassword: z
         .string()
         .min(1, { message: "New password is required" })
         .min(6, { message: "Password must be at least 6 characters" }),
      confirmPassword: z
         .string()
         .min(1, { message: "Please confirm your new password" }),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
   });

export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

// Password link schema for users without a password (e.g., Google login)
export const passwordLinkSchema = z
   .object({
      newPassword: z
         .string()
         .min(1, { message: "New password is required" })
         .min(6, { message: "Password must be at least 6 characters" }),
      confirmPassword: z
         .string()
         .min(1, { message: "Please confirm your new password" }),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
   });

export type PasswordLinkFormValues = z.infer<typeof passwordLinkSchema>;
