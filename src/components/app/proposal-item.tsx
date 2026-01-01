import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  ProposalStatusBadge,
  type ProposalStatus,
} from "./proposal-status-badge";
import { mapProposalStatus, truncateAddress, cn } from "@/lib/utils";
import { FormattedContent } from "./formatted-content";

interface ProposalItemProps {
  status: ProposalStatus;
  title: string;
  publishDate: string;
  author: string;
  description: string;
  numberOfVotes: number;
  participationRate: number;
}

export function ProposalItem({
  status,
  title,
  publishDate,
  author,
  description,
  numberOfVotes,
  participationRate,
}: ProposalItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "w-full flex flex-col cursor-pointer rounded-[5px] transition-all duration-200 border border-transparent",
        isExpanded
          ? "border-[#E7E7E7] dark:border-[#333333] shadow-lg dark:shadow-none"
          : "dark:border-[#282828B2]"
      )}
      style={{
        boxShadow: isExpanded ? undefined : "0px 1px 40px 0px #1018280D",
      }}
    >
      {/* Header Container */}
      <div className="w-full p-3 md:p-4 flex items-start justify-between gap-3 md:gap-4">
        <div className="flex flex-col gap-1.5 md:gap-2 flex-1 min-w-0">
          <ProposalStatusBadge status={mapProposalStatus(status)} />
          <h3 className="text-[#101828] dark:text-[#EDEDED] font-medium text-sm md:text-base leading-tight">
            {title}
          </h3>
          <p className="text-[#6B7280] dark:text-[#909090] text-xs md:text-sm">
            Publish on {publishDate} by {truncateAddress(author)}
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-[#9CA3AF] dark:text-[#909090] flex-shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-[#9CA3AF] dark:text-[#909090] flex-shrink-0 mt-1" />
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-col">
          {/* Divider */}
          <div className="h-[0.5px] w-full bg-[#E7E7E7] dark:bg-[#282828B2]" />

          {/* Main Content */}
          <div className="p-3 md:p-4 flex flex-col gap-4 text-[#6B7280] dark:text-[#909090]">
            <div className="flex flex-col gap-1">
              {description && description.trim() !== "" ? (
                <FormattedContent
                  content={description}
                  className="text-[#6B7280] dark:text-[#909090] text-xs md:text-sm leading-relaxed"
                />
              ) : (
                <p className="text-xs md:text-sm italic opacity-70">
                  no description for this proposal
                </p>
              )}
            </div>

            {/* Stats Section */}
            <div className="flex items-center justify-between gap-2 text-[10px] md:text-xs font-medium">
              <div className="text-[#6B7280] dark:text-[#909090]">
                Number of voters: <span className="font-semibold bg-gradient-to-l from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent">{numberOfVotes} votes</span> recorded.
              </div>
              <div className="flex items-center gap-1">
                <span className="bg-gradient-to-l from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent font-semibold">
                  {participationRate}%
                </span>
                <span className="text-[#6B7280] dark:text-[#909090]">participation</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
