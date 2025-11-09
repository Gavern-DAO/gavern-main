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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api";

interface Dao {
  imageUrl: string;
  realmName: string;
  governingTokenDepositAmount: string;
}

export default function DaosFoundModal() {
  const { daosFoundModalOpen, setDaosFoundModalOpen } = useWalletAuth();
  const queryClient = useQueryClient();

  // Get cached data from the mutation (set in use-wallet-auth hook)
  const cachedData = queryClient.getQueryData<{ count: number; result: Dao[] }>(["daos"]);
  
  // Only make a query if we don't have cached data and modal is open
  const { data: daosData } = useQuery<{ count: number; result: Dao[] }>({
    queryKey: ["daos"],
    queryFn: userApi.getDaos,
    enabled: !cachedData && daosFoundModalOpen, // Only fetch if no cached data and modal is open
    retry: false, // Don't retry on error
    initialData: cachedData, // Use cached data if available
  });

  const handleGoToDashboard = () => {
    setDaosFoundModalOpen(false);
  };

  // Use cached data if query data is undefined (e.g., on error or when using cached data)
  // The mutation's onError sets this to { count: 0, result: [] } when API returns 400
  const finalDaosData = daosData || cachedData || { count: 0, result: [] };
  
  // Show modal even if there's an error - we'll display "No DAOs Found"
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