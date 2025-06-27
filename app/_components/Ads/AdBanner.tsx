"use client";

import { useEffect } from "react";

type Props = {
   dataAdSlot: string;
   dataAdFormat: string;
   dataAdClient: string;
   dataFullWidthResponsive: boolean;
   className?: string;
};

export default function AdBanner({
   dataAdSlot,
   dataAdFormat,
   dataAdClient,
   dataFullWidthResponsive,
   className,
}: Props) {
   useEffect(() => {
      try {
         (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
         console.error("Error loading Google AdSense:", error);
      }
   }, []);

   return (
      <ins
         className={`adsbygoogle ${className}`}
         style={{ display: "block" }}
         // data-ad-client="ca-pub-7227150050392511"
         // data-ad-slot="5010019560"
         // data-ad-format="auto"
         // data-full-width-responsive="true"
         data-ad-client={dataAdClient}
         data-ad-slot={dataAdSlot}
         data-ad-format={dataAdFormat}
         data-full-width-responsive={dataFullWidthResponsive.toString()}
      ></ins>
   );
}
