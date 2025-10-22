import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { DataTable } from "./data-table";
import { truncateAddress } from "@/lib/utils";
import { ArrowDown } from "lucide-react";


interface IMembers {
  memberName: string;
  membersAddress: string;
  isDelegator: boolean;
  votesCast: number;
  delegatedTokens: number;
  proposalsCreated: number;
  governancePower: number;
  memberImage: string;
}

const columns: ColumnDef<IMembers>[] = [
  {
    accessorKey: "members",
    size: 353,
    header: () => (
      <div className="text-left text-[#101828B2] dark:text-[#A1A1A1] font-normal text-sm leading-[24px]">
        Members
      </div>
    ),
    cell({ row }) {
      const data = row.original;
      return (
        <div className="flex items-center gap-2">
          <Image
            src={data.memberImage}
            alt={data.memberName || data.membersAddress}
            width={36}
            height={36}
            className="rounded-full"
          />
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[#101828] dark:text-[#EDEDED] text-sm font-medium">
              {data.memberName}
            </h2>
            <span className="text-[#101828B2] dark:text-[#A1A1A1] font-normal text-xs">
              {truncateAddress(data.membersAddress)}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "delegator",
    header: () => (
      <div className="text-center text-[#101828B2] dark:text-[#A1A1A1] font-normal text-sm leading-[24px]">
        Delegator
      </div>
    ),
    cell({ row }) {
      const data = row.original;
      return (
        <span className="block text-center">
          {data.isDelegator ? "Yes" : "No"}
        </span>
      );
    },
  },
  {
    accessorKey: "votesCast",
    header: () => (
      <div className="text-center text-[#101828B2] dark:text-[#A1A1A1] font-normal text-sm leading-[24px]">
        Votes cast
      </div>
    ),
    cell({ row }) {
      const data = row.original;
      return <span className="block text-center">{data.votesCast}</span>;
    },
  },
  {
    accessorKey: "delegatedTokens",
    header: () => (
      <div className="text-center text-[#101828B2] dark:text-[#A1A1A1] font-normal text-sm leading-[24px]">
        Delegated tokens
      </div>
    ),
    cell({ row }) {
      const data = row.original;
      return <span className="block text-center">{data.delegatedTokens}</span>;
    },
  },
  {
    accessorKey: "proposalsCreated",
    header: () => (
      <div className="text-center text-[#101828B2] dark:text-[#A1A1A1] font-normal text-sm leading-[24px]">
        Proposals created
      </div>
    ),
    cell({ row }) {
      const data = row.original;
      return <span className="block text-center">{data.proposalsCreated}</span>;
    },
  },
  {
    accessorKey: "governancePower",
    header: () => (
      <div className="text-center text-[#101828B2] dark:text-[#A1A1A1] font-normal text-sm leading-[24px]">
        Governance Power
      </div>
    ),
    cell({ row }) {
      const data = row.original;
      return <span className="block text-center">{data.proposalsCreated}</span>;
    },
  },
];

const data: IMembers[] = [
  {
    memberName: "Gaverm.sol",
    membersAddress: "C91MG..OHac",
    isDelegator: false,
    votesCast: 109,
    delegatedTokens: 32,
    proposalsCreated: 9,
    governancePower: 60,
    memberImage: "/solana.png", // Replace with actual image URL
  },
  {
    memberName: "Gaverm.sol",
    membersAddress: "C91MG..OHac",
    isDelegator: false,
    votesCast: 7,
    delegatedTokens: 0,
    proposalsCreated: 7,
    governancePower: 16,
    memberImage: "/solana.png", // Replace with actual image URL
  },
  {
    memberName: "Gaverm.sol",
    membersAddress: "C91MG..OHac",
    isDelegator: true,
    votesCast: 78,
    delegatedTokens: 1,
    proposalsCreated: 64,
    governancePower: 87,
    memberImage: "/solana.png", // Replace with actual image URL
  },
  {
    memberName: "Gaverm.sol",
    membersAddress: "C91MG..OHac",
    isDelegator: true,
    votesCast: 45,
    delegatedTokens: 8,
    proposalsCreated: 21,
    governancePower: 56,
    memberImage: "/solana.png", // Replace with actual image URL
  },
  {
    memberName: "Gaverm.sol",
    membersAddress: "C91MG..OHac",
    isDelegator: false,
    votesCast: 23,
    delegatedTokens: 0,
    proposalsCreated: 23,
    governancePower: 77,
    memberImage: "/solana.png", // Replace with actual image URL
  },
  {
    memberName: "Gaverm.sol",
    membersAddress: "C91MG..OHac",
    isDelegator: false,
    votesCast: 8,
    delegatedTokens: 0,
    proposalsCreated: 1,
    governancePower: 12,
    memberImage: "/solana.png", // Replace with actual image URL
  },
  {
    memberName: "Gaverm.sol",
    membersAddress: "C91MG..OHac",
    isDelegator: true,
    votesCast: 34,
    delegatedTokens: 0,
    proposalsCreated: 1,
    governancePower: 41,
    memberImage: "/solana.png", // Replace with actual image URL
  },
  {
    memberName: "Gaverm.sol",
    membersAddress: "C91MG..OHac",
    isDelegator: true,
    votesCast: 76,
    delegatedTokens: 0,
    proposalsCreated: 7,
    governancePower: 43,
    memberImage: "/solana.png", // Replace with actual image URL
  },
  {
    memberName: "Gaverm.sol",
    membersAddress: "C91MG..OHac",
    isDelegator: false,
    votesCast: 76,
    delegatedTokens: 0,
    proposalsCreated: 7,
    governancePower: 43,
    memberImage: "/solana.png", // Replace with actual image URL
  },
  {
    memberName: "Gaverm.sol",
    membersAddress: "C91MG..OHac",
    isDelegator: false,
    votesCast: 76,
    delegatedTokens: 0,
    proposalsCreated: 7,
    governancePower: 43,
    memberImage: "/solana.png",
  },
];

export default function DaoMembers() {
  return (
    <div className="w-full bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2]">
      <DataTable columns={columns} data={data} />
      <div className="flex items-center justify-center font-medium text-sm text-[#101828] dark:text-[#EDEDED] py-4.5 px-6 gap-1 cursor-pointer">
        Load More <ArrowDown size={16} />
      </div>
    </div>
  );
}
