"use client";

import type React from "react";

import { forwardRef, useState, type ReactNode } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./Input.module.scss";

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   label?: string;
   error?: string;
   icon?: ReactNode;
   rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
   (
      { label, error, className, type = "text", icon, rightIcon, ...props },
      ref
   ) => {
      const [showPassword, setShowPassword] = useState(false);
      const [fileName, setFileName] = useState("");
      const isPassword = type === "password";
      const isFileInput = type === "file";

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0];
         setFileName(file ? file.name : "");

         // Call the original onChange handler if it exists
         if (props.onChange) {
            props.onChange(e);
         }
      };

      // For file inputs, we'll create a custom styled component
      if (isFileInput) {
         return (
            <div className={styles.form_group}>
               {label && <label className={styles.label}>{label}</label>}
               <div className={styles.file_input_container}>
                  <input
                     ref={ref}
                     type="file"
                     className={styles.file_input}
                     id={props.id || "file-input"}
                     onChange={handleFileChange}
                     {...props}
                  />
                  <div className={styles.file_input_wrapper}>
                     <button
                        type="button"
                        className={styles.choose_file_btn}
                        onClick={() =>
                           document
                              .getElementById(props.id || "file-input")
                              ?.click()
                        }
                     >
                        Choose File
                     </button>
                     <span className={styles.file_name}>
                        {fileName || "No file chosen"}
                     </span>
                  </div>
               </div>
               {error && <p className={styles.error_message}>{error}</p>}
            </div>
         );
      }

      // For regular inputs
      return (
         <div className={styles.form_group}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.input_wrapper}>
               {icon && <span className={styles.icon}>{icon}</span>}
               <input
                  ref={ref}
                  type={isPassword && showPassword ? "text" : type}
                  className={`${styles.input}
                      ${error ? styles.error : ""}
                      ${icon ? styles.with_left_icon : ""}
                      ${rightIcon || isPassword ? styles.with_right_icon : ""}
                      ${className || ""}`}
                  {...props}
               />
               {isPassword && (
                  <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className={styles.right_icon}
                     aria-label={
                        showPassword ? "Hide password" : "Show password"
                     }
                  >
                     {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
               )}
               {rightIcon && !isPassword && (
                  <span className={styles.right_icon}>{rightIcon}</span>
               )}
            </div>
            {error && <p className={styles.error_message}>{error}</p>}
         </div>
      );
   }
);

Input.displayName = "Input";

// Checkbox Component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
   label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
   ({ label, className, ...props }, ref) => {
      return (
         <div className={styles.checkbox_group}>
            <input
               ref={ref}
               type="checkbox"
               className={`${styles.checkbox} ${className || ""}`}
               id={`checkbox-${label}`}
               {...props}
            />
            <label
               htmlFor={`checkbox-${label}`}
               className={styles.checkbox_label}
            >
               {label}
            </label>
         </div>
      );
   }
);

Checkbox.displayName = "Checkbox";

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   variant?: "primary" | "secondary";
   children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
   ({ variant = "primary", className, children, ...props }, ref) => {
      return (
         <button
            ref={ref}
            className={`${styles.button} ${styles[variant]} ${className || ""}`}
            {...props}
         >
            {children}
         </button>
      );
   }
);

Button.displayName = "Button";

// Textarea Component
interface TextareaProps
   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
   label?: string;
   error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
   ({ label, error, className, ...props }, ref) => {
      return (
         <div className={styles.form_group}>
            {label && <label className={styles.label}>{label}</label>}
            <textarea
               ref={ref}
               className={`${styles.textarea} ${error ? styles.error : ""} ${
                  className || ""
               }`}
               {...props}
            />
            {error && <div className={styles.error_message}>{error}</div>}
         </div>
      );
   }
);

Textarea.displayName = "Textarea";

// ForgotPassword Component
interface ForgotPasswordProps {
   href?: string;
   children?: React.ReactNode;
   onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function ForgotPassword({
   href = "#",
   children = "Forgot password?",
   onClick,
}: ForgotPasswordProps) {
   return (
      <a href={href} className={styles.forgot_password} onClick={onClick}>
         {children}
      </a>
   );
}

// Tab Component
interface TabProps {
   tabs: string[];
   activeTab: number;
   onChangeAction: (index: number) => void;
}

export function Tabs({ tabs, activeTab, onChangeAction }: TabProps) {
   return (
      <div className={styles.tab_group}>
         {tabs.map((tab, index) => (
            <div
               key={index}
               className={`${styles.tab} ${
                  activeTab === index ? styles.active : ""
               }`}
               onClick={() => onChangeAction(index)}
            >
               {tab}
            </div>
         ))}
      </div>
   );
}
