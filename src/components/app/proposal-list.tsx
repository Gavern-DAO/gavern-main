import React from "react";
import { ChevronDown } from "lucide-react";
import { Proposal } from "@/lib/api";
import { ProposalItem } from "./proposal-item";
import { ProposalStatus } from "./proposal-status-badge";

interface ProposalsListProps {
  proposals: Proposal[] | undefined;
  totalCount: number;
  onLoadMore?: () => void;
}

export function ProposalsList({
  proposals,
  // totalCount,
  onLoadMore,
}: ProposalsListProps) {
  return (
    <>
      <div className="flex flex-col py-2 px-4 gap-2">
        {proposals?.map((proposal, index) => (
          <ProposalItem
            key={`${proposal.name}-${proposal.datePublished}-${index}`}
            status={proposal.status as ProposalStatus}
            title={proposal.name}
            publishDate={new Date(proposal.datePublished).toLocaleDateString()}
            author={proposal.creator}
          />
        ))}
      </div>

      {onLoadMore && (
        <button
          onClick={onLoadMore}
          className="w-full py-4 flex items-center justify-center gap-2 text-[#6B7280] dark:text-white text-sm font-medium transition-colors"
        >
          Load More
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </>
  );
}
