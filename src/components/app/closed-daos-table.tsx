import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

export interface IClosedDao {
  id: string;
  daoName: string;
  daoHealth: "Alive" | "Dead" | "Stable";
  proposals: number;
  treasuryBalance: string;
  isActive: boolean;
  timeCompleted: string;
  image: string;
}
const columns: ColumnDef<IClosedDao>[] = [
  {
    accessorKey: "daoName",
    header: () => {
      return (
        <span className="font-normal leading-[24px] text-base text-[#4C4C4C]">
          DAO Name
        </span>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center justify-start gap-3">
          <div className="flex items-center justify-center gap-2.5">
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
            {!data.isActive && (
              <span className="py-1 px-2 border rounded-full gap-2 border-[#F77777] bg-[#EA17171F] font-medium text-[0.75rem] text-[#EA1717] leading-[100%]">
                Closed Proposal
              </span>
            )}
            {data.timeCompleted && (
              <span className="text-[#909090] text-sm leading-[21px]">
                {data.timeCompleted}
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
      return (
        <div className="flex items-center justify-center gap-1.5 text-[#101828] dark:text-[#EDEDED] font-normal text-base leading-[24px]">
          {row.original.daoHealth === "Alive" ? (
            <div className="aspect-square h-auto w-2 rounded-full bg-[#00AA09]"></div>
          ) : row.original.daoHealth === "Dead" ? (
            <div className="aspect-square h-auto w-2 rounded-full bg-[#D70000]"></div>
          ) : (
            <div className="aspect-square h-auto w-2 rounded-full bg-[#E4DC00]"></div>
          )}
          {row.original.daoHealth}
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
const allDaoData: IClosedDao[] = [
  {
    id: "realms",
    daoName: "Realms Ecosystem DAO",
    daoHealth: "Alive",
    proposals: 532,
    treasuryBalance: "$180,000",
    timeCompleted: "14 hours ago!",
    isActive: false,
    image: "/realms-dao.png",
  },
  {
    id: "island",
    daoName: "Island DAO",
    daoHealth: "Alive",
    proposals: 340,
    treasuryBalance: "$780,000",
    timeCompleted: "1 day ago!",
    isActive: false,
    image: "/island-dao.png",
  },
  {
    id: "metaplex",
    daoName: "Metaplex DAO",
    daoHealth: "Dead",
    proposals: 265,
    treasuryBalance: "$80,000",
    timeCompleted: "2 days ago!",
    isActive: false,
    image: "/metaplex-dao.png",
  },
  {
    id: "epicentral",
    daoName: "Epicentral DAO",
    daoHealth: "Alive",
    proposals: 74,
    treasuryBalance: "$50,000",
    timeCompleted: "3 days ago!",
    isActive: false,
    image: "/epicentral-dao.png",
  },
  {
    id: "adrena",
    daoName: "Adrena DAO",
    daoHealth: "Dead",
    proposals: 532,
    treasuryBalance: "$180,000",
    timeCompleted: "4 days ago!",
    isActive: false,
    image: "/adrena-dao.png",
  },
  {
    id: "tensor",
    daoName: "Tensor DAO",
    daoHealth: "Alive",
    proposals: 340,
    treasuryBalance: "$780,000",
    timeCompleted: "1 week ago!",
    isActive: false,
    image: "/tensor-dao.png",
  },
  {
    id: "jito",
    daoName: "Jito DAO",
    daoHealth: "Alive",
    proposals: 163,
    treasuryBalance: "$62,000",
    timeCompleted: "1 week ago!",
    isActive: false,
    image: "/jito-dao.png",
  },
  {
    id: "meta",
    daoName: "MetaDAO",
    daoHealth: "Stable",
    proposals: 163,
    treasuryBalance: "$62,000",
    timeCompleted: "1 week ago!",
    isActive: false,
    image: "/meta-dao.png",
  },
  {
    id: "flash",
    daoName: "Flash Trade",
    daoHealth: "Stable",
    proposals: 163,
    treasuryBalance: "$62,000",
    timeCompleted: "1 week ago!",
    isActive: false,
    image: "/flash-trade-dao.png",
  },
  {
    id: "sanctum",
    daoName: "Sanctum",
    daoHealth: "Stable",
    proposals: 163,
    treasuryBalance: "$62,000",
    timeCompleted: "1 week ago!",
    isActive: false,
    image: "/sanctum-dao.png",
  },
];

export default function ClosedDaosTable() {
  return (
    <div className="lg:max-w-[1200px] bg-white dark:bg-[#010101] mx-auto rounded-[10px] border-b-[0.5px] dark:border-[.5px] dark:border-[#282828B2] overflow-hidden">
      <DataTable<IClosedDao> columns={columns} data={allDaoData} />
      <div className="flex items-center justify-center p-8  text-[#101828B2] dark:text-[#A1A1A1] leading-[24px] text-[1.25rem]">
        <span className="flex items-center justify-center gap-2 cursor-pointer select-none">
          Load More <ArrowDown />
        </span>
      </div>
    </div>
  );
}
