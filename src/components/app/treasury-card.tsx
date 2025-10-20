import { truncateAddress } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { MdArrowOutward } from "react-icons/md";

export default function TryeasuryCard(props: {
  image: string;
  price: string;
  tokenName: string;
  address: string;
}) {
  return (
    <div className="rounded-[5px] w-full border border-[#F0F0F0] dark:border-[#282828B2] bg-white dark:bg-[#010101] shadow-sm py-3.5 px-4 gap-2 grid grid-cols-[42px_5fr]">
      <Image src={props.image} alt={props.tokenName} width={36} height={36} />
      <div className="grid grid-cols-1 w-full gap-[2px]">
        <h2 className="font-medium text-sm text-[#101828] dark:text-[#EDEDED] leading-[100%]">
          ${props.price}
        </h2>
        <div className="text-[10px] text-[#101828B2] dark:text-[#A1A1A1] font-normal leading-[100%] flex items-center justify-between ">
          <span>
            <span>{props.tokenName}</span> token
          </span>
          <span className="flex items-center cursor-pointer">
            {truncateAddress(props.address)}
            <MdArrowOutward size={16} />
          </span>
        </div>
      </div>
    </div>
  );
}
