"use client";

import React, { useRef, useState } from "react";
import { FaImage, FaUpload } from "react-icons/fa";
import styles from "./ImageInput.module.scss";

interface ImageInputProps {
   id: string;
   accept?: string;
   onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
   error?: string;
   selectedFileName?: string;
}

export default function ImageInput({
   id,
   accept = "image/*",
   onChangeAction,
   error,
   selectedFileName,
}: ImageInputProps) {
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [fileName, setFileName] = useState(selectedFileName || "");

   const handleClick = () => {
      fileInputRef.current?.click();
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setFileName(file.name);
      } else {
         setFileName("");
      }
      onChangeAction(e);
   };

   return (
      <div className={styles.image_input_container}>
         <input
            ref={fileInputRef}
            type="file"
            id={id}
            accept={accept}
            onChange={handleChange}
            className={styles.hidden_input}
         />

         <button
            type="button"
            onClick={handleClick}
            className={styles.select_button}
         >
            <FaUpload className={styles.icon} />
            Choose image
         </button>

         {fileName && (
            <div className={styles.file_info}>
               <FaImage className={styles.file_icon} />
               <span className={styles.file_name}>{fileName}</span>
            </div>
         )}

         {error && <p className={styles.error_message}>{error}</p>}
      </div>
   );
}
