import { Metadata } from "next";

type MetadataProps = {
   title: string;
   description: string;
   keywords?: string[];
   image?: string;
   type?: "website" | "article" | "movie" | "tv_show" | "event";
   url?: string;
   publishedTime?: string;
   modifiedTime?: string;
   authors?: string[];
   section?: string;
   tags?: string[];
};

export function generateMetadata({
   title,
   description,
   keywords = [],
   image = "/images/og-image.jpg",
   type = "website",
   url = "",
   publishedTime,
   modifiedTime,
   authors = [],
   section,
   tags = [],
}: MetadataProps): Metadata {
   // Base metadata
   const metadata: Metadata = {
      title,
      description,
      keywords: keywords,
      alternates: {
         canonical: url,
      },
   };

   // Only "website" or "article" are valid for openGraph.type
   const openGraphType: "website" | "article" =
      type === "article" ? "article" : "website";

   // OpenGraph metadata
   metadata.openGraph = {
      title,
      description,
      url,
      siteName: "PimPim",
      locale: "en_US",
      type: openGraphType,
   };

   // Add image if provided
   if (image) {
      metadata.openGraph!.images = [
         {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
         },
      ];
      metadata.twitter = {
         card: "summary_large_image",
         title,
         description,
         images: [image],
      };
   }

   // Add article specific metadata
   if (type === "article" && publishedTime) {
      // @ts-expect-error: openGraph may be undefined, but we ensure it's set above
      metadata.openGraph!.publishedTime = publishedTime;

      if (modifiedTime) {
         // @ts-expect-error: openGraph may be undefined, but we ensure it's set above
         metadata.openGraph!.modifiedTime = modifiedTime;
      }

      if (authors.length > 0) {
         // @ts-expect-error: openGraph may be undefined, but we ensure it's set above
         metadata.openGraph!.authors = authors;
      }

      if (section) {
         // @ts-expect-error: openGraph may be undefined, but we ensure it's set above
         metadata.openGraph!.section = section;
      }

      if (tags.length > 0) {
         // @ts-expect-error: openGraph may be undefined, but we ensure it's set above
         metadata.openGraph!.tags = tags;
      }
   }

   return metadata;
}
