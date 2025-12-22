"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { DataTable } from "./data-table";
import { truncateAddress } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MemberInfo, daosApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { DaoMembersSkeleton } from "./skeleton-dao";
import { useMemo } from "react";

interface DaoMembersProps {
  realm: string;
  realmOwner: string;
  governingTokenMint: string;
  councilMint?: string;
  page: number;
  setPage: (page: number) => void;
}

const columns: ColumnDef<MemberInfo>[] = [
  {
    accessorKey: "member",
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
            src={"/solana.png"}
            alt={data.member}
            width={36}
            height={36}
            className="rounded-full w-8 h-8 md:w-9 md:h-9"
          />
          <div className="flex flex-col gap-0.5 min-w-0">
            <h2 className="text-[#101828] dark:text-[#EDEDED] text-xs md:text-sm font-medium truncate">
              {truncateAddress(data.member)}
            </h2>
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
      return <span className="block text-center">{data.delegator ? "Yes" : "No"}</span>;
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
      return <span className="block text-center">{data.governancePower}</span>;
    },
  },
];

export default function DaoMembers({
  realm,
  realmOwner,
  governingTokenMint,
  councilMint,
  page,
  setPage,
}: DaoMembersProps) {
  // Helper function to fetch all members from a mint
  const fetchAllMembers = async (mint: string): Promise<MemberInfo[]> => {
    const allMembers: MemberInfo[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await daosApi.getMemberInfo({
        realm,
        realmOwner,
        governingTokenMint: mint,
        page: currentPage,
        limit: 100, // Fetch larger batches for efficiency
      });

      allMembers.push(...response.members);
      hasMore = response.pagination.hasNext;
      currentPage++;
    }

    return allMembers;
  };

  // Fetch all community members
  const { data: allCommunityMembers, isLoading: isLoadingCommunity } = useQuery({
    queryKey: ["allMemberDetails", realm, realmOwner, governingTokenMint, "community"],
    queryFn: () => fetchAllMembers(governingTokenMint),
    enabled: !!realm && !!realmOwner && !!governingTokenMint,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch all council members if councilMint exists
  const { data: allCouncilMembers, isLoading: isLoadingCouncil } = useQuery({
    queryKey: ["allMemberDetails", realm, realmOwner, councilMint, "council"],
    queryFn: () => fetchAllMembers(councilMint!),
    enabled: !!realm && !!realmOwner && !!councilMint,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isLoading = isLoadingCommunity || isLoadingCouncil;

  // Merge members from both sources
  const mergedMembers = useMemo(() => {
    const communityMembers = allCommunityMembers || [];
    const councilMembers = allCouncilMembers || [];

    // Create a map to merge members by their pubkey (member address)
    const memberMap = new Map<string, MemberInfo>();

    // Add community members first
    communityMembers.forEach((member) => {
      memberMap.set(member.member, { ...member });
    });

    // Merge council members - add numeric values if member already exists
    councilMembers.forEach((member) => {
      const existingMember = memberMap.get(member.member);
      if (existingMember) {
        // Member exists in both - merge numeric values
        existingMember.votesCast = existingMember.votesCast + member.votesCast;
        existingMember.proposalsCreated =
          existingMember.proposalsCreated + member.proposalsCreated;
        // Governance power is a string, so we need to parse and add
        const existingPower = parseFloat(existingMember.governancePower) || 0;
        const councilPower = parseFloat(member.governancePower) || 0;
        existingMember.governancePower = (existingPower + councilPower).toString();
        // Keep delegator from community (or could be OR logic, but keeping community for now)
      } else {
        // New member from council
        memberMap.set(member.member, { ...member });
      }
    });

    return Array.from(memberMap.values());
  }, [allCommunityMembers, allCouncilMembers]);

  // Calculate pagination for merged results
  const limit = 10;
  const totalMembers = mergedMembers.length;
  const totalPages = Math.ceil(totalMembers / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedMembers = mergedMembers.slice(startIndex, endIndex);

  const pagination = {
    page,
    limit,
    total: totalMembers,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };

  if (isLoading) {
    return <DaoMembersSkeleton />;
  }

  if (paginatedMembers.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] p-6 text-center text-lg font-semibold">
        No members found.
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2]">
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={paginatedMembers} />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-medium text-xs md:text-sm text-[#101828] dark:text-[#EDEDED] py-3 md:py-4.5 px-4 md:px-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={!pagination.hasPrevious}
          className="flex items-center gap-1 cursor-pointer disabled:opacity-50 text-xs md:text-sm"
        >
          <ArrowLeft size={14} className="md:w-4 md:h-4" />
          Previous
        </button>
        <span className="text-xs md:text-sm">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!pagination.hasNext}
          className="flex items-center gap-1 cursor-pointer disabled:opacity-50 text-xs md:text-sm"
        >
          Next
          <ArrowRight size={14} className="md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  );
}
