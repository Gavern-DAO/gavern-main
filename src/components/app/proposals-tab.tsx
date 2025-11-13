"use client";
import React from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../ui/hover-card";
import { ProposalsList } from "./proposal-list";
import { Proposal } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { daosApi } from "@/lib/api";
import LoadingSpinner from "../loading-spinner";
import { ProposalsTabSkeleton } from "./skeleton-dao";

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

  const topMembers = [
    {
      rank: 1,
      name: "C9.",
      address: "C91MG...OfHac",
      proposals: 67,
      votes: 109,
      power: "100k",
      color: "from-[#7B61FF] to-[#00C4CC]",
    },
    {
      rank: 2,
      name: "Gavern.sol",
      address: "C91MG...OfHac",
      proposals: 45,
      votes: 84,
      power: "109",
      color: "from-[#7B61FF] to-[#00C4CC]",
    },
    {
      rank: 3,
      name: "Gavern.sol",
      address: "C91MG...OfHac",
      proposals: 34,
      votes: 87,
      power: "109",
      color: "from-[#7B61FF] to-[#00C4CC]",
    },
  ];

  return (
    <div className="w-full bg-transparent space-y-4">
      <div className="bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] p-4 rounded-[8px] gap-6 grid grid-cols-1 md:grid-cols-2">
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
          <div className="w-full py-6 px-3 bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] rounded-[5px] flex flex-col items-center justify-center min-h-[318px]">
            {/* Active voters */}
            <HoverCard>
              <HoverCardTrigger asChild className="cursor-pointer">
                <div className="aspect-square rounded-full bg-[#FECE26] h-auto w-[184px] text-black flex flex-col items-center justify-center font-medium text-[20px] leading-[100%]">
                  32
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
                    91%
                  </span>
                  <span className="font-medium text-[9.66px] leading-[14.5px]">
                    32 delegates
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-[#E4DC0042]">
                  <div className="h-full w-[50%] bg-[#E4DC00] rounded-full"></div>
                </div>
              </HoverCardContent>
            </HoverCard>

            {/* Inactive voters */}
            <HoverCard>
              <HoverCardTrigger asChild className="cursor-pointer">
                <div className="aspect-square rounded-full bg-[#FE4A23] h-auto w-[124px] -mt-[62px] text-white dark:text-[#010101] flex flex-col items-center justify-center font-medium text-base leading-[100%]">
                  5
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
                    9%
                  </span>
                  <span className="font-medium text-[9.66px] leading-[14.5px]">
                    5 delegates
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-[#FD4A2361]">
                  <div className="h-full w-[50%] bg-[#FE4A23] rounded-full"></div>
                </div>
              </HoverCardContent>
            </HoverCard>
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
          <div className="w-full py-5 pb-6 bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] rounded-[5px] flex flex-col  min-h-[318px]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[#101828B2] dark:text-[#A1A1A1] text-sm leading-[24px] font-normal">
                    <th className="px-4 py-2">Delegates</th>
                    <th className="px-4 py-2 text-center">Proposals created</th>
                    <th className="px-4 py-2 text-center">Votes</th>
                    <th className="px-4 py-2 text-center">Voting Power</th>
                  </tr>
                </thead>
                <tbody>
                  {topMembers.map((member) => (
                    <tr
                      key={member.rank}
                      className="bg-[white] dark:bg-[#010101] rounded-lg hover:bg-[#F1F5F9] transition"
                    >
                      <td className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white dark:text-[#010101] text-xs sm:text-sm font-semibold`}
                        >
                          {member.rank}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#101828] dark:text-[#EDEDED] font-medium text-xs md:text-sm leading-[100%]">
                            {member.name}
                          </span>
                          <span className="text-[#101828B2] dark:text-[#A1A1A1] text-[10px] md:text-xs leading-[100%]">
                            {member.address}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#101828] dark:text-[#EDEDED] font-normal text-xs sm:text-sm text-center">
                        {member.proposals}
                      </td>
                      <td className="px-4 py-3 text-[#101828] dark:text-[#EDEDED] font-normal text-xs sm:text-sm text-center">
                        {member.votes}
                      </td>
                      <td className="px-4 py-3 text-[#101828] dark:text-[#EDEDED] font-normal text-xs sm:text-sm text-center">
                        {member.power}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#010101] dark:border dark:border-[#282828B2] rounded-[5px] flex flex-col gap-2">
        <div className="w-full border-b-[0.5px] border-b-[#E7E7E7] dark:border-b-[#282828B2] p-4 gap-1">
          <h2 className="text-[#101828] dark:text-[#EDEDED] font-medium text-base leading-[100%]">
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
              onLoadMore={() => console.log("Load more clicked")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
