"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useWalletAuth } from "@/hooks/use-wallet-auth";

export default function SuccessfulWalletModal() {
  const { successfulWalletModalOpen, setSuccessfulWalletModalOpen, countdown } =
    useWalletAuth();

  // ✅ Add debug logging
  React.useEffect(() => {
    console.log("🎨 [SuccessfulWalletModal] Render - open:", successfulWalletModalOpen, "countdown:", countdown);
  }, [successfulWalletModalOpen, countdown]);

  return (
    <Dialog
      open={successfulWalletModalOpen}
      onOpenChange={setSuccessfulWalletModalOpen}
    >
      <DialogContent
        className="w-screen max-w-4xl self-start space-x-0 space-y-0 pb-4"
        showCloseButton={false}
      // ✅ Remove z-10, let Dialog handle z-index (usually z-50 by default)
      // ✅ Add forceMount to ensure it renders immediately
      >
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="bg-gradient-to-r from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent font-semibold text-3xl">
            Wallet Successfully connected.
          </DialogTitle>
          <DialogDescription className="font-normal text-[#101828B2] text-lg leading-[100%]">
            Checking for your DAOs involvement, and detecting your governance
            power in those DAOs too.
          </DialogDescription>
        </DialogHeader>
        <section className="flex flex-col items-center py-12 text-[#101828B2] font-medium text-base">
          <span>Please wait, It happens in seconds!</span>
          <span className="block bg-gradient-to-r from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent py-3.5 text-[128px] cursor-pointer">
            {countdown}
          </span>
          <span>To go!</span>
        </section>
      </DialogContent>
    </Dialog>
  );
}