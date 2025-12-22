"use client";

import { type ReactElement } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { daosApi, ApiError } from "@/lib/api";
import RoleCard from "./role-card";

export interface Role {
  id: string;
  title: string;
  description: string;
  holder?: string;
  isVacant?: boolean;
  colorClass?: string;
  telegram?: string | null;
  discord?: string | null;
  x?: string | null;
}

interface DaoStructureRolesProps {
  daoPubkey?: string;
}

export default function DaoStructureRoles({
  daoPubkey,
}: DaoStructureRolesProps): ReactElement {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const imageSrc = isDarkMode ? "/Empty-Dark.png" : "/Table-EmptyState.png";

  // Fetch stored roles for the DAO
  const {
    data: storedRoles,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["stored-roles", daoPubkey],
    queryFn: () => {
      if (!daoPubkey) {
        throw new Error("DAO pubkey is required");
      }
      return daosApi.getStoredRoles(daoPubkey);
    },
    enabled: !!daoPubkey,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry on 404 errors
  });

  // Check if error is 404 (Not Found) - treat as "no roles found"
  const isNotFoundError =
    isError &&
    error &&
    typeof error === "object" &&
    "statusCode" in error &&
    (error as ApiError).statusCode === 404;

  // Transform API roles to match Role interface
  const roles: Role[] = storedRoles
    ? storedRoles.map((role) => {
        // Format pubkey for display
        const formatPubkey = (pubkey: string | null): string => {
          if (!pubkey) return "";
          return `${pubkey.slice(0, 5)}...${pubkey.slice(-5)}`;
        };

        return {
          id: role.id,
          title: role.name,
          description: role.description,
          holder: role.pubkey ? formatPubkey(role.pubkey) : undefined,
          isVacant: !role.pubkey,
          telegram: role.telegram,
          discord: role.discord,
          x: role.x,
        };
      })
    : [];

  const hasRoles = roles.length > 0;

  return (
    <div className="bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] rounded-[5px] flex flex-col gap-2 pb-4 md:pb-6">
      <div className="w-full border-b-[0.5px] border-b-[#E7E7E7] dark:border-b-[#282828B2] p-3 md:p-4 gap-1">
        <h2 className="text-[#101828] dark:text-[#EDEDED] font-medium text-sm md:text-base leading-[100%]">
          DAO Structure and Roles.
        </h2>
      </div>
      {isLoading ? (
        <div className="px-3 md:px-4 py-2 gap-2 md:gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 md:gap-6 p-3 border border-[#F0F0F0] dark:border-[#282828B2] rounded-[5px] animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : hasRoles ? (
        <div className="px-3 md:px-4 py-2 gap-2 md:gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      ) : (
        <div className="space-y-8 min-h-[810px] flex flex-col items-center justify-center w-full">
          <Image src={imageSrc} alt="Empty State" width={552} height={316} />
          <div className="text-[#101828] dark:text-[#EDEDED]">
            {isError && !isNotFoundError
              ? "Error loading roles. Please try again later."
              : "No Structure or Roles have been assigned to DAO members/delegates yet."}
          </div>
        </div>
      )}
    </div>
  );
}
