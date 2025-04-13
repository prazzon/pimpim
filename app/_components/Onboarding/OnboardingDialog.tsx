"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter } from "../UI/Dialog/Dialog";
import { Button } from "../UI/Input/Input";
import styles from "./OnboardingDialog.module.scss";

// Icons
import { CgProfile } from "react-icons/cg";
import { FaRegHandPeace } from "react-icons/fa6";
import {
   IoChatbubblesOutline,
   IoChevronBack,
   IoChevronForward,
} from "react-icons/io5";
import { MdOutlineEventNote } from "react-icons/md";
import { PiFilmSlate } from "react-icons/pi";

interface OnboardingDialogProps {
   open: boolean;
   onOpenAction: (open: boolean) => void;
}

export default function OnboardingDialog({
   open,
   onOpenAction,
}: OnboardingDialogProps) {
   const [step, setStep] = useState(1);
   const totalSteps = 5;
   const router = useRouter();

   // Reset step when dialog opens
   useEffect(() => {
      if (open) {
         setStep(1);
      }
   }, [open]);

   const handleNext = () => {
      if (step < totalSteps) {
         setStep(step + 1);
      }
   };

   const handlePrevious = () => {
      if (step > 1) {
         setStep(step - 1);
      }
   };

   const handleSkip = () => {
      onOpenAction(false);
   };

   const handleCustomizeProfile = () => {
      onOpenAction(false);
      router.push("/profile/edit");
   };

   // Content for each step
   const steps = [
      // Step 1
      {
         icon: <FaRegHandPeace />,
         title: "Welcome to PimPim!",
         description:
            "Your new home for discovering great media, connecting with creators and enthusiasts, and staying updated on industry happenings.",
      },
      // Step 2
      {
         icon: <PiFilmSlate />,
         title: "Explore Media & Content",
         description:
            "Dive into curated articles, find your next favorite movie or show with reviews and recommendations, and get insights straight from the industry.",
      },
      // Step 3
      {
         icon: <IoChatbubblesOutline />,
         title: "Join the Conversation",
         description:
            "Engage with the latest news in your feed, share your thoughts in comments, and connect with fellow fans and professionals.",
      },
      // Step 4
      {
         icon: <MdOutlineEventNote />,
         title: "Stay Tuned for Events",
         description:
            "Keep an eye out for exclusive Q&As, virtual screenings, and industry events. Ready to get started?",
      },
      // Step 5
      {
         icon: <CgProfile />,
         title: "Personalize Your PimPim Profile",
         description:
            "You're now a part of the PimPim community. Jump into discovering content, sharing your insights, and connecting with others.",
         additionalContent: (
            <>
               <p className={styles.onboarding_description}>
                  Make your mark on the PimPim community by setting up your
                  profile, add a photo, write a short bio, and set your
                  interests. A complete profile helps others connect with you
                  and enhances your overall experience.
               </p>
            </>
         ),
      },
   ];

   const currentStep = steps[step - 1];

   // Animation variants
   const contentVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
   };

   return (
      <Dialog
         open={open}
         onOpenChange={onOpenAction}
         hasBlur={true}
         closeOnOutsideClick={false}
      >
         <DialogContent>
            {/* Progress indicator */}
            <div className={styles.onboarding_progress}>
               {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                     key={index}
                     className={`${styles.onboarding_progress_dot} ${
                        index + 1 <= step ? styles.active : ""
                     }`}
                  ></div>
               ))}
               <span className={styles.onboarding_progress_text}>
                  {step} of {totalSteps}
               </span>
            </div>

            <AnimatePresence mode="wait">
               <motion.div
                  key={step}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                  className={styles.onboarding_content}
               >
                  <div className={styles.onboarding_icon_container}>
                     <div className={styles.onboarding_icon}>
                        {currentStep.icon}
                     </div>
                  </div>
                  <h2 className={styles.onboarding_title}>
                     {currentStep.title}
                  </h2>
                  <p className={styles.onboarding_description}>
                     {currentStep.description}
                  </p>
                  {currentStep.additionalContent}
               </motion.div>
            </AnimatePresence>

            <DialogFooter>
               <div className={styles.onboarding_footer}>
                  <div>
                     {step > 1 && (
                        <Button
                           variant="secondary"
                           onClick={handlePrevious}
                           style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                           }}
                        >
                           <IoChevronBack /> Back
                        </Button>
                     )}
                  </div>
                  <div className={styles.onboarding_buttons}>
                     <button
                        className={styles.skip_button}
                        onClick={handleSkip}
                     >
                        Skip for now
                     </button>
                     {step < totalSteps ? (
                        <Button
                           onClick={handleNext}
                           style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                           }}
                        >
                           Next <IoChevronForward />
                        </Button>
                     ) : (
                        <Button onClick={handleCustomizeProfile}>
                           My Profile
                        </Button>
                     )}
                  </div>
               </div>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
