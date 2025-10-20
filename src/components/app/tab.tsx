"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import clsx from "clsx";

export interface IProps {
  tabs: { item: string; icon: React.ReactNode; iconActive: React.ReactNode }[];
  activeTab: {
    item: string;
    icon: React.ReactNode;
    iconActive: React.ReactNode;
  };
  onTabChange?: (tab: {
    item: string;
    icon: React.ReactNode;
    iconActive: React.ReactNode;
  }) => void;
}

export default function Tab({ tabs, onTabChange, activeTab }: IProps) {
  const handleTabClick = (tab: {
    item: string;
    icon: React.ReactNode;
    iconActive: React.ReactNode;
  }) => {
    // setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="lg:max-w-[1200px] bg-white dark:border dark:border-[#282828B2] dark:bg-[#010101] mx-auto rounded-[10px] border-b-[0.5px] flex items-center justify-between py-4 px-4 md:px-6 ">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => handleTabClick(tab)}
            className={clsx(
              `flex items-center py-2.5 px-4 gap-2 rounded-md transition-all duration-200 cursor-pointer`,
            )}
          >
            {activeTab.item === tab.item ? tab.iconActive : tab.icon}
            <span
              className={clsx(
                "text-sm md:text-base select-none",
                activeTab.item === tab.item
                  ? "bg-gradient-to-r from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent font-medium"
                  : "dark:text-[#A1A1A1] text-[#101828B2]",
              )}
            >
              {tab.item}
            </span>
          </div>
        ))}
      </div>
      <Select
        onValueChange={(value) => {
          console.log("Selected category:", value);
        }}
      >
        <SelectTrigger className="dark:text-[#A1A1A1] w-[140px] md:w-[180px] py-2 px-3 border-[#E7E7E7] dark:border-[#282828B2] bg-white dark:bg-[#010101] hover:dark:bg-[#010101]/90">
          <SelectValue placeholder="Categories" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-[#010101]">
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
