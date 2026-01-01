"use client";
import React from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../ui/hover-card";
import { ProposalsList } from "./proposal-list";
import { useQuery } from "@tanstack/react-query";
import { daosApi } from "@/lib/api";
import { ProposalsTabSkeleton } from "./skeleton-dao";
import { truncateAddress, formatNumber } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface ProposalsTabProps {
  realm: string;
  realmOwner: string;
}

export default function ProposalsTab({ realm, realmOwner }: ProposalsTabProps) {
  const { data: proposals, isLoading: isLoadingProposals } = useQuery({
    queryKey: ["proposals", realm, realmOwner],
    queryFn: () =>
      daosApi.getProposalsSummary({
        realm,
        realmOwner,
      }),
    enabled: !!realm && !!realmOwner,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: topMembersData, isLoading: isLoadingTopMembers } = useQuery({
    queryKey: ["topActiveMembers", realm, realmOwner],
    queryFn: () =>
      daosApi.getTopActiveMembers({
        realm,
        realmOwner,
      }),
    enabled: !!realm && !!realmOwner,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: turnoutData, isLoading: isLoadingTurnout } = useQuery({
    queryKey: ["voterTurnout", realm, realmOwner],
    queryFn: () =>
      daosApi.getVoterTurnout({
        realm,
        realmOwner,
      }),
    enabled: !!realm && !!realmOwner,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const topMembers = (topMembersData || []).slice(0, 3).map((member, index) => ({
    rank: index + 1,
    name: member.snsId || member.pubkey.slice(0, 5),
    address: member.pubkey,
    proposals: member.proposalsCreated,
    votes: member.votesCast,
    power: member.votingPower,
    color: "from-[#7B61FF] to-[#00C4CC]",
  }));

  const activeVoters = turnoutData?.activeVoters || 0;
  const inactiveVoters = turnoutData?.inactiveVoters || 0;
  const totalVoters = turnoutData?.totalMembers || activeVoters + inactiveVoters || 1;

  const activePercentage = Math.round((activeVoters / totalVoters) * 100);
  const inactivePercentage = Math.round((inactiveVoters / totalVoters) * 100);

  // Proportional sizing logic (relative to a base size)
  const baseSize = 250; // max size in pixels
  const minSize = 80;  // min size in pixels

  // Active circle size (yellow)
  const activeSize = Math.max(minSize, (activeVoters / totalVoters) * baseSize);
  // Inactive circle size (red)
  const inactiveSize = Math.max(minSize, (inactiveVoters / totalVoters) * baseSize);

  const [displayLimit, setDisplayLimit] = React.useState(10);

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 10);
  };

  return (
    <div className="w-full bg-transparent space-y-4">
      <div className="bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] p-3 md:p-4 rounded-[8px] gap-4 md:gap-6 grid grid-cols-1 md:grid-cols-2">
        {/* Card 1 */}
        <div
          className="bg-black dark:bg-[#171717] rounded-[5px]"
          style={{
            boxShadow: "0px 4px 40px 0px #0000000D",
          }}
        >
          <div className="pt-4 pb-3 px-4 font-medium text-sm leading-[100%] text-white dark:text-[#EDEDED] min-h-[46px] flex items-center">
            All-time voter’s turnout
          </div>
          <div className="w-full py-4 md:py-6 px-2 md:px-3 bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] rounded-[5px] flex flex-col items-center justify-center min-h-[250px] md:min-h-[318px] relative overflow-hidden">
            {isLoadingTurnout ? (
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="rounded-full w-[150px] h-[150px]" />
                <Skeleton className="rounded-full w-[100px] h-[100px] -mt-10" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full">
                {/* Active voters (Top, Yellow) */}
                <HoverCard>
                  <HoverCardTrigger asChild className={`cursor-pointer transition-all duration-300 ${activeSize < inactiveSize ? "z-20 scale-105" : "z-10"}`}>
                    <div
                      style={{
                        width: `${activeSize}px`,
                        height: `${activeSize}px`,
                      }}
                      className="rounded-full bg-[#FECE26] text-black flex flex-col items-center justify-center font-medium text-base md:text-[20px] leading-[100%] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.15)]"
                    >
                      {activeVoters}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="left"
                    sideOffset={-40}
                    className="bg-[#22222280] backdrop-blur-[12.08px] opacity-90 py-1.5 px-[7.25px] text-white flex flex-col gap-1.5 max-w-[130.5px] border-none"
                  >
                    <span className="font-medium text-[10px] leading-[100%]">
                      Active voters
                    </span>
                    <div className="w-full flex items-center justify-between">
                      <span className="font-medium text-base leading-[100%]">
                        {activePercentage}%
                      </span>
                      <span className="font-medium text-[9.66px] leading-[14.5px]">
                        {activeVoters} delegates
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-[#E4DC0042]">
                      <div
                        className="h-full bg-[#E4DC00] rounded-full"
                        style={{ width: `${activePercentage}%` }}
                      ></div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {/* Inactive voters (Bottom, Red) */}
                <HoverCard>
                  <HoverCardTrigger asChild className={`cursor-pointer transition-all duration-300 ${inactiveSize <= activeSize ? "z-20 scale-105" : "z-10"}`}>
                    <div
                      style={{
                        width: `${inactiveSize}px`,
                        height: `${inactiveSize}px`,
                        marginTop: `-${Math.min(activeSize, inactiveSize) * 0.25}px`, // Edge overlap
                      }}
                      className="rounded-full bg-[#FE4A23] text-white dark:text-[#010101] flex flex-col items-center justify-center font-medium text-sm md:text-base leading-[100%] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.15)]"
                    >
                      {inactiveVoters}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="right"
                    sideOffset={-20}
                    className="bg-[#22222280] backdrop-blur-[12.08px] opacity-90 py-1.5 px-[7.25px] text-white flex flex-col gap-1.5 max-w-[130.5px] border-none"
                  >
                    <span className="font-medium text-[10px] leading-[100%]">
                      In-active voters
                    </span>
                    <div className="w-full flex items-center justify-between">
                      <span className="font-medium text-base leading-[100%]">
                        {inactivePercentage}%
                      </span>
                      <span className="font-medium text-[9.66px] leading-[14.5px]">
                        {inactiveVoters} delegates
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-[#FD4A2361]">
                      <div
                        className="h-full bg-[#FE4A23] rounded-full"
                        style={{ width: `${inactivePercentage}%` }}
                      ></div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            )}
          </div>
        </div>

        {/* Card 2 - Top Members */}
        <div
          className="bg-black dark:bg-[#171717] rounded-[5px]"
          style={{
            boxShadow: "0px 4px 40px 0px #0000000D",
          }}
        >
          <div className="pt-4 pb-3 px-4 font-medium text-sm leading-[100%] text-white dark:text-[#EDEDED] min-h-[46px] flex items-center">
            Top 3 most active members
          </div>
          <div className="w-full py-4 md:py-5 pb-4 md:pb-6 bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] rounded-[5px] flex flex-col min-h-[250px] md:min-h-[318px]">
            <div className="overflow-x-auto -mx-2 md:mx-0 px-2 md:px-0">
              <table className="min-w-full text-xs md:text-sm text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[#101828B2] dark:text-[#A1A1A1] text-xs md:text-sm leading-[20px] md:leading-[24px] font-normal">
                    <th className="px-2 md:px-4 py-2">Delegates</th>
                    <th className="px-2 md:px-4 py-2 text-center">Proposals created</th>
                    <th className="px-2 md:px-4 py-2 text-center">Votes</th>
                    <th className="px-2 md:px-4 py-2 text-center">Voting Power</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingTopMembers ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-2 md:px-4 py-2 md:py-3 flex items-center gap-2 md:gap-3">
                          <Skeleton className="w-6 h-6 md:w-8 md:h-8 rounded-full" />
                          <div className="flex flex-col gap-1">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-2 w-24" />
                          </div>
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-center">
                          <Skeleton className="h-4 w-8 mx-auto" />
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-center">
                          <Skeleton className="h-4 w-8 mx-auto" />
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </td>
                      </tr>
                    ))
                  ) : topMembers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-500">
                        No active members found
                      </td>
                    </tr>
                  ) : (
                    topMembers.map((member) => (
                      <tr
                        key={member.rank}
                        className="bg-[white] dark:bg-[#010101] rounded-lg hover:bg-[#F1F5F9] transition"
                      >
                        <td className="px-2 md:px-4 py-2 md:py-3 flex items-center gap-2 md:gap-3 whitespace-nowrap">
                          <div
                            className={`w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white dark:text-[#010101] text-xs md:text-sm font-semibold`}
                          >
                            {member.rank}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[#101828] dark:text-[#EDEDED] font-medium text-xs md:text-sm leading-[100%]">
                              {member.name}
                            </span>
                            <span className="text-[#101828B2] dark:text-[#A1A1A1] text-[10px] md:text-xs leading-[100%]">
                              {truncateAddress(member.address)}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-[#101828] dark:text-[#EDEDED] font-normal text-xs md:text-sm text-center">
                          {formatNumber(member.proposals)}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-[#101828] dark:text-[#EDEDED] font-normal text-xs md:text-sm text-center">
                          {formatNumber(member.votes)}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-[#101828] dark:text-[#EDEDED] font-normal text-xs md:text-sm text-center">
                          {formatNumber(member.power)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#010101] dark:border dark:border-[#282828B2] rounded-[5px] flex flex-col gap-2">
        <div className="w-full border-b-[0.5px] border-b-[#E7E7E7] dark:border-b-[#282828B2] p-3 md:p-4 gap-1">
          <h2 className="text-[#101828] dark:text-[#EDEDED] font-medium text-sm md:text-base leading-[100%]">
            Proposals{" "}
            <span className="text-[#101828B2] dark:text-[#A1A1A1] font-normal text-xs">({proposals?.length || 0})</span>
          </h2>
        </div>
        <div className="">
          {isLoadingProposals ? (
            <ProposalsTabSkeleton />
          ) : (
            <ProposalsList
              proposals={proposals}
              totalCount={proposals?.length || 0}
              displayLimit={displayLimit}
              onLoadMore={handleLoadMore}
            />
          )}
        </div>
      </div>
    </div>
  );
}
