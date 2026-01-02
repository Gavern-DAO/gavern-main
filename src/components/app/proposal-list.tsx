import React from "react";
import { ChevronDown } from "lucide-react";
import { Proposal } from "@/lib/api";
import { ProposalItem } from "./proposal-item";
import { ProposalStatus } from "./proposal-status-badge";

interface ProposalsListProps {
  proposals: Proposal[] | undefined;
  totalCount: number;
  displayLimit: number;
  daoPubkey: string;
  onLoadMore?: () => void;
}

export function ProposalsList({
  proposals,
  totalCount,
  displayLimit,
  daoPubkey,
  onLoadMore,
}: ProposalsListProps) {
  const hasMore = totalCount > displayLimit;

  return (
    <>
      <div className="flex flex-col py-2 px-3 md:px-4 gap-2">
        {proposals?.slice(0, displayLimit).map((proposal, index) => (
          <ProposalItem
            key={`${proposal.name}-${proposal.datePublished}-${index}`}
            status={proposal.status as ProposalStatus}
            title={proposal.name}
            publishDate={new Date(proposal.datePublished).toLocaleDateString()}
            author={proposal.creator}
            description={proposal.description}
            numberOfVotes={proposal.numberOfVotes}
            participationRate={proposal.participationRate}
            proposalPubkey={proposal.pubkey}
            daoPubkey={daoPubkey}
          />
        ))}
      </div>

      {onLoadMore && (
        <div className="w-full flex justify-center py-4">
          {hasMore ? (
            <button
              onClick={onLoadMore}
              className="px-6 py-2 flex items-center justify-center gap-2 text-[#6B7280] dark:text-white text-xs md:text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#1A1A1A] rounded-full transition-colors border border-transparent hover:border-gray-200 dark:hover:border-[#333]"
            >
              Load More
              <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          ) : totalCount > 0 ? (
            <span className="text-[#6B7280] dark:text-[#909090] text-xs md:text-sm font-medium italic">
              That&apos;s all we&apos;ve got!
            </span>
          ) : null}
        </div>
      )}
    </>
  );
}
