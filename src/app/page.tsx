"use client";
import AllDaosTable from "@/components/app/all-daos-table";
import Navbar from "@/components/app/navbar";
import Tab from "@/components/app/tab";
import CheckIcon from "@/components/icons/check-icon";
import EyeIcon from "@/components/icons/eye-icon";
import GridIcon from "@/components/icons/grid-icon";
import LockIcon from "@/components/icons/lock-icon";
import StarIcon from "@/components/icons/star-icon";
import React, { useState } from "react";
import Footer from "@/components/app/footer";
import WatchlistTable from "@/components/app/watchlist-table";
import ActiveDaosTable from "@/components/app/active-daos-table";
import ClosedDaosTable from "@/components/app/closed-daos-table";
import TrackDaosTable from "@/components/app/track-daos-table";

interface TabType {
  item: string;
  icon: React.ReactNode;
  iconActive: React.ReactNode;
}
export default function page() {
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
  return (
    <div className="space-y-4">
      <Navbar />
      <Tab
        tabs={tabs}
        onTabChange={(tab) => setActiveTab(tab)}
        activeTab={activeTab}
      />
      {activeTab.item === tabs[0].item && <AllDaosTable />}
      {activeTab.item === tabs[1].item && <WatchlistTable />}
      {activeTab.item === tabs[2].item && <ActiveDaosTable />}
      {activeTab.item === tabs[3].item && <ClosedDaosTable />}
      {activeTab.item === tabs[4].item && <TrackDaosTable />}
      <Footer />
    </div>
  );
}
