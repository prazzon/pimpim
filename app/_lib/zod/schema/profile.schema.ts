import { z } from "zod";

// Profile edit form schema
export const profileEditSchema = z.object({
   displayName: z.string().min(1, { message: "Display name is required" }),
   firstName: z.string().optional(),
   lastName: z.string().optional(),
   email: z.string().email({ message: "Invalid email address" }).optional(),
   phone: z.string().optional(),
   location: z.string().optional(),
   occupation: z.string().optional(),
   bio: z.string().optional(),
   dateOfBirth: z.string().optional(),
   isPrivate: z.boolean().optional().default(false),
   // Social links
   instagram: z
      .string()
      .url({ message: "Invalid URL" })
      .optional()
      .or(z.literal("")),
   facebook: z
      .string()
      .url({ message: "Invalid URL" })
      .optional()
      .or(z.literal("")),
   youtube: z
      .string()
      .url({ message: "Invalid URL" })
      .optional()
      .or(z.literal("")),
   tiktok: z
      .string()
      .url({ message: "Invalid URL" })
      .optional()
      .or(z.literal("")),
   twitter: z
      .string()
      .url({ message: "Invalid URL" })
      .optional()
      .or(z.literal("")),
   // Portfolio links
   behance: z
      .string()
      .url({ message: "Invalid URL" })
      .optional()
      .or(z.literal("")),
   dribbble: z
      .string()
      .url({ message: "Invalid URL" })
      .optional()
      .or(z.literal("")),
   linkedin: z
      .string()
      .url({ message: "Invalid URL" })
      .optional()
      .or(z.literal("")),
   website: z
      .string()
      .url({ message: "Invalid URL" })
      .optional()
      .or(z.literal("")),
});

export type ProfileEditFormValues = z.infer<typeof profileEditSchema>;
