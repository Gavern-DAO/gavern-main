import React from "react";
import { ChevronDown } from "lucide-react";
import type { ProposalStatus } from "./proposal-status-badge";
import { ProposalItem } from "./proposal-item";

interface Proposal {
  id: string;
  status: ProposalStatus;
  timeLeft?: string;
  title: string;
  publishDate: string;
  author: string;
}

interface ProposalsListProps {
  proposals: Proposal[];
  totalCount: number;
  onLoadMore?: () => void;
}

export function ProposalsList({
  proposals,
  totalCount,
  onLoadMore,
}: ProposalsListProps) {
  return (
    <>
      <div className="flex flex-col py-2 px-4 gap-2">
        {proposals.map((proposal) => (
          <ProposalItem
            key={proposal.id}
            status={proposal.status}
            timeLeft={proposal.timeLeft}
            title={proposal.title}
            publishDate={proposal.publishDate}
            author={proposal.author}
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
