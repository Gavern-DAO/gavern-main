import { type ReactElement } from "react";
import RoleCard from "./role-card";

export interface Role {
  id: string;
  title: string;
  description: string;
  holder?: string;
  isVacant?: boolean;
  colorClass?: string;
}

export const rolesData: Role[] = [
  {
    id: "1",
    title: "Treasury Manager",
    description:
      "Manages the DAO's on-chain assets, oversees fund allocations, multisig participation.",
    holder: "7A6Cr...3MJAx",
    colorClass: "border-cyan-500 text-cyan-500",
  },
  {
    id: "2",
    title: "Community Moderator",
    description: "Manages events, onboarding, and announcements.",
    holder: "7A6Cr...3MJAx",
    colorClass: "border-purple-500 text-purple-500",
  },
  {
    id: "3",
    title: "Growth/Marketing Lead",
    description:
      "Tracks metrics, creates outreach strategies, manages partnerships.",
    holder: "7A6Cr...3MJAx",
    colorClass: "border-cyan-500 text-cyan-500",
  },
  {
    id: "4",
    title: "Chief Technology Officer",
    description: "Task: builds smart contracts, handles bug fixes or updates.",
    isVacant: true,
    colorClass: "border-cyan-500 text-cyan-500",
  },
  {
    id: "5",
    title: "Grants Coordinator",
    description:
      "Oversees the grants program, manages application processes, disbursements, and reporting.",
    holder: "7A6Cr...3MJAx",
    colorClass: "border-purple-500 text-purple-500",
  },
  {
    id: "6",
    title: "Design Lead",
    description: "Owns brand identity, visuals, and product design work.",
    holder: "7A6Cr...3MJAx",
    colorClass: "border-cyan-500 text-cyan-500",
  },
  {
    id: "7",
    title: "Legal/Compliance Lead",
    description:
      "Reviews contracts or ensures DAO meets off-chain obligations.",
    holder: "7A6Cr...3MJAx",
    colorClass: "border-cyan-500 text-cyan-500",
  },
  {
    id: "8",
    title: "DAO Secretary / Notetaker",
    description: "Documents decisions, maintains DAO knowledge base.",
    holder: "7A6Cr...3MJAx",
    colorClass: "border-purple-500 text-purple-500",
  },
  {
    id: "9",
    title: "Content Creator",
    description: "Task: Writes blogs, tweets, newsletter content",
    isVacant: true,
    colorClass: "border-cyan-500 text-cyan-500",
  },
];

export default function DaoStructureRoles(): ReactElement {
  return (
    <div className="bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] rounded-[5px] flex flex-col gap-2 pb-6">
      <div className="w-full border-b-[0.5px] border-b-[#E7E7E7] dark:border-b-[#282828B2] p-4 gap-1">
        <h2 className="text-[#101828] dark:text-[#EDEDED] font-medium text-base leading-[100%]">
          DAO Structure and Roles.
        </h2>
      </div>
      <div className="px-4 py-2 gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {rolesData.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>
    </div>
  );
}
