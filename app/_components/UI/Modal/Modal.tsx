"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
   ButtonHTMLAttributes,
   cloneElement,
   createContext,
   ReactElement,
   ReactNode,
   useContext,
   useEffect,
   useState,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";
import { IoMdClose } from "react-icons/io";

const container = {
   exit: { opacity: 0, transition: { duration: 0.3 } },
};

const modal = {
   hidden: { opacity: 0, y: 30 },
   visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
   exit: { opacity: 0, y: 30 },
};

interface Context {
   showModal: boolean;
   openModal: () => void;
   closeModal: () => void;
}

const ModalContext = createContext<Context | null>(null);

type Props = {
   children: ReactNode;
   closeFn?: () => void;
};

function Modal({ children, closeFn }: Props) {
   const [showModal, setShowModal] = useState(false);

   const openModal = () => setShowModal(true);

   const closeModal = () => {
      setShowModal(false);
      closeFn?.();
   };

   return (
      <ModalContext.Provider value={{ showModal, openModal, closeModal }}>
         {children}
      </ModalContext.Provider>
   );
}

export function OpenBtn({
   children,
}: {
   children: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>;
}) {
   const { openModal } = useContext(ModalContext) as Context;

   return cloneElement(children, { onClick: () => openModal() });
}

export function Content({ children }: { children: ReactNode }) {
   const { showModal, closeModal } = useContext(ModalContext) as Context;

   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
   }, []);

   if (!mounted) return null;

   return createPortal(
      <AnimatePresence>
         {showModal && (
            <motion.div
               key="modal"
               className={styles.container}
               variants={container}
               initial="hidden"
               animate="visible"
               exit="exit"
            >
               <motion.div
                  className={styles.modal}
                  variants={modal}
                  layout
                  transition={{ duration: 0.2 }}
               >
                  <button className={styles.close__btn} onClick={closeModal}>
                     <IoMdClose />
                  </button>
                  {children}
               </motion.div>
               <motion.div
                  className={styles.overlay}
                  onClick={closeModal}
               ></motion.div>
            </motion.div>
         )}
      </AnimatePresence>,
      document.body
   );
}

export default Modal;
