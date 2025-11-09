import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProposalStatus } from "@/components/app/proposal-status-badge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateAddress = (address: string, length = 4) => {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export const mapProposalStatus = (status: string): ProposalStatus => {
  switch (status) {
    case "Voting":
      return "live";
    case "Succeeded":
      return "approved";
    case "Executing":
      return "executable";
    case "Completed":
      return "approved";
    case "Cancelled":
      return "cancelled";
    case "Defeated":
      return "failed";
    case "Vetoed":
      return "failed";
    case "Draft":
      return "cancelled";
    case "SigningOff":
      return "cancelled";
    case "ExecutingWithErrors":
      return "failed";
    default:
      return "cancelled";
  }
};
