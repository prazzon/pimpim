import { z } from "zod";

// Login form schema
export const loginSchema = z.object({
   email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
   password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
   rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Signup form schema
export const signupSchema = z
   .object({
      username: z
         .string()
         .min(1, { message: "Username is required" })
         .min(2, { message: "Username must be at least 2 characters" }),
      email: z
         .string()
         .min(1, { message: "Email is required" })
         .email({ message: "Invalid email address" }),
      password: z
         .string()
         .min(1, { message: "Password is required" })
         .min(6, { message: "Password must be at least 6 characters" }),
      confirmPassword: z
         .string()
         .min(1, { message: "Please confirm your password" }),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
   });

export type SignupFormValues = z.infer<typeof signupSchema>;
