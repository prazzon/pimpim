"use client";

import { Dialog, DialogContent } from "../Dialog/Dialog";
import Loader from "../Loader/Loader";
import styles from "./AlertDialog.module.scss";

interface AlertDialogProps {
   open: boolean;
   onOpenChangeAction: (open: boolean) => void;
   title: string;
   description: string;
   cancelText?: string;
   confirmText?: string;
   onCancelAction?: () => void;
   onConfirmAction: () => void;
   isConfirmLoading?: boolean;
   isDanger?: boolean;
}

export function AlertDialog({
   open,
   onOpenChangeAction,
   title,
   description,
   cancelText = "Cancel",
   confirmText = "Confirm",
   onCancelAction,
   onConfirmAction,
   isConfirmLoading = false,
   isDanger = false,
}: AlertDialogProps) {
   const handleCancel = () => {
      onOpenChangeAction(false);
      if (onCancelAction) onCancelAction();
   };

   return (
      <Dialog
         open={open}
         onOpenChange={onOpenChangeAction}
         preventFullScreen={true}
      >
         <DialogContent>
            <div className={styles.alert_dialog}>
               <h3 className={styles.alert_dialog_title}>{title}</h3>
               <p className={styles.alert_dialog_description}>{description}</p>
               <div className={styles.alert_dialog_actions}>
                  <button
                     className={`${styles.alert_dialog_button} ${styles.cancel_button}`}
                     onClick={handleCancel}
                  >
                     {cancelText}
                  </button>
                  <button
                     className={`${styles.alert_dialog_button} ${
                        isDanger ? styles.danger_button : styles.confirm_button
                     }`}
                     onClick={onConfirmAction}
                     disabled={isConfirmLoading}
                  >
                     {isConfirmLoading ? <Loader /> : confirmText}
                  </button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
