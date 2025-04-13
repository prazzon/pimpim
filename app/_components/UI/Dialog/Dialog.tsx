"use client";

import type React from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
   createContext,
   useContext,
   useEffect,
   useState,
   type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import styles from "./Dialog.module.scss";

// Context for Dialog
type DialogContextType = {
   isOpen: boolean;
   onOpen: () => void;
   onClose: () => void;
   hasBlur?: boolean;
   closeOnOutsideClick?: boolean;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

// Dialog Root Component
interface DialogProps {
   children: ReactNode;
   open?: boolean;
   onOpenChange?: (open: boolean) => void;
   hasBlur?: boolean;
   closeOnOutsideClick?: boolean;
}

export function Dialog({
   children,
   open,
   onOpenChange,
   hasBlur = false,
   closeOnOutsideClick = true,
}: DialogProps) {
   const [isOpen, setIsOpen] = useState(open || false);

   // Sync internal state with external control
   useEffect(() => {
      if (open !== undefined) {
         setIsOpen(open);
      }
   }, [open]);

   // Prevent body scrolling when dialog is open
   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = "hidden";
      }

      return () => {
         document.body.style.overflow = "";
      };
   }, [isOpen]);

   const onOpen = () => {
      setIsOpen(true);
      onOpenChange?.(true);
   };

   const onClose = () => {
      setIsOpen(false);
      onOpenChange?.(false);
   };

   return (
      <DialogContext.Provider
         value={{ isOpen, onOpen, onClose, hasBlur, closeOnOutsideClick }}
      >
         {children}
      </DialogContext.Provider>
   );
}

// Dialog Trigger Component
interface DialogTriggerProps {
   children: ReactNode;
   asChild?: boolean;
}

export function DialogTrigger({
   children,
   asChild = false,
}: DialogTriggerProps) {
   const context = useContext(DialogContext);

   if (!context) {
      throw new Error("DialogTrigger must be used within a Dialog");
   }

   const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      context.onOpen();
   };

   if (asChild) {
      return <div onClick={handleClick}>{children}</div>;
   }

   return <div onClick={handleClick}>{children}</div>;
}

// Dialog Content Component
interface DialogContentProps {
   children: ReactNode;
   onInteractOutside?: () => void;
}

export function DialogContent({
   children,
   onInteractOutside,
}: DialogContentProps) {
   const context = useContext(DialogContext);
   const [mounted, setMounted] = useState(false);

   // Handle client-side mounting
   useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
   }, []);

   if (!context) {
      throw new Error("DialogContent must be used within a Dialog");
   }

   const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && context.closeOnOutsideClick) {
         context.onClose();
         onInteractOutside?.();
      }
   };

   const overlayVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
   };

   const contentVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: {
         opacity: 1,
         y: 0,
         transition: { duration: 0.2 },
      },
   };

   // Don't render anything on the server
   if (!mounted) return null;

   // Use createPortal to render the dialog directly to the body
   return createPortal(
      <AnimatePresence mode="wait">
         {context.isOpen && (
            <motion.div
               className={`${styles.dialog_overlay} ${
                  context.hasBlur ? styles.blur_overlay : ""
               }`}
               initial="hidden"
               animate="visible"
               exit="hidden"
               variants={overlayVariants}
               onClick={handleOverlayClick}
            >
               <motion.div
                  className={styles.dialog_content}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  onClick={(e) => e.stopPropagation()}
               >
                  <button
                     className={styles.dialog_close}
                     onClick={context.onClose}
                     aria-label="Close"
                  >
                     <IoMdClose />
                  </button>
                  {children}
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>,
      document.body
   );
}

// Dialog Header Component
interface DialogHeaderProps {
   children: ReactNode;
}

export function DialogHeader({ children }: DialogHeaderProps) {
   return <div className={styles.dialog_header}>{children}</div>;
}

// Dialog Title Component
interface DialogTitleProps {
   children: ReactNode;
}

export function DialogTitle({ children }: DialogTitleProps) {
   return <h2 className={styles.dialog_title}>{children}</h2>;
}

// Dialog Description Component
interface DialogDescriptionProps {
   children: ReactNode;
}

export function DialogDescription({ children }: DialogDescriptionProps) {
   return <p className={styles.dialog_description}>{children}</p>;
}

// Dialog Footer Component
interface DialogFooterProps {
   children: ReactNode;
}

export function DialogFooter({ children }: DialogFooterProps) {
   return <div className={styles.dialog_footer}>{children}</div>;
}

// Dialog Divider Component
interface DialogDividerProps {
   children?: ReactNode;
}

export function DialogDivider({ children = "Or" }: DialogDividerProps) {
   return <div className={styles.dialog_divider}>{children}</div>;
}

// Dialog Logo Component
interface DialogLogoProps {
   children: ReactNode;
}

export function DialogLogo({ children }: DialogLogoProps) {
   return <div className={styles.dialog_logo}>{children}</div>;
}
