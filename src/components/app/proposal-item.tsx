import { ChevronDown } from "lucide-react";
import {
  ProposalStatusBadge,
  type ProposalStatus,
} from "./proposal-status-badge";
import { mapProposalStatus } from "@/lib/utils";

interface ProposalItemProps {
  status: ProposalStatus;
  title: string;
  publishDate: string;
  author: string;
}

export function ProposalItem({
  status,
  title,
  publishDate,
  author,
}: ProposalItemProps) {
  return (
    <div
      className="w-full p-4 flex items-start justify-between gap-4 cursor-pointer rounded-[5px] dark:border dark:border-[#282828B2]"
      style={{
        boxShadow: "0px 1px 40px 0px #1018280D",
      }}
    >
      <div className="flex flex-col gap-2 flex-1">
        <ProposalStatusBadge status={mapProposalStatus(status)} />
        <h3 className="text-[#101828] dark:text-[#EDEDED] font-medium text-base leading-tight">
          {title}
        </h3>
        <p className="text-[#6B7280] dark:text-[#909090] text-sm">
          Publish on {publishDate} by {author}
        </p>
      </div>
      <ChevronDown className="w-5 h-5 text-[#9CA3AF] dark:text-[#909090] flex-shrink-0 mt-1" />
    </div>
  );
}
