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
        className="w-full sm:max-w-5xl sm:min-w-[1000px] sm:min-h-[517px] self-start space-x-0 space-y-0 pb-4 rounded-[32px] flex flex-col font-sans"
        showCloseButton={false}
      // ✅ Remove z-10, let Dialog handle z-index (usually z-50 by default)
      // ✅ Add forceMount to ensure it renders immediately
      >
        <DialogHeader className="flex flex-col gap-3 pt-12 pl-12 md:pl-20 pr-10 text-left sm:text-left">
          <DialogTitle className="bg-gradient-to-l from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent font-semibold text-3xl md:text-4xl">
            Wallet Successfully connected.
          </DialogTitle>
          <DialogDescription className="font-normal text-[#10182880] text-[18px] leading-relaxed">
            Checking for your DAOs involvement, and detecting your governance
            power in those DAOs too.
          </DialogDescription>
        </DialogHeader>
        <section className="flex-1 flex flex-col items-center justify-center py-6 text-[#10182880] font-normal text-[16px]">
          <span>Please wait, It happens in seconds!</span>
          <span className="block bg-gradient-to-l from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent py-0 text-[128px] cursor-default font-medium">
            {countdown}
          </span>
          <span>To go!</span>
        </section>
      </DialogContent>
    </Dialog>
  );
}