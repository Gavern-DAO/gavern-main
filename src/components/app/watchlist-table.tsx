"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import DaoCard from "./dao-card";

export interface WatchlistDao {
  id: string;
  daoName: string;
  daoHealth: "Alive" | "Dead";
  proposals: number;
  treasuryBalance: string;
  image: string;
  amountDetected: string;
}

const DaoImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState(src);

  const handleImageError = () => {
    setImageSrc("/dao-1.png");
  };

  return (
    <Image
      src={imageSrc}
      width={48}
      height={48}
      alt={alt}
      className="w-12 h-12 rounded-full object-cover"
      unoptimized={true}
      onError={handleImageError}
    />
  );
};

export const EmptyState = () => {
  return (
    <div className="bg-white dark:bg-[#171717] space-y-8 min-h-[578px] md:min-h-[810px] flex flex-col items-center justify-center w-full rounded-none">
      <Image
        src={"/Table-EmptyState.png"}
        alt="Empty State"
        width={552}
        height={316}
      />
      <div className="flex flex-col items-center justify-center gap-3">
        <span>You don’t have any DAOs on your Watchlist currently. </span>
        <Button className="dark:bg-[]">Add DAOs to watchlist</Button>
      </div>
    </div>
  );
};
const columns: ColumnDef<WatchlistDao>[] = [
  {
    accessorKey: "daoName",
    header: () => (
      <span className="font-normal leading-[24px] text-base text-[#4C4C4C]">
        DAO Name
      </span>
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center justify-start gap-3">
          <DaoImage src={data.image} alt={data.daoName} />
          {/* <Image
            src={data.image}
            width={48}
            height={48}
            alt={data.daoName}
            className="h-full w-auto"
          /> */}
          <h2 className="text-[#101828] dark:text-[#EDEDED] font-medium text-[1.25rem] leading-[1.5rem]">
            {data.daoName}
          </h2>

          {data.amountDetected && (
            <span className="bg-gradient-to-l from-[#22E9AD] to-[#9846FE] text-transparent bg-clip-text">
              {data.amountDetected}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "daoHealth",
    header: () => (
      <span className="font-normal leading-[24px] text-base text-[#4C4C4C] text-center flex items-center justify-center">
        DAO Health
      </span>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-1.5 text-[#101828] dark:text-[#EDEDED] font-normal text-base leading-[24px]">
          {row.original.daoHealth === "Alive" ? (
            <div className="aspect-square h-auto w-2 rounded-full bg-[#00AA09]"></div>
          ) : (
            <div className="aspect-square h-auto w-2 rounded-full bg-[#D70000]"></div>
          )}
          {row.original.daoHealth}
        </div>
      );
    },
  },
  {
    accessorKey: "proposals",
    header: () => (
      <span className="font-normal leading-[24px] text-base text-[#4C4C4C] text-center flex items-center justify-center">
        Proposals
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-center flex items-center justify-center text-[#101828] dark:text-[#EDEDED] leading-[24px] text-base">
        {row.original.proposals}
      </span>
    ),
  },
  {
    accessorKey: "treasuryBalance",
    header: () => (
      <span className="font-normal leading-[24px] text-base text-[#4C4C4C] text-center flex items-center justify-center">
        Treasury Balance
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-center flex items-center justify-center text-[#101828] dark:text-[#EDEDED] leading-[24px] text-base">
        {row.original.treasuryBalance}
      </span>
    ),
  },
];

// const allDaoData: WatchlistDao[] = [
//   { id: '1', daoName: 'BonkDAO', daoHealth: 'Alive', proposals: 265, treasuryBalance: '$80,000', image: '/bonk-dao.png', amountDetected: " 5k Bonk Detected!" },
//   { id: '2', daoName: 'Saga mobile DAO ', daoHealth: 'Alive', proposals: 74, treasuryBalance: '$50,000', image: '/saga-mobile-dao.png', amountDetected: "5k Solana Detected!" },
//   { id: '3', daoName: 'Adrena DAO 5k adrena Detected!', daoHealth: 'Alive', proposals: 532, treasuryBalance: '$180,000', image: '/adrena-dao.png', amountDetected: "5k adrena Detected!" },
//   { id: '4', daoName: 'Tensor DAO 5k Detected!', daoHealth: 'Alive', proposals: 340, treasuryBalance: '$780,000', image: '/tensor-dao.png', amountDetected: "5k" },
//   { id: '5', daoName: 'Jito DAO 5k Detected!', daoHealth: 'Dead', proposals: 163, treasuryBalance: '$62,000', image: '/jito-dao.png', amountDetected: "5k" },
//   { id: '6', daoName: 'Mango DAO 5k Detected!', daoHealth: 'Dead', proposals: 189, treasuryBalance: '$34,000', image: '/mango-dao.png', amountDetected: "5k" },
//   { id: '7', daoName: 'Solend DAO 5k Detected!', daoHealth: 'Dead', proposals: 290, treasuryBalance: '$70,000', image: '/solend-dao.png', amountDetected: "5k" },
//   { id: '8', daoName: 'Ore DAO 5k Detected!', daoHealth: 'Alive', proposals: 163, treasuryBalance: '$62,000', image: '/ore-dao.png', amountDetected: "5k" },
//   { id: '9', daoName: 'MetaDAO 5k Detected!', daoHealth: 'Alive', proposals: 163, treasuryBalance: '$62,000', image: '/meta-dao.png', amountDetected: "5k" },
//   { id: '10', daoName: 'Sanctum 5k Detected!', daoHealth: 'Dead', proposals: 163, treasuryBalance: '$62,000', image: '/sanctum-dao.png', amountDetected: "5k" },
// ]

export default function WatchlistTable({
  data,
  onTrackMoreClick,
}: {
  data: WatchlistDao[];
  onTrackMoreClick?: () => void;
}) {
  const router = useRouter();

  // Log when watchlist data changes
  useEffect(() => {
    console.log("[WatchlistTable] Data received:", data);
    console.log("[WatchlistTable] Data length:", data.length);
    console.log("[WatchlistTable] Data items:", data.map(d => ({ id: d.id, name: d.daoName })));
  }, [data]);

  const handleRowClick = (row: WatchlistDao) => {
    router.push(`/dao/${row.id}`);
  };

  return (
    <div className="lg:max-w-[1200px] mx-auto px-4">
      <span className="block mb-2 text-[#101828B2] dark:text-[#A1A1A1] font-normal text-xs md:text-base leading-[17px] md:leading-[25px]">
        <span className="text-[#101828] dark:text-[#EDEDED]">Note:</span> These
        are DAOs that your wallet address was dictated in or the DAO that you
        are currently tracking.
      </span>
      <div className="w-full bg-white dark:bg-[#010101]  rounded-[10px] border-b-[0.5px] dark:border-[.5px] dark:border-[#282828B2] overflow-hidden">

        <div className="hidden md:block">
          <DataTable<WatchlistDao>
            columns={columns}
            data={data}
            emptyState={<EmptyState />}
            onRowClick={handleRowClick}
          />
          {data.length !== 0 && (
            <div className="flex items-center justify-center p-8 text-[#101828B2] leading-[24px] text-[1.25rem]">
              <span
                onClick={onTrackMoreClick}
                className="flex items-center justify-center gap-2 cursor-pointer select-none hover:opacity-80 transition-opacity"
              >
                Tracked More DAOs →
              </span>
            </div>
          )}
        </div>



        <div className="md:hidden space-y-4 px-4 pb-8">
          {data.length === 0 ? (
            <EmptyState />
          ) : (
            data.map((dao) => (
              <DaoCard key={dao.id} dao={dao} onClick={() => handleRowClick(dao)} />
            ))
          )}
          {data.length !== 0 && (
            <div className="flex items-center justify-center p-8 text-[#101828B2] leading-[24px] text-[1.25rem]">
              <span
                onClick={onTrackMoreClick}
                className="flex items-center justify-center gap-2 cursor-pointer select-none hover:opacity-80 transition-opacity"
              >
                Tracked More DAOs →
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
