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

      const priorityPubkey = "F9V4Lwo49aUe8fFujMbU6uhdFyDRqKY54WpzdpncUSk9";

      const userDaoPubkeys = userDaos?.result.map((dao) => dao.realmName) ?? [];

      const prioritizedDaos = [
        ...allDaos.filter((dao) => userDaoPubkeys.includes(dao.name)),
        ...allDaos.filter((dao) => !userDaoPubkeys.includes(dao.name)),
      ].slice(0, 15);

      const daoPubkeysToSummarize = prioritizedDaos.map((dao) => dao.pubkey);

      // Remove priority pubkey if it exists in the list, then add it to the top
      const filteredPubkeys = daoPubkeysToSummarize.filter(
        (pubkey) => pubkey !== priorityPubkey
      );
      const finalPubkeysToSummarize = [priorityPubkey, ...filteredPubkeys];

      if (finalPubkeysToSummarize.length === 0) {
        return [];
      }

      const summaryData = await daosApi.getSummaryForDaos(finalPubkeysToSummarize);
      console.log("[Page] Summary data from API:", summaryData);
      return summaryData;
    },
    enabled: !!allDaos,
  });

  const { data: trackedDaos, isLoading: isLoadingTrackedDaos } = useQuery({
    queryKey: ["trackedDaos"],
    queryFn: userApi.getTrackedDaos,
    enabled: isAuthenticated,
  });

  // Log trackedDaos changes
  useEffect(() => {
    console.log("[Page] trackedDaos changed:", trackedDaos);
    console.log("[Page] trackedDaos isLoading:", isLoadingTrackedDaos);
  }, [trackedDaos, isLoadingTrackedDaos]);

  const { data: summarizedTrackedDaos, isLoading: isLoadingSummarizedTrackedDaos } =
    useQuery({
      queryKey: ["summarizedTrackedDaos", trackedDaos],
      queryFn: async () => {
        console.log(
          "[Page] summarizedTrackedDaos queryFn called with trackedDaos:",
          trackedDaos
        );
        if (!trackedDaos) {
          console.log("[Page] No trackedDaos, returning empty array");
          return [];
        }

        const daoPubkeysToSummarize = trackedDaos.map((dao) => dao.pubkey);
        console.log("[Page] DAO pubkeys to summarize:", daoPubkeysToSummarize);

        if (daoPubkeysToSummarize.length === 0) {
          console.log("[Page] No pubkeys to summarize, returning empty array");
          return [];
        }

        console.log("[Page] Fetching summary for DAOs...");
        const result = await daosApi.getSummaryForDaos(daoPubkeysToSummarize);
        console.log("[Page] Summary result:", result);
        return result;
      },
      enabled: !!trackedDaos,
    });

  // Log summarizedTrackedDaos changes
  useEffect(() => {
    console.log("[Page] summarizedTrackedDaos changed:", summarizedTrackedDaos);
    console.log(
      "[Page] summarizedTrackedDaos isLoading:",
      isLoadingSummarizedTrackedDaos
    );
  }, [summarizedTrackedDaos, isLoadingSummarizedTrackedDaos]);

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
    (isAuthenticated && isLoadingTrackedDaos) ||
    (isAuthenticated && isLoadingSummarizedTrackedDaos) ||
    isLoadingSummarizedDaos ||
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

  const watchlistData = useMemo(
    () =>
      Array.isArray(summarizedDaos)
        ? summarizedTrackedDaos?.map((dao) => {
            const mainnetDao = mainnetBeta?.find(
              (mDao: MainnetDao) => mDao.realmId === dao.realm
            );
            return {
              id: dao.realm,
              daoName: dao.realmName,
              daoHealth: (dao.status === "active" ? "Alive" : "Dead") as "Alive" | "Dead",
              proposals: dao.proposalCount,
              treasuryBalance: `$${Number(dao.treasuryBalance).toLocaleString()}`,
              image: mainnetDao?.ogImage ?? "/dao-1.png",
              amountDetected: "", // This needs to be implemented
            };
          }) ?? []
        : [],
    [summarizedDaos, summarizedTrackedDaos, mainnetBeta]
  );

  // Log watchlistData changes
  useEffect(() => {
    console.log("[Page] watchlistData changed:", watchlistData);
    console.log("[Page] watchlistData length:", watchlistData.length);
    console.log(
      "[Page] summarizedTrackedDaos used for watchlist:",
      summarizedTrackedDaos
    );
  }, [watchlistData, summarizedTrackedDaos]);

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
