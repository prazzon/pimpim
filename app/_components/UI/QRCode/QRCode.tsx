"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import QRCodeLib from "react-qr-code";
import styles from "./QRCode.module.scss";

interface QRCodeProps {
   value: string;
   size?: number;
   logoSize?: number;
}

export default function QRCode({
   value,
   size = 200,
   logoSize = 50,
}: QRCodeProps) {
   const [mounted, setMounted] = useState(false);
   const qrCodeRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return (
         <div
            className={styles.qr_placeholder}
            style={{ width: size, height: size }}
         />
      );
   }

   return (
      <div
         className={styles.qr_container}
         ref={qrCodeRef}
         style={{ width: size, height: size }}
      >
         <QRCodeLib
            value={value}
            size={size}
            level="H" // High error correction to allow for logo
            className={styles.qr_code}
         />
         <div
            className={styles.logo_container}
            style={{
               width: logoSize,
               height: logoSize,
               left: `calc(50% - ${logoSize / 2}px)`,
               top: `calc(50% - ${logoSize / 2}px)`,
            }}
         >
            <Image
               src="/logo.png"
               alt="PimPim Logo"
               width={logoSize}
               height={logoSize}
               className={styles.logo}
            />
         </div>
      </div>
   );
}
