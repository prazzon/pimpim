import { v2 as cloudinary } from "cloudinary";

if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
   throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
}

if (!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY) {
   throw new Error("NEXT_PUBLIC_CLOUDINARY_API_KEY is not set");
}

if (!process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET) {
   throw new Error("NEXT_PUBLIC_CLOUDINARY_API_SECRET is not set");
}

cloudinary.config({
   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
   api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary
 * @param image The image file to upload
 * @param uniqueId A unique ID for the image
 * @returns The secure URL of the uploaded image
 */
export async function uploadImage(
   image: File,
   uniqueId: string
): Promise<string> {
   try {
      // Convert the image to a base64 data URI
      const imageData = await image.arrayBuffer();
      const mime = image.type;
      const encoding = "base64";
      const base64Data = Buffer.from(imageData).toString("base64");
      const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(fileUri, {
         folder: "pimpim",
         public_id: `${uniqueId}`,
         overwrite: true,
      });

      console.log("Image uploaded to Cloudinary:", result.secure_url);
      return result.secure_url;
   } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw new Error("Failed to upload image to Cloudinary");
   }
}
