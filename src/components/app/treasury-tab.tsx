import React from "react";
import TryeasuryCard from "./treasury-card";

const daoAssets = [
  {
    image: "/treasuries/item1.png",
    price: "106,435.51",
    tokenName: "USDC",
    address: "EPjFWdTDi",
  },
  {
    image: "/treasuries/item2.png",
    price: "18.05",
    tokenName: "WSOL",
    address: "So111111111",
  },
  {
    image: "/treasuries/item3.png",
    price: "2.61",
    tokenName: "BLZE",
    address: "BLZEE_bKUJA",
  },
  {
    image: "/treasuries/item4.png",
    price: "0.17",
    tokenName: "SOL",
    address: "11111111",
  },
  {
    image: "/treasuries/item5.png",
    price: "0",
    tokenName: "5h6ss_m6QDV",
    address: "5h6ss_m6QDV",
  },
  {
    image: "/treasuries/item6.png",
    price: "0",
    tokenName: "993dv_Zuwqk",
    address: "BLZEE_bKUJA",
  },
  {
    image: "/treasuries/item7.png",
    price: "15.74",
    tokenName: "cSOL",
    address: "5h6ss_m6QDV",
  },
  {
    image: "/treasuries/item8.png",
    price: "4.55",
    tokenName: "cUSDC",
    address: "5h6ss_m6QDV",
  },
];

export default function Treasurytab() {
  return (
    <div className="bg-white dark:bg-[#010101] dark:border dark:border-[#282828B2] flex flex-col gap-2 pb-6 rounded-[5px]">
      <div className="w-full border-b-[0.5px] border-b-[#E7E7E7] dark:border-b-[#282828B2] p-4 gap-1">
        <h2 className="text-[#101828] dark:text-[#EDEDED] font-medium text-base leading-[100%]">
          DAO Assets{" "}
          <span className="text-[#101828B2] dark:text-[#A1A1A1] font-normal text-xs">
            ($106.48K)
          </span>
        </h2>
      </div>
      <div className="px-4 py-2 gap-1.5 grid grid-cols-1">
        {daoAssets.map((asset, index) => (
          <TryeasuryCard
            key={index}
            image={asset.image}
            price={asset.price}
            tokenName={asset.tokenName}
            address={asset.address}
          />
        ))}
      </div>
    </div>
  );
}
