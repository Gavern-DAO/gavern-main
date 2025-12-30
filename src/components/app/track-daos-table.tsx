"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { userApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { throttle } from "lodash";
import DaoCard from "./dao-card";

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
    placeholderData: keepPreviousData,
  });

  const [selectedDaos, setSelectedDaos] = useState<string[]>([]);

  useEffect(() => {
    if (trackedDaos) {
      setSelectedDaos(trackedDaos.map((dao: TrackedDao) => dao.pubkey));
    }
  }, [trackedDaos]);

  const trackMutation = useMutation({
    mutationFn: userApi.trackDao,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["trackedDaos"] });
      queryClient.invalidateQueries({ queryKey: ["trackedDaosWithSummary"] });
      queryClient.invalidateQueries({ queryKey: ["userDaos"] });
      queryClient.invalidateQueries({ queryKey: ["summarizedDaos"] });
    },
  });

  const untrackMutation = useMutation({
    mutationFn: userApi.untrackDao,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["trackedDaos"] });
      queryClient.invalidateQueries({ queryKey: ["trackedDaosWithSummary"] });
      queryClient.invalidateQueries({ queryKey: ["userDaos"] });
      queryClient.invalidateQueries({ queryKey: ["summarizedDaos"] });
    },
  });

  const throttledTrack = useMemo(
    () => throttle((pubkey: string) => trackMutation.mutate({ pubkey }), 1000),
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
      throttledTrack(daoId);
    } else {
      throttledUntrack(daoId);
    }
  };

  const columns: ColumnDef<IAllDao>[] = [
    {
      accessorKey: "daoName",
      header: () => (
        <span className="font-normal leading-[24px] text-base text-[#4C4C4C]">
          DAO Name
        </span>
      ),
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
  ];

  if (isAuthenticated && isLoadingTrackedDaos) {
    return (
      <div className="lg:max-w-[1200px] bg-white dark:bg-[#010101] mx-auto rounded-[10px] border-b-[0.5px] dark:border-[.5px] dark:border-[#282828B2] py-20 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-gray-300 border-t-[#010101] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="lg:max-w-[1200px] mx-auto">
      <div className="hidden md:block">
        <span className="block mb-2 text-[#101828B2] dark:text-[#A1A1A1] font-normal text-base leading-[26px]">
          <span className="text-[#101828] dark:text-[#EDEDED]">Note:</span> If
          you already had Dao that were checked, they are DAo your wallet
          address were dictated in or Dao you already belonged to. <br />
          Choose your preferred DAO(s) that you would like to track and get
          notifications about their activity.
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

      {/* Mobile view - pass state and handler to DaoCard */}
      <div className="md:hidden space-y-4 px-4 pb-8">
        {data.length === 0 ? (
          <>No DAOs found</>
        ) : (
          data.map((dao) => (
            <DaoCard
              key={dao.id}
              dao={dao}
              onClick={() => { }}
              showSelect={isAuthenticated}
              isSelected={selectedDaos.includes(dao.id)}
              onSelectChange={handleCheckboxChange}
            />
          ))
        )}
      </div>
    </div>
  );
}