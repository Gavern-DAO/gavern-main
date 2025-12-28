"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { useQueryClient } from "@tanstack/react-query";

interface Dao {
  imageUrl: string;
  realmName: string;
  governingTokenDepositAmount: string;
}

interface DaosData {
  count: number;
  result: Dao[];
}

export default function DaosFoundModal() {
  const { daosFoundModalOpen, setDaosFoundModalOpen } = useWalletAuth();
  const queryClient = useQueryClient();

  // Get cached data from the mutation (set in use-wallet-auth hook)
  // This data was already fetched during the countdown phase
  const cachedData = queryClient.getQueryData<DaosData>(["daos"]);

  const handleGoToDashboard = () => {
    setDaosFoundModalOpen(false);
  };

  // Use cached data, default to empty if not available
  const finalDaosData: DaosData = cachedData || { count: 0, result: [] };

  // Don't render if modal is not open
  if (!daosFoundModalOpen) {
    return null;
  }

  const count = finalDaosData.count;
  const hasDaos = count > 0;

  return (
    <Dialog open={daosFoundModalOpen} onOpenChange={setDaosFoundModalOpen}>
      <DialogContent
        className="bg-white w-screen max-w-6xl px-30 overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#010101]"
        showCloseButton={true}
      >
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="bg-gradient-to-l from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent font-semibold text-3xl">
            {hasDaos
              ? `We Found ${count} DAO${count > 1 ? "s" : ""} associated with your wallet.`
              : "No DAOs Found"}
          </DialogTitle>
          <DialogDescription className="font-normal text-[#101828B2] text-lg leading-[100%]">
            {hasDaos
              ? `This DAO${count > 1 ? "s" : ""} will be automatically added to your watchlist in the gavern dashboard.`
              : "You can still explore and track other DAOs."}
          </DialogDescription>
        </DialogHeader>

        {hasDaos && (
          <section className="flex flex-col items-center text-[#101828B2] font-medium text-base w-full gap-2">
            {finalDaosData.result.map((dao, index) => (
              <div key={index} className="flex justify-between w-full py-5">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={dao.imageUrl}
                    alt={dao.realmName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <h2>{dao.realmName}</h2>
                </div>
                <span className="bg-gradient-to-l from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent">
                  {dao.governingTokenDepositAmount} Detected!
                </span>
              </div>
            ))}
          </section>
        )}

        <Button
          className="w-auto justify-self-center py-5.5 px-3 rounded-[5px] bg-[#010101] text-white"
          onClick={handleGoToDashboard}
        >
          Go to Dashboard
        </Button>
      </DialogContent>
    </Dialog>
  );
}