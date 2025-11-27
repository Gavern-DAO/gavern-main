"use client";
import React from "react";
import { IAllDao } from "./all-daos-table";
import { IClosedDao } from "./closed-daos-table";
import DaoImage from "./dao-image";
import { Checkbox } from "@/components/ui/checkbox";

interface DaoCardProps {
  dao: IAllDao | IClosedDao;
  onClick: () => void;
  showClosed?: boolean;
  showSelect?: boolean;
  isSelected?: boolean;
  onSelectChange?: (checked: boolean, daoId: string) => void;
}

const DaoCard: React.FC<DaoCardProps> = ({
  dao,
  onClick,
  showClosed = false,
  showSelect = false,
  isSelected = false,
  onSelectChange,
}) => {
  const handleCheckboxChange = (checked: boolean) => {
    onSelectChange?.(checked, dao.id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-checkbox-container]")) {
      return;
    }
    onClick();
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#282828] p-4 cursor-pointer transition-all hover:shadow-md rounded-[10px] flex flex-col gap-4.5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {showSelect && (
            <div
              data-checkbox-container
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => handleCheckboxChange(!!checked)}
                className="h-5 w-5 text-blue-600"
              />
            </div>
          )}
          <DaoImage src={dao.image} alt={dao.daoName} />
          <div className="space-y-1">
            <h3 className="text-[#101828] dark:text-[#EDEDED] font-medium text-sm">
              {dao.daoName}
            </h3>
            {dao.isActive && (
              <div className="flex items-center gap-2">
                <span className="inline-block py-1 px-2 border rounded-full border-[#75FA7C] bg-[#00D70B1F] text-[#00BF0A] text-[8px] font-medium">
                  Active Proposal
                </span>
                <span className="text-xs text-[#909090] dark:text-[#A1A1A1]">
                  31 days left!
                </span>
              </div>
            )}
            {!dao.isActive && showClosed && (
              <div className="flex items-center gap-2">
                <span className="inline-block py-1 px-2 border rounded-full border-[#F77777] bg-[#EA17171F] text-[#EA1717] text-[8px] font-medium">
                  Closed Proposal
                </span>
                <span className="text-xs text-[#909090] dark:text-[#A1A1A1]">
                  31 days ago!
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1 text-xs">
          <p className="text-[#4C4C4C] dark:text-[#A1A1A1]">Proposal:</p>
          <p className="font-medium text-[#101828] dark:text-white">
            {dao.proposals.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 text-sm">
        <div className="flex gap-1">
          <p className="text-[#909090] dark:text-[#A1A1A1] text-nowrap">
            Treasury Balance
          </p>
          <p className="font-medium text-[#101828] dark:text-white">
            {dao.treasuryBalance}
          </p>
        </div>

        <div className="flex text-sm gap-1.5">
          <p className="text-[#909090] dark:text-[#A1A1A1] text-nowrap">
            Dao Health:
          </p>
          <p className="flex items-center gap-1.5">
            <section
              className={`w-2 h-2 rounded-full ${
                dao.daoHealth === "Alive"
                  ? "bg-[#00AA09]"
                  : dao.daoHealth === "Dead"
                  ? "bg-[#D70000]"
                  : "bg-[#FFD700]"
              }`}
            />
            <span className="text-sm text-[#101828] dark:text-[#EDEDED]">
              {dao.daoHealth}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DaoCard;