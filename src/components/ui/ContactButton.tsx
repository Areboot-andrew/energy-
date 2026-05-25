"use client";

import { useModal } from "@/components/providers/ModalProvider";

export default function ContactButton({ 
  className, 
  children,
  price
}: { 
  className?: string;
  children: React.ReactNode;
  price?: number;
}) {
  const { openContactModal } = useModal();
  
  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        openContactModal(price);
      }} 
      className={className}
    >
      {children}
    </button>
  );
}
