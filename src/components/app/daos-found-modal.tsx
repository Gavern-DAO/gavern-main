"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { useQueryClient } from "@tanstack/react-query";
import { UserDaosResponse } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import { XIcon } from "lucide-react";

interface DaoItem {
  imageUrl?: string;
  realmName?: string;
  tokenMetadata?: {
    symbol?: string;
  } | null;
  governingTokenDepositAmount?: string;
  [key: string]: unknown;
}

export default function DaosFoundModal() {
  const { daosFoundModalOpen, setDaosFoundModalOpen } = useWalletAuth();
  const queryClient = useQueryClient();

  // Get cached data from the unified query
  const cachedData = queryClient.getQueryData<UserDaosResponse>(["userDaos"]);

  const handleGoToDashboard = () => {
    setDaosFoundModalOpen(false);
  };

  // Use cached data, default to empty if not available
  const finalDaosData: UserDaosResponse = cachedData || { count: 0, result: [] };

  // Don't render if modal is not open
  if (!daosFoundModalOpen) {
    return null;
  }

  const count = finalDaosData.count;
  const hasDaos = count > 0;

  return (
    <Dialog open={daosFoundModalOpen} onOpenChange={setDaosFoundModalOpen}>
      <DialogContent
        className="w-full sm:max-w-5xl sm:min-w-[1000px] self-start p-0 pb-10 rounded-[32px] flex flex-col font-sans bg-white dark:bg-[#0A0A0A] border-none [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#010101]"
        showCloseButton={false}
      >
        <div className="relative flex flex-col w-full h-full">
          {/* Close Button positioned at the far right, same line as heading */}
          <DialogClose className="absolute top-12 right-12 md:right-20 z-50 text-[#10182880] dark:text-[#A1A1A1] hover:text-[#101828] dark:hover:text-white transition-colors">
            <XIcon size={24} />
          </DialogClose>
          <DialogHeader className="flex flex-col gap-3 pt-12 pl-16 md:pl-24 pr-24 md:pr-32 text-left sm:text-left">
            <DialogTitle className="bg-gradient-to-l from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent font-semibold text-[32px] leading-tight">
              {hasDaos
                ? `We Found ${count} DAO${count > 1 ? "s" : ""} associated with your wallet.`
                : "No DAOs Found"}
            </DialogTitle>
            <DialogDescription className="font-normal text-[#10182880] dark:text-[#A1A1A1] text-[20px] leading-relaxed">
              {hasDaos ? (
                <>
                  {count > 1 ? "These" : "This"} DAO{count > 1 ? "s" : ""} will be automatically added to your{" "}
                  <span className="text-[#101828] dark:text-white font-medium">watchlist</span> in the gavern
                  dashboard.
                </>
              ) : (
                "You can still explore and track other DAOs."
              )}
            </DialogDescription>
          </DialogHeader>

          {/* End-to-end thin line 20px after description */}
          <div className="w-full border-t border-[#E7E7E7] dark:border-[#1A1A1A] mt-5" />

          <section className="flex-1 flex flex-col items-center px-16 md:px-24 py-2 w-full gap-1 overflow-y-auto max-h-[500px]">
            {hasDaos && finalDaosData.result.map((dao: DaoItem, index: number) => {
              // Priority: Symbol from metadata (if valid) > Realm Name (if valid)
              const symbol = dao.tokenMetadata?.symbol;
              const isValidSymbol = symbol && symbol !== "?" && symbol.trim() !== "";

              const realmName = dao.realmName;
              const isValidRealmName = realmName && realmName !== "?" && realmName.trim() !== "";

              const tokenIdentifier = isValidSymbol ? symbol : (isValidRealmName ? realmName : "Tokens");

              return (
                <div
                  key={index}
                  className="flex justify-between items-center w-full pt-6 pb-2 border-b border-[#E7E7E7] dark:border-[#1A1A1A] last:border-0"
                >
                  <div className="flex items-center gap-[20px] pb-2">
                    <div className="relative w-[48px] h-[48px] flex-shrink-0 bg-[#F9F9F9] dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                      <DaoImage src={dao.imageUrl || ""} alt={dao.realmName || ""} />
                    </div>
                    <h2 className="text-[20px] font-semibold text-[#101828] dark:text-white">
                      {dao.realmName}
                    </h2>
                  </div>

                  <span
                    className="text-[14px] font-medium pb-2"
                    style={{
                      background: 'linear-gradient(270deg, #22E9AD 0%, #9846FE 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {formatNumber(dao.governingTokenDepositAmount || "0", 2)} {tokenIdentifier} Detected!
                  </span>
                </div>
              );
            })}

            {!hasDaos && (
              <div className="flex flex-col items-center justify-center py-10 text-[#10182880] dark:text-[#A1A1A1]">
                <p>No governance activity detected for this wallet.</p>
              </div>
            )}
          </section>

          <div className="flex justify-center pt-2">
            <Button
              className="w-auto py-[29px] px-10 rounded-[5px] bg-[#010101] dark:bg-white text-white dark:text-[#010101] hover:opacity-90 transition-all font-medium text-lg"
              onClick={handleGoToDashboard}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Sub-component to handle image fallbacks correctly
function DaoImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);
  const fallback = "/dao-1.png";

  return (
    <Image
      src={imageError ? fallback : (src || fallback)}
      alt={alt}
      fill
      className="rounded-full object-cover"
      onError={() => setImageError(true)}
    />
  );
}