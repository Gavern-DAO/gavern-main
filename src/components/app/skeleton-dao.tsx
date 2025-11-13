import React from 'react';
import { Skeleton } from '../ui/skeleton';
// DAO Header Skeleton
export function DaoHeaderSkeleton() {
    return (
        <section className="w-full min-h-[336px] bg-white dark:bg-[#010101] mt-4 rounded-[5px] relative overflow-hidden dark:border dark:border-[#282828B2]">
            {/* Banner section */}
            <div className="w-full relative h-[206px] overflow-hidden">
                {/* DAO Health badge */}
                <div className="flex items-center gap-2 absolute top-0 left-0 z-5 p-5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>

                {/* Blurred banner */}
                <div className="h-[164px] w-full overflow-hidden bg-[#FFFFFF80] dark:bg-[#01010180]">
                    <Skeleton className="w-full h-full" />
                </div>

                {/* DAO Avatar */}
                <div className="absolute bottom-0 left-1/2 w-[90px] aspect-square rounded-[5px] p-[5px] bg-white dark:bg-[#010101] shadow-lg flex items-center justify-center -translate-x-1/2">
                    <Skeleton className="w-full h-full rounded" />
                </div>
            </div>

            {/* Content section */}
            <div className="p-4 flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-start gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </div>
        </section>
    );
}

// Proposals Tab Skeleton
export function ProposalsTabSkeleton() {
    return (
        <div className="w-full bg-transparent space-y-4">
            {/* Stats Cards */}
            <div className="bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] p-4 rounded-[8px] gap-6 grid grid-cols-1 md:grid-cols-2">
                {/* Card 1 - Voter Turnout */}
                <div className="bg-black dark:bg-[#171717] rounded-[5px]">
                    <div className="pt-4 pb-3 px-4 min-h-[46px] flex items-center">
                        <Skeleton className="h-4 w-40 bg-gray-700" />
                    </div>
                    <div className="w-full py-6 px-3 bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] rounded-[5px] flex flex-col items-center justify-center min-h-[318px]">
                        <Skeleton className="w-[184px] h-[184px] rounded-full" />
                        <Skeleton className="w-[124px] h-[124px] rounded-full -mt-[62px]" />
                    </div>
                </div>

                {/* Card 2 - Top Members */}
                <div className="bg-black dark:bg-[#171717] rounded-[5px]">
                    <div className="pt-4 pb-3 px-4 min-h-[46px] flex items-center">
                        <Skeleton className="h-4 w-48 bg-gray-700" />
                    </div>
                    <div className="w-full py-5 pb-6 bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] rounded-[5px] flex flex-col min-h-[318px]">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">
                                            <Skeleton className="h-4 w-20" />
                                        </th>
                                        <th className="px-4 py-2">
                                            <Skeleton className="h-4 w-32 mx-auto" />
                                        </th>
                                        <th className="px-4 py-2">
                                            <Skeleton className="h-4 w-16 mx-auto" />
                                        </th>
                                        <th className="px-4 py-2">
                                            <Skeleton className="h-4 w-24 mx-auto" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3].map((i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="w-8 h-8 rounded-full" />
                                                    <div className="flex flex-col gap-1">
                                                        <Skeleton className="h-4 w-20" />
                                                        <Skeleton className="h-3 w-24" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Skeleton className="h-4 w-8 mx-auto" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Skeleton className="h-4 w-8 mx-auto" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Skeleton className="h-4 w-12 mx-auto" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Proposals List */}
            <div className="bg-[#FFFFFF] dark:bg-[#010101] dark:border dark:border-[#282828B2] rounded-[5px] flex flex-col gap-2">
                <div className="w-full border-b-[0.5px] border-b-[#E7E7E7] dark:border-b-[#282828B2] p-4 gap-1">
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="border-b border-[#E7E7E7] dark:border-[#282828B2] pb-3">
                            <Skeleton className="h-5 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6 mt-1" />
                            <div className="flex gap-2 mt-3">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Treasury Tab Skeleton
export function TreasuryTabSkeleton({ itemCount = 5 }: { itemCount?: number }) {
    return (
        <div className="bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] flex flex-col gap-2 pb-6 rounded-[5px]">
            {/* Header */}
            <div className="w-full border-b-[0.5px] border-b-[#E7E7E7] dark:border-b-[#282828B2] p-4 gap-1">
                <Skeleton className="h-4 w-48" />
            </div>

            {/* Treasury Cards */}
            <div className="px-4 py-2 gap-1.5 grid grid-cols-1">
                {Array.from({ length: itemCount }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 border-b border-[#E7E7E7] dark:border-[#282828B2]"
                    >
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// DAO Members Tab Skeleton
export function DaoMembersSkeleton({ rows = 8 }: { rows?: number }) {
    return (
        <div className="bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] rounded-[5px] overflow-hidden">
            {/* Header */}
            <div className="w-full border-b-[0.5px] border-b-[#E7E7E7] dark:border-b-[#282828B2] p-4">
                <Skeleton className="h-4 w-32" />
            </div>

            {/* Table */}
            <div className="overflow-hidden">
                {/* Table Header */}
                <div className="flex items-center p-6 border-b border-[#E7E7E7] dark:border-[#282828B2]">
                    <div className="flex-1">
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>

                {/* Table Rows */}
                {Array.from({ length: rows }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center p-6 border-b border-[#E7E7E7] dark:border-[#282828B2]"
                    >
                        {/* Member column */}
                        <div className="flex-1 flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>

                        {/* Proposals column */}
                        <div className="flex-1 flex justify-center">
                            <Skeleton className="h-4 w-8" />
                        </div>

                        {/* Votes column */}
                        <div className="flex-1 flex justify-center">
                            <Skeleton className="h-4 w-8" />
                        </div>

                        {/* Voting Power column */}
                        <div className="flex-1 flex justify-center">
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination/Load More */}
            <div className="flex items-center justify-center p-8">
                <Skeleton className="h-6 w-28" />
            </div>
        </div>
    );
}

// DAO Structure and Roles Skeleton
export function DaoStructureSkeleton() {
    return (
        <div className="bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] rounded-[5px] p-6">
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-6 w-48 mb-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-4 border border-[#E7E7E7] dark:border-[#282828B2] rounded">
                            <Skeleton className="h-5 w-32 mb-3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5 mt-2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}