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

// Forgot password schema (email only)
export const forgotPasswordSchema = z.object({
   email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// Reset password schema (new password and confirmation)
export const resetPasswordSchema = z
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

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
