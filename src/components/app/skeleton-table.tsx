import React from 'react';
import { Skeleton } from '../ui/skeleton';
// Skeleton row component
const SkeletonRow = () => {
    return (
        <div className="flex items-center p-6 border-b border-[#E7E7E7] dark:border-[#282828B2]">
            {/* DAO Name Column */}
            <div className="flex-1 flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                </div>
            </div>

            {/* DAO Health Column */}
            <div className="flex-1 flex items-center justify-center gap-2">
                <Skeleton className="w-2 h-2 rounded-full" />
                <Skeleton className="h-5 w-16" />
            </div>

            {/* Proposals Column */}
            <div className="flex-1 flex items-center justify-center">
                <Skeleton className="h-5 w-8" />
            </div>

            {/* Treasury Balance Column */}
            <div className="flex-1 flex items-center justify-center">
                <Skeleton className="h-5 w-24" />
            </div>
        </div>
    );
};

export default function SkeletonTable({ rows = 5 }) {
    return (
        <div className="lg:max-w-[1200px] bg-white dark:bg-[#010101] mx-auto rounded-[10px] border-b-[0.5px] dark:border-[.5px] dark:border-[#282828B2] overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center p-6 border-b border-[#E7E7E7] dark:border-[#282828B2] bg-white dark:bg-[#010101]">
                <div className="flex-1">
                    <Skeleton className="h-6 w-24" />
                </div>
                <div className="flex-1 flex justify-center">
                    <Skeleton className="h-6 w-24" />
                </div>
                <div className="flex-1 flex justify-center">
                    <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex-1 flex justify-center">
                    <Skeleton className="h-6 w-32" />
                </div>
            </div>

            {/* Table Body */}
            <div>
                {Array.from({ length: rows }).map((_, index) => (
                    <SkeletonRow key={index} />
                ))}
            </div>

            {/* Load More Footer */}
            <div className="flex items-center justify-center p-8">
                <Skeleton className="h-6 w-28" />
            </div>
        </div>
    );
}