import { truncateAddress } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import { MdArrowOutward } from "react-icons/md";

export default function TryeasuryCard(props: {
  image: string;
  price: string;
  tokenName: string;
  address: string;
}) {
  const [imageSrc, setImageSrc] = useState(props.image);

  const handleImageError = () => {
    setImageSrc("/FallbackCoin.png");
  };

  return (
    <div className="rounded-[5px] w-full border border-[#F0F0F0] dark:border-[#282828B2] bg-white dark:bg-[#010101] shadow-sm py-3 md:py-3.5 px-3 md:px-4 gap-2 grid grid-cols-[36px_1fr] md:grid-cols-[42px_5fr]">
      <Image
        src={imageSrc}
        alt={props.tokenName || "Token image"}
        width={36}
        height={36}
        className="w-9 h-9 md:w-[36px] md:h-[36px]"
        onError={handleImageError}
      />
      <div className="grid grid-cols-1 w-full gap-[2px] min-w-0">
        <h2 className="font-medium text-xs md:text-sm text-[#101828] dark:text-[#EDEDED] leading-[100%] truncate">
          ${props.price}
        </h2>
        <div className="text-[10px] text-[#101828B2] dark:text-[#A1A1A1] font-normal leading-[100%] flex items-center justify-between gap-2">
          <span className="truncate">
            <span>{props.tokenName}</span> token
          </span>
          <a
            href={`https://solscan.io/token/${props.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center cursor-pointer gap-1 flex-shrink-0"
          >
            <span className="hidden sm:inline">{truncateAddress(props.address)}</span>
            <span className="sm:hidden">{truncateAddress(props.address, 4)}</span>
            <MdArrowOutward size={14} className="md:w-4 md:h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
