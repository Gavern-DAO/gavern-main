"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { throttle } from "lodash";

export interface IAllDao {
  id: string;
  daoName: string;
  daoHealth: "Alive" | "Dead" | "Stable";
  proposals: number;
  treasuryBalance: string;
  isActive: boolean;
  timeLeft?: string | null;
  image: string;
}

interface TrackedDao {
  pubkey: string;
}

export default function TrackDaosTable({ data }: { data: IAllDao[] }) {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: trackedDaos, isLoading: isLoadingTrackedDaos } = useQuery({
    queryKey: ["trackedDaos"],
    queryFn: userApi.getTrackedDaos,
    enabled: isAuthenticated,
  });

  const [selectedDaos, setSelectedDaos] = useState<string[]>([]);

  useEffect(() => {
    if (trackedDaos) {
      setSelectedDaos(trackedDaos.map((dao: TrackedDao) => dao.pubkey));
    }
  }, [trackedDaos]);

  const trackMutation = useMutation({
    mutationFn: userApi.trackDao,
    onSuccess: async (data, variables) => {
      console.log("[TrackMutation] Success - Tracking DAO:", variables.pubkey);
      console.log("[TrackMutation] Response:", data);

      // Invalidate trackedDaos
      console.log("[TrackMutation] Invalidating trackedDaos query...");
      queryClient.invalidateQueries({ queryKey: ["trackedDaos"] });

      // Wait for trackedDaos to refetch, then refetch summarizedTrackedDaos
      // This ensures summarizedTrackedDaos uses the updated trackedDaos data
      console.log("[TrackMutation] Refetching trackedDaos query...");
      const trackedDaosResult = await queryClient.refetchQueries({ queryKey: ["trackedDaos"] });
      console.log("[TrackMutation] trackedDaos refetch result:", trackedDaosResult);

      // Explicitly refetch summarizedTrackedDaos to ensure watchlist updates
      // Using exact: false to match all queries starting with "summarizedTrackedDaos"
      console.log("[TrackMutation] Refetching summarizedTrackedDaos query...");
      const summarizedResult = await queryClient.refetchQueries({
        queryKey: ["summarizedTrackedDaos"],
        exact: false
      });
      console.log("[TrackMutation] summarizedTrackedDaos refetch result:", summarizedResult);
      console.log("[TrackMutation] All queries refetched");
    },
    onError: (error) => {
      console.error("[TrackMutation] Error:", error);
    },
  });

  const untrackMutation = useMutation({
    mutationFn: userApi.untrackDao,
    onSuccess: async (data, variables) => {
      console.log("[UntrackMutation] Success - Untracking DAO:", variables);
      console.log("[UntrackMutation] Response:", data);

      // Invalidate trackedDaos
      console.log("[UntrackMutation] Invalidating trackedDaos query...");
      queryClient.invalidateQueries({ queryKey: ["trackedDaos"] });

      // Wait for trackedDaos to refetch, then refetch summarizedTrackedDaos
      // This ensures summarizedTrackedDaos uses the updated trackedDaos data
      console.log("[UntrackMutation] Refetching trackedDaos query...");
      const trackedDaosResult = await queryClient.refetchQueries({ queryKey: ["trackedDaos"] });
      console.log("[UntrackMutation] trackedDaos refetch result:", trackedDaosResult);

      // Explicitly refetch summarizedTrackedDaos to ensure watchlist updates
      // Using exact: false to match all queries starting with "summarizedTrackedDaos"
      console.log("[UntrackMutation] Refetching summarizedTrackedDaos query...");
      const summarizedResult = await queryClient.refetchQueries({
        queryKey: ["summarizedTrackedDaos"],
        exact: false
      });
      console.log("[UntrackMutation] summarizedTrackedDaos refetch result:", summarizedResult);
      console.log("[UntrackMutation] All queries refetched");
    },
    onError: (error) => {
      console.error("[UntrackMutation] Error:", error);
    },
  });

  const throttledTrack = useMemo(
    () =>
      throttle((pubkey: string) => trackMutation.mutate({ pubkey }), 1000),
    [trackMutation]
  );

  const throttledUntrack = useMemo(
    () => throttle((pubkey: string) => untrackMutation.mutate(pubkey), 1000),
    [untrackMutation]
  );

  const handleCheckboxChange = (checked: boolean, daoId: string) => {
    setSelectedDaos((prev) =>
      checked ? [...prev, daoId] : prev.filter((id) => id !== daoId)
    );
    if (checked) {
      console.log(`Tracking DAO: ${daoId}`);
      throttledTrack(daoId);
    } else {
      console.log(`Untracking DAO: ${daoId}`);
      throttledUntrack(daoId);
    }
  };

  const columns: ColumnDef<IAllDao>[] = [
    {
      accessorKey: "daoName",
      header: () => {
        return (
          <span className="font-normal leading-[24px] text-base text-[#4C4C4C]">
            DAO Name
          </span>
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        const isSelected = selectedDaos.includes(data.id);

        return (
          <div className="flex items-center justify-start gap-3">
            <div className="flex items-center justify-center gap-2.5">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(!!checked, data.id)
                }
                className="h-5 w-5 text-blue-600"
              />
              <Image
                src={data.image}
                width={48}
                height={48}
                alt={data.daoName}
                className="w-12 h-12 rounded-full object-cover"
                unoptimized={true}
              />
              {/* <Image
                src={data.image}
                width={48}
                height={48}
                alt={data.daoName}
                className="h-full w-auto"
              /> */}
              <h2 className="text-[#101828] dark:text-[#EDEDED] font-medium text-[1.25rem] leading-[1.5rem]">
                {data.daoName}
              </h2>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              {data.isActive && (
                <span className="py-1 px-2 border rounded-full gap-2 border-[#75FA7C] bg-[#00D70B1F] font-medium text-[0.75rem] text-[#00BF0A] leading-[100%]">
                  Active Proposal
                </span>
              )}
              {data.timeLeft && (
                <span className="text-[#909090] text-sm leading-[21px]">
                  {data.timeLeft}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "daoHealth",
      header: () => {
        return (
          <span className="font-normal leading-[24px] text-base text-[#4C4C4C] text-center flex items-center justify-center">
            DAO Health
          </span>
        );
      },
      cell: ({ row }) => {
        const health = row.original.daoHealth;
        return (
          <div className="flex items-center justify-center gap-1.5 text-[#101828] dark:text-[#EDEDED] font-normal text-base leading-[24px]">
            {health === "Alive" ? (
              <div className="aspect-square h-auto w-2 rounded-full bg-[#00AA09]"></div>
            ) : health === "Stable" ? (
              <div className="aspect-square h-auto w-2 rounded-full bg-[#FFC107]"></div>
            ) : (
              <div className="aspect-square h-auto w-2 rounded-full bg-[#D70000]"></div>
            )}
            {health}
          </div>
        );
      },
    },
    {
      accessorKey: "proposals",
      header: () => {
        return (
          <span className="font-normal leading-[24px] text-base text-[#4C4C4C] text-center flex items-center justify-center">
            Proposals
          </span>
        );
      },
      cell: ({ row }) => {
        return (
          <span className="text-center flex items-center justify-center text-[#101828] dark:text-[#EDEDED] leading-[24px] text-base">
            {row.original.proposals}
          </span>
        );
      },
    },
    {
      accessorKey: "treasuryBalance",
      header: () => {
        return (
          <span className="font-normal leading-[24px] text-base text-[#4C4C4C] text-center flex items-center justify-center">
            Treasury Balance
          </span>
        );
      },
      cell: ({ row }) => {
        return (
          <span className="text-center flex items-center justify-center text-[#101828] dark:text-[#EDEDED] leading-[24px] text-base">
            {row.original.treasuryBalance}
          </span>
        );
      },
    },
  ];

  if (isAuthenticated && isLoadingTrackedDaos) {
    return (
      <div className="lg:max-w-[1200px] bg-white dark:bg-[#010101] mx-auto rounded-[10px] border-b-[0.5px] dark:border-[.5px] dark:border-[#282828B2] py-20 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-gray-300 border-t-[#010101] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="lg:max-w-[1200px] mx-auto ">
      <span className="block mb-2 text-[#101828B2] dark:text-[#A1A1A1] font-normal text-base leading-[26px]">
        <span className="text-[#101828] dark:text-[#EDEDED]">Note:</span> If you
        already had Dao that were checked, they are DAo your wallet address were
        dictated in or Dao you already belonged to. <br />
        Choose your preferred DAO(s) that you would like to track and get
        notifications about their activity.{" "}
      </span>
      <div className="w-full bg-white dark:bg-[#010101] rounded-[10px] border-b-[0.5px] dark:border-[.5px] dark:border-[#282828B2] overflow-hidden">
        <DataTable<IAllDao> columns={columns} data={data} />
        <div className="flex items-center justify-center p-8 text-[#101828B2] dark:text-[#A1A1A1] leading-[24px] text-[1.25rem]">
          <span className="flex items-center justify-center gap-2 cursor-pointer select-none">
            Load More <ArrowDown />
          </span>
        </div>
      </div>
    </div>
  );
}
