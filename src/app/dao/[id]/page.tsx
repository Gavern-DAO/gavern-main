"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/app/navbar";
import Footer from "@/components/app/footer";
import DaoHeader from "@/components/app/dao-header";
import DaoTab from "@/components/app/dao-tab";
import DaoStructureRoles from "@/components/app/dao-structure-n-roles";
import Treasurytab from "@/components/app/treasury-tab";
import DaoMembers from "@/components/app/dao-members";
import ProposalsTab from "@/components/app/proposals-tab";
import { useQuery } from "@tanstack/react-query";
import { daosApi } from "@/lib/api";
import axios from "axios";
import { DaoHeaderSkeleton } from "@/components/app/skeleton-dao";

interface MainnetDao {
  realmId: string;
  ogImage?: string;
  bannerImage?: string;
}

const tabs = ["DAO Structure and Roles", "Proposals", "Treasury", "Members"];

export default function DaoPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [page, setPage] = useState(1);
  const params = useParams();
  const id = params.id as string;

  const { data: daoSummary } = useQuery({
    queryKey: ["daoSummary", id],
    queryFn: () => daosApi.getDaoSummaryOne(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: mainnetBeta } = useQuery({
    queryKey: ["mainnetBeta"],
    queryFn: async () => {
      const response = await axios.get("/mainnet-beta.json");
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
  });

  const daoData = useMemo(() => {
    return daoSummary
      ? daoSummary.map((dao) => {
        const mainnetDao = mainnetBeta?.find(
          (mDao: MainnetDao) => mDao.realmId === dao.realm
        );
        return {
          ...dao,
          imageUrl: mainnetDao?.ogImage ?? "/dao-1.png",
          bannerImage: mainnetDao?.bannerImage ?? mainnetDao?.ogImage ?? "/dao-1.png",
        };
      })[0]
      : null;
  }, [daoSummary, mainnetBeta]);

  const { data: parallelData, isLoading: isLoadingParallelData } = useQuery({
    queryKey: ["parallelData", id, daoData],
    queryFn: async () => {
      if (!daoData) return null;
      const [voteCount, memberCount] = await Promise.all([
        daosApi.getVoteCount({
          realm: daoData.realm,
          realmOwner: daoData.realmOwner,
        }),
        daosApi.getMemberCount({
          realm: daoData.realm,
          realmOwner: daoData.realmOwner,
        }),
      ]);
      return { voteCount, memberCount };
    },
    enabled: !!daoData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const voteCount = parallelData?.voteCount;
  const memberCount = parallelData?.memberCount;

  return (
    <div className="">
      <Navbar />
      <div className="lg:max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0">
        {!daoData || isLoadingParallelData ? (
          <DaoHeaderSkeleton />
        ) : (
          <DaoHeader
            daoName={daoData.realmName}
            daoHealth={daoData.status === "active" ? "Alive" : "Dead"}
            imageUrl={daoData.imageUrl}
            bannerImage={daoData.bannerImage}
            proposalCount={daoData.proposalCount}
            voteCount={voteCount ? parseInt(voteCount, 10) : undefined}
            memberCount={memberCount ? parseInt(memberCount, 10) : undefined}
          />
        )}
        <DaoTab
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
        {activeTab === tabs[0] && daoData && <DaoStructureRoles daoPubkey={daoData.realm} />}
        {activeTab === tabs[1] && daoData && <ProposalsTab realm={daoData.realm} realmOwner={daoData.realmOwner} />}
        {activeTab === tabs[2] && daoData && <Treasurytab realm={daoData.realm} realmOwner={daoData.realmOwner} />}
        {activeTab === tabs[3] && daoData && (
          <DaoMembers
            realm={daoData.realm}
            realmOwner={daoData.realmOwner}
            governingTokenMint={daoData.communityMint}
            councilMint={daoData.councilMint}
            page={page}
            setPage={setPage}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}