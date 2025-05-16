"use client";

import { useEffect, useRef } from "react";

interface PostContentProps {
   content: string;
   className?: string;
}

export default function PostContent({ content, className }: PostContentProps) {
   const contentRef = useRef<HTMLDivElement>(null);

   // Function to load Instagram embeds
   const loadInstagramEmbeds = () => {
      if (window.instgrm) {
         window.instgrm.Embeds.process();
      } else if (contentRef.current?.querySelector(".instagram-media")) {
         // If Instagram embed exists but script hasn't loaded yet, load it
         const script = document.createElement("script");
         script.async = true;
         script.src = "//www.instagram.com/embed.js";
         script.onload = () => {
            if (window.instgrm) {
               window.instgrm.Embeds.process();
            }
         };
         document.body.appendChild(script);
      }
   };

   // Function to load Twitter embeds
   const loadTwitterEmbeds = () => {
      if (window.twttr) {
         window.twttr.widgets.load(contentRef.current);
      } else if (contentRef.current?.querySelector(".twitter-tweet")) {
         // If Twitter embed exists but script hasn't loaded yet, load it
         const script = document.createElement("script");
         script.async = true;
         script.src = "https://platform.twitter.com/widgets.js";
         script.charset = "utf-8";
         script.onload = () => {
            if (window.twttr) {
               window.twttr.widgets.load(contentRef.current);
            }
         };
         document.body.appendChild(script);
      }
   };

   useEffect(() => {
      // Initialize embeds when component mounts or content changes
      loadInstagramEmbeds();
      loadTwitterEmbeds();

      // Re-initialize embeds when window is resized (helps with responsive embeds)
      const handleResize = () => {
         loadInstagramEmbeds();
         loadTwitterEmbeds();
      };

      window.addEventListener("resize", handleResize);

      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, [content]);

   return (
      <div
         ref={contentRef}
         className={className}
         dangerouslySetInnerHTML={{ __html: content }}
      />
   );
}
