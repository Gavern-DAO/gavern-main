"use client"
import React, { useState } from "react";
import Image from "next/image";
import DelegateActivity from "./delegate-activity";
import VotingHistory from "./voting-history";
import ProofOfWork from "./proof-of-work";
import ProofOfWorkModal from "./proof-of-work-modal";
import { useDelegateActivity, useVotingHistory, useProofOfWork } from "@/hooks/use-delegate";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import {
    DelegateActivitySkeleton,
    VotingHistorySkeleton,
    ProofOfWorkSkeleton
} from "./profile-tab-skeletons";

const tabs = ["Delegate Activity", "Voting history", "Proof of work"];

interface ProfileTabsProps {
    pubkey?: string;
}

const ProfileTabs = ({ pubkey }: ProfileTabsProps) => {
    const [activeTab, setActiveTab] = useState("Delegate Activity");

    // Fetch all data
    const { data: delegateActivity, isLoading: isLoadingActivity } = useDelegateActivity(pubkey);
    const { data: votingHistory, isLoading: isLoadingVoting } = useVotingHistory(pubkey);
    const { data: proofOfWork, isLoading: isLoadingPoW } = useProofOfWork(pubkey);

    // Auth context to check if this is the user's own profile
    const { publicKey, connected } = useWallet();
    const isOwnProfile = connected && publicKey?.toBase58() === pubkey;

    // Fetch mainnet-beta.json for DAO images
    const { data: mainnetBeta } = useQuery({
        queryKey: ["mainnetBeta"],
        queryFn: async () => {
            const response = await axios.get("/mainnet-beta.json");
            return response.data;
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

    const daoImageMap = useMemo(() => {
        if (!mainnetBeta) return {};
        return mainnetBeta.reduce((acc: Record<string, string>, dao: any) => {
            // Map by realmId (pubkey)
            if (dao.realmId) {
                acc[dao.realmId] = dao.ogImage || "/dao-1.png";
            }
            return acc;
        }, {});
    }, [mainnetBeta]);

    // Modal state
    const [isPoWModalOpen, setIsPoWModalOpen] = useState(false);

    const renderEmptyState = () => {
        let message = "";
        let action = null;

        switch (activeTab) {
            case "Delegate Activity":
                message = "No Delegate activity found!";
                break;
            case "Voting history":
                message = "No Voting history found!";
                break;
            case "Proof of work":
                if (isOwnProfile) {
                    message = "You don't have any proof of work uploaded.";
                    action = (
                        <button
                            onClick={() => setIsPoWModalOpen(true)}
                            className="mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            Upload proof of work
                        </button>
                    );
                } else {
                    message = "No proof of work upload by the delegate yet.";
                }
                break;
            default:
                message = "No content found.";
        }

        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="relative w-48 h-48 mb-4">
                    <Image
                        src="/EmptyState.png"
                        alt="Empty State"
                        fill
                        className="object-contain"
                    />
                </div>
                <p className="text-[#101828B2] dark:text-gray-400 text-[16px] leading-[24px] font-normal">
                    {message}
                </p>
                {action}
            </div>
        );
    };

    const isTabEmpty = () => {
        switch (activeTab) {
            case "Delegate Activity":
                return !delegateActivity || delegateActivity.length === 0;
            // return false;
            case "Voting history":
                return !votingHistory?.history || votingHistory.history.length === 0;
            case "Proof of work":
                return !proofOfWork || proofOfWork.length === 0;
            default:
                return true;
        }
    };

    const isLoading = () => {
        switch (activeTab) {
            case "Delegate Activity":
                return isLoadingActivity;
            case "Voting history":
                return isLoadingVoting;
            case "Proof of work":
                return isLoadingPoW;
            default:
                return false;
        }
    };

    return (
        <>
            <div className="flex gap-1.5 border-b border-gray-200/50 dark:border-[#282828] w-full mx-auto max-w-[1200px] bg-white dark:bg-[#010101] mt-6 items-center min-h-[76px] mb-4 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <div
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
              py-2 px-4 cursor-pointer
              font-(family-name:--font-geist-sans)
              text-[16px]
              leading-[24px]
              tracking-[0]
              whitespace-nowrap
              transition-all
              ${isActive
                                    ? "bg-linear-to-l from-[#22E9AD] to-[#9846FE] bg-clip-text text-transparent font-medium"
                                    : "text-[#101828B2] dark:text-gray-400 font-normal hover:text-gray-600 dark:hover:text-gray-200"
                                }
            `}
                        >
                            {tab}
                        </div>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="w-full mx-auto max-w-[1200px] bg-[#FFFFFF] dark:bg-[#010101] mb-10">
                {isLoading() ? (
                    <div className="">
                        {activeTab === "Delegate Activity" && <DelegateActivitySkeleton />}
                        {activeTab === "Voting history" && <VotingHistorySkeleton />}
                        {activeTab === "Proof of work" && <ProofOfWorkSkeleton />}
                    </div>
                ) : isTabEmpty() ? (
                    renderEmptyState()
                ) : (
                    <div className="">
                        {activeTab === "Delegate Activity" && <DelegateActivity data={delegateActivity || []} daoImageMap={daoImageMap} />}
                        {activeTab === "Voting history" && <VotingHistory data={votingHistory?.history || []} totalCount={votingHistory?.totalCount || 0} />}
                        {activeTab === "Proof of work" && <ProofOfWork data={proofOfWork || []} onAddMore={() => setIsPoWModalOpen(true)} isOwnProfile={isOwnProfile} />}
                    </div>
                )}
            </div>

            <ProofOfWorkModal open={isPoWModalOpen} onOpenChange={setIsPoWModalOpen} />
        </>
    );
};

export default ProfileTabs;
