"use client";

import { VotingHistoryItem } from "@/types/delegate";
import { ProposalStatusBadge, ProposalStatus } from "./proposal-status-badge";

interface VotingHistoryProps {
    data: VotingHistoryItem[];
    totalCount: number;
}

const VotingHistory = ({ data, totalCount }: VotingHistoryProps) => {
    return (
        <div className="w-full">
            <h2 className="flex items-center gap-[4px] w-full px-6 md:px-10 py-4 border-b-[0.5px] border-[#E7E7E7] dark:border-[#282828] font-(family-name:--font-geist-sans) font-medium text-[16px] leading-[100%] tracking-[0%] text-[#101828] dark:text-white">
                Proposals <span className="font-(family-name:--font-geist-sans) font-normal text-[12px] leading-[100%] tracking-[0%] text-[#101828B2] dark:text-gray-400">({totalCount})</span>
            </h2>

            <div className="flex flex-col gap-4 bg-gray-50/50 dark:bg-transparent px-6 md:px-10 py-4">
                {data.map((proposal, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-[#282828] rounded-xl p-4 md:p-5 cursor-pointer transition-shadow"
                        style={{ boxShadow: '0px 1px 40px 0px #1018280D' }}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1 w-full">
                                {/* Status Line */}
                                <div className="flex items-center gap-1.5 text-xs md:text-sm mb-1">
                                    <ProposalStatusBadge status={proposal.status as ProposalStatus} />

                                    {proposal.status === "Active" && proposal.hoursLeft && (
                                        <>
                                            <span className="text-[#909090] dark:text-gray-500 text-[12px] leading-[100%] font-normal font-(family-name:--font-geist-sans)">
                                                {proposal.hoursLeft} hours left!
                                            </span>
                                            <span className="text-gray-300 dark:text-gray-700">-</span>
                                        </>
                                    )}

                                    {proposal.status !== "Active" && <span className="text-gray-300 dark:text-gray-700">-</span>}

                                    <span className={`${getVoteColor(proposal.voteChoice)} font-(family-name:--font-geist-sans) font-normal text-[12px] leading-[100%] tracking-[0%]`}>
                                        Voted: {proposal.voteChoice}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-(family-name:--font-geist-sans) font-medium text-[16px] leading-[24px] text-[#101828] dark:text-gray-200">
                                    {proposal.proposalName}
                                </h3>

                                {/* Metadata */}
                                <p className="font-(family-name:--font-geist-sans) font-normal text-[14px] leading-[100%] tracking-[0%] text-[#909090] dark:text-gray-500 mt-1">
                                    Published on {new Date(proposal.proposalCreatedAt).toLocaleDateString()} by {proposal.proposalCreator.slice(0, 6)}...{proposal.proposalCreator.slice(-4)}
                                </p>
                            </div>

                            <button className="text-gray-400 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helper for vote colors
const getVoteColor = (vote: VotingHistoryItem["voteChoice"]) => {
    switch (vote) {
        case "Approve":
            return "text-[#00AA09]";
        case "Deny":
            return "text-[#D70000]";
        default:
            return "text-[#00AA09]";
    }
}

export default VotingHistory;
