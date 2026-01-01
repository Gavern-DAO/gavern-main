import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  ProposalStatusBadge,
  type ProposalStatus,
} from "./proposal-status-badge";
import { mapProposalStatus, truncateAddress, cn } from "@/lib/utils";

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

  // Function to detect and linkify URLs in text
  const linkify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3B82F6] hover:underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Simple function to format description: handle bullet points and links
  const formatDescription = (text: string) => {
    if (!text) return null;

    // Split by lines and check for bullet points or simple list markers
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('*') || trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        return (
          <li key={idx} className="ml-4 list-disc text-[#6B7280] dark:text-[#909090] text-xs md:text-sm leading-relaxed">
            {linkify(trimmedLine.replace(/^[*•-]\s*/, ''))}
          </li>
        );
      }
      return (
        <p key={idx} className={cn(
          "text-[#6B7280] dark:text-[#909090] text-xs md:text-sm leading-relaxed",
          idx === 0 && "font-bold text-[#101828] dark:text-[#EDEDED] mb-2"
        )}>
          {linkify(trimmedLine)}
        </p>
      );
    });
  };

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
                formatDescription(description)
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
