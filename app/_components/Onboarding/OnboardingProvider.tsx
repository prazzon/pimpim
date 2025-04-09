"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import OnboardingDialog from "./OnboardingDialog";

interface OnboardingContextType {
   showOnboarding: () => void;
   hideOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
   undefined
);

export function useOnboarding() {
   const context = useContext(OnboardingContext);
   if (!context) {
      throw new Error(
         "useOnboarding must be used within an OnboardingProvider"
      );
   }
   return context;
}

interface OnboardingProviderProps {
   children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
   const [isOpen, setIsOpen] = useState(false);

   const showOnboarding = () => {
      setIsOpen(true);
   };

   const hideOnboarding = () => {
      setIsOpen(false);
   };

   return (
      <OnboardingContext.Provider value={{ showOnboarding, hideOnboarding }}>
         {children}
         <OnboardingDialog open={isOpen} onOpenAction={setIsOpen} />
      </OnboardingContext.Provider>
   );
}
