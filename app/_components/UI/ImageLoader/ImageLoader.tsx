"use client";

import Image from "next/image";
import { useState } from "react";
import Spinner from "../Spinner/Spinner";

type Props = {
   src: string;
   alt: string;
};

function ImageLoader({ src, alt }: Props) {
   const [loaded, setLoaded] = useState(false);

   return (
      <>
         {!loaded ? <Spinner /> : null}

         <Image
            src={src}
            alt={alt}
            fill
            onLoad={() => setLoaded(true)}
            style={{ visibility: !loaded ? "hidden" : "visible" }}
         />
      </>
   );
}

export default ImageLoader;
