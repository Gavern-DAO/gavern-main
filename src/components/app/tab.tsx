"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import clsx from "clsx";
import { CiSearch } from "react-icons/ci";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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
    <div className="bg-white dark:bg-[#010101] md:bg-transparent pt-4 md:pt-0 mb-4 pb-4 md:pb-0 space-y-4">
      <Label className="md:hidden flex items-center bg-[#F7F7F7] dark:bg-[#171717] max-w-[95%] mx-auto py-2 px-4 rounded-[8px]">
        <CiSearch color="#909090" />
        <Input
          className="bg-transparent border-none outline-none shadow-none focus:outline-none focus:ring-0 px-0 dark:px-3 focus-visible:outline-0 focus-visible:ring-0 min-w-[353px] placeholder:text-[#909090] text-base leading-[24px] font-normal dark:bg-transparent"
          placeholder="Search for a DAO"
        />
      </Label>
      <div className="max-w-[95%] lg:max-w-[1200px] bg-transparent md:bg-white md:dark:bg-[#010101] dark:border-0 dark:md:border dark:md:border-[#282828B2]  mx-auto rounded-[10px] border-0 md:border-b-[0.5px] flex items-center justify-between p-0 md:py-4 px-0 md:px-6 gap-4">
        <div className="hidden md:flex flex-wrap items-center gap-2">
          {tabs.map((tab, index) => (
            <div
              key={index}
              onClick={() => handleTabClick(tab)}
              className={clsx(
                `flex items-center py-2.5 px-4 gap-2 rounded-md transition-all duration-200 cursor-pointer`
              )}
            >
              {activeTab.item === tab.item ? tab.iconActive : tab.icon}
              <span
                className={clsx(
                  "text-sm md:text-base select-none",
                  activeTab.item === tab.item
                    ? "bg-gradient-to-r from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent font-medium"
                    : "dark:text-[#A1A1A1] text-[#101828B2]"
                )}
              >
                {tab.item}
              </span>
            </div>
          ))}
        </div>
        <Select
          value={activeTab.item}
          onValueChange={(value) => {
            const selectedTab = tabs.find((tab) => tab.item === value);
            if (selectedTab && onTabChange) {
              onTabChange(selectedTab);
            }
          }}
        >
          <SelectTrigger className="md:hidden dark:text-[#A1A1A1] w-full py-2 px-3 border-[#E7E7E7] dark:border-[#282828B2] bg-white dark:bg-[#010101] hover:dark:bg-[#010101]/90 min-h-[44px]">
            <SelectValue placeholder="Select a tab" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#010101]">
            {tabs.map((tab, index) => (
              <SelectItem key={index} value={tab.item}>
                {tab.icon}
                {tab.item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            console.log("Selected category:", value);
          }}
        >
          <SelectTrigger className="dark:text-[#A1A1A1] w-[140px] md:w-[180px] py-2 px-3 border-[#E7E7E7] dark:border-[#282828B2] bg-white dark:bg-[#010101] hover:dark:bg-[#010101]/90 min-h-[44px]">
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
    </div>
  );
}
