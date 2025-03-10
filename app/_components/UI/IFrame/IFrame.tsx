"use client";

import { useState } from "react";
import Spinner from "../Spinner/Spinner";

function convertLinkToEmbed(link: string) {
   return link
      .replace(/https:\/\/youtu\.be\//g, "https://youtube.com/embed/")
      .replace(
         /https:\/\/www\.youtube\.com\/watch\?v=/g,
         "https://youtube.com/embed/"
      );
}

function IFrame({ link }: { link: string }) {
   const [isLoading, setIsLoading] = useState(true);

   const embedLink = convertLinkToEmbed(link);

   return (
      <>
         {isLoading ? <Spinner /> : null}

         <iframe
            width="100%"
            height="100%"
            style={{ display: isLoading ? "none" : "block" }}
            src={embedLink}
            onLoad={() => setIsLoading(false)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
         ></iframe>
      </>
   );
}

export default IFrame;
