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

export function formatNumber(value: number | string, decimals = 0): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "0";

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(decimals).replace(/\.00$/, "") + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(decimals).replace(/\.00$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(decimals).replace(/\.00$/, "") + "K";
  }

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}
