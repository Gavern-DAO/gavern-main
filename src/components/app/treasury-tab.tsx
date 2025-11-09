"use client";

import React from "react";
import TryeasuryCard from "./treasury-card";
import { daosApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../loading-spinner";

interface TreasurytabProps {
  realm: string;
  realmOwner: string;
}

export default function Treasurytab({ realm, realmOwner }: TreasurytabProps) {
  const { data: treasuryInfo, isLoading } = useQuery({
    queryKey: ["treasuryInfo", realm, realmOwner],
    queryFn: () => daosApi.getTreasuryInfo({ realm, realmOwner }),
    enabled: !!realm && !!realmOwner,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const daoAssets =
    treasuryInfo?.tokens
      .sort((a, b) => b.value - a.value)
      .map((token) => ({
        image: token.logoURI ?? "/FallbackCoin.png",
        price: token.value.toLocaleString(),
        tokenName: token.symbol || token.name,
        address: token.mint,
      })) ?? [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] flex flex-col gap-2 pb-6 rounded-[5px]">
      <div className="w-full border-b-[0.5px] border-b-[#E7E7E7] dark:border-b-[#282828B2] p-4 gap-1">
        <h2 className="text-[#101828] dark:text-[#EDEDED] font-medium text-base leading-[100%]">
          DAO Assets{" "}
          <span className="text-[#101828B2] dark:text-[#A1A1A1] font-normal text-xs">
            ($
            {treasuryInfo?.totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            )
          </span>
        </h2>
      </div>
      <div className="px-4 py-2 gap-1.5 grid grid-cols-1">
        {daoAssets.map((asset, index) => (
          <TryeasuryCard
            key={index}
            image={asset.image}
            price={asset.price}
            tokenName={asset.tokenName}
            address={asset.address}
          />
        ))}
      </div>
    </div>
  );
}
