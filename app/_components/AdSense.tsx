"use client";

import Script from "next/script";

type Props = {
   pId: string;
};
function AdSense({ pId }: Props) {
   return (
      <Script
         async
         src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
         crossOrigin="anonymous"
      />
   );
}

export default AdSense;
