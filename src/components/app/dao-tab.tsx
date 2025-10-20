import clsx from "clsx";
import { type ReactElement } from "react";

export interface DaoTabProps {
  tabs: string[];
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export default function DaoTab(props: Readonly<DaoTabProps>): ReactElement {
  return (
    <div className="w-full bg-white dark:bg-[#010101] rounded-[5px] border-b-[0.5px] dark:border dark:border-[#282828B2] py-4 flex items-center gap-1.5 mt-6 mb-4">
      {props.tabs.map((tab, index) => (
        <div
          key={index}
          className={clsx(
            "py-2 px-4 text-regular text-base leading-[24px] cursor-pointer select-none",
            props.activeTab === tab
              ? "bg-gradient-to-r from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent font-medium"
              : "text-[#101828B2] dark:text-[#A1A1A1] ",
          )}
          onClick={() => props.onTabChange?.(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}
