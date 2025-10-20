import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export interface IAllDao {
  id: string;
  daoName: string;
  daoHealth: "Alive" | "Dead" | "Stable";
  proposals: number;
  treasuryBalance: string;
  isActive: boolean;
  timeLeft: string;
  image: string;
}
const columns: ColumnDef<IAllDao>[] = [
  {
    accessorKey: "daoName",
    header: ({ header }) => {
      return (
        <span className="font-normal leading-[24px] text-base text-[#4C4C4C]">
          DAO Name
        </span>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      const [selectedDaos, setSelectedDaos] = useState<string[]>([]);
      const isSelected = selectedDaos.includes(data.id);

      const handleCheckboxChange = (checked: boolean) => {
        setSelectedDaos((prev) =>
          checked ? [...prev, data.id] : prev.filter((id) => id !== data.id),
        );
      };

      return (
        <div className="flex items-center justify-start gap-3">
          <div className="flex items-center justify-center gap-2.5">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleCheckboxChange}
              className="h-5 w-5 text-blue-600"
            />
            <Image
              src={data.image}
              width={48}
              height={48}
              alt={data.daoName}
              className="h-full w-auto"
            />
            <h2 className="text-[#101828] dark:text-[#EDEDED] font-medium text-[1.25rem] leading-[1.5rem]">
              {data.daoName}
            </h2>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            {data.isActive && (
              <span className="py-1 px-2 border rounded-full gap-2 border-[#75FA7C] bg-[#00D70B1F] font-medium text-[0.75rem] text-[#00BF0A] leading-[100%]">
                Active Proposal
              </span>
            )}
            {data.timeLeft && (
              <span className="text-[#909090] text-sm leading-[21px]">
                {data.timeLeft}
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "daoHealth",
    header: () => {
      return (
        <span className="font-normal leading-[24px] text-base text-[#4C4C4C] text-center flex items-center justify-center">
          DAO Health
        </span>
      );
    },
    cell: ({ row }) => {
      const health = row.original.daoHealth;
      return (
        <div className="flex items-center justify-center gap-1.5 text-[#101828] dark:text-[#EDEDED] font-normal text-base leading-[24px]">
          {health === "Alive" ? (
            <div className="aspect-square h-auto w-2 rounded-full bg-[#00AA09]"></div>
          ) : health === "Stable" ? (
            <div className="aspect-square h-auto w-2 rounded-full bg-[#FFC107]"></div>
          ) : (
            <div className="aspect-square h-auto w-2 rounded-full bg-[#D70000]"></div>
          )}
          {health}
        </div>
      );
    },
  },
  {
    accessorKey: "proposals",
    header: () => {
      return (
        <span className="font-normal leading-[24px] text-base text-[#4C4C4C] text-center flex items-center justify-center">
          Proposals
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-center flex items-center justify-center text-[#101828] dark:text-[#EDEDED] leading-[24px] text-base">
          {row.original.proposals}
        </span>
      );
    },
  },
  {
    accessorKey: "treasuryBalance",
    header: () => {
      return (
        <span className="font-normal leading-[24px] text-base text-[#4C4C4C] text-center flex items-center justify-center">
          Treasury Balance
        </span>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-center flex items-center justify-center text-[#101828] dark:text-[#EDEDED] leading-[24px] text-base">
          {row.original.treasuryBalance}
        </span>
      );
    },
  },
];
const allDaoData: IAllDao[] = [
  {
    id: "realms",
    daoName: "Realms Ecosystem DAO",
    daoHealth: "Alive",
    proposals: 532,
    treasuryBalance: "$180,000",
    timeLeft: "",
    isActive: false,
    image: "/realms-dao.png",
  },
  {
    id: "island",
    daoName: "Island DAO",
    daoHealth: "Alive",
    proposals: 340,
    treasuryBalance: "$780,000",
    timeLeft: "",
    isActive: false,
    image: "/island-dao.png",
  },
  {
    id: "metaplex",
    daoName: "Metaplex DAO",
    daoHealth: "Alive",
    proposals: 265,
    treasuryBalance: "$80,000",
    timeLeft: "",
    isActive: false,
    image: "/metaplex-dao.png",
  },
  {
    id: "epicentral",
    daoName: "Epicentral DAO",
    daoHealth: "Alive",
    proposals: 74,
    treasuryBalance: "$50,000",
    timeLeft: "",
    isActive: false,
    image: "/epicentral-dao.png",
  },
  {
    id: "marinade",
    daoName: "Marinade",
    daoHealth: "Stable",
    proposals: 163,
    treasuryBalance: "$62,000",
    timeLeft: "",
    isActive: false,
    image: "/marinade-dao.png",
  },
  {
    id: "drift",
    daoName: "Drift Protocol",
    daoHealth: "Stable",
    proposals: 189,
    treasuryBalance: "$34,000",
    timeLeft: "",
    isActive: false,
    image: "/drift-dao.png",
  },
  {
    id: "orca",
    daoName: "Orca DAO",
    daoHealth: "Dead",
    proposals: 290,
    treasuryBalance: "$70,000",
    timeLeft: "",
    isActive: false,
    image: "/orca-dao.png",
  },
  {
    id: "metadao",
    daoName: "MetaDAO",
    daoHealth: "Stable",
    proposals: 163,
    treasuryBalance: "$62,000",
    timeLeft: "",
    isActive: false,
    image: "/meta-dao.png",
  },
  {
    id: "flash",
    daoName: "Flash Trade",
    daoHealth: "Stable",
    proposals: 163,
    treasuryBalance: "$62,000",
    timeLeft: "",
    isActive: false,
    image: "/flash-trade-dao.png",
  },
  {
    id: "sanctum",
    daoName: "Sanctum",
    daoHealth: "Stable",
    proposals: 163,
    treasuryBalance: "$62,000",
    timeLeft: "",
    isActive: false,
    image: "/sanctum-dao.png",
  },
];

export default function TrackDaosTable() {
  // const [selectedDaos, setSelectedDaos] = useState<string[]>([]);

  return (
    <div className="lg:max-w-[1200px] mx-auto ">
      <span className="block mb-2 text-[#101828B2] dark:text-[#A1A1A1] font-normal text-base leading-[26px]">
        <span className="text-[#101828] dark:text-[#EDEDED]">Note:</span> If you
        already had Dao that were checked, they are DAo your wallet address were
        dictated in or Dao you already belonged to. <br />
        Choose your preferred DAO(s) that you would like to track and get
        notifications about their activity.{" "}
      </span>
      <div className="w-full bg-white dark:bg-[#010101] rounded-[10px] border-b-[0.5px] dark:border-[.5px] dark:border-[#282828B2] overflow-hidden">
        <DataTable<IAllDao> columns={columns} data={allDaoData} />
        <div className="flex items-center justify-center p-8 text-[#101828B2] dark:text-[#A1A1A1] leading-[24px] text-[1.25rem]">
          <span className="flex items-center justify-center gap-2 cursor-pointer select-none">
            Load More <ArrowDown />
          </span>
        </div>
      </div>
    </div>
  );
}
