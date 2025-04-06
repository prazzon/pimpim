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
      const isPassword = type === "password";

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

// ForgotPassword Component
interface ForgotPasswordProps {
   href?: string;
   children?: React.ReactNode;
}

export function ForgotPassword({
   href = "#",
   children = "Forgot password?",
}: ForgotPasswordProps) {
   return (
      <a href={href} className={styles.forgot_password}>
         {children}
      </a>
   );
}

// Tab Component
interface TabProps {
   tabs: string[];
   activeTab: number;
   onChange: (index: number) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabProps) {
   return (
      <div className={styles.tab_group}>
         {tabs.map((tab, index) => (
            <div
               key={index}
               className={`${styles.tab} ${
                  activeTab === index ? styles.active : ""
               }`}
               onClick={() => onChange(index)}
            >
               {tab}
            </div>
         ))}
      </div>
   );
}
