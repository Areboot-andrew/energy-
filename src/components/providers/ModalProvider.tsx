"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import ContactModal from "@/components/ui/ContactModal";

interface ModalContextType {
  openContactModal: (price?: number) => void;
  closeContactModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialPrice, setInitialPrice] = useState<number | undefined>(undefined);

  const openContactModal = (price?: number) => {
    setInitialPrice(price);
    setIsOpen(true);
  };

  const closeContactModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ openContactModal, closeContactModal }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={closeContactModal} initialPrice={initialPrice} />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};
