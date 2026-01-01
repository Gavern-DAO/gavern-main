"use client";

import Image from "next/image";
import { DelegateActivity as DelegateActivityType } from "@/types/delegate";
import { formatNumber } from "@/lib/utils";

interface DelegateActivityProps {
    data: DelegateActivityType[];
    daoImageMap: Record<string, string>;
}

const DelegateActivity = ({ data, daoImageMap }: DelegateActivityProps) => {

    return (
        <div className="w-full">
            {/* Table Header */}
            <div className="hidden md:flex w-full font-(family-name:--font-geist-sans) font-normal text-[16px] leading-[24px] tracking-[0] text-[#4C4C4C] dark:text-gray-400 border-b border-gray-100 dark:border-[#282828] pb-4 mb-4 px-6 md:px-10 pt-4">
                <div className="flex-1">DAO Name</div>
                <div className="w-40 text-center">Proposals created</div>
                <div className="w-40 text-center">Votes casted</div>
                <div className="w-40 text-center">Governance power</div>
            </div>

            {/* Table Body */}
            <div className="flex flex-col gap-4 md:gap-6">
                {data.map((dao, index) => (
                    <div
                        key={index}
                        className="flex flex-col md:flex-row w-full md:items-center py-4 md:py-2 border md:border-b border-gray-100 dark:border-[#1a1a1a] rounded-xl md:rounded-none md:border-x-0 md:border-t-0 last:border-0 px-6 md:px-10 bg-white dark:bg-[#0a0a0a] md: dark:md:bg-transparent shadow-sm md:shadow-none gap-4 md:gap-0"
                    >
                        <div className="flex-1 flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                                <Image
                                    src={daoImageMap[dao.pubkey] || "/dao-1.png"}
                                    alt={dao.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-(family-name:--font-geist-sans) font-medium text-[20px] leading-[24px] tracking-[0] text-[#101828] dark:text-gray-200">{dao.name}</span>
                        </div>

                        {/* Mobile Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 md:flex md:gap-0 w-full md:w-auto mt-2 md:mt-0">
                            <div className="flex flex-col md:block w-auto md:w-40 text-left md:text-center">
                                <span className="md:hidden text-xs text-gray-500 dark:text-gray-500 mb-1">Proposals</span>
                                <span className="font-(family-name:--font-geist-sans) font-normal text-[16px] leading-[24px] tracking-[0] text-[#101828] dark:text-gray-200">
                                    {dao.proposalsCreated}
                                </span>
                            </div>
                            <div className="flex flex-col md:block w-auto md:w-40 text-left md:text-center">
                                <span className="md:hidden text-xs text-gray-500 dark:text-gray-500 mb-1">Votes</span>
                                <span className="font-(family-name:--font-geist-sans) font-normal text-[16px] leading-[24px] tracking-[0] text-[#101828] dark:text-gray-200">
                                    {dao.votesCast}
                                </span>
                            </div>
                            <div className="flex flex-col md:block w-auto md:w-40 text-left md:text-center col-span-2 md:col-span-1 border-t md:border-0 dark:border-[#282828] pt-2 md:pt-0 mt-2 md:mt-0">
                                <span className="md:hidden text-xs text-gray-500 dark:text-gray-500 mb-1">Governance Power</span>
                                <span className="font-(family-name:--font-geist-sans) font-normal text-[16px] leading-[24px] tracking-[0] text-[#101828] dark:text-gray-200">
                                    {formatNumber(dao.governancePower)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-gray-500 text-sm pb-9">
                That&apos;s all we&apos;ve got!
            </div>
        </div>
    );
};

export default DelegateActivity;

