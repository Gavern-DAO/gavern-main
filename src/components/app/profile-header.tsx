"use client"
import { useState, useMemo } from "react";
import ShareProfileModal from "./share-profile-modal";
import EditProfileModal from "./edit-profile-modal";

import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { useDelegateStats } from "@/hooks/use-delegate";
import { useSnsId } from "@/hooks/use-sns";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { Copy01Icon, PencilEdit02Icon, DiscordIcon, NewTwitterIcon, TelegramIcon, Tick01Icon } from "@hugeicons/core-free-icons";

interface ProfileHeaderProps {
    pubkey?: string;
}

export function ProfileHeader({ pubkey }: ProfileHeaderProps) {
    const { data: statsData, isLoading, isFetching } = useDelegateStats(pubkey!);
    const { snsId, isLoading: isSnsLoading } = useSnsId(pubkey);
    const { publicKey } = useWalletAuth();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

    const isOwner = useMemo(() => {
        return publicKey?.toBase58() === pubkey;
    }, [publicKey, pubkey]);

    const stats = useMemo(() => {
        if (!statsData) {
            return {
                proposalsCreated: 0,
                votesCast: 0,
                delegationsReceived: 0
            };
        }

        return {
            proposalsCreated: statsData.totalProposalsCreated || 0,
            votesCast: statsData.totalVotesCast || 0,
            delegationsReceived: statsData.totalDelegationsReceived || 0
        };
    }, [statsData]);

    // Format numbers helper
    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "m";
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + "k";
        }
        return num.toString();
    };

    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (pubkey) {
            navigator.clipboard.writeText(pubkey);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 500);
        }
    };

    const displayName = useMemo(() => {
        if (isSnsLoading) return "...";
        if (statsData?.name) return statsData.name;
        if (snsId) return snsId;
        return pubkey ? `${pubkey.slice(0, 6)}...${pubkey.slice(-4)}` : "Unnamed";
    }, [snsId, isSnsLoading, pubkey, statsData?.name]);

    return (
        <div className="w-full max-w-[1200px] mx-auto mt-4 bg-white dark:bg-[#010101] pb-5">
            {/* Banner Area with Blur */}
            <div className="relative h-[200px] md:h-[260px] w-full overflow-hidden">
                {/* Background Image Layer */}
                <div className="absolute inset-0">
                    <Image
                        src="/icoder.png"
                        alt="Banner Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Blur Overlay - using backdrop-filter: blur(50px) as requested */}
                    <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-[50px]" />
                </div>
            </div>

            {/* Profile Content Section */}
            <div className="px-6 md:px-10 relative">
                <div className="flex flex-col gap-4">

                    {/* Profile Picture - Overlapping */}
                    <div className="-mt-16 md:-mt-20 shrink-0 z-10 w-fit -ml-4 relative group">
                        {/* Animated Loading Border */}
                        {isFetching && (
                            <div className="absolute -inset-[3px] rounded-full loading-gradient-border animate-spin-slow" />
                        )}

                        <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-[#010101] overflow-hidden bg-white dark:bg-black shadow-sm ring-1 ring-gray-100/50 dark:ring-white/10 z-10">
                            <Image
                                src={statsData?.profilePictureUrl || "/icoder.png"}
                                alt={displayName}
                                width={144}
                                height={144}
                                className={`w-full h-full object-cover ${isFetching ? "opacity-50 blur-[1px]" : ""} transition-all duration-300`}
                            />
                        </div>
                        {/* Edit Button overlay - only show for owner */}
                        {isOwner && (
                            <button
                                onClick={() => setIsEditProfileModalOpen(true)}
                                className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-[#171717] border border-gray-200 dark:border-[#282828B2] rounded-full flex items-center justify-center shadow-lg text-gray-700 dark:text-gray-300 hover:scale-110 active:scale-95 transition-all cursor-pointer z-20"
                            >
                                <HugeiconsIcon icon={PencilEdit02Icon} size={18} />
                            </button>
                        )}
                    </div>

                    {/* Info Area */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">

                            {/* Left Column: Details */}
                            <div className="flex-1 max-max-2xl">
                                <div className="flex items-center gap-2 mb-2 relative">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {displayName}
                                    </h1>
                                    <div className="relative group/copy">
                                        {isCopied && (
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded shadow-lg animate-in fade-in slide-in-from-bottom-1 duration-200 whitespace-nowrap z-30">
                                                Copied!
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black dark:border-t-white" />
                                            </div>
                                        )}
                                        <button
                                            onClick={handleCopy}
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                                        >
                                            <HugeiconsIcon
                                                icon={isCopied ? Tick01Icon : Copy01Icon}
                                                size={18}
                                                className={isCopied ? "text-green-500" : ""}
                                            />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed mb-4">
                                    The official gavern profile of {pubkey ? `${pubkey.slice(0, 6)}...${pubkey.slice(-4)}` : "F1kz5...Gkw7"}, providing an overview of delegate&apos;s governance activity.
                                </p>

                                {/* Socials & Actions */}
                                <div className="flex items-center gap-4 mb-6">
                                    {/* X (Twitter) */}
                                    {statsData?.twitter ? (
                                        <Link
                                            href={`https://x.com/${statsData.twitter.replace('@', '')}`}
                                            target="_blank"
                                            className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                        >
                                            <HugeiconsIcon icon={NewTwitterIcon} />
                                        </Link>
                                    ) : (
                                        <div className="text-gray-300 dark:text-gray-700 cursor-not-allowed">
                                            <HugeiconsIcon icon={NewTwitterIcon} />
                                        </div>
                                    )}

                                    {/* Discord */}
                                    {statsData?.discord ? (
                                        <div className="relative group flex items-center justify-center">
                                            <div
                                                className="text-gray-400 hover:text-[#5865F2] transition-colors cursor-pointer"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(statsData.discord!);
                                                }}
                                            >
                                                <HugeiconsIcon icon={DiscordIcon} />
                                            </div>
                                            <div className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-black dark:bg-white text-white dark:text-black text-xs px-2 py-1 rounded shadow-lg z-50">
                                                {statsData.discord}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black dark:border-t-white"></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-300 dark:text-gray-700 cursor-not-allowed">
                                            <HugeiconsIcon icon={DiscordIcon} />
                                        </div>
                                    )}

                                    {/* Telegram */}
                                    {statsData?.telegram ? (
                                        <Link
                                            href={`https://t.me/${statsData.telegram.replace('@', '')}`}
                                            target="_blank"
                                            className="text-gray-400 hover:text-[#26A5E4] transition-colors"
                                        >
                                            <HugeiconsIcon icon={TelegramIcon} />
                                        </Link>
                                    ) : (
                                        <div className="text-gray-300 dark:text-gray-700 cursor-not-allowed">
                                            <HugeiconsIcon icon={TelegramIcon} />
                                        </div>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                                    <div className="flex gap-1">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {isLoading ? "..." : formatNumber(stats.proposalsCreated)}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">proposals created</span>
                                    </div>
                                    <div className="hidden sm:block w-px h-4 bg-gray-200 dark:bg-zinc-800" />
                                    <div className="flex gap-1">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {isLoading ? "..." : formatNumber(stats.votesCast)}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">vote casted</span>
                                    </div>
                                    <div className="hidden sm:block w-px h-4 bg-gray-200 dark:bg-zinc-800" />
                                    <div className="flex gap-1">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {isLoading ? "..." : formatNumber(stats.delegationsReceived)}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">Delegations Received</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Activity Rating */}
                            <div className="mt-8 lg:mt-0 flex flex-col gap-8">
                                <div className="w-full sm:w-auto sm:min-w-[300px]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                            DAOs activity rating
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                            </svg>
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Top 10% of delegates.</span>
                                    </div>

                                    {/* Custom Rating Bar */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">0</span>
                                        <div className="flex-1 relative h-3 flex gap-1">
                                            {/* Red Segment */}
                                            <div className="w-[45%] bg-[#D7000B] rounded-l-full"></div>
                                            {/* Yellow Segment */}
                                            <div className="w-[20%] bg-[#E5E510]"></div>
                                            {/* Green Segment */}
                                            <div className="w-[35%] bg-[#00B604] rounded-r-full"></div>

                                            {/* Indicator Dot */}
                                            <div className="absolute top-1/2 -translate-y-1/2 left-[55%] -translate-x-1/2 flex items-center justify-center">
                                                <div className="w-8 h-8 bg-white rounded-full border-[6px] border-[#E5E510] shadow-sm flex items-center justify-center z-10">
                                                    <span className="text-[11px] font-bold text-gray-900">3.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">5</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsShareModalOpen(true)}
                                    className="w-full bg-black dark:bg-white text-white dark:text-black font-medium py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                                >
                                    Share delegate profile
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <ShareProfileModal
                open={isShareModalOpen}
                onOpenChange={setIsShareModalOpen}
                pubkey={pubkey}
            />

            <EditProfileModal
                open={isEditProfileModalOpen}
                onOpenChange={setIsEditProfileModalOpen}
                initialData={{
                    twitter: statsData?.twitter,
                    telegram: statsData?.telegram,
                    discord: statsData?.discord,
                    profilePictureUrl: statsData?.profilePictureUrl,
                }}
                pubkey={pubkey}
            />
        </div>
    );
}
