"use client";
import AllDaosTable from "@/components/app/all-daos-table";
import Tab from "@/components/app/tab";
import CheckIcon from "@/components/icons/check-icon";
import EyeIcon from "@/components/icons/eye-icon";
import GridIcon from "@/components/icons/grid-icon";
import LockIcon from "@/components/icons/lock-icon";
import StarIcon from "@/components/icons/star-icon";
import React, { useEffect, useMemo, useState } from "react";
import WatchlistTable from "@/components/app/watchlist-table";
import ActiveDaosTable from "@/components/app/active-daos-table";
import ClosedDaosTable from "@/components/app/closed-daos-table";
import TrackDaosTable from "@/components/app/track-daos-table";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { daosApi, userApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import SuccessfulWalletModal from "@/components/app/successful-wallet-modal";
import DaosFoundModal from "@/components/app/daos-found-modal";
import axios from "axios";
import SkeletonTable from "@/components/app/skeleton-table";
import { formatNumber } from "@/lib/utils";

const Navbar = dynamic(() => import("@/components/app/navbar"), { ssr: false });

interface TabType {
  item: string;
  icon: React.ReactNode;
  iconActive: React.ReactNode;
}

interface MainnetDao {
  realmId: string;
  ogImage: string;
}

export default function Page() {
  const tabs: TabType[] = [
    { item: "All DAOs", icon: <GridIcon />, iconActive: <GridIcon isActive /> },
    {
      item: "Watchlists",
      icon: <CheckIcon />,
      iconActive: <CheckIcon isActive />,
    },
    {
      item: "Active Proposals",
      icon: <EyeIcon />,
      iconActive: <EyeIcon isActive />,
    },
    {
      item: "Closed Proposals",
      icon: <LockIcon />,
      iconActive: <LockIcon isActive />,
    },
    {
      item: "Track DAOs",
      icon: <StarIcon />,
      iconActive: <StarIcon isActive />,
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: allDaos, isLoading: isLoadingAllDaos } = useQuery({
    queryKey: ["allDaos"],
    queryFn: async (): Promise<
      {
        pubkey: string;
        owner: string;
        name: string;
      }[]
    > => {
      const response = await axios.get("/api/daos");
      return response.data;
    },
    enabled: mounted,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const { data: userDaos, isLoading: isLoadingUserDaos } = useQuery({
    queryKey: ["userDaos"],
    queryFn: userApi.getDaos,
    enabled: isAuthenticated,
  });

  const { data: summarizedDaos, isLoading: isLoadingSummarizedDaos } = useQuery({
    queryKey: ["summarizedDaos", allDaos, userDaos],
    queryFn: async () => {
      if (!allDaos) {
        return [];
      }

      // Prioritized DAOs - these will appear at the top of the list
      const priorityPubkeys = [
        "F9V4Lwo49aUe8fFujMbU6uhdFyDRqKY54WpzdpncUSk9", // Island DAO
        "6yU77XJakREaptpqFbu5azT7uzxa6RPswhpTAYX9pq1o", // DL Ecosystem Grant
        "ConzwGtFktKLA2M7451S6jmW1tB3tRD9augz9zFA46Yr", // DL Metaplex Grant
        "DA5G7QQbFioZ6K33wQcH8fVdgFcnaDjLD7DLQkapZg5X", // Metaplex DAO
        "5PP7vKjJyLw1MR55LoexRsCj3CpZj9MdD6aNXRrvxG42", // EpicentralDAO
        "3YADdZuLqfZ8ZHnxDNMnMs77qbVdhioe6yi3b4i3hfNA", // Realms Ecosystem DAO
        "84pGFuy1Y27ApK67ApethaPvexeDWA66zNV8gm38TVeQ", // BonkDAO
        "GWe1VYTRMujAtGVhSLwSn4YPsXBLe5qfkzNAYAKD44Nk", // AdrenaDAO
        "4sgAydAiSvnpT73rALCcnYGhi5K2LrB9pJFAEbLMfrXt", // Tensor DAO
      ];

      const userDaoPubkeys = userDaos?.result.map((dao) => dao.realmName) ?? [];

      const prioritizedDaos = [
        ...allDaos.filter((dao) => userDaoPubkeys.includes(dao.name)),
        ...allDaos.filter((dao) => !userDaoPubkeys.includes(dao.name)),
      ].slice(0, 15);

      const daoPubkeysToSummarize = prioritizedDaos.map((dao) => dao.pubkey);

      // Remove priority pubkeys if they exist in the list, then add them to the top
      const filteredPubkeys = daoPubkeysToSummarize.filter(
        (pubkey) => !priorityPubkeys.includes(pubkey)
      );
      // Ensure total is 15: priority pubkeys first, then fill remaining slots
      const remainingSlots = 15 - priorityPubkeys.length;
      const finalPubkeysToSummarize = [
        ...priorityPubkeys,
        ...filteredPubkeys.slice(0, remainingSlots),
      ];

      if (finalPubkeysToSummarize.length === 0) {
        return [];
      }

      const summaryData = await daosApi.getSummaryForDaos(finalPubkeysToSummarize);
      console.log("[Page] Summary data from API:", summaryData);

      // Sort the results to ensure prioritized DAOs appear at the top
      const sortedSummaryData = summaryData.sort((a, b) => {
        const aIndex = priorityPubkeys.indexOf(a.realm);
        const bIndex = priorityPubkeys.indexOf(b.realm);

        // If both are in priority list, maintain their order in priority list
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        // If only a is in priority list, a comes first
        if (aIndex !== -1) {
          return -1;
        }
        // If only b is in priority list, b comes first
        if (bIndex !== -1) {
          return 1;
        }
        // If neither is in priority list, maintain original order
        return 0;
      });

      return sortedSummaryData;
    },
    enabled: !!allDaos,
  });

  // Fetch tracked DAOs with summaries and governance power in a single call
  const { data: trackedDaosWithSummary, isLoading: isLoadingTrackedDaosWithSummary } = useQuery({
    queryKey: ["trackedDaosWithSummary"],
    queryFn: userApi.getTrackedDaosWithSummary,
    enabled: isAuthenticated,
  });

  // Log trackedDaosWithSummary changes
  useEffect(() => {
    console.log("[Page] trackedDaosWithSummary changed:", trackedDaosWithSummary);
    console.log("[Page] trackedDaosWithSummary isLoading:", isLoadingTrackedDaosWithSummary);
  }, [trackedDaosWithSummary, isLoadingTrackedDaosWithSummary]);

  const { data: mainnetBeta, isLoading: isLoadingMainnetBeta } = useQuery({
    queryKey: ["mainnetBeta"],
    queryFn: async () => {
      const response = await axios.get("/mainnet-beta.json");
      return response.data;
    },
    enabled: mounted,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - static JSON file rarely changes
    refetchOnWindowFocus: false,
  });

  // Individual loading states for each tab
  const isLoadingAllDaosTab =
    isLoadingAllDaos ||
    (isAuthenticated && isLoadingUserDaos) ||
    isLoadingSummarizedDaos ||
    isLoadingMainnetBeta;

  const isLoadingWatchlistTab =
    (isAuthenticated && isLoadingTrackedDaosWithSummary) ||
    isLoadingMainnetBeta;

  const isLoadingActiveProposalsTab = isLoadingAllDaosTab;
  const isLoadingClosedProposalsTab = isLoadingAllDaosTab;
  const isLoadingTrackDaosTab = isLoadingAllDaosTab;

  const allDaosData = Array.isArray(summarizedDaos)
    ? summarizedDaos.map((dao) => {
      const mainnetDao = mainnetBeta?.find(
        (mDao: MainnetDao) => mDao.realmId === dao.realm
      );
      return {
        id: dao.realm,
        daoName: dao.realmName,
        daoHealth: (dao.status === "active" ? "Alive" : "Dead") as "Alive" | "Dead",
        proposals: dao.proposalCount,
        treasuryBalance: `$${Number(dao.treasuryBalance).toLocaleString()}`,
        isActive: dao.activeProposal.exists,
        timeLeft: dao.activeProposal.exists
          ? dao.activeProposal.latest
          : dao.closedProposal.latest,
        image: mainnetDao?.ogImage ?? "/dao-1.png",
      };
    })
    : [];

  // Map trackedDaosWithSummary to watchlist data format
  const watchlistData = useMemo(
    () => {
      if (!trackedDaosWithSummary?.result) {
        return [];
      }

      return trackedDaosWithSummary.result.map((dao) => {
        const mainnetDao = mainnetBeta?.find(
          (mDao: MainnetDao) => mDao.realmId === dao.pubkey
        );

        return {
          id: dao.pubkey,
          daoName: dao.name || dao.summary?.realmName || "Unknown DAO",
          daoHealth: (dao.summary?.status === "active" ? "Alive" : "Dead") as "Alive" | "Dead",
          proposals: dao.summary?.proposalCount || 0,
          treasuryBalance: dao.summary
            ? `$${Number(dao.summary.treasuryBalance).toLocaleString()}`
            : "$0",
          image: mainnetDao?.ogImage ?? "/dao-1.png",
          governancePower: dao.governancePower || "0",
        };
      });
    },
    [trackedDaosWithSummary, mainnetBeta]
  );

  // Log watchlistData changes
  useEffect(() => {
    console.log("[Page] watchlistData changed:", watchlistData);
    console.log("[Page] watchlistData length:", watchlistData.length);
    console.log(
      "[Page] trackedDaosWithSummary used for watchlist:",
      trackedDaosWithSummary
    );
  }, [watchlistData, trackedDaosWithSummary]);

  const activeDaos = allDaosData.filter((dao) => dao.isActive);
  const closedDaos = allDaosData
    .filter((dao) => !dao.isActive)
    .map((dao) => ({
      ...dao,
      timeCompleted: dao.timeLeft,
    }));

  return (
    <div className="space-y-0 md:space-y-4">
      {/* <HookStateDebugger /> */}
      {/* <SuperDebugModal /> */}
      <Navbar />
      <Tab tabs={tabs} onTabChange={(tab) => setActiveTab(tab)} activeTab={activeTab} />

      {activeTab.item === tabs[0].item &&
        (isLoadingAllDaosTab ? <SkeletonTable /> : <AllDaosTable data={allDaosData} />)}
      {activeTab.item === tabs[1].item &&
        (isLoadingWatchlistTab ? (
          <SkeletonTable />
        ) : (
          <WatchlistTable
            data={watchlistData}
            onTrackMoreClick={() => setActiveTab(tabs[4])}
          />
        ))}
      {activeTab.item === tabs[2].item &&
        (isLoadingActiveProposalsTab ? (
          <SkeletonTable />
        ) : (
          <ActiveDaosTable data={activeDaos} />
        ))}
      {activeTab.item === tabs[3].item &&
        (isLoadingClosedProposalsTab ? (
          <SkeletonTable />
        ) : (
          <ClosedDaosTable data={closedDaos} />
        ))}
      {activeTab.item === tabs[4].item &&
        (isLoadingTrackDaosTab ? (
          <SkeletonTable />
        ) : (
          <TrackDaosTable data={allDaosData} />
        ))}
      {/* <Footer /> */}

      {/* <DebugSuccessfulWalletModal /> */}
      <SuccessfulWalletModal />
      <DaosFoundModal />
    </div>
  );
}
