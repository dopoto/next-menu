"use client";

import React from 'react';
import { type ComponentRef, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<ComponentRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="m-7 h-screen w-screen rounded border-2 border-gray-300 bg-gray-200"
      onClose={onDismiss}
    >
      {children}
      <button onClick={onDismiss} className="close-button" />
      
    </dialog>,
    document.getElementById("modal-root")!,
  );
}
