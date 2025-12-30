"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CiSearch } from "react-icons/ci";
import { Label } from "../ui/label";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface Dao {
    pubkey: string;
    name: string;
}

interface MainnetDao {
    realmId: string;
    ogImage: string;
}

export default function DaoSearch() {
    const [query, setQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [lastSearchedQuery, setLastSearchedQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: allDaos } = useQuery<Dao[]>({
        queryKey: ["allDaos"],
        queryFn: async () => {
            const response = await axios.get("/api/daos");
            return response.data;
        },
        staleTime: 1000 * 60 * 30, // 30 minutes
    });

    const { data: mainnetBeta } = useQuery<MainnetDao[]>({
        queryKey: ["mainnetBeta"],
        queryFn: async () => {
            const response = await axios.get("/mainnet-beta.json");
            return response.data;
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

    const results = useMemo(() => {
        if (!lastSearchedQuery.trim() || !allDaos) return [];

        // Filter DAOs that contain the letters of query in order
        return allDaos.filter((dao) =>
            dao.name?.toLowerCase().includes(lastSearchedQuery.toLowerCase())
        );

    }, [lastSearchedQuery, allDaos]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (query.trim()) {
                setLastSearchedQuery(query);
                setShowResults(true);
            } else {
                setShowResults(false);
                setLastSearchedQuery("");
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [query]);

    const handleClear = () => {
        setQuery("");
        setShowResults(false);
        setLastSearchedQuery("");
    };

    const getLogo = (pubkey: string) => {
        const mainnetDao = mainnetBeta?.find((m) => m.realmId === pubkey);
        return mainnetDao?.ogImage ?? "/dao-1.png";
    };

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isSuccessful = query.trim() !== "" && query === lastSearchedQuery;

    return (
        <div className="relative w-full md:w-auto" ref={containerRef}>
            <Label className={cn(
                "hidden md:flex items-center gap-2 relative bg-transparent rounded-[8px] px-3 h-10 min-w-[353px] lg:min-w-[450px] transition-all duration-300",
                "focus-within:bg-[#F5F5F5] dark:focus-within:bg-[#0D0D0D] focus-within:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]"
            )}>

                <CiSearch color="#909090" className="text-xl shrink-0" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() && setShowResults(true)}

                    className="bg-transparent border-none outline-none shadow-none focus:outline-none focus:ring-0 px-0 dark:px-3 focus-visible:outline-0 focus-visible:ring-0 flex-1 placeholder:text-[#909090] text-base leading-[24px] font-normal dark:bg-transparent pr-[85px]"
                    placeholder="Search for a DAO"
                />
                {query.trim() && (
                    <Button
                        variant="default"
                        onClick={isSuccessful ? handleClear : () => setLastSearchedQuery(query)}
                        className={cn(
                            "absolute right-1 h-[32px] px-4 rounded-[10px] text-[14px] font-medium transition-all z-10",
                            "bg-[#010101] text-white hover:bg-[#010101]/90 dark:bg-white dark:text-[#010101] dark:hover:bg-white/90"
                        )}
                    >
                        {isSuccessful ? "Clear" : "Search"}
                    </Button>
                )}
            </Label>

            {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0a0a0a] border border-[#e7e7e7] dark:border-[#282828] rounded-[10px] shadow-lg z-[100] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-[#282828]">
                    {results.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {results.map((dao) => (
                                <Link
                                    key={dao.pubkey}
                                    href={`/dao/${dao.pubkey}`}
                                    className="flex items-center gap-3 px-3 h-[52px] rounded-[8px] border border-transparent hover:border-[#e7e7e7] dark:hover:border-[#282828] hover:bg-gray-50/50 dark:hover:bg-[#1a1a1a]/50 hover:shadow-sm transition-all duration-200 group"
                                    onClick={() => setShowResults(false)}
                                >
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm border border-gray-100 dark:border-gray-800">
                                        <Image
                                            src={getLogo(dao.pubkey)}
                                            alt={dao.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-200"
                                        />
                                    </div>
                                    <span className="text-[16px] font-medium text-gray-900 dark:text-white truncate">
                                        {dao.name}
                                    </span>
                                </Link>
                            ))}
                        </div>

                    ) : (
                        <div className="py-6 flex flex-col items-center justify-center text-center px-4">
                            <div className="relative w-[156px] h-[113px] mb-2">
                                <Image
                                    src="/no-search-result.png"
                                    alt="No results found"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-[14px] font-medium text-[#101828B2] dark:text-[#101828B2]">
                                No results found for your search!
                            </p>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

