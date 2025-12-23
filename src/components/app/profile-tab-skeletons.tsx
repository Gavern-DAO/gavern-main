import { Skeleton } from "@/components/ui/skeleton";

export const DelegateActivitySkeleton = () => {
    return (
        <div className="w-full">
            {/* Table Header */}
            <div className="flex w-full border-b border-gray-100 pb-4 mb-4 px-6 pt-4">
                <div className="flex-1">
                    <Skeleton className="h-6 w-24" />
                </div>
                <div className="w-32 md:w-40 flex justify-end">
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="w-32 md:w-40 flex justify-end">
                    <Skeleton className="h-6 w-24" />
                </div>
                <div className="w-32 md:w-40 flex justify-end">
                    <Skeleton className="h-6 w-32" />
                </div>
            </div>

            {/* Table Body */}
            <div className="flex flex-col gap-6">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex w-full items-center py-2 border-b border-gray-50 last:border-0 px-6"
                    >
                        <div className="flex-1 flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                            <Skeleton className="h-6 w-48" />
                        </div>
                        <div className="w-32 md:w-40 flex justify-end">
                            <Skeleton className="h-6 w-8" />
                        </div>
                        <div className="w-32 md:w-40 flex justify-end">
                            <Skeleton className="h-6 w-8" />
                        </div>
                        <div className="w-32 md:w-40 flex justify-end">
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const VotingHistorySkeleton = () => {
    return (
        <div className="w-full">
            <div className="flex items-center gap-[4px] w-full p-[16px] border-b-[0.5px] border-[#E7E7E7] dark:border-[#282828]">
                <Skeleton className="h-6 w-32" />
            </div>

            <div className="flex flex-col gap-4 bg-gray-50/50 dark:bg-transparent p-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-[#282828] rounded-xl p-5"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-3 w-full">
                                {/* Status Line */}
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-4 h-4 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-32" />
                                </div>

                                {/* Title */}
                                <Skeleton className="h-6 w-3/4" />

                                {/* Metadata */}
                                <Skeleton className="h-4 w-1/2 mt-1" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ProofOfWorkSkeleton = () => {
    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between w-full px-[16px] border-b-[0.5px] border-[#E7E7E7] dark:border-[#282828] py-4">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-11 w-28 rounded-md" />
            </div>

            {/* Content Area */}
            <div className="flex flex-col gap-4 bg-gray-50/50 dark:bg-transparent p-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-[#282828] rounded-xl p-5"
                    >
                        <div className="flex flex-col gap-4">
                            {/* Title and Edit Button */}
                            <div className="flex items-start justify-between gap-3">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-5 w-40" />
                            </div>

                            {/* DAO Name */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-36" />
                                <Skeleton className="w-4 h-4 rounded-full" />
                            </div>

                            {/* Skills */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
