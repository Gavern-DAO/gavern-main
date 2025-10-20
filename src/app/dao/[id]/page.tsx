"use client";

import { useState } from "react";
import Navbar from "@/components/app/navbar";
import Footer from "@/components/app/footer";
import DaoHeader from "@/components/app/dao-header";
import DaoTab from "@/components/app/dao-tab";
import DaoStructureRoles from "@/components/app/dao-structure-n-roles";
import Treasurytab from "@/components/app/treasury-tab";
import DaoMembers from "@/components/app/dao-members";
import ProposalsTab from "@/components/app/proposals-tab";

const tabs = ["DAO Structure and Roles", "Proposals", "Treasury", "Members"];
export default function DaoPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (
    <div className="">
      <Navbar />
      <div className="lg:max-w-[1200px] mx-auto ">
        <DaoHeader />
        <DaoTab
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
        {activeTab === tabs[0] && <DaoStructureRoles />}
        {activeTab === tabs[1] && <ProposalsTab />}
        {activeTab === tabs[2] && <Treasurytab />}
        {activeTab === tabs[3] && <DaoMembers />}
      </div>
      <Footer />
    </div>
  );
}
