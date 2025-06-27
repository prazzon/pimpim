"use client";

import { useEffect } from "react";

type Props = {
   dataAdSlot: string;
   dataAdClient: string;
   className?: string;
};

export default function AdBanner({
   dataAdSlot,
   dataAdClient,
   className,
}: Props) {
   useEffect(() => {
      try {
         // Check if window.adsbygoogle exists before pushing
         if (window.adsbygoogle) {
            window.adsbygoogle.push({});
         } else {
            console.warn("AdSense script not loaded yet.");
         }
      } catch (e) {
         console.error("AdSense push error:", e);
      }
   }, []);

   return (
      <ins
         className={`adsbygoogle ${className}`}
         style={{ display: "block" }}
         // data-ad-client="ca-pub-7227150050392511"
         // data-ad-slot="5010019560"
         data-ad-client={dataAdClient}
         data-ad-slot={dataAdSlot}
         data-ad-format="auto"
         data-full-width-responsive="true"
      ></ins>
   );
}
